import type { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@api/db/connection';
import { isAuthenticated } from '@api/helpers';
import { APIResponse } from '@api/types';
import Feedback from '@api/models/feedback';
import mongoose from 'mongoose';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<APIResponse>,
) {
	switch (req.method) {
		case 'PATCH': {
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				const productId = req?.query?.productId;
				const feedbackId = req?.query?.feedbackId;

				await connectDb();

				// To check if the user has already upvoted the feedback
				const upvotedDoc = await Feedback.findOne({
					_id: feedbackId,
					productId,
					upvotedUsers: { $in: [new mongoose.Types.ObjectId(userId)] },
				});

				/* if user has upvoted it will decrement upvotes and pull out the user from list,
                   else increment upvotes and push user to list
                */

				const updateQuery = upvotedDoc
					? {
							$pull: {
								upvotedUsers: new mongoose.Types.ObjectId(userId),
							},
					  }
					: {
							$push: {
								upvotedUsers: new mongoose.Types.ObjectId(userId),
							},
					  };

				const updated = await Feedback.updateOne(
					{ _id: feedbackId, productId },
					{
						$inc: {
							upvotesCount: upvotedDoc
								? upvotedDoc?.upvotesCount > 0
									? -1
									: 0
								: 1,
						},
						...updateQuery,
					},
				);

				updated.modifiedCount === 0
					? res.status(404).json({
							ok: false,
							message: 'No documents found',
					  })
					: res.status(200).json({
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
