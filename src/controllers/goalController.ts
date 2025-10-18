import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import db from '../config/database';
import { Goal } from '../types/models';

export const getAllGoals = (req: Request, res: Response) => {
  const userId = req.user?.id;
  const statusParam = req.query.status as string;

  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  let query = 'SELECT * FROM goals WHERE user_id = ?';
  const params: (string | number)[] = [userId];

  if (statusParam) {
    // Split comma-separated statuses
    const statuses = statusParam.split(',').map((s) => s.trim());

    // Validate all statuses
    const validStatuses = ['active', 'completed', 'cancelled'];
    const invalidStatuses = statuses.filter((s) => !validStatuses.includes(s));

    if (invalidStatuses.length > 0) {
      res.status(400).json({
        error: `Invalid status values: ${invalidStatuses.join(', ')}. Must be active, completed, or cancelled`,
      });
      return;
    }

    // Build IN clause for multiple statuses
    const placeholders = statuses.map(() => '?').join(', ');
    query += ` AND status IN (${placeholders})`;
    params.push(...statuses);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

export const createGoal = (req: Request, res: Response) => {
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
  db.get(
    'SELECT id from goals WHERE user_id = ? AND status = ?',
    [userId, 'active'],
    (error, row) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      if (row) {
        res.status(400).json({ error: 'User already has an active goal' });
        return;
      }

      // create a row for a new goal if no active goal found
      const id = randomUUID();
      db.run(
        `INSERT INTO goals (id, user_id, target_amount, status) VALUES (?, ?, ?, ?)`,
        [id, userId, target_amount, 'active'],
        (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          // fetch the created goal after creation succeed
          db.get('SELECT * FROM goals where id = ?', [id], (error, goal) => {
            if (error) {
              res.status(500).json({ error: error.message });
              return;
            }
            res.status(201).json(goal);
          });
        }
      );
    }
  );
};

export const updateGoal = (req: Request, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id;
  const status = req.body.status as string;

  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  if (!status || !['completed', 'cancelled'].includes(status)) {
    res.status(400).json({ error: 'Status is required and must be either completed or cancelled' });
    return;
  }

  // First, check if goal exists and belongs to user
  db.get('SELECT * FROM goals WHERE id = ? AND user_id = ?', [id, userId], (error, goal: Goal) => {
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
    db.run(
      'UPDATE goals SET status = ?, completed_at = ? WHERE id = ? AND user_id = ?',
      [status, completedAt, id, userId],
      function (error) {
        if (error) {
          res.status(500).json({ error: error.message });
          return;
        }

        // Fetch and return the updated goal
        db.get('SELECT * FROM goals WHERE id = ?', [id], (error, updatedGoal) => {
          if (error) {
            res.status(500).json({ error: error.message });
            return;
          }
          res.json(updatedGoal);
        });
      }
    );
  });
};
