module.exports = {
  apps: [
    {
      name: "chat-app-ega",
      script: "server.mjs",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3042,
        NEXTAUTH_URL: "https://chat-app.egadestaviano.my.id",
        APP_URL: "https://chat-app.egadestaviano.my.id"
      }
    }
  ]
};
