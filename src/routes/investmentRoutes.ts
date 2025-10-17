import { Router } from 'express';
import {
  getAllInvestments,
  createInvestment,
  deleteInvestment,
} from '../controllers/investmentController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getAllInvestments);
router.post('/', requireAuth, createInvestment);
router.delete('/:id', requireAuth, deleteInvestment);

export default router;
