import connectDb from '@api/db/connection';
import { isAuthenticated } from '@api/helpers';
import { CommentResponse } from '@api/types';
import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import Comment from '@api/models/comment';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CommentResponse>,
) {
	switch (req.method) {
		case 'POST':
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				if (!req.body.comment || req.body.comment.trim().length < 2)
					throw new Error('Comment should be atleast 2 characters long');

				if (req.body.comment.trim().length > 250)
					throw new Error('Comment cannot contain more than 250 characters');

				if (!req.query.feedbackId || !isValidObjectId(req.query.feedbackId))
					throw new Error('Invalid feedback id');

				await connectDb();

				const { comment, parentId } = req.body;

				const newComment = await Comment.create({
					comment,
					parentId: parentId ?? null,
					feedbackId: req.query.feedbackId,
					userId,
				});

				res.status(201).json({
					ok: true,
					message: 'Comment added successfully',
					comment: newComment,
				});
			} catch (error: any) {
				res.status(400).json({ ok: false, message: error.message });
			}
			break;

		case 'PATCH':
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				if (!req.query.feedbackId || !isValidObjectId(req.query.feedbackId))
					throw new Error('Invalid feedback id');

				if (!req.query.commentId || !isValidObjectId(req.query.commentId))
					throw new Error('Invalid comment id');

				if (!req.body.comment || req.body.comment.trim().length < 2)
					throw new Error('Comment should be atleast 2 characters long');

				if (req.body.comment.trim().length > 250)
					throw new Error('Comment cannot contain more than 250 characters');

				await connectDb();

				const { comment } = req.body;

				const oldComment = await Comment.findOne({
					_id: req.query.commentId,
					feedbackId: req.query.feedbackId,
					userId,
				});

				if (!oldComment) throw new Error('You can only edit your comments');

				oldComment.comment = comment;

				await oldComment.save();

				res.status(201).json({
					ok: true,
					message: 'Comment updated successfully',
				});
			} catch (error: any) {
				res.status(400).json({ ok: false, message: error.message });
			}
			break;

		case 'DELETE': {
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				if (!req.query.feedbackId || !isValidObjectId(req.query.feedbackId))
					throw new Error('Invalid feedback id');

				if (!req.query.commentId || !isValidObjectId(req.query.commentId))
					throw new Error('Invalid comment id');

				await connectDb();

				const result = await Comment.deleteOne({
					_id: req.query.commentId,
					feedbackId: req.query.feedbackId,
					userId,
				});

				if (!(result.deletedCount > 0))
					throw new Error('Cannot delete comment');

				res.status(201).json({
					ok: true,
					message: 'Comment deleted successfully',
				});
			} catch (error: any) {
				res.status(400).json({ ok: false, message: error.message });
			}
			break;
		}

		default:
			res.status(503).json({ ok: false, message: 'method not allowed' });
			break;
	}
}
