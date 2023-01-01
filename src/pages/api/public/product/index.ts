import type { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../../backend/db/connection';
import { findProductsWithUserDetails } from '../../../../backend/helpers';
import Product from '../../../../backend/models/product';
import { ProductResponse } from '../../../../backend/types';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ProductResponse>,
) {
	switch (req.method) {
		case 'GET': {
			try {
				await connectDb();

				const products = await findProductsWithUserDetails();

				res.status(200).json({ ok: true, products });
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}

		default:
			res.status(401).json({ ok: false, message: 'Method not allowed' });
	}
}
