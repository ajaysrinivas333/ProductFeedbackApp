import mongoose from 'mongoose';
import {
	FEEDBACK_CATEGORIES,
	FEEDBACK_STATUS,
	PRODUCT_CATEGORIES,
} from '@api/constants';
import { CommentDoc } from 'types';

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
	user: User;
	feedbacksCount?: number;
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

export interface Comment {
	_id: mongoose.Types.ObjectId | string;
	comment: string;
	parentId: mongoose.Types.ObjectId | string | null;
	userId: mongoose.Types.ObjectId | string;
	feedbackId: mongoose.Types.ObjectId | string;
}

export interface CommentResponse extends APIResponse {
	comment?: Comment | CommentDoc;
	comments?: Comment[];
}
