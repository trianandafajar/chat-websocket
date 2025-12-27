module.exports = {
  apps: [
    {
      name: "chat-app",
      script: "server.mjs",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3041,
        NEXTAUTH_URL: "https://chat-app.trianandafajar.com"
      }
    }
  ]
};
