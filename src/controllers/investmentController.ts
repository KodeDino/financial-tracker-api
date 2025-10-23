import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import db from '../config/database';

export const getAllInvestments = (req: Request, res: Response) => {
  const userId = req.user?.id;

  db.all(
    'SELECT * FROM investments WHERE user_id = ? ORDER BY date DESC',
    [userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

export const createInvestment = (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { date, type, amount, rate, actual_cost } = req.body;

  // Validate required fields
  if (!date || !type || amount === undefined) {
    res.status(400).json({ error: 'Missing required fields: date, type, amount' });
    return;
  }

  // Validate type field
  if (!['cd', 'tBill'].includes(type)) {
    res.status(400).json({ error: 'Type must be "cd" or "tBill"' });
    return;
  }

  // Validate type-specific fields
  if (type === 'cd' && rate === undefined) {
    res.status(400).json({ error: 'Rate is required for CD investments' });
    return;
  }

  if (type === 'tBill' && actual_cost === undefined) {
    res.status(400).json({ error: 'Face value is required for T-Bill investments' });
    return;
  }

  // Insert into database
  const id = randomUUID();
  db.run(
    'INSERT INTO investments (id, user_id, date, type, amount, rate, actual_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, userId, date, type, amount, rate || null, actual_cost || null],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id,
        user_id: userId,
        date,
        type,
        actual_cost,
        amount,
        rate,
      });
    }
  );
};

export const deleteInvestment = (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;

  db.run('DELETE FROM investments WHERE id = ? AND user_id = ?', [id, userId], function (err) {
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
