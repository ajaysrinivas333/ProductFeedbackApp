import { model, Schema, models, Types } from 'mongoose';

const commentSchema = new Schema({
	comment: {
		type: String,
		required: true,
		min: 2,
		max: 250,
		trim: true,
	},
	parentId: {
		ref: 'Comment',
		type: Types.ObjectId,
		default: null,
	},
	userId: {
		ref: 'User',
		required: true,
		type: Types.ObjectId,
	},
	feedbackId: {
		ref: 'Feedback',
		type: Types.ObjectId,
		required: true,
	},
});

const Comment = models.Comment ?? model('Comment', commentSchema);

export default Comment;
