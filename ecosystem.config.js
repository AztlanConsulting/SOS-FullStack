const path = require('path');

module.exports = {
  apps: [
    {
      name: 'sos-backend',
      cwd: 'backend',
      script: 'dist/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      interpreter: 'node',
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
