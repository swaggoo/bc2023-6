const Device = require('../models/deviceModel');
const fs = require('fs');
const path = require('path');

const DeviceController = {
  // Отримати всі пристрої
  async getAllDevices(req, res) {
    try {
      const devices = await Device.find();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Отримати один пристрій за ID
  async getDeviceById(req, res) {
    try {
      const deviceId = req.params.id;
      const device = await Device.findById(deviceId);
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Створити новий пристрій
  async createDevice(req, res) {
    try {
      const { deviceName, description, serialNumber, manufacturer, image, user } = req.body;
      const newDevice = new Device({
        deviceName,
        description,
        serialNumber,
        manufacturer,
        image
      });
      const savedDevice = await newDevice.save();
      res.status(201).json(savedDevice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Оновити існуючий пристрій за ID
  async updateDevice(req, res) {
    try {
      const deviceId = req.params.id;
      const { deviceName, description, serialNumber, manufacturer, image } = req.body;
      const updatedDevice = await Device.findByIdAndUpdate(deviceId, {
        deviceName,
        description,
        serialNumber,
        manufacturer,
        image
      }, { new: true });
      if (!updatedDevice) {
        return res.status(404).json({ message: 'Device not found' });
      }
      res.json(updatedDevice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Видалити пристрій за ID
  async deleteDevice(req, res) {
    try {
      const deviceId = req.params.id;
      const deletedDevice = await Device.findByIdAndDelete(deviceId);
      if (!deletedDevice) {
        return res.status(404).json({ message: 'Device not found' });
      }
      res.json({ message: 'Device deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async uploadDeviceImage(req, res) {
    try {
      const { id } = req.params;
      const device = await Device.findById(id);
  
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
  
      console.log(req.file.filename);
      device.image = path.join('./uploads', req.file.filename)
  
      await device.save();
      res.status(200).json({ message: 'Device image uploaded successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getDeviceImage(req, res) {
    try {
      const { id } = req.params;
      const device = await Device.findById(id);

      if (!device || !device.image) {
        return res.status(404).json({ message: 'Device image not found' });
      }

      // Reading the image file and sending it as a response
      const imagePath = device.image;
      const image = fs.readFileSync(imagePath);
      res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on your image type
      res.send(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = DeviceController;