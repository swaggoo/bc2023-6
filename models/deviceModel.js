const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  description: { type: String },
  serialNumber: { type: String },
  manufacturer: { type: String },
  image: { type: String  },
  takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Device', deviceSchema);