import { FEEDBACK_CATEGORIES, PRODUCT_CATEGORIES } from '@api/constants';
import { Comment } from '@api/types';

export type ProductCategoriesState = 'All' | keyof typeof PRODUCT_CATEGORIES;

export type FeedbackCategories = keyof typeof FEEDBACK_CATEGORIES;

export type FeedbackCategoriesState = 'All' | FeedbackCategories;

export type CommentDoc = Comment & {
	user: { _id: string; email: string; username: string };
};
