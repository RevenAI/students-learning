const fs = require("fs");
const path = require("path");

const structure = {
  "nodejs-chat-app": {
    config: ["db.js", "redis.js", "env.js"],
    controllers: ["auth.controller.js", "chat.controller.js", "user.controller.js"],
    middleware: ["auth.middleware.js", "error.middleware.js", "rateLimit.middleware.js"],
    models: ["message.model.js", "session.model.js", "user.model.js"],
    routes: ["auth.routes.js", "chat.routes.js", "user.routes.js"],
    services: ["cache.service.js", "email.service.js", "socket.service.js", "token.service.js"],
    utils: ["helpers.js", "logger.js", "validators.js"],
    ".": ["app.js", "server.js", "package.json"],
  },
};

function createStructure(basePath, contents) {
  Object.entries(contents).forEach(([folder, files]) => {
    const dirPath = path.join(basePath, folder);
    if (folder !== ".") {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    files.forEach((file) => {
      const filePath = path.join(folder === "." ? basePath : dirPath, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "", "utf8");
        console.log(`Created: ${filePath}`);
      }
    });
  });
}

const root = Object.keys(structure)[0];
fs.mkdirSync(root, { recursive: true });
createStructure(root, structure[root]);
