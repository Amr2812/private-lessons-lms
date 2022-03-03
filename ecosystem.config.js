module.exports = {
  apps: [
    {
      name: "app",
      script: "./bin/www",
      instances: "1",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
