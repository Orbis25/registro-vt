import React, { useState } from 'react';

export default function RosterManager({ students, onAddStudent, onRemoveStudent }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    
    onAddStudent({ name: name.trim(), code: code.trim().toUpperCase() });
    setName('');
    setCode('');
    setShowForm(false);
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Listado de Alumnos ({students.length})
          </h3>
        </div>
        <div className="panel-actions">
          <button className="btn-add-subject" onClick={() => setShowForm(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Agregar Estudiante
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h4 className="empty-state-title">No hay estudiantes inscritos</h4>
          <p className="empty-state-desc">Agrega estudiantes a esta asignatura para comenzar a registrar su asistencia y calificaciones.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="registry-table">
            <thead>
              <tr>
                <th>Código / Matrícula</th>
                <th>Nombre Completo</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-info)' }}>
                      {student.code}
                    </span>
                  </td>
                  <td className="student-name-td">{student.name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-danger" 
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => {
                        if (confirm(`¿Estás seguro de que deseas eliminar a ${student.name} de esta asignatura? Se borrará su historial.`)) {
                          onRemoveStudent(student.id);
                        }
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Nuevo Estudiante</h3>
              <button className="btn-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Matrícula / Código</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej. A006" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej. Lucía Méndez" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-add-subject">
                  Guardar Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
