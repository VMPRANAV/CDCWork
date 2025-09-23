const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Links to the admin who created the post
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Post = mongoose.model('Post', postSchema);
module.exports = Post;