import mongoose from 'mongoose';

const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  mongoose.connect('mongodb://localhost:27017/product-feedback-app', (err) => {
    if (err) console.log('Error has occured :', err.message);
  });
  mongoose.connection.on('connected', () => {
    console.log('connected to database');
  });
};

export default connectDb;
