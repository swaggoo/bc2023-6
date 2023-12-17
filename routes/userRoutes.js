const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     description: Реєстрація нового користувача в системі
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Ім'я користувача
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email користувача
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Пароль користувача
 *     responses:
 *       '201':
 *         description: Успішно зареєстровано
 *       '400':
 *         description: Некоректні дані запиту
 *       '500':
 *         description: Помилка сервера
 */
router.post('/register', UserController.registerUser);

/**
 * @swagger
 * /devices/{id}/take:
 *   post:
 *     summary: Взяття пристрою у користування
 *     description: Взяття пристрою певним користувачем на користування
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пристрою
 *         schema:
 *           type: string
 *       - in: header
 *         name: user-id
 *         required: true
 *         description: ID користувача
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успішно взято пристрій
 *       '404':
 *         description: Прошук не вдалося знайти пристрій
 *       '500':
 *         description: Помилка сервера
 */
router.post('/devices/:id/take', UserController.takeDevice);

/**
 * @swagger
 * /users/{userId}/devices:
 *   get:
 *     summary: Отримати список пристроїв, що використовуються користувачем
 *     description: Отримати список пристроїв, які використовуються певним користувачем
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID користувача
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успішний запит, повертає список пристроїв
 *       '404':
 *         description: Прошук не вдалося знайти користувача або пристроїв
 *       '500':
 *         description: Помилка сервера
 */
router.get('/users/:userId/devices', UserController.getDevicesInUse);

module.exports = router;
