import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { 
      type: String, 
      enum: ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'], 
      default: 'Backlog' 
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
    storyPoints: { type: Number, min: 0 },
    labels: [{ type: String, trim: true }],
    dueDate: { type: Date },
    
    // Sub-document schema to cleanly map requirements for AI generation features
    aiGeneratedDetails: {
      acceptanceCriteria: [{ type: String }],
      subtasksChecklist: [{
        text: { type: String },
        isDone: { type: Boolean, default: false }
      }]
    }
}, { timestamps: true });
taskSchema.index({ title: 1, boardId: 1 }, { unique: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;