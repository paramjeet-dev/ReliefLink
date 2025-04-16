import disasters from '../models/Disaster.js'

export const getUpi = async (req, res) => {
    const { id } = req.params
    const disaster = await disasters.findOne({upi:id})
    await res.json({
        message:disaster.upi
    })
  };

export const create = async(req,res)=>{
    const {name,description,affected,upi,donationAim} = req.body
    await disasters.insertOne({name:name,description:description,affected:affected,upi:upi,donationAim:donationAim})
    await res.json({message:"Disaster created."})
}

export const getAllDisasters = async(req,res)=>{
    const data = await disasters.find()
    await res.json({data:data});
}