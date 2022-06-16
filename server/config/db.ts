import mongoose from 'mongoose';
import endpointsConfig from '../endpoints.config';

const connectDB = async () => {
  try {
    mongoose.set('runValidators', true); // here is your global setting
    await mongoose.connect(endpointsConfig.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection successful');
  } catch (error) {
    console.log(error)
    console.log('MongoDB connection has failed');
  }
};

module.exports = connectDB;
