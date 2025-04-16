import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true
    },
    type:{type:String},
    method:{type:String},
    receipient:{type:String}
}, { timestamps: true });

export default mongoose.model('expenses', expenseSchema);