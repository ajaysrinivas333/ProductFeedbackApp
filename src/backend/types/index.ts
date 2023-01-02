import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '@api/constants';

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

export interface ProductResponse extends APIResponse {
	product?: Product;
	products?: Product[];
}
