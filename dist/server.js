"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
app_1.app.listen(config_1.config.port, () => {
    console.log(`Server is running on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode`);
});
