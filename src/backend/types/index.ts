import mongoose from 'mongoose';
import {
	FEEDBACK_CATEGORIES,
	FEEDBACK_STATUS,
	PRODUCT_CATEGORIES,
} from '@api/constants';

export interface APIResponse {
	ok: boolean;
	message?: string;
}

export interface User {
	_id: string | mongoose.Types.ObjectId;
	email: string;
	username: string;
}

export interface Product {
	_id: string | mongoose.Types.ObjectId;
	name: string;
	description: string;
	userId: string;
	createdAt: string | Date;
	updatedAt: string | Date;
	link?: string;
	category: keyof typeof PRODUCT_CATEGORIES;
	user: User[];
}

export interface Feedback {
	_id: string | mongoose.Types.ObjectId;
	title: string;
	description: string;
	category: keyof typeof FEEDBACK_CATEGORIES;
	userId: string;
	productId: string | mongoose.Types.ObjectId;
	upvotedUsers: string[] | mongoose.Types.ObjectId[];
	upvotesCount: number;
	commentsCount: number;
	position?: number;
	status?: keyof typeof FEEDBACK_STATUS;
	createdAt: string | Date;
	updatedAt: string | Date;
	user?: User[];
}

export interface ProductResponse extends APIResponse {
	product?: Product;
	products?: Product[];
}

export interface FeedbackResponse extends APIResponse {
	feedback?: Feedback;
	feedbacks?: Feedback[];
}
