module.exports = {
  apps: [{
    name: "backend",
    script: "./dist/backend/server.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
