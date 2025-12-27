module.exports = {
  apps: [
    {
      name: "chat-app",
      script: "server.mjs",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 9898,
        NEXTAUTH_URL: "https://chat-app.trianandafajar.com"
      }
    }
  ]
};
