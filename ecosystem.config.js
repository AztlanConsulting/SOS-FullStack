const path = require('path');

module.exports = {
  apps: [
    {
      name: 'sos-backend',
      cwd: 'backend',
      script: 'dist/src/server.js',
      interpreter: 'node',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
