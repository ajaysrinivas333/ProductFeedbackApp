import { FEEDBACK_STATUS } from '@api/constants';
import connectDb from '@api/db/connection';
import Feedback from '@api/models/feedback';
import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	switch (req.method) {
		case 'GET': {
			try {
				if (!req.query?.productId || !isValidObjectId(req.query?.productId))
					throw new Error('Invalid product id');

				const { productId } = req.query;

				await connectDb();

				const feedbacks = await Feedback.find({
					productId,
					status: {
						$in: [
							FEEDBACK_STATUS.INPROGRESS,
							FEEDBACK_STATUS.PLANNED,
							FEEDBACK_STATUS.LIVE,
						],
					},
				});

				res.status(200).json({ ok: true, feedbacks });
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}

		default:
			res.status(401).json({ ok: false, message: 'Method not allowed' });
	}
}
