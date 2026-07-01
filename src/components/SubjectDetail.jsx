import React, { useState } from 'react';
import RosterManager from './RosterManager';
import AttendanceRegister from './AttendanceRegister';
import GradebookRegister from './GradebookRegister';
import AnalyticsView from './AnalyticsView';

export default function SubjectDetail({ 
  subject, 
  onBack, 
  onDeleteSubject,
  onAddStudent,
  onRemoveStudent,
  onAddSession,
  onUpdateRecord,
  onDeleteSession,
  onAddEvaluation,
  onUpdateGrade,
  onDeleteEvaluation
}) {
  const [activeTab, setActiveTab] = useState('roster');

  const handleDeleteClick = () => {
    if (confirm(`¿Estás completamente seguro de eliminar la asignatura "${subject.name}"? Se perderán permanentemente todos los datos de estudiantes, asistencias y calificaciones.`)) {
      onDeleteSubject(subject.id);
    }
  };

  return (
    <div className="detail-container">
      {/* Back navigation */}
      <button className="back-link" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Volver a mis asignaturas
      </button>

      {/* Subject Header */}
      <div className="subject-detail-header">
        <div className="subject-meta-large">
          <div className="subject-code" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: subject.color }}>
            {subject.code}
          </div>
          <h2 className="subject-title-large">
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: subject.color }} />
            {subject.name}
          </h2>
          <span className="subject-teacher">{subject.teacher}</span>
        </div>
        <div className="subject-actions">
          <button className="btn-danger" onClick={handleDeleteClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Eliminar Asignatura
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          Alumnos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Asistencia
        </button>
        <button 
          className={`tab-btn ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveTab('grades')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          Calificaciones
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Estadísticas
        </button>
      </div>

      {/* Render Active Tab Component */}
      <div>
        {activeTab === 'roster' && (
          <RosterManager 
            students={subject.students}
            onAddStudent={onAddStudent}
            onRemoveStudent={onRemoveStudent}
          />
        )}
        {activeTab === 'attendance' && (
          <AttendanceRegister 
            students={subject.students}
            attendance={subject.attendance}
            onAddSession={onAddSession}
            onUpdateRecord={onUpdateRecord}
            onDeleteSession={onDeleteSession}
          />
        )}
        {activeTab === 'grades' && (
          <GradebookRegister 
            students={subject.students}
            evaluations={subject.evaluations}
            grades={subject.grades}
            onAddEvaluation={onAddEvaluation}
            onUpdateGrade={onUpdateGrade}
            onDeleteEvaluation={onDeleteEvaluation}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsView 
            students={subject.students}
            attendance={subject.attendance}
            evaluations={subject.evaluations}
            grades={subject.grades}
          />
        )}
      </div>
    </div>
  );
}
