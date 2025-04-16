import mongoose from 'mongoose';

const disasterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    upi: { type:String, required: true },
    affected: { type: Number },
    donationAim: { type: Number },
    donated: { type: Number },
}, { timestamps: true });

export default mongoose.model('disasters', disasterSchema);