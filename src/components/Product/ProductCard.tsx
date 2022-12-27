import React from 'react';
import Card from './../UI/Card';
import styles from '../../styles/product-card.module.scss';
import UserRunDown from './../User/UserRunDown';

interface Product {
	name: string;
	description: string;
	category: string;
	feedbackCount?: number;
}

interface User {
	avatarId: string;
	displayName: string;
}

interface ProductDetailProps {
	product: Product;
}

interface ProductCardProps extends ProductDetailProps {
	user: User;
	createdAt: string;
}

const ProductDetails = (props: ProductDetailProps) => {
	return (
		<div className={styles.productDetails}>
			<h4>{props.product.name}</h4>
			<p>{props.product?.description}</p>
			<span className={styles.category}>{props.product.category}</span>
			{props.product?.feedbackCount && (
				<span className={styles.feedbackCount}>
					{props.product?.feedbackCount} Feedbacks!
				</span>
			)}
		</div>
	);
};

const ProductCard = ({ product, user, createdAt }: ProductCardProps) => {
	return (
		<Card className={styles.productCard}>
			<div className={styles.detailsWrapper}>
				<UserRunDown
					height={45}
					width={45}
					slug={user.avatarId}
					username={user.displayName}
					subText={createdAt}
					subTextStyles={{
						color: 'grey',
						fontWeight: 400,
					}}
				/>

				<ProductDetails product={product} />
			</div>
			<div> &#8964;</div>
		</Card>
	);
};

export default ProductCard;
