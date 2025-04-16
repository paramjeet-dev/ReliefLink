import Help from '../models/Help.js'

export const createRequest = async (req, res) => {
  const { user, needType, description, disasterType,area } = req.body;
  console.log(req.body)
  const request = await Help.insertOne({ user: user, needType: needType, description: description, disasterType: disasterType, area:area.city });
  await res.json({
    message: "Help Request created."
  });
};

export const acceptRequest = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  const request = await Help.findOne({ _id: id })
  const updateResult = await Help.updateOne(
    { _id: id },
    { $set: { volunteer: user, status: 'progress' } }
  );;

  await res.json({
    message: "Help Request accepted."
  });
};

export const pendingRequests = async(req,res) => {
  const data = await Help.find({ status: 'pending' })
  await res.json({data:data})
};

export const gettAllRequests = async (req,res) => {
  try {
    // Fetch all requests with 'pending' status
    const requests = await Help.find({ status: 'pending' });
    await res.json({data:requests});
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    await res.status(500).json({ error: 'Error fetching pending requests.' });
  }
}

export const getAllRequest = async (req,res) => {
  const data = await Help.find()
  await res.json({data:data})
};

export const getProgressRequest = async(req,res) =>{
  const data = await Help.find({status:"progress"})
  await res.json({data:data})
}

export const complete = async(req,res) =>{
  const { id } = req.params
  const updateResult = await Help.updateOne(
    { _id: id },
    { $set: { status: 'completed' } }
  )
  await res.json({message:"request completed."})
}