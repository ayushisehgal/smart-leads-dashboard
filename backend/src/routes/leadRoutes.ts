import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads, getLead, createLead, updateLead, deleteLead, exportLeads,
} from '../controllers/leadController';
import { authenticate } from '../middleware/auth';

const router = Router();

const leadValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Valid source required'),
];

router.get('/export', authenticate, exportLeads);
router.get('/', authenticate, getLeads);
router.get('/:id', authenticate, getLead);
router.post('/', authenticate, leadValidation, createLead);
router.put('/:id', authenticate, leadValidation, updateLead);
router.delete('/:id', authenticate, deleteLead);

export default router;