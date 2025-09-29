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
    reactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['registered', 'not_registered'],
            required: true
        },
        reactedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Actual counts instead of virtual
    reactionCounts: {
        registered: {
            type: Number,
            default: 0
        },
        not_registered: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    }
}, { 
    timestamps: true
});

// Middleware to update counts whenever reactions change
postSchema.pre('save', function() {
    const counts = {
        registered: 0,
        not_registered: 0,
        total: this.reactions.length
    };
    
    this.reactions.forEach(reaction => {
        if (counts.hasOwnProperty(reaction.type)) {
            counts[reaction.type]++;
        }
    });
    
    this.reactionCounts = counts;
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;