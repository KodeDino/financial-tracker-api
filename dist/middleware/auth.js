"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
