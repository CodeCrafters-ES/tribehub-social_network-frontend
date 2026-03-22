module.exports = {
  ci: {
    collect: {
      // Como no hay servidor externo, LHCI levantará el tuyo
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // Sube el reporte a los servidores de Google
    },
  },
};
