import { Router } from 'express';
import { loginUser, registerUser, renderLoginView, renderRegisterView } from '../controllers/auth.controllers.js';

const router = Router();

router.get('/login', renderLoginView);
router.get('/register', renderRegisterView);


router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;