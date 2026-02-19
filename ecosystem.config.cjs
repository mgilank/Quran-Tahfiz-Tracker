module.exports = {
  apps: [
    {
      name: "ngaji",
      script: "src/index.tsx",
      interpreter: "bun",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
