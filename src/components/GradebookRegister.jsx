import React, { useState } from 'react';

export default function GradebookRegister({ students, evaluations, grades, onAddEvaluation, onUpdateGrade, onDeleteEvaluation }) {
  const [evalName, setEvalName] = useState('');
  const [evalWeight, setEvalWeight] = useState('');
  const [showModal, setShowModal] = useState(false);

  const totalWeight = evaluations.reduce((sum, item) => sum + item.weight, 0);

  const handleAddEvalSubmit = (e) => {
    e.preventDefault();
    if (!evalName.trim() || !evalWeight) return;

    const weightNum = parseFloat(evalWeight);
    if (weightNum <= 0) {
      alert('La ponderación debe ser un número positivo.');
      return;
    }

    if (totalWeight + weightNum > 100) {
      alert(`La ponderación total no puede superar el 100%. Espacio disponible: ${100 - totalWeight}%.`);
      return;
    }

    onAddEvaluation({
      name: evalName.trim(),
      weight: weightNum
    });

    setEvalName('');
    setEvalWeight('');
    setShowModal(false);
  };

  // Helper to calculate student grades summary
  const calculateStudentGrades = (studentId) => {
    let accumulatedScore = 0;
    let weightSum = 0;

    evaluations.forEach(evalItem => {
      const studentGrades = grades[studentId] || {};
      const score = studentGrades[evalItem.id];
      
      if (score !== undefined && score !== null && !isNaN(score)) {
        accumulatedScore += (score * evalItem.weight) / 100;
        weightSum += evalItem.weight;
      }
    });

    // Projected grade (if they maintain their current performance, adjusted to a scale of 0-100)
    const projected = weightSum > 0 ? (accumulatedScore / weightSum) * 100 : 0;
    
    // Status based on projected grade or accumulated (let's use accumulated if weights sum to 100, or projected for standard tracking)
    // If weights sum to 100, accumulated == projected. Let's use projected as final average, and accumulated as points earned.
    let status = 'Reprobado';
    let statusClass = 'danger';

    if (projected >= 70) {
      status = 'Aprobado';
      statusClass = 'success';
    } else if (projected >= 50) {
      status = 'Recuperación';
      statusClass = 'warning';
    }

    return {
      accumulated: accumulatedScore.toFixed(1),
      projected: projected.toFixed(1),
      status,
      statusClass
    };
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
            Registro de Calificaciones (Base 100)
          </h3>
        </div>
        <div className="panel-actions">
          <button 
            className="btn-add-subject" 
            onClick={() => setShowModal(true)}
            disabled={totalWeight >= 100}
            style={{ opacity: totalWeight >= 100 ? 0.5 : 1, cursor: totalWeight >= 100 ? 'not-allowed' : 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Evaluación
          </button>
        </div>
      </div>

      {/* Ponderations Indicator */}
      <div className={`alert-panel ${totalWeight === 100 ? 'success' : totalWeight > 100 ? 'danger' : 'warning'}`} 
           style={{
             backgroundColor: totalWeight === 100 ? 'var(--color-success-bg)' : 'var(--bg-tertiary)',
             borderColor: totalWeight === 100 ? 'var(--color-success-border)' : 'var(--border-color)',
             color: totalWeight === 100 ? 'var(--color-success)' : 'var(--text-secondary)',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'stretch',
             gap: '0.5rem'
           }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
          <span>Distribución de Calificaciones: {totalWeight}% / 100%</span>
          {totalWeight < 100 && <span>Falta un {100 - totalWeight}% por asignar</span>}
          {totalWeight === 100 && <span>¡Distribución completa!</span>}
        </div>
        <div className="bar-bg" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }}>
          <div className="bar-fill" style={{ 
            width: `${totalWeight}%`, 
            backgroundColor: totalWeight === 100 ? 'var(--color-success)' : 'var(--color-warning)'
          }} />
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
                {evaluations.map((evalItem) => (
                  <th key={evalItem.id} style={{ textAlign: 'center', minWidth: '110px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>{evalItem.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-info)', fontFamily: 'var(--font-mono)' }}>
                        ({evalItem.weight}%)
                      </span>
                      <button 
                        className="btn-close" 
                        style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="Eliminar esta evaluación"
                        onClick={() => {
                          if (confirm(`¿Eliminar la evaluación "${evalItem.name}" (${evalItem.weight}%)? Se perderán las calificaciones registradas.`)) {
                            onDeleteEvaluation(evalItem.id);
                          }
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  </th>
                ))}
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Puntos Ganados</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Promedio Act.</th>
                <th style={{ textAlign: 'center', minWidth: '120px' }}>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const results = calculateStudentGrades(student.id);
                return (
                  <tr key={student.id}>
                    <td>
                      <div className="col-student-info">
                        <span className="student-name-td">{student.name}</span>
                        <span className="student-code-td">{student.code}</span>
                      </div>
                    </td>
                    {evaluations.map((evalItem) => {
                      const studentGrades = grades[student.id] || {};
                      const value = studentGrades[evalItem.id] !== undefined ? studentGrades[evalItem.id] : '';
                      return (
                        <td key={evalItem.id} style={{ textAlign: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="grade-input"
                            value={value}
                            placeholder="-"
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                              onUpdateGrade(student.id, evalItem.id, val);
                            }}
                          />
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {results.accumulated} pts
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-info)' }}>
                      {results.projected}%
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`stat-badge ${results.statusClass}`}>
                        {results.status}
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
              <h3 className="modal-title">Nueva Actividad Evaluativa</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddEvalSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre de la Evaluación</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej. Tarea 1, Examen Parcial" 
                  value={evalName}
                  onChange={(e) => setEvalName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Peso Ponderado (%)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder={`Máximo disponible: ${100 - totalWeight}`} 
                  min="1"
                  max={100 - totalWeight}
                  value={evalWeight}
                  onChange={(e) => setEvalWeight(e.target.value)}
                  required
                />
                <span className="form-hint">Indica el porcentaje de la nota total que representa esta actividad.</span>
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
