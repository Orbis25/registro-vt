export const initialSubjects = [
  {
    id: 'sub-1',
    name: 'Matemáticas',
    code: 'MAT-101',
    teacher: 'Prof. Carlos Mendoza',
    color: '#3b82f6',
    students: [
      { id: 'est-1', name: 'Sofía Rodríguez', code: 'A001' },
      { id: 'est-2', name: 'Mateo González', code: 'A002' },
      { id: 'est-3', name: 'Valeria Gómez', code: 'A003' },
      { id: 'est-4', name: 'Santiago López', code: 'A004' },
      { id: 'est-5', name: 'Camila Martínez', code: 'A005' },
    ],
    attendance: [
      { date: '2026-06-15', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'A', 'est-4': 'P', 'est-5': 'T' } },
      { date: '2026-06-17', records: { 'est-1': 'P', 'est-2': 'A', 'est-3': 'P', 'est-4': 'P', 'est-5': 'P' } },
      { date: '2026-06-20', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'P', 'est-4': 'A', 'est-5': 'P' } },
      { date: '2026-06-22', records: { 'est-1': 'T', 'est-2': 'P', 'est-3': 'P', 'est-4': 'P', 'est-5': 'A' } },
      { date: '2026-06-24', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'A', 'est-4': 'P', 'est-5': 'P' } },
    ],
    evaluations: [
      { id: 'eval-1', name: 'Tarea 1', weight: 15, maxGrade: 100 },
      { id: 'eval-2', name: 'Examen 1', weight: 25, maxGrade: 100 },
      { id: 'eval-3', name: 'Tarea 2', weight: 15, maxGrade: 100 },
      { id: 'eval-4', name: 'Proyecto Final', weight: 45, maxGrade: 100 },
    ],
    grades: {
      'est-1': { 'eval-1': 95, 'eval-2': 88, 'eval-3': 90, 'eval-4': 92 },
      'est-2': { 'eval-1': 85, 'eval-2': 75, 'eval-3': 80, 'eval-4': 88 },
      'est-3': { 'eval-1': 70, 'eval-2': 65, 'eval-3': 75, 'eval-4': 72 },
      'est-4': { 'eval-1': 90, 'eval-2': 92, 'eval-3': 85, 'eval-4': 95 },
      'est-5': { 'eval-1': 60, 'eval-2': 55, 'eval-3': 65, 'eval-4': 58 },
    }
  },
  {
    id: 'sub-2',
    name: 'Ciencias Naturales',
    code: 'CIE-202',
    teacher: 'Dra. Elena Rostova',
    color: '#10b981',
    students: [
      { id: 'est-1', name: 'Sofía Rodríguez', code: 'A001' },
      { id: 'est-2', name: 'Mateo González', code: 'A002' },
      { id: 'est-3', name: 'Valeria Gómez', code: 'A003' },
      { id: 'est-4', name: 'Santiago López', code: 'A004' },
      { id: 'est-5', name: 'Camila Martínez', code: 'A005' },
    ],
    attendance: [
      { date: '2026-06-16', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'P', 'est-4': 'P', 'est-5': 'P' } },
      { date: '2026-06-18', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'A', 'est-4': 'T', 'est-5': 'P' } },
      { date: '2026-06-23', records: { 'est-1': 'P', 'est-2': 'A', 'est-3': 'P', 'est-4': 'P', 'est-5': 'A' } },
      { date: '2026-06-25', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'P', 'est-4': 'P', 'est-5': 'P' } },
    ],
    evaluations: [
      { id: 'eval-1', name: 'Reporte Lab 1', weight: 20, maxGrade: 100 },
      { id: 'eval-2', name: 'Parcial 1', weight: 30, maxGrade: 100 },
      { id: 'eval-3', name: 'Reporte Lab 2', weight: 20, maxGrade: 100 },
      { id: 'eval-4', name: 'Proyecto Lab', weight: 30, maxGrade: 100 },
    ],
    grades: {
      'est-1': { 'eval-1': 100, 'eval-2': 92, 'eval-3': 95, 'eval-4': 98 },
      'est-2': { 'eval-1': 80, 'eval-2': 82, 'eval-3': 78, 'eval-4': 85 },
      'est-3': { 'eval-1': 85, 'eval-2': 70, 'eval-3': 88, 'eval-4': 78 },
      'est-4': { 'eval-1': 95, 'eval-2': 90, 'eval-3': 92, 'eval-4': 94 },
      'est-5': { 'eval-1': 70, 'eval-2': 62, 'eval-3': 75, 'eval-4': 68 },
    }
  },
  {
    id: 'sub-3',
    name: 'Literatura y Español',
    code: 'LIT-303',
    teacher: 'Prof. Mario Vargas',
    color: '#f59e0b',
    students: [
      { id: 'est-1', name: 'Sofía Rodríguez', code: 'A001' },
      { id: 'est-2', name: 'Mateo González', code: 'A002' },
      { id: 'est-3', name: 'Valeria Gómez', code: 'A003' },
      { id: 'est-4', name: 'Santiago López', code: 'A004' },
      { id: 'est-5', name: 'Camila Martínez', code: 'A005' },
    ],
    attendance: [
      { date: '2026-06-14', records: { 'est-1': 'P', 'est-2': 'T', 'est-3': 'P', 'est-4': 'P', 'est-5': 'P' } },
      { date: '2026-06-19', records: { 'est-1': 'P', 'est-2': 'A', 'est-3': 'P', 'est-4': 'P', 'est-5': 'A' } },
      { date: '2026-06-21', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'T', 'est-4': 'P', 'est-5': 'P' } },
      { date: '2026-06-26', records: { 'est-1': 'P', 'est-2': 'P', 'est-3': 'P', 'est-4': 'P', 'est-5': 'P' } },
    ],
    evaluations: [
      { id: 'eval-1', name: 'Control de Lectura 1', weight: 25, maxGrade: 100 },
      { id: 'eval-2', name: 'Ensayo Crítico', weight: 35, maxGrade: 100 },
      { id: 'eval-3', name: 'Exposición Oral', weight: 40, maxGrade: 100 },
    ],
    grades: {
      'est-1': { 'eval-1': 88, 'eval-2': 90, 'eval-3': 95 },
      'est-2': { 'eval-1': 70, 'eval-2': 75, 'eval-3': 80 },
      'est-3': { 'eval-1': 95, 'eval-2': 82, 'eval-3': 90 },
      'est-4': { 'eval-1': 92, 'eval-2': 96, 'eval-3': 94 },
      'est-5': { 'eval-1': 50, 'eval-2': 55, 'eval-3': 60 },
    }
  }
];
