import connectDb from '@api/db/connection';
import { CommentResponse } from '@api/types';
import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import Comment from '@api/models/comment';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CommentResponse>,
) {
	switch (req.method) {
		case 'GET':
			try {
				if (!req.query.feedbackId || !isValidObjectId(req.query.feedbackId))
					throw new Error('Invalid feedback id');

				const { feedbackId } = req.query;

				await connectDb();

				let response = {};

				if (!req.query.commentId) {
					response['comments'] = await Comment.find({ feedbackId });
				}

				if (req.query.commentId) {
					if (!isValidObjectId(req.query.commentId))
						throw new Error('Invalid comment id');

					response['comment'] = await Comment.findOne({
						feedbackId,
						_id: req.query.commentId,
					});
				}
				res.status(200).json({ ok: true, ...response });
			} catch (error: any) {
				res.status(400).json({ ok: false, message: error.message });
			}
			break;

		default:
			res.status(503).json({ ok: false, message: 'method not allowed' });
			break;
	}
}
