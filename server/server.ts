require('dotenv').config({path: __dirname + '/.env'});
import express from 'express';
import endpointsConfig from './endpoints.config';

var cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const circleRoutes = require('./routes/circleRoutes');
const userRoutes = require('./routes/userRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();

const connectDB = require('./config/db');
const morgan = require('morgan');
const morganChalk = require('./utils/morganChalk');
const chalk = require('chalk');
// var admin = require('firebase-admin');
// var serviceAccount = require('./ajo-f1b9b-firebase-adminsdk-dgjl0-58d38b8923.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://ajo-f1b9b.firebaseio.com',
// });


connectDB();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(
  morgan(function (tokens: any, req: any, res: any) {
    return [
      chalk.green.bold(tokens.method(req, res)),
      chalk.red.bold(tokens.status(req, res)),
      chalk.white(tokens.url(req, res)),
      chalk.yellow(tokens['response-time'](req, res) + ' ms'),
    ].join(' ');
  }),
);

app.get('/', (req, res)=>{
  res.send("Yup, stuff work!")
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/wallets', walletRoutes);

const PORT = endpointsConfig.port || 6000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
