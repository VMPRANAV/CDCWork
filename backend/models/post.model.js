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
    }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Post = mongoose.model('Post', postSchema);
module.exports = Post;