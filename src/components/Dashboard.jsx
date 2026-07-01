import React, { useState } from 'react';

const COLOR_PRESETS = [
  { value: '#3b82f6', name: 'Azul' },
  { value: '#10b981', name: 'Esmeralda' },
  { value: '#f59e0b', name: 'Ámbar' },
  { value: '#8b5cf6', name: 'Violeta' },
  { value: '#f43f5e', name: 'Rosa' },
  { value: '#06b6d4', name: 'Cian' }
];

export default function Dashboard({ subjects, onSelectSubject, onAddSubject }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0].value);

  // --- Calculate Global Stats ---
  const totalSubjects = subjects.length;
  
  // Unique students count
  const allStudentIds = new Set();
  subjects.forEach(sub => {
    sub.students.forEach(st => allStudentIds.add(st.id));
  });
  const totalUniqueStudents = allStudentIds.size;

  // Global attendance average
  let globalTotalAttendance = 0;
  let globalPositiveAttendance = 0;
  subjects.forEach(sub => {
    sub.attendance.forEach(session => {
      sub.students.forEach(student => {
        globalTotalAttendance++;
        const status = session.records[student.id] || 'P';
        if (status === 'P') globalPositiveAttendance += 1;
        else if (status === 'T') globalPositiveAttendance += 0.5;
      });
    });
  });
  const globalAttendanceRate = globalTotalAttendance > 0 
    ? ((globalPositiveAttendance / globalTotalAttendance) * 100).toFixed(1)
    : '100.0';

  // Global grade average
  let totalGradesCount = 0;
  let totalGradesSum = 0;
  subjects.forEach(sub => {
    sub.students.forEach(student => {
      let accumulatedScore = 0;
      let weightSum = 0;
      sub.evaluations.forEach(evalItem => {
        const studentGrades = sub.grades[student.id] || {};
        const score = studentGrades[evalItem.id];
        if (score !== undefined && score !== null && !isNaN(score)) {
          accumulatedScore += (score * evalItem.weight) / 100;
          weightSum += evalItem.weight;
        }
      });
      if (weightSum > 0) {
        const projected = (accumulatedScore / weightSum) * 100;
        totalGradesSum += projected;
        totalGradesCount++;
      }
    });
  });
  const globalGradesAvg = totalGradesCount > 0 
    ? (totalGradesSum / totalGradesCount).toFixed(1)
    : '0.0';

  // --- Calculate stats per subject ---
  const getSubjectMetrics = (sub) => {
    // Attendance
    let subTotalAttend = 0;
    let subPosAttend = 0;
    sub.attendance.forEach(session => {
      sub.students.forEach(student => {
        subTotalAttend++;
        const status = session.records[student.id] || 'P';
        if (status === 'P') subPosAttend += 1;
        else if (status === 'T') subPosAttend += 0.5;
      });
    });
    const attendanceRate = subTotalAttend > 0 
      ? ((subPosAttend / subTotalAttend) * 100).toFixed(0)
      : '100';

    // Grades
    let subGradesCount = 0;
    let subGradesSum = 0;
    sub.students.forEach(student => {
      let accum = 0;
      let wSum = 0;
      sub.evaluations.forEach(ev => {
        const score = (sub.grades[student.id] || {})[ev.id];
        if (score !== undefined && score !== null && !isNaN(score)) {
          accum += (score * ev.weight) / 100;
          wSum += ev.weight;
        }
      });
      if (wSum > 0) {
        subGradesSum += (accum / wSum) * 100;
        subGradesCount++;
      }
    });
    const gradesAvg = subGradesCount > 0 
      ? (subGradesSum / subGradesCount).toFixed(0)
      : '0';

    return {
      attendanceRate,
      gradesAvg
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !teacher.trim()) return;

    onAddSubject({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      teacher: teacher.trim(),
      color
    });

    setName('');
    setCode('');
    setTeacher('');
    setColor(COLOR_PRESETS[0].value);
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Overview stats cards */}
      <div className="summary-grid">
        <div className="summary-card info">
          <span className="summary-title">Asignaturas</span>
          <span className="summary-val">{totalSubjects}</span>
          <span className="summary-desc">Cursos activos registrados</span>
        </div>
        <div className="summary-card">
          <span className="summary-title">Estudiantes Totales</span>
          <span className="summary-val">{totalUniqueStudents}</span>
          <span className="summary-desc">Alumnos únicos inscritos</span>
        </div>
        <div className="summary-card success">
          <span className="summary-title">Asistencia Promedio</span>
          <span className="summary-val">{globalAttendanceRate}%</span>
          <span className="summary-desc">Asistencia acumulada global</span>
        </div>
        <div className="summary-card warning">
          <span className="summary-title">Promedio de Notas</span>
          <span className="summary-val">{globalGradesAvg}%</span>
          <span className="summary-desc">Rendimiento académico global</span>
        </div>
      </div>

      {/* Subjects section */}
      <div className="subjects-section">
        <div className="panel-header">
          <h3 className="section-heading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6 17h14M4 19.5A2.5 2.5 0 0 0 6 22h14M4 19.5V3a1 1 0 0 1 1-1h13.5a1 1 0 0 1 1 1v15H6a2.5 2.5 0 0 0-2.5 2.5z"></path></svg>
            Mis Asignaturas
          </h3>
          <button className="btn-add-subject" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Asignatura
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="workspace-panel" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6 17h14M4 19.5V3a1 1 0 0 1 1-1h13.5a1 1 0 0 1 1 1v15H6a2.5 2.5 0 0 0-2.5 2.5z"></path></svg>
              </div>
              <h4 className="empty-state-title">No hay asignaturas registradas</h4>
              <p className="empty-state-desc">Haz clic en el botón superior para crear tu primera asignatura y comenzar.</p>
            </div>
          </div>
        ) : (
          <div className="subjects-grid">
            {subjects.map(sub => {
              const metrics = getSubjectMetrics(sub);
              return (
                <div 
                  key={sub.id} 
                  className="subject-card"
                  onClick={() => onSelectSubject(sub.id)}
                  style={{ borderLeft: `5px solid ${sub.color}` }}
                >
                  <div className="subject-card-overlay" style={{ backgroundColor: sub.color }} />
                  <div className="subject-header">
                    <span className="subject-code" style={{ color: sub.color }}>{sub.code}</span>
                    <h4 className="subject-name">{sub.name}</h4>
                    <span className="subject-teacher">{sub.teacher}</span>
                  </div>
                  <div className="subject-footer">
                    <div className="subject-stats-row">
                      <div className="subject-stat">
                        <span className="subject-stat-label">Alumnos</span>
                        <span className="subject-stat-val">{sub.students.length}</span>
                      </div>
                      <div className="subject-stat">
                        <span className="subject-stat-label">Asist. %</span>
                        <span className="subject-stat-val" style={{ color: parseFloat(metrics.attendanceRate) >= 80 ? 'var(--color-success)' : parseFloat(metrics.attendanceRate) >= 60 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                          {metrics.attendanceRate}%
                        </span>
                      </div>
                      <div className="subject-stat">
                        <span className="subject-stat-label">Nota Prom.</span>
                        <span className="subject-stat-val" style={{ color: parseFloat(metrics.gradesAvg) >= 70 ? 'var(--color-success)' : parseFloat(metrics.gradesAvg) >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                          {metrics.gradesAvg}%
                        </span>
                      </div>
                    </div>
                    <div className="subject-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Nueva Asignatura</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre de la Asignatura</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej. Álgebra, Física Mecánica" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row-split">
                <div className="form-group">
                  <label className="form-label">Código</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. MAT-202" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Docente</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Prof. Silva" 
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Color del Tema</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {COLOR_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setColor(preset.value)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: preset.value,
                        border: color === preset.value ? '3px solid white' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transform: color === preset.value ? 'scale(1.1)' : 'scale(1)',
                        transition: 'var(--transition-smooth)'
                      }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-add-subject">
                  Crear Asignatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
