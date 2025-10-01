// routes/postsRoutes.js

const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    reactToPost,
    removeReaction,
    getPostReactions
} = require('../controller/post.controller');

// Import your middleware
const { protect, authorize } = require('../middleware/auth.middleware'); 

// --- PUBLIC ROUTES ---
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// --- STUDENT ROUTES (PROTECTED) ---
router.post('/:postId/react', protect, authorize('student'), reactToPost);
router.delete('/:postId/react', protect, authorize('student'), removeReaction);

// --- ADMIN-ONLY ROUTES ---
// 1. `protect` runs first to ensure the user is logged in.
// 2. `authorize('admin')` runs next, ensuring req.user.role is 'admin'.
// 3. If both pass, the following functions are called:
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);
router.get('/:postId/reactions', protect, authorize('admin'), getPostReactions);

module.exports = router;