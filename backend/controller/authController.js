import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password, phone, role, } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.json({ error: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password,10)
  const user = await User.insertOne({ name:name, email:email, password:hashedPassword, phone:phone, role:role, pincode:pin });

  res.json({
    _id: user._id,
    name: user.name,
    message:"User Registered"
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password,user.password))) {
    return res.json({ error: 'Invalid email or password' });
  }

  generateToken(res, user._id);

  res.json({
    _id: user._id,
    name: user.name,
    message:"Logged in"
  });
};

export const logoutUser = (req, res) => {
  res.clearCookie('token')

  res.json({ message: 'Logged out successfully' });
};
