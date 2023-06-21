import express from 'express';
const router = express.Router();

import { signIn, signUp, updateUser, deleteUser } from '../controllers/userController.js';

router.post('/signup', signUp);
router.post('/signin', signIn);
router.put('/:id', updateUser);
router.post('/:id', deleteUser);

export default router;
