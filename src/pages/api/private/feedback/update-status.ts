import { isAuthenticated } from '@api/helpers';
import Feedback from '@api/models/feedback';
import Product from '@api/models/product';
import { NextApiRequest, NextApiResponse } from 'next';
import { FEEDBACK_STATUS } from '@api/constants';
import { APIResponse } from '@api/types';

// /private/feedback/update-status?productId=abc&feedbackId=xyz -> patch

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<APIResponse>,
) {
	switch (req.method) {
		case 'PATCH':
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error('Authentication Failed');

				const { productId, feedbackId } = req.query;

				if (!productId || !feedbackId)
					throw new Error('Product Id and Feedback Id are required');

				const { status } = req.body;

				if (!status || !Object.values(FEEDBACK_STATUS).includes(status))
					throw new Error('Invalid status');

				const isProductOwner = await Product.exists({
					_id: productId,
					userId,
				});

				if (!isProductOwner) throw new Error('Access restricted');

				const position: number | null =
					status !== FEEDBACK_STATUS.REQUESTED
						? (await Feedback.find({ status }).count()) + 1
						: null;

				const updatedFeedback = await Feedback.findOneAndUpdate(
					{ _id: feedbackId, productId },
					{ $set: { status, position } },
					{ new: true },
				);

				if (
					updatedFeedback?.status !== status ||
					updatedFeedback?._id?.toString() !== feedbackId
				)
					throw new Error('Cannot update feedback status');

				res.status(200).json({
					ok: true,
					message: 'Feedback status updated successfully',
				});
			} catch (error: any) {
				res.status(400).json({
					ok: false,
					message: error.message,
				});
			}
			break;
		default:
			res.status(405).json({ ok: false, message: 'Method not allowed' });
	}
}
