import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
    volunteer: { type:String },
    needType: { type: String, required: true,},
    description: { type: String},
    disasterType: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true},
}, { timestamps: true });

export default mongoose.model('helpRequest', requestSchema);