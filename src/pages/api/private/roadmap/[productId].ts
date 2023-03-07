import mongoose, { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@api/db/connection';
import { isAuthenticated } from '@api/helpers';
import Product from '@api/models/product';
import Feedback from '@api/models/feedback';

enum OperationTypes {
	SINGLE_LIST_MOVE = 'single_list_move',
	MULTI_LIST_MOVE = 'multi_list_move',
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	switch (req.method) {
		case 'PATCH': {
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				if (!req.query.productId || !isValidObjectId(req.query.productId))
					throw new Error('Invalid product id');

				const { productId } = req.query;

				const canModify = await Product.exists({ _id: productId, userId });

				if (!canModify)
					throw new Error(
						"You don't have sufficient permissions to do this operation",
					);

				if (!req.body.affectedDocs)
					throw new Error('No documents are provided to update');

				if (!req.query.operationType) throw new Error('Invalid operation type');

				const { operationType } = req.query;
				const { affectedDocs } = req.body;

				await connectDb();

				if (
					operationType == OperationTypes.SINGLE_LIST_MOVE ||
					operationType == OperationTypes.MULTI_LIST_MOVE
				) {
					const [updateResult] = await Promise.all(
						affectedDocs.map((doc: any) =>
							Feedback.findByIdAndUpdate(doc._id, doc),
						),
					);
				}

				res
					.status(200)
					.json({ ok: true, message: 'Updated successfully', operationType });
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}

		default:
			res.status(404).json({ ok: false, message: 'Method not allowed' });
	}
}
