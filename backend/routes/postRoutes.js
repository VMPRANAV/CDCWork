// routes/postsRoutes.js

const express = require('express');
const router = express.Router();
const { createPost, getAllPosts,getPostById,  updatePost, deletePost} = require('../controller/postController');

// Import your excellent middleware
const { protect, authorize } = require('../middleware/auth'); 

// --- PUBLIC ROUTES ---
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// --- ADMIN-ONLY ROUTES ---
// 1. `protect` runs first to ensure the user is logged in.
// 2. `authorize('admin')` runs next, ensuring req.user.role is 'admin'.
// 3. If both pass, `createPost` is called.
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;