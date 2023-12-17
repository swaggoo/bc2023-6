const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const devicesRouter = require('./routes/devicesRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./config/db');

const app = express();

connectDb();
const port = process.env.NODE_LOCAL_PORT || 3020;

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Device Inventory API',
        description: 'API для інвентаризації пристроїв',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js'],
  };

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('', devicesRouter);
app.use('', userRoutes);


app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});