import User from '../models/User.js'
import donation from '../models/Donation.js'
import Help from '../models/Help.js';

export const getAllUsers = async(req,res) => {
    const data = await User.find()
    await res.json({data:data})
  };

export const getDonations = async(req,res) =>{
    const { id } = req.params
    const data = await donation.find({user:id})
    await res.json({
        data:data
    })
}

export const getAllDonations = async (req,res) => {
    const data = await donation.find()
    await res.json({data:data})
  };

export const getUserRequests = async(req,res) =>{
    const { id } = req.params
    const data = await Help.find({user:id, status:'pending'})
    await res.json({
        data:data
    })
}