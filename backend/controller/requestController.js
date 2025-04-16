import Help from '../models/Help.js'

export const createRequest = async (req, res) => {
    const { user, needType, description, disasterType } = req.body;

    const request = await Help.insertOne({ user:user, needTyoe:needType, decsription:description, disasterType:disasterType });
  
    res.json({
      message:"Help Request created."
    });
  };

  export const acceptRequest = async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;

    const request = await Help.findOne({_id:id})
    const updateResult = await Help.updateOne(
      { _id: id },
      { $set: { volunteer: user, status: 'progress' } }
    );;
  
    res.json({
      message:"Help Request accepted."
    });
  };

export const pendingRequests = async () => {
  const data = await Help.find({status:'pending'})
  res.json({
    data:data
  })
  };
