import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import Product from '@api/models/product';
import Feedback from './models/feedback';
import Comment from './models/comment';

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
				from: 'feedbacks',
				as: 'feedbacks',
				localField: '_id',
				foreignField: 'productId',
			},
		},
		{
			$addFields: {
				feedbacksCount: { $size: '$feedbacks' },
			},
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
			$unwind: {
				path: '$user',
			},
		},
		{
			$project: {
				'user.password': 0,
				__v: 0,
				'user._id': 0,
				'user.createdAt': 0,
				'user.updatedAt': 0,
				feedbacks: 0,
			},
		},
		{
			$sort: {
				feedbacksCount: -1,
				updatedAt: -1,
			},
		},
	]);
	return products;
};

export const findFeedbacksWithUserDetails = async (
	findOptions: Record<string, any> = {},
) => {
	const feedbacks = await Feedback.aggregate([
		{
			$match: findOptions,
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'user',
			},
		},
		{
			$project: {
				position: 0,
				status: 0,
				'user.password': 0,
				__v: 0,
				'user.createdAt': 0,
				'user.updatedAt': 0,
			},
		},
		{
			$unwind: {
				path: '$user',
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);

	return feedbacks;
};

export const findCommentsWithUser = async (
	findOptions: Record<string, any> = {},
) => {
	const comments = await Comment.aggregate([
		{
			$match: findOptions,
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'user',
			},
		},
		{
			$project: {
				'user.password': 0,
				'user.createdAt': 0,
				'user.updatedAt': 0,
			},
		},
		{
			$unwind: {
				path: '$user',
			},
		},
	]);

	return comments;
};
