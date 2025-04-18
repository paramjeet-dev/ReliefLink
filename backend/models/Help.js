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
    status: { type: String, required: true ,default:'pending'},
    priority: { type: String},
    area:{type:String},
    affected:{type:Number}
}, { timestamps: true });

export default mongoose.model('helpRequest', requestSchema);