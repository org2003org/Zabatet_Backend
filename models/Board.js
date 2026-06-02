import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true }
}, { timestamps: true });
boardSchema.index({ name: 1, workspaceId: 1 }, { unique: true });

const Board = mongoose.model('Board', boardSchema);
export default Board;