import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

commentSchema.index({ taskId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;