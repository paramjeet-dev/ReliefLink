import Expenses from '../models/Expenses.js'

export const createExpense = async(req,res) =>{
    const {amount,type,method,receipient} = req.body
    await Expenses.insertOne({amount:amount,type:type,method:method,receipient:receipient})
    await res.json({message:"expense created."})
}

export const getExpenses = async(req,res)=>{
    const data = await Expenses.find()
    res.json({data:data})
}