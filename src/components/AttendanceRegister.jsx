import React, { useState } from 'react';

export default function AttendanceRegister({ students, attendance, onAddSession, onUpdateRecord, onDeleteSession }) {
  const [newDate, setNewDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleAddSessionSubmit = (e) => {
    e.preventDefault();
    if (!newDate) return;
    
    // Check if session date already exists
    if (attendance.some(s => s.date === newDate)) {
      alert('Ya existe una sesión registrada para esta fecha.');
      return;
    }

    onAddSession(newDate);
    setNewDate('');
    setShowModal(false);
  };

  // Helper to format date display (e.g. "15 Jun")
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  // Calculations helper for a student
  const getStudentStats = (studentId) => {
    let total = attendance.length;
    let present = 0;
    let absent = 0;
    let late = 0;

    attendance.forEach(session => {
      const status = session.records[studentId];
      if (status === 'P') present++;
      else if (status === 'A') absent++;
      else if (status === 'T') late++;
    });

    // Attendance percentage: P = 1, T = 0.5 (Tardanza cuenta mitad), A = 0
    const score = present + (late * 0.5);
    const percentage = total > 0 ? (score / total) * 100 : 100;

    return {
      total,
      present,
      absent,
      late,
      percentage: percentage.toFixed(1)
    };
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Registro de Asistencias
          </h3>
        </div>
        <div className="panel-actions">
          <button className="btn-add-subject" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Fecha
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          </div>
          <h4 className="empty-state-title">No hay estudiantes cargados</h4>
          <p className="empty-state-desc">Por favor, ve a la pestaña "Alumnos" e inscribe al menos un estudiante.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="registry-table">
            <thead>
              <tr>
                <th style={{ minWidth: '180px' }}>Estudiante</th>
                {attendance.map((session, index) => (
                  <th key={session.date} style={{ textAlign: 'center', minWidth: '90px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>{formatDate(session.date)}</span>
                      <button 
                        className="btn-close" 
                        style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="Eliminar esta fecha"
                        onClick={() => {
                          if (confirm(`¿Eliminar la sesión del ${session.date}? Se perderán estos datos de asistencia.`)) {
                            onDeleteSession(session.date);
                          }
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  </th>
                ))}
                <th style={{ textAlign: 'center', minWidth: '70px' }}>P</th>
                <th style={{ textAlign: 'center', minWidth: '70px' }}>T</th>
                <th style={{ textAlign: 'center', minWidth: '70px' }}>A</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Asistencia %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const stats = getStudentStats(student.id);
                return (
                  <tr key={student.id}>
                    <td>
                      <div className="col-student-info">
                        <span className="student-name-td">{student.name}</span>
                        <span className="student-code-td">{student.code}</span>
                      </div>
                    </td>
                    {attendance.map((session) => {
                      const currentStatus = session.records[student.id] || 'P'; // default P
                      return (
                        <td key={session.date} style={{ textAlign: 'center' }}>
                          <div className="attendance-toggle-group">
                            <div 
                              className={`attendance-opt P ${currentStatus === 'P' ? 'selected' : ''}`}
                              onClick={() => onUpdateRecord(session.date, student.id, 'P')}
                              title="Presente"
                            >
                              P
                            </div>
                            <div 
                              className={`attendance-opt T ${currentStatus === 'T' ? 'selected' : ''}`}
                              onClick={() => onUpdateRecord(session.date, student.id, 'T')}
                              title="Tardanza (mitad de valor)"
                            >
                              T
                            </div>
                            <div 
                              className={`attendance-opt A ${currentStatus === 'A' ? 'selected' : ''}`}
                              onClick={() => onUpdateRecord(session.date, student.id, 'A')}
                              title="Ausente"
                            >
                              A
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{stats.present}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-warning)' }}>{stats.late}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-danger)' }}>{stats.absent}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`stat-badge ${parseFloat(stats.percentage) >= 80 ? 'success' : parseFloat(stats.percentage) >= 60 ? 'warning' : 'danger'}`}>
                        {stats.percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Agregar Fecha de Clase</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSessionSubmit}>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-add-subject">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
