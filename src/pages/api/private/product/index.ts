import type { NextApiRequest, NextApiResponse } from 'next';
import { PRODUCT_CATEGORIES } from '../../../../backend/constants';
import connectDb from '../../../../backend/db/connection';
import { isAuthenticated, isEmpty } from '../../../../backend/helpers';
import { ProductResponse } from '../../../../backend/types';
import Product from './../../../../backend/models/product';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ProductResponse>,
) {
	switch (req.method) {
		case 'POST': {
			try {
				if (isEmpty(req?.body?.name))
					throw new Error(`Product name cannot be empty`);

				if (isEmpty(req?.body?.description))
					throw new Error(`Product description cannot be empty`);

				if (
					!req.body?.category ||
					!Object.values(PRODUCT_CATEGORIES).includes(req.body?.category)
				)
					throw new Error(`Invalid category`);

				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				await connectDb();

				const { name, description, category } = req.body;

				const product = await Product.create({
					name,
					description,
					link: req.body?.link ?? null,
					userId,
					category,
				});

				res
					.status(201)
					.json({ ok: true, message: 'Product added successfully', product });
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}
		default:
			res.status(401).json({ ok: false, message: 'Method not allowed' });
	}
}
