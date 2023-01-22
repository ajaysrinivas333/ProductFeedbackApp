// /private/feedback?id=123 ->edit and delete and get
// /private/feedback?productId=12131 -> post

import type { NextApiRequest, NextApiResponse } from 'next';
import { FEEDBACK_CATEGORIES } from '@api/constants';
import connectDb from '@api/db/connection';
import { isAuthenticated, isEmpty } from '@api/helpers';
import { FeedbackResponse } from '@api/types';
import Feedback from '@api/models/feedback';
import Product from '@api/models/product';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<FeedbackResponse>,
) {
	switch (req.method) {
		case 'POST': {
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error(`Authentication failed`);

				if (
					!req?.body?.title ||
					isEmpty(req?.body.title) ||
					req?.body?.title.length < 3
				)
					throw new Error('Feedback title should be atleast 3 characters long');

				if (!req?.body?.description || isEmpty(req?.body?.description))
					throw new Error('Feedback description should not be empty');

				if (
					!req?.body?.category ||
					!Object.values(FEEDBACK_CATEGORIES).includes(req?.body?.category)
				)
					throw new Error(`Invalid category`);

				await connectDb();

				const { title, description, category } = req?.body;
				const productId = req?.query?.productId;

				if (!(await Product.exists({ _id: productId })))
					throw new Error("Product doesn't exist");

				const newFeedback = await Feedback.create({
					title,
					description,
					category,
					userId,
					productId,
				});

				res.status(201).json({
					ok: true,
					message: 'Feedback added successfully',
					feedback: newFeedback,
				});
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}

		case 'PATCH': {
			try {
				const userId = await isAuthenticated(req);

				if (!userId) throw new Error('Authentication Failed');

				const { id: feedbackId } = req?.query;

				if (!feedbackId) throw new Error('feedback id cannot be empty');

				if (
					req?.body?.title &&
					(isEmpty(req?.body.title) || req?.body?.title.length < 3)
				)
					throw new Error('Feedback title should be atleast 3 characters long');

				if (req?.body?.description && isEmpty(req?.body?.description))
					throw new Error('Feedback description should not be empty');

				if (
					req?.body?.category &&
					!Object.values(FEEDBACK_CATEGORIES).includes(req?.body?.category)
				)
					throw new Error(`Invalid category`);

				await connectDb();

				const feedback = await Feedback.findOne({
					_id: feedbackId,
					userId,
				});

				if (!feedback) throw new Error('No Feedback found');

				Object.keys(req?.body).forEach((key) => {
					if (key === 'title' || key === 'description' || key === 'category') {
						feedback[key] = req.body[key];
					}
				});

				await feedback.save();

				res.status(200).json({
					ok: true,
					message: 'Feedback updated successfully',
				});
			} catch (err: any) {
				res.status(400).json({ ok: false, message: err.message });
			}
			break;
		}
		default:
			res.status(401).json({ ok: false, message: 'Method not allowed' });
	}
}
