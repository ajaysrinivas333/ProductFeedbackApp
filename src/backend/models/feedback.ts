import mongoose, { models, Schema, model } from 'mongoose';
import { FEEDBACK_STATUS, FEEDBACK_CATEGORIES } from '@api/constants';

const feedbackSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			enum: FEEDBACK_CATEGORIES,
		},
		upvotesCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		upvotedUsers: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'User',
		},
		commentsCount: {
			type: Number,
			default: 0,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		position: {
			type: Number,
			default: null,
		},
		status: {
			type: String,
			enum: FEEDBACK_STATUS,
			default: FEEDBACK_STATUS.REQUESTED,
		},
	},
	{
		timestamps: true,
	},
);

const Feedback =
	models?.Feedback ?? model('Feedback', feedbackSchema, 'feedbacks');

export default Feedback;
