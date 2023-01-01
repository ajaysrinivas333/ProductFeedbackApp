import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '../constants';

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
	name: string;
	description: string;
	link?: string;
	userId: string;
	category: keyof typeof PRODUCT_CATEGORIES;
	user?: User;
}

export interface ProductResponse extends APIResponse {
	product?: Product;
	products?: Product[];
}
