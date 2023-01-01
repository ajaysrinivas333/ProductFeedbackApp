import mongoose, { models, Schema, model } from 'mongoose';
import { PRODUCT_CATEGORIES } from '@api/constants';

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		link: {
			type: String,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		category: {
			type: String,
			required: true,
			enum: PRODUCT_CATEGORIES,
		},
	},
	{
		timestamps: true,
	},
);

const Product = models?.Product ?? model('Product', productSchema, 'products');

export default Product;
