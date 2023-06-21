import express from "express";

const router = express.Router();

import { createPost, getAllPost, getASinglePost, updateASinglePost, deletePost, deleteAllPost, queryForAPost } from "../controllers/postController.js";
import auth from '../middlewares/auth.js';

// Public Route
router.get('/', getAllPost);
router.get('/:id', getASinglePost);


// Auth Route
router.post('/dashboard', auth, queryForAPost);
router.post('/', auth, createPost);
router.put('/:id', auth, updateASinglePost);
router.delete('/:id', auth, deletePost);
router.delete('/user/:id', auth, deleteAllPost);

export default router;