"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoal = exports.createGoal = exports.getAllGoals = void 0;
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("../config/database"));
const getAllGoals = (req, res) => {
    const userId = req.user?.id;
    const status = req.query.status;
    if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    let query = 'SELECT * FROM goals WHERE user_id = ?';
    const params = [userId];
    if (status) {
        if (!['active', 'completed', 'cancelled'].includes(status)) {
            res.status(400).json({ error: 'Invalid status. Must be active, completed, or cancelled' });
            return;
        }
        query += ' AND status = ?';
        params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    database_1.default.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
};
exports.getAllGoals = getAllGoals;
const createGoal = (req, res) => {
    const userId = req.user?.id;
    const { target_amount } = req.body;
    if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    if (!target_amount || target_amount <= 0) {
        res.status(400).json({ error: 'Valid target_amount is required' });
        return;
    }
    // Check to see if an active goal exists
    database_1.default.get('SELECT id from goals WHERE user_id = ? AND status = ?', [userId, 'active'], (error, row) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (row) {
            res.status(400).json({ error: 'User already has an active goal' });
            return;
        }
        // create a row for a new goal if no active goal found
        const id = (0, crypto_1.randomUUID)();
        database_1.default.run(`INSERT INTO goals (id, user_id, target_amount, status) VALUES (?, ?, ?, ?)`, [id, userId, target_amount, 'active'], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            // fetch the created goal after creation succeed
            database_1.default.get('SELECT * FROM goals where id = ?', [id], (error, goal) => {
                if (error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                res.status(201).json(goal);
            });
        });
    });
};
exports.createGoal = createGoal;
const updateGoal = (req, res) => {
    const userId = req.user?.id;
    const id = req.params.id;
    const status = req.body.status;
    if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    if (!status || !['completed', 'cancelled'].includes(status)) {
        res.status(400).json({ error: 'Status is required and must be either completed or cancelled' });
        return;
    }
    // First, check if goal exists and belongs to user
    database_1.default.get('SELECT * FROM goals WHERE id = ? AND user_id = ?', [id, userId], (error, goal) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (!goal) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        // Optional: Check if goal is already in that status
        if (goal.status === status) {
            res.status(400).json({ error: `Goal is already ${status}` });
            return;
        }
        // Determine completed_at value based on status
        // If 'completed', use CURRENT_TIMESTAMP. If 'cancelled' or 'active', set to null
        const completedAt = status === 'completed' ? new Date().toISOString() : null;
        // Update the goal
        database_1.default.run('UPDATE goals SET status = ?, completed_at = ? WHERE id = ? AND user_id = ?', [status, completedAt, id, userId], function (error) {
            if (error) {
                res.status(500).json({ error: error.message });
                return;
            }
            // Fetch and return the updated goal
            database_1.default.get('SELECT * FROM goals WHERE id = ?', [id], (error, updatedGoal) => {
                if (error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                res.json(updatedGoal);
            });
        });
    });
};
exports.updateGoal = updateGoal;
