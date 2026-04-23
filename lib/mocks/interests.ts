import { Interest } from '../types/interests';

export const MOCK_INTERESTS: Interest[] = [
  { id: '1', name: 'Pintura', category: 'arte_cultura' },
  { id: '2', name: 'Fotografía', category: 'arte_cultura' },
  { id: '3', name: 'Teatro', category: 'arte_cultura' },

  { id: '4', name: 'Cine', category: 'entretenimiento' },
  { id: '5', name: 'Series', category: 'entretenimiento' },
  { id: '6', name: 'Podcasts', category: 'entretenimiento' },

  { id: '7', name: 'Programación', category: 'ciencia_tecnologia' },
  { id: '8', name: 'Inteligencia artificial', category: 'ciencia_tecnologia' },
  { id: '9', name: 'Ciberseguridad', category: 'ciencia_tecnologia' },

  { id: '10', name: 'Lectura', category: 'educacion' },
  { id: '11', name: 'Psicología', category: 'educacion' },
  { id: '12', name: 'Idiomas', category: 'educacion' },

  { id: '13', name: 'Running', category: 'salud_ocio' },
  { id: '14', name: 'Gimnasio', category: 'salud_ocio' },
  { id: '15', name: 'Yoga', category: 'salud_ocio' },

  { id: '16', name: 'Viajes', category: 'estilo_vida' },
  { id: '17', name: 'Cocina', category: 'estilo_vida' },
  { id: '18', name: 'Desarrollo personal', category: 'estilo_vida' },

  { id: '19', name: 'Emprendimiento', category: 'economia' },
  { id: '20', name: 'Inversiones', category: 'economia' },
  { id: '21', name: 'Marketing', category: 'economia' },

  { id: '22', name: 'Videojuegos', category: 'gaming' },
  { id: '23', name: 'eSports', category: 'gaming' },
];

export const MOCK_CATEGORIES = [
  { id: 'arte_cultura', label: 'Arte y cultura' },
  { id: 'entretenimiento', label: 'Entretenimiento' },
  { id: 'ciencia_tecnologia', label: 'Ciencia y tecnología' },
  { id: 'educacion', label: 'Educación' },
  { id: 'salud_ocio', label: 'Salud y ocio' },
  { id: 'estilo_vida', label: 'Estilo de vida' },
  { id: 'economia', label: 'Economía' },
  { id: 'gaming', label: 'Gaming' },
];

export const MOCK_SELECTED: string[] = ['3', '5'];
