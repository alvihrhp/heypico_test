"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
exports.app = (0, express_1.default)();
// Middleware
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
// Debug middleware to log all requests
exports.app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Routes
exports.app.use('/api', recommendationRoutes_1.default);
// Health check endpoint
exports.app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
});
// Error handling middleware
exports.app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
