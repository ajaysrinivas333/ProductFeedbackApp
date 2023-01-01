import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@api/db/connection';
import { findProductsWithUserDetails, isAuthenticated } from '@api/helpers';
import { ProductResponse } from '@api/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ProductResponse>,
) {
	switch (req.method) {
		case 'GET': {
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				await connectDb();

				const products = await findProductsWithUserDetails({
					userId: new mongoose.Types.ObjectId(userId),
				});

				res.status(200).json({ ok: true, products });
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}

		default:
			res.status(404).json({ ok: false, message: 'Method not allowed' });
	}
}
