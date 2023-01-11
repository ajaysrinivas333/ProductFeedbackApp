import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import Product from '@api/models/product';

export const isAuthenticated = async (
	req: NextApiRequest,
): Promise<string | null> => {
	const token = await getToken({ req });
	return token ? token.id! : null;
};

export const isEmpty = (s: string) => !s?.length || s?.trim()?.length <= 0;

export const hasKey = <T extends Record<string, any>>(object: T, key: string) =>
	object.hasOwnProperty(key);

export const findProductsWithUserDetails = async (
	findOptions: Record<string, any> = {},
) => {
	const products = await Product.aggregate([
		{
			$match: findOptions,
		},
		{
			$lookup: {
				from: 'users',
				as: 'user',
				localField: 'userId',
				foreignField: '_id',
			},
		},
		{
			$project: {
				'user.password': 0,
				__v: 0,
				'user._id': 0,
				'user.createdAt': 0,
				'user.updatedAt': 0,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);

	return products;
};
