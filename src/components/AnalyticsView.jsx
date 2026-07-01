import React from 'react';

export default function AnalyticsView({ students, attendance, evaluations, grades }) {
  if (students.length === 0) {
    return (
      <div className="workspace-panel">
        <h3 className="panel-title">Análisis y Estadísticas</h3>
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <h4 className="empty-state-title">No hay datos disponibles</h4>
          <p className="empty-state-desc">Agrega estudiantes, registra asistencias y notas para ver analíticas completas de esta asignatura.</p>
        </div>
      </div>
    );
  }

  // --- Calculate Attendance Stat ---
  let totalAttendanceRecords = 0;
  let positiveAttendanceRecords = 0; // P = 1, T = 0.5
  
  attendance.forEach(session => {
    students.forEach(student => {
      const status = session.records[student.id] || 'P';
      totalAttendanceRecords++;
      if (status === 'P') positiveAttendanceRecords += 1;
      else if (status === 'T') positiveAttendanceRecords += 0.5;
    });
  });

  const overallAttendance = totalAttendanceRecords > 0 
    ? ((positiveAttendanceRecords / totalAttendanceRecords) * 100).toFixed(1) 
    : '100.0';

  // --- Calculate Grade Stats ---
  let totalStudents = students.length;
  let approvedCount = 0;
  let recoveryCount = 0;
  let failedCount = 0;
  let sumProjectedGrades = 0;

  const studentFinalGrades = students.map(student => {
    let accumulatedScore = 0;
    let weightSum = 0;

    evaluations.forEach(evalItem => {
      const studentGrades = grades[student.id] || {};
      const score = studentGrades[evalItem.id];
      if (score !== undefined && score !== null && !isNaN(score)) {
        accumulatedScore += (score * evalItem.weight) / 100;
        weightSum += evalItem.weight;
      }
    });

    const projected = weightSum > 0 ? (accumulatedScore / weightSum) * 100 : 0;
    sumProjectedGrades += projected;

    if (projected >= 70) approvedCount++;
    else if (projected >= 50) recoveryCount++;
    else failedCount++;

    return {
      student,
      grade: projected
    };
  });

  const overallGradeAverage = totalStudents > 0 
    ? (sumProjectedGrades / totalStudents).toFixed(1) 
    : '0.0';

  // Sort students by grade for ranking
  const rankedStudents = [...studentFinalGrades].sort((a, b) => b.grade - a.grade);

  // Conic-gradient percentages calculations
  const approvedPct = totalStudents > 0 ? (approvedCount / totalStudents) * 100 : 0;
  const recoveryPct = totalStudents > 0 ? (recoveryCount / totalStudents) * 100 : 0;
  const failedPct = totalStudents > 0 ? (failedCount / totalStudents) * 100 : 0;

  const p1 = approvedPct.toFixed(1);
  const p2 = (approvedPct + recoveryPct).toFixed(1);

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Métricas e Insights de Desempeño
        </h3>
      </div>

      <div className="analytics-grid">
        {/* Card 1: Donut Chart Grade Distribution */}
        <div className="chart-card">
          <h4 className="chart-header">Distribución de Estatus Académico</h4>
          <div className="chart-donut-container">
            <div 
              className="donut-ring" 
              style={{
                '--p1': `${p1}%`,
                '--p2': `${p2}%`
              }}
            >
              <div className="donut-center">
                <span className="donut-val">{approvedCount} / {totalStudents}</span>
                <span className="donut-label">Aprobados</span>
              </div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-label-group">
                <span className="legend-color-dot success" />
                <span>Aprobado (&ge;70)</span>
              </div>
              <span className="legend-val">{approvedCount} ({approvedPct.toFixed(0)}%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-label-group">
                <span className="legend-color-dot warning" />
                <span>Recuperación (50-69)</span>
              </div>
              <span className="legend-val">{recoveryCount} ({recoveryPct.toFixed(0)}%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-label-group">
                <span className="legend-color-dot danger" />
                <span>Reprobado (&lt;50)</span>
              </div>
              <span className="legend-val">{failedCount} ({failedPct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Attendance statistics & progress */}
        <div className="chart-card">
          <h4 className="chart-header">Resumen de Asistencia</h4>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-info)' }}>
              {overallAttendance}%
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '240px' }}>
              Porcentaje general de asistencia física de la clase.
            </span>
          </div>
          <div className="bar-chart-container">
            <div className="bar-row">
              <div className="bar-label-row">
                <span>Asistencia de Clase</span>
                <span>{overallAttendance}%</span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${overallAttendance}%`, backgroundColor: 'var(--color-info)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CLASES IMPARTIDAS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{attendance.length}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PROMEDIO GENERAL</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>{overallGradeAverage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Student Ranking / Leaderboard */}
        <div className="chart-card" style={{ gridColumn: 'span 1' }}>
          <h4 className="chart-header">Cuadro de Honor (Mejores Promedios)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '200px', paddingRight: '0.25rem' }}>
            {rankedStudents.map((item, index) => (
              <div 
                key={item.student.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: index === 0 ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary)',
                  border: index === 0 ? '1px solid var(--color-success-border)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: 700, 
                    color: index === 0 ? 'var(--color-success)' : 'var(--text-muted)',
                    fontSize: '0.95rem'
                  }}>
                    #{index + 1}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.student.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.student.code}</span>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.grade >= 70 ? 'var(--color-success)' : 'var(--text-primary)' }}>
                  {item.grade.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
