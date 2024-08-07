"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRoutes = void 0;
const express_1 = require("express");
const urlController_1 = require("../controller/urlController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const urlRoutes = (0, express_1.Router)();
exports.urlRoutes = urlRoutes;
urlRoutes.get("/", authMiddleware_1.authMiddlware, urlController_1.getAllUrls);
urlRoutes.post("/", authMiddleware_1.authMiddlware, urlController_1.createNewURL);
