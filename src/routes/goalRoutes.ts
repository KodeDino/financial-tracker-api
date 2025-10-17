import { Router } from 'express';
import { getAllGoals, createGoal, updateGoal } from '../controllers/goalController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getAllGoals);
router.post('/', requireAuth, createGoal);
router.patch('/:id', requireAuth, updateGoal);

export default router;
