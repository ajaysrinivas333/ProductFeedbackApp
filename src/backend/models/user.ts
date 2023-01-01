import { models, Schema, model } from 'mongoose';

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const User = models?.User ?? model('User', userSchema, 'users');

export default User;
