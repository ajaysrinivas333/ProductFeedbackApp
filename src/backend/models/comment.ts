import { model, Schema, models, Types } from 'mongoose';
import Feedback from './feedback';

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

commentSchema.post('save', async function (doc: any, next: any) {
	if (doc.parentId == null) {
		const result = await Feedback.findByIdAndUpdate(
			doc.feedbackId,
			{
				$inc: {
					commentsCount: 1,
				},
			},
			{ new: true },
		);
	}
	next();
});

const Comment = models.Comment ?? model('Comment', commentSchema);

export default Comment;
