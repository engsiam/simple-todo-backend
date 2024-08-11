const jwt = require('jsonwebtoken');
const User = require('../models/registerModel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const username = req.header('Username');
  
  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header is required' });
  }

  if (!username) {
    return res.status(400).send({ error: 'Username header is required' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log("Token:", token); // Debug log

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Decoded Token:', decoded); // Debug log

    const user = await User.findOne({ _id: decoded._id });
    console.log('Found User:', user); // Debug log

    if (!user || user.username !== username) {
      return res.status(403).send({ error: 'Unauthorized access' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication Error:', err); // Debug log
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = authMiddleware;
