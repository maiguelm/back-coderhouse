import { Router } from 'express';
import EmailService from '../services/email.services.js';

const router = Router();

router.get('/', EmailService)

export default router;