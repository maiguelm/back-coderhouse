import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../daos/mongodb/models/user.model.js';
import { hashPassword, comparePassword } from '../utils/encryptPassword.js';
import { userDTO } from '../daos/mongodb/dto/user.dto.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = hashPassword(password);
    const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
    await newUser.save();

    res.redirect('/auth/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).send({ message: 'User not found' });
    }

    if (!comparePassword(password, user.password)) {
        return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_PASSPORT, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).redirect('/api/sessions/current');
});

router.get('/current', (req, res) => {
    const token = req.cookies['token'];
    if (!token) return res.status(401).send({ message: 'Usuario no encontrado' });

    jwt.verify(token, process.env.SECRET_PASSPORT, async (err, decoded) => {
        if (err) return res.status(401).send({ message: 'No autorizado' });

        const user = await User.findById(decoded.id);
        if (user) {
            const userData = userDTO(user);
            console.log(userData);
            res.render('current', {
                user: userData,
                loggedIn: true
            });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
});

export default router;