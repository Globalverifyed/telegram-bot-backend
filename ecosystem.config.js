module.exports = {
  apps: [
    {
      name: "Globalverifyed_bot",
      script: "bot.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      time: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
