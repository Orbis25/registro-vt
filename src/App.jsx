import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { initialSubjects } from './mockData';
import Dashboard from './components/Dashboard';
import SubjectDetail from './components/SubjectDetail';

export default function App() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Firestore Sync Effect
  useEffect(() => {
    const colRef = collection(db, 'subjects');
    
    // Subscribe to Firestore updates
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id });
      });

      if (list.length === 0 && loading) {
        // If Firestore is empty on first load, seed with local mockData
        console.log("Firestore empty. Seeding database with initialSubjects...");
        initialSubjects.forEach(async (sub) => {
          await setDoc(doc(db, 'subjects', sub.id), sub);
        });
      } else {
        // Sort subjects by name alphabetically to keep visual order consistent
        list.sort((a, b) => a.name.localeCompare(b.name));
        setSubjects(list);
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore onSnapshot subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loading]);

  const activeSubject = subjects.find(sub => sub.id === selectedSubjectId);

  // --- Global Subject Handlers ---
  const handleAddSubject = async (newSub) => {
    const id = `sub-${Date.now()}`;
    const docRef = doc(db, 'subjects', id);
    try {
      await setDoc(docRef, {
        id,
        name: newSub.name,
        code: newSub.code,
        teacher: newSub.teacher,
        color: newSub.color,
        students: [],
        attendance: [],
        evaluations: [],
        grades: {}
      });
    } catch (e) {
      console.error("Error creating subject in Firestore:", e);
      alert("Error al crear la asignatura. Inténtalo de nuevo.");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      await deleteDoc(doc(db, 'subjects', subjectId));
      setSelectedSubjectId(null);
    } catch (e) {
      console.error("Error deleting subject from Firestore:", e);
      alert("Error al eliminar la asignatura.");
    }
  };

  // --- Student (Roster) Handlers ---
  const handleAddStudent = async (studentInfo) => {
    if (!activeSubject) return;
    const studentId = `est-${Date.now()}`;
    const newStudent = {
      id: studentId,
      name: studentInfo.name,
      code: studentInfo.code
    };

    const updatedStudents = [...activeSubject.students, newStudent];
    const updatedAttendance = activeSubject.attendance.map(session => ({
      ...session,
      records: {
        ...session.records,
        [studentId]: 'P'
      }
    }));

    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        students: updatedStudents,
        attendance: updatedAttendance
      });
    } catch (e) {
      console.error("Error adding student in Firestore:", e);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!activeSubject) return;

    const updatedStudents = activeSubject.students.filter(st => st.id !== studentId);
    const updatedAttendance = activeSubject.attendance.map(session => {
      const nextRecords = { ...session.records };
      delete nextRecords[studentId];
      return {
        ...session,
        records: nextRecords
      };
    });

    const nextGrades = { ...activeSubject.grades };
    delete nextGrades[studentId];

    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        students: updatedStudents,
        attendance: updatedAttendance,
        grades: nextGrades
      });
    } catch (e) {
      console.error("Error removing student in Firestore:", e);
    }
  };

  // --- Attendance Handlers ---
  const handleAddSession = async (date) => {
    if (!activeSubject) return;

    const initialRecords = {};
    activeSubject.students.forEach(student => {
      initialRecords[student.id] = 'P';
    });

    const newSession = {
      date,
      records: initialRecords
    };

    const nextAttendance = [...activeSubject.attendance, newSession].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        attendance: nextAttendance
      });
    } catch (e) {
      console.error("Error adding attendance session in Firestore:", e);
    }
  };

  const handleUpdateRecord = async (date, studentId, status) => {
    if (!activeSubject) return;

    const updatedAttendance = activeSubject.attendance.map(session => {
      if (session.date !== date) return session;
      return {
        ...session,
        records: {
          ...session.records,
          [studentId]: status
        }
      };
    });

    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        attendance: updatedAttendance
      });
    } catch (e) {
      console.error("Error updating attendance record in Firestore:", e);
    }
  };

  const handleDeleteSession = async (date) => {
    if (!activeSubject) return;

    const updatedAttendance = activeSubject.attendance.filter(session => session.date !== date);
    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        attendance: updatedAttendance
      });
    } catch (e) {
      console.error("Error deleting session in Firestore:", e);
    }
  };

  // --- Evaluation / Grades Handlers ---
  const handleAddEvaluation = async (evalInfo) => {
    if (!activeSubject) return;

    const evalId = `eval-${Date.now()}`;
    const newEval = {
      id: evalId,
      name: evalInfo.name,
      weight: evalInfo.weight,
      maxGrade: 100
    };

    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        evaluations: [...activeSubject.evaluations, newEval]
      });
    } catch (e) {
      console.error("Error adding evaluation in Firestore:", e);
    }
  };

  const handleUpdateGrade = async (studentId, evalId, value) => {
    if (!activeSubject) return;

    const studentGrades = activeSubject.grades[studentId] || {};
    const nextGrades = {
      ...activeSubject.grades,
      [studentId]: {
        ...studentGrades,
        [evalId]: value === '' ? null : value
      }
    };

    if (value === '') {
      delete nextGrades[studentId][evalId];
    }

    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        grades: nextGrades
      });
    } catch (e) {
      console.error("Error updating grade in Firestore:", e);
    }
  };

  const handleDeleteEvaluation = async (evalId) => {
    if (!activeSubject) return;

    const updatedEvaluations = activeSubject.evaluations.filter(ev => ev.id !== evalId);
    const updatedGrades = {};
    Object.keys(activeSubject.grades).forEach(stId => {
      const studentGrades = { ...activeSubject.grades[stId] };
      delete studentGrades[evalId];
      updatedGrades[stId] = studentGrades;
    });

    try {
      const docRef = doc(db, 'subjects', activeSubject.id);
      await updateDoc(docRef, {
        evaluations: updatedEvaluations,
        grades: updatedGrades
      });
    } catch (e) {
      console.error("Error deleting evaluation in Firestore:", e);
    }
  };

  const handleResetData = async () => {
    if (confirm("¿Deseas restablecer todos los datos en Firebase a la configuración inicial predeterminada? Se perderán tus cambios actuales.")) {
      setLoading(true);
      try {
        // Clear all current documents
        for (const sub of subjects) {
          await deleteDoc(doc(db, 'subjects', sub.id));
        }
        // Add defaults
        for (const sub of initialSubjects) {
          await setDoc(doc(db, 'subjects', sub.id), sub);
        }
        setSelectedSubjectId(null);
      } catch (e) {
        console.error("Error resetting data in Firestore:", e);
        setLoading(false);
      }
    }
  };

  // Render Skeleton Loader while fetching data
  if (loading) {
    return (
      <div className="app-container">
        <header className="header">
          <div className="brand-section">
            <div className="logo-icon skeleton">R</div>
            <h1 className="brand-title skeleton" style={{ width: '150px', height: '32px' }}>Registro Virtual</h1>
          </div>
        </header>
        <main>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="summary-grid">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="summary-card skeleton" style={{ height: '120px' }} />
              ))}
            </div>
            <div className="subjects-section">
              <h3 className="section-heading skeleton" style={{ width: '180px', height: '28px' }}>Mis Asignaturas</h3>
              <div className="subjects-grid" style={{ marginTop: '1.5rem' }}>
                {[1, 2, 3].map(n => (
                  <div key={n} className="subject-card skeleton" style={{ height: '220px' }} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="header">
        <div className="brand-section">
          <div className="logo-icon">R</div>
          <h1 className="brand-title">Registro Virtual</h1>
        </div>
        <div>
          <button className="btn-secondary" style={{ marginRight: '0.75rem' }} onClick={handleResetData} title="Restablecer datos en Firebase">
            Restablecer Muestra
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {activeSubject ? (
          <SubjectDetail
            subject={activeSubject}
            onBack={() => setSelectedSubjectId(null)}
            onDeleteSubject={handleDeleteSubject}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudent}
            onAddSession={handleAddSession}
            onUpdateRecord={handleUpdateRecord}
            onDeleteSession={handleDeleteSession}
            onAddEvaluation={handleAddEvaluation}
            onUpdateGrade={handleUpdateGrade}
            onDeleteEvaluation={handleDeleteEvaluation}
          />
        ) : (
          <Dashboard 
            subjects={subjects}
            onSelectSubject={setSelectedSubjectId}
            onAddSubject={handleAddSubject}
          />
        )}
      </main>
    </div>
  );
}
