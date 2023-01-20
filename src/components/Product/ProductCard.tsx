import React from 'react';
import Card from './../UI/Card';
import styles from '../../styles/product-card.module.scss';
import UserRunDown from './../User/UserRunDown';
import { AiOutlineMore as OptionIcon } from 'react-icons/ai';
import { Menu, MenuContainer, MenuItem } from '../UI/Menu';
import useMenu from './../../hooks/use-menu';
import { FiExternalLink } from 'react-icons/fi';
import Router from 'next/router';
interface Product {
	name: string;
	description: string;
	category: string;
	feedbackCount?: number;
	link?: string;
}

interface User {
	avatarId: string;
	displayName: string;
}

interface ProductDetailProps {
	product: Product;
}

interface ProductCardProps {
	createdAt: string;
	avatarId: User['avatarId'];
	displayName: User['displayName'];
	name: Product['name'];
	description: Product['description'];
	category: Product['category'];
	feedbackCount: Product['feedbackCount'];
	link?: Product['link'];
	isProductOwner: boolean;
	id: string;
}

const ProductDetails = (props: ProductDetailProps) => {
	return (
		<div className={styles.productDetails}>
			<h4>{props.product.name}</h4>
			<p>{props.product?.description}</p>
			{props.product?.link && (
				<a
					className={styles.link}
					href={props.product?.link ?? '#'}
					target='_blank'
					rel='noreferrer'
				>
					{`${props.product.link}`} <FiExternalLink />
				</a>
			)}
			<span className={styles.category}>{props.product.category}</span>
			{props.product?.feedbackCount && (
				<span className={styles.feedbackCount}>
					{props.product?.feedbackCount} Feedbacks!
				</span>
			)}
		</div>
	);
};

const ProductCard = ({
	createdAt,
	avatarId,
	displayName,
	name,
	description,
	category,
	feedbackCount,
	link,
	isProductOwner,
	id,
}: ProductCardProps) => {
	const { open, openMenu, closeMenu } = useMenu();

	const product = {
		name,
		description,
		category,
		feedbackCount,
		link,
	};

	return (
		<Card className={styles.productCard}>
			<div className={styles.detailsWrapper}>
				<UserRunDown
					height={45}
					width={45}
					slug={avatarId}
					username={displayName}
					subText={createdAt}
					subTextStyles={{
						color: 'grey',
						fontWeight: 400,
					}}
				/>

				<ProductDetails product={product} />
			</div>
			{isProductOwner && (
				<MenuContainer className={styles.moreOptionsMenu}>
					<OptionIcon className={styles.optionIcon} onClick={openMenu} />
					<Menu open={open} onBlur={closeMenu}>
						<MenuItem
							onClick={() => Router.push(`/edit-product?productId=${id}`)}
						>
							Edit
						</MenuItem>
						<MenuItem>Delete</MenuItem>
					</Menu>
				</MenuContainer>
			)}
		</Card>
	);
};

export default React.memo(ProductCard);
