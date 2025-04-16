"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const budgetRoutes_1 = __importDefault(require("./routes/budgetRoutes"));
const transactionsRoutes_1 = __importDefault(require("./routes/transactionsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(body_parser_1.default.json());
// Routes
app.use('/api', budgetRoutes_1.default);
app.use('/api', transactionsRoutes_1.default);
exports.default = app;
