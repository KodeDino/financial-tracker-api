import { Request, Response } from 'express';
import db from '../config/database';
import { randomUUID } from 'crypto';

export const getAllInvestments = (req: Request, res: Response) => {
  const userId = (req.user as any)?.id

  db.all('SELECT * FROM investments WHERE user_id = ? ORDER BY date DESC', [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

export const createInvestment = (req: Request, res: Response) => {
  const userId = (req.user as any)?.id
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
  const id = randomUUID()
  db.run(
    'INSERT INTO investments (id, user_id, date, type, amount, rate) VALUES (?, ?, ?, ?, ?, ?)',
    [id, userId, date, type, amount, rate],
    function(err) {
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
        rate
      });
    }
  );
};

export const deleteInvestment = (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req.user as any)?.id

  db.run('DELETE FROM investments WHERE id = ? AND user_id = ?', [id, userId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return;
    }

    if(this.changes === 0) {
      res.status(404).json({ error: `Investment with id ${id} not found` })
      return;
    }

    res.status(200).json({ message: `Investment with id ${id} deleted successfully` })
  })
};
