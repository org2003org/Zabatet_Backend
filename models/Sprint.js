import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    goal: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Planned', 'Active', 'Completed'], default: 'Planned' },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }
}, { timestamps: true });
sprintSchema.index({ name: 1, boardId: 1 }, { unique: true });

const Sprint = mongoose.model('Sprint', sprintSchema);
export default Sprint;