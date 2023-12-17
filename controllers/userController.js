const Device = require('../models/deviceModel');
const User = require('../models/userModel');
const crypto = require('crypto');

const userController = {
    async takeDevice(req, res) {
        try {
          const { id } = req.params;
          const userId = req.headers['user-id'];
      
          if (!userId) {
            return res.status(400).json({ message: 'User ID is missing in headers' });
          }
      
          const device = await Device.findById(id);
      
          if (!device) {
            return res.status(404).json({ message: 'Device not found' });
          }
          
          if (device.takenBy) {
            return res.status(400).json({ message: 'Device is already taken' });
          }
      
          device.takenBy = userId;
          await device.save();
      
          res.status(200).json({ message: 'Device taken successfully' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
      async registerUser(req, res) {
        try {
          const { name, email, password } = req.body;
      
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
          }
      
          const salt = await crypto.randomBytes(32);
          const iterations = 10000;
          const keyLength = 32;
      
          crypto.pbkdf2(password, salt, iterations, keyLength, 'sha256', async (err, derivedKey) => {
            if (err) {
              return res.status(500).json({ message: 'Error generating password hash.' });
            }
      
            const newUser = new User({
              name,
              email,
              password: derivedKey.toString('hex'), // Store the derived key as a hexadecimal string
            });
      
            const savedUser = await newUser.save();
      
            const userResponse = {
              id: savedUser._id,
              name: savedUser.name,
              email: savedUser.email,
            };
      
            res.status(201).json({ message: 'User registered successfully', user: userResponse });
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
      async getDevicesInUse(req, res) {
        try {
          const userId = req.params.userId;
      
          const devicesInUse = await Device.find({ takenBy: userId });
      
          res.status(200).json({
            message: 'Successful request',
            devices: devicesInUse 
          });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Server error' });
        }
      }
}

module.exports = userController;