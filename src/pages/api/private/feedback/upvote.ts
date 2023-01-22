import type { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@api/db/connection';
import { isAuthenticated } from '@api/helpers';
import { APIResponse } from '@api/types';
import Feedback from '@api/models/feedback';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<APIResponse>,
) {
	switch (req.method) {
		case 'PATCH': {
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				const { id: feedbackId } = req?.query;

				if (!feedbackId) throw new Error('Feedback Id should not be empty');

				await connectDb();

				const feedback = await Feedback.findOne({ _id: feedbackId });

				if (!feedback) throw new Error('Feedback not found');

				/* if user has upvoted it will decrement upvotes and pull out the user from list,
                   else increment upvotes and push user to list
                */

				if (
					feedback.upvotedUsers.includes(userId) &&
					feedback.upvotesCount > 0
				) {
					feedback.upvotesCount -= 1;
					feedback.upvotedUsers.pull(userId);
				} else {
					feedback.upvotesCount += 1;
					feedback.upvotedUsers.push(userId);
				}
				await feedback.save();

				res.status(200).json({
					ok: true,
					message: 'Upvoted/Downvoted successfully',
				});
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}
		default:
			res.status(405).json({ ok: false, message: 'Method not allowed' });
	}
}
