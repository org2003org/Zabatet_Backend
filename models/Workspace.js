import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
workspaceSchema.index({ name: 1, owner: 1 }, { unique: true });
const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;