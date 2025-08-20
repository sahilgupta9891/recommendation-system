const express = require('express');
const dotenv = require('dotenv');
const router = require('./modules/index');
const { connectDB } = require('./config/database');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', router); 

connectDB();

module.exports = app;
