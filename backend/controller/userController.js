import User from '../models/User.js'
import donation from '../models/Donation.js'
import Help from '../models/Help.js';

export const getAllUsers = async () => {
    const data = await User.find()
    res.jaon({data:data})
  };

export const getDonations = async() =>{
    const { id } = req.params
    const data = await donation.find({user:id})
    res.json({
        data:data
    })
}

export const getUserRequests = async() =>{
    const { id } = req.params
    const data = await Help.find({user:id, status:'pending'})
    res.json({
        data:data
    })
}