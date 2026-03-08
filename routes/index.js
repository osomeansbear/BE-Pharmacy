const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const routesPath = __dirname;

fs.readdirSync(routesPath).forEach((file) => {
  if (file === "index.js") return;
  if (file.endsWith(".js")) {
    const route = require(path.join(routesPath, file));
    const routeName = file.replace(".route.js", "");
    router.use(`/${routeName}`, route);
  }
});

module.exports = router;
