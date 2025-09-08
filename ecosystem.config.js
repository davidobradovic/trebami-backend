module.exports = {
  apps: [{
    name: "trebami-backend",
    script: 'dist/server.js',
    cwd: '/var/www/trebami-backend', // Make sure this matches your actual path
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Logging
    log_file: '/var/log/trebami-backend/combined.log',
    out_file: '/var/log/trebami-backend/out.log',
    error_file: '/var/log/trebami-backend/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Auto restart settings
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
