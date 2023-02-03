import { FEEDBACK_CATEGORIES, PRODUCT_CATEGORIES } from '@api/constants';

export type ProductCategoriesState = 'All' | keyof typeof PRODUCT_CATEGORIES;

export type FeedbackCategories = keyof typeof FEEDBACK_CATEGORIES;

export type FeedbackCategoriesState = 'All' | FeedbackCategories;

