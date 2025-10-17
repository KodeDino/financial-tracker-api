"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvestment = exports.createInvestment = exports.getAllInvestments = void 0;
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("../config/database"));
const getAllInvestments = (req, res) => {
    const userId = req.user?.id;
    database_1.default.all('SELECT * FROM investments WHERE user_id = ? ORDER BY date DESC', [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
};
exports.getAllInvestments = getAllInvestments;
const createInvestment = (req, res) => {
    const userId = req.user?.id;
    const { date, type, amount, rate } = req.body;
    // Validate required fields
    if (!date || !type || amount === undefined || rate === undefined) {
        res.status(400).json({ error: 'Missing required fields: date, type, amount, rate' });
        return;
    }
    // Validate type field
    if (!['cd', 'tBill'].includes(type)) {
        res.status(400).json({ error: 'Type must be "cd" or "tBill"' });
        return;
    }
    // Insert into database
    const id = (0, crypto_1.randomUUID)();
    database_1.default.run('INSERT INTO investments (id, user_id, date, type, amount, rate) VALUES (?, ?, ?, ?, ?, ?)', [id, userId, date, type, amount, rate], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id,
            user_id: userId,
            date,
            type,
            amount,
            rate,
        });
    });
};
exports.createInvestment = createInvestment;
const deleteInvestment = (req, res) => {
    const id = req.params.id;
    const userId = req.user?.id;
    database_1.default.run('DELETE FROM investments WHERE id = ? AND user_id = ?', [id, userId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: `Investment with id ${id} not found` });
            return;
        }
        res.status(200).json({ message: `Investment with id ${id} deleted successfully` });
    });
};
exports.deleteInvestment = deleteInvestment;
