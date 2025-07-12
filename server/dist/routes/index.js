"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const getRoutes = () => {
    const router = (0, express_1.Router)();
    router.use('/users', user_routes_1.default);
    return router;
};
exports.getRoutes = getRoutes;
