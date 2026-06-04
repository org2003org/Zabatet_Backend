import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' }
}, { timestamps: true });

userSchema.pre('save', async function () {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
}
const User = mongoose.model('User', userSchema);

export default User;