"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getUser = void 0;
const getUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else {
        res.status(401).json({ error: 'Not authenticated' });
    }
};
exports.getUser = getUser;
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Logged out successfully' });
    });
};
exports.logout = logout;
