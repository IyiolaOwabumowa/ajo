require('dotenv').config({path: __dirname + '/../.env'});
import express from 'express';
import endpointsConfig from '../endpoints.config';
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const app = express();
const connectDB = require('./config/db');

connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/auth', authRoutes);

const PORT = endpointsConfig.port || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
