const { execSync } = require("child_process");

const bunPath =
    process.env.BUN_PATH ||
    execSync("which bun").toString().trim();

module.exports = {
    apps: [
        {
            name: "ngaji",
            script: bunPath,
            args: "run src/index.tsx",
            interpreter: "none",
            watch: false,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
