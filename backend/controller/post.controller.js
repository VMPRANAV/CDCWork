const Post = require('../models/post.model');
const User = require('../models/user.model');

const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Please provide a title and description.' });
        }

        const post = new Post({
            title,
            description,
            reactions: [],
            reactionCounts: {
                registered: 0,
                not_registered: 0,
                total: 0
            }
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);

    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = await Post.findById(req.params.id);

        if (post) {
            post.title = title || post.title;
            post.description = description || post.description;

            const updatedPost = await post.save();
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate({
                path: 'reactions.userId',
                select: 'fullName collegeEmail rollNo mobileNumber'
            })
            .sort({ createdAt: -1 });
            
        console.log('Fetched posts with reactions:', posts.map(p => ({ 
            title: p.title, 
            reactionsCount: p.reactions?.length || 0,
            reactions: p.reactions?.map(r => ({ 
                userId: r.userId?._id, 
                userName: r.userId?.fullName,
                type: r.type 
            }))
        })));
        
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: 'reactions.userId',
                select: 'fullName collegeEmail rollNo mobileNumber'
            });
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            await post.deleteOne();
            res.status(200).json({ message: 'Post removed successfully.' });
        } else {
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const reactToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { reactionType } = req.body;
        const userId = req.user.id;

        console.log('React to post - User ID:', userId, 'Reaction Type:', reactionType, 'Post ID:', postId);

        const validReactions = ['registered', 'not_registered'];
        if (!validReactions.includes(reactionType)) {
            return res.status(400).json({ 
                message: 'Invalid reaction type. Must be: registered or not_registered' 
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const existingReactionIndex = post.reactions.findIndex(
            reaction => reaction.userId.toString() === userId
        );

        if (existingReactionIndex !== -1) {
            // Update existing reaction
            post.reactions[existingReactionIndex].type = reactionType;
            post.reactions[existingReactionIndex].reactedAt = new Date();
        } else {
            // Add new reaction
            post.reactions.push({
                userId,
                type: reactionType,
                reactedAt: new Date()
            });
        }

        const updatedPost = await post.save();
        await updatedPost.populate({
            path: 'reactions.userId',
            select: 'fullName collegeEmail rollNo mobileNumber'
        });
        
        console.log('Updated post reactions:', updatedPost.reactions?.length || 0);
        
        res.status(200).json({
            message: 'Reaction updated successfully',
            post: updatedPost,
            userReaction: reactionType
        });

    } catch (error) {
        console.error('Error in reactToPost:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const removeReaction = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        post.reactions = post.reactions.filter(
            reaction => reaction.userId.toString() !== userId
        );

        const updatedPost = await post.save();
        await updatedPost.populate({
            path: 'reactions.userId',
            select: 'fullName collegeEmail rollNo mobileNumber'
        });
        
        res.status(200).json({
            message: 'Reaction removed successfully',
            post: updatedPost
        });

    } catch (error) {
        console.error('Error in removeReaction:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const getPostReactions = async (req, res) => {
    try {
        const { postId } = req.params;

        console.log('Fetching reactions for post ID:', postId);

        const post = await Post.findById(postId)
            .populate({
                path: 'reactions.userId',
                select: 'fullName collegeEmail rollNo mobileNumber',
                model: 'User'
            });
            
        if (!post) {
            console.log('Post not found for ID:', postId);
            return res.status(404).json({ message: 'Post not found.' });
        }

        console.log('Found post with reactions:', {
            postTitle: post.title,
            totalReactions: post.reactions?.length || 0,
            reactions: post.reactions?.map(r => ({
                userId: r.userId?._id,
                userName: r.userId?.fullName,
                userEmail: r.userId?.collegeEmail,
                rollNo: r.userId?.rollNo,
                type: r.type,
                reactedAt: r.reactedAt
            }))
        });

        // Separate reactions by type with student info
        const reactionDetails = {
            registered: [],
            not_registered: []
        };

        const counts = {
            registered: 0,
            not_registered: 0,
            total: post.reactions?.length || 0
        };

        if (post.reactions && post.reactions.length > 0) {
            post.reactions.forEach(reaction => {
                if (reaction.userId && reaction.type && reactionDetails[reaction.type]) {
                    counts[reaction.type]++;
                    reactionDetails[reaction.type].push({
                        user: {
                            _id: reaction.userId._id,
                            name: reaction.userId.fullName || 'Unknown',
                            email: reaction.userId.collegeEmail || 'No email',
                            rollno: reaction.userId.rollNo || 'No roll number',
                            phone: reaction.userId.mobileNumber || 'No phone'
                        },
                        reactedAt: reaction.reactedAt
                    });
                }
            });
        }

        const response = {
            postTitle: post.title,
            postId: post._id,
            reactions: {
                ...reactionDetails,
                counts
            }
        };

        console.log('Sending response:', JSON.stringify(response, null, 2));

        res.status(200).json(response);

    } catch (error) {
        console.error('Error in getPostReactions:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    reactToPost,
    removeReaction,
    getPostReactions
};