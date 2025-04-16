import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
    amount:{
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('donation', donationSchema);