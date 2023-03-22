import mongoose from 'mongoose';

const connectDb = async (): Promise<void> => {
	mongoose.set('strictQuery', true);
	const mongoUri =
		process.env.MONGO_URI || 'mongodb://localhost:27017/product-feedback-app';
	mongoose.connect(mongoUri, (err) => {
		if (err) console.log('Error has occured :', err.message);
	});
	mongoose.connection.on('connected', () => {
		console.log('connected to database');
	});
};

export default connectDb;
