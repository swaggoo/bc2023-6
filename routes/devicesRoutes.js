const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');
const multer = require('multer');
const path = require('path');

const uploadDir = './uploads';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  });
  
  
const upload = multer({ storage: storage });

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Отримати список пристроїв
 *     description: Отримати всі пристрої з бази даних
 *     responses:
 *       '200':
 *         description: Успішний запит, повертає список пристроїв
 *       '500':
 *         description: Помилка сервера
 */
router.get('/devices', DeviceController.getAllDevices);

/**
 * @swagger
 * /devices/{id}:
 *   get:
 *     summary: Отримати інформацію про окремий пристрій
 *     description: Отримати інформацію про конкретний пристрій за його ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пристрою
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успішний запит, повертає інформацію про пристрій
 *       '404':
 *         description: Прошук не вдалося знайти пристрій
 */
router.get('/devices/:id', DeviceController.getDeviceById);

/**
 * @swagger
 * components:
 *   examples:
 *     DeviceExample:
 *       summary: Example device data
 *       value:
 *         deviceName: Example Device
 *         description: This is an example device.
 *         serialNumber: ABC123XYZ
 *         manufacturer: Example Manufacturer
 *
 * /devices:
 *   post:
 *     summary: Реєстрація нового пристрою
 *     description: Створює новий пристрій
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceName:
 *                 type: string
 *                 description: Ім'я пристрою
 *               description:
 *                 type: string
 *                 description: Опис пристрою
 *               serialNumber:
 *                 type: string
 *                 description: Серійний номер пристрою
 *               manufacturer:
 *                 type: string
 *                 description: Виробник пристрою
 *
 *             example: 
 *               deviceName: Example Device
 *               description: This is an example device.
 *               serialNumber: ABC123XYZ
 *               manufacturer: Example Manufacturer
 *     responses:
 *       '201':
 *         description: Успішно створено
 *       '400':
 *         description: Некоректні дані запиту
 *       '500':
 *         description: Помилка сервера
 */
router.post('/devices', DeviceController.createDevice);

/**
 * @swagger
 * /devices/{id}:
 *   put:
 *     summary: Редагування інформації про окремий пристрій
 *     description: Оновлення інформації про конкретний пристрій за його ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пристрою
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceName:
 *                 type: string
 *                 description: Ім'я пристрою
 *               description:
 *                 type: string
 *                 description: Опис пристрою
 *               serialNumber:
 *                 type: string
 *                 description: Серійний номер пристрою
 *               manufacturer:
 *                 type: string
 *                 description: Виробник пристрою
 *           example: 
 *             deviceName: Updated Device
 *             description: This is an updated device.
 *             serialNumber: XYZ456ABC
 *             manufacturer: Updated Manufacturer
 *     responses:
 *       '200':
 *         description: Успішний запит, повертає оновлену інформацію про пристрій
 *       '404':
 *         description: Прошук не вдалося знайти пристрій
 *       '500':
 *         description: Помилка сервера
 */
router.put('/devices/:id', DeviceController.updateDevice);

/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     summary: Видалення пристрою
 *     description: Видаляє пристрій за його ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пристрою
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успішно видалено
 *       '404':
 *         description: Прошук не вдалося знайти пристрій
 *       '500':
 *         description: Помилка сервера
 */
router.delete('/devices/:id', DeviceController.deleteDevice);

/**
 * @swagger
 * /devices/{id}/image:
 *   post:
 *     summary: Завантаження зображення пристрою
 *     description: Завантажує зображення для пристрою за його ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пристрою
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: file
 *                 format: binary
 *                 description: Файл зображення пристрою
 *     responses:
 *       '200':
 *         description: Успішно завантажено
 *       '400':
 *         description: Некоректні дані запиту
 *       '500':
 *         description: Помилка сервера
 */
router.post('/devices/:id/image', upload.single('image'), DeviceController.uploadDeviceImage);

/**
 * @swagger
 * /devices/{id}/image:
 *   get:
 *     summary: Перегляд зображення пристрою
 *     description: Отримує зображення для пристрою за його ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пристрою
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успішний запит, повертає зображення пристрою
 *       '404':
 *         description: Прошук не вдалося знайти пристрій або зображення
 *       '500':
 *         description: Помилка сервера
 */
router.get('/devices/:id/image', DeviceController.getDeviceImage);
// Додайте інші маршрути для пристроїв, такі як PUT, DELETE та інші, використовуючи відповідні методи контролера

module.exports = router;
