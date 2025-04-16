import disasters from '../models/Disaster.js'

export const getUpi = async (req, res) => {
    const { id } = req.params
    const disaster = await disasters.findOne({_id:id})
    res.json({
        message:disaster.upi
    })
  };