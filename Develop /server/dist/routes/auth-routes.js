var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const router = Router();
// POST /login - Login a user
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // 1. Check if the user exists
        const user = yield User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 2. Verify the password using bcrypt
        const validPassword = yield bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        // 3. Generate a JWT token with the user's ID and username as payload
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, // Ensure JWT secret is in .env
        { expiresIn: '1h' } // Token expires in 1 hour
        );
        // 4. Return the token as a response
        return res.json({ token });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/login', login);
export default router;
