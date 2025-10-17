"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv must be imported and configured first
/* eslint-disable import/order */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* eslint-enable import/order */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./config/passport"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const investmentRoutes_1 = __importDefault(require("./routes/investmentRoutes"));
const app = (0, express_1.default)();
const PORT = 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/investments', investmentRoutes_1.default);
app.use('/api/goals', goalRoutes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
