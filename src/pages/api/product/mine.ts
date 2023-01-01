import type { NextApiRequest, NextApiResponse } from 'next';
import { PRODUCT_CATEGORIES } from '../../../backend/constants';
import connectDb from '../../../backend/db/connection';
import { isAuthenticated, isEmpty } from '../../../backend/helpers';
import Product from '../../../backend/models/product';

type Product = {
	name: string;
	description: string;
	link?: string;
	userId: string;
	category: keyof typeof PRODUCT_CATEGORIES;
};

type ProductResponse = {
	ok: boolean;
	message?: string;
	products?: Product[];
};

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
				
				const products = await Product.find({ userId });

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
