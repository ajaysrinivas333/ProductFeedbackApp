import React from 'react';
import Card from './../UI/Card';
import styles from '../../styles/product-card.module.scss';
import UserRunDown from './../User/UserRunDown';
import { AiOutlineMore as OptionIcon } from 'react-icons/ai';
import { Menu, MenuContainer, MenuItem } from '../UI/Menu';
import useMenu from './../../hooks/use-menu';
import { FiExternalLink } from 'react-icons/fi';
import Router from 'next/router';
import { getFeedbackText, makeUrl } from 'lib';
import Link from 'next/link';
interface Product {
	name: string;
	description: string;
	category: string;
	feedbacksCount?: number;
	link?: string;
	id: string;
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
	feedbacksCount: Product['feedbacksCount'];
	link?: Product['link'];
	isProductOwner: boolean;
	id: string;
}

const ProductDetails = (props: ProductDetailProps) => {
	return (
		<div className={styles.productDetails}>
			<Link
				href={`/feedbacks/${props.product?.id}`}
				className={styles.feedbackPageLink}
			>
				<h4>{props.product.name}</h4>
				<p>{props.product?.description}</p>
			</Link>
			{props.product?.link && (
				<a
					className={styles.link}
					href={makeUrl(props.product?.link) ?? '#'}
					target='_blank'
					rel='noreferrer'
				>
					{`${makeUrl(props.product?.link)}`} <FiExternalLink />
				</a>
			)}
			<span className={styles.category}>{props.product?.category}</span>
			<span className={styles.feedbackCount}>
				{getFeedbackText(props.product?.feedbacksCount ?? 0)}
			</span>
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
	feedbacksCount,
	link,
	isProductOwner,
	id,
}: ProductCardProps) => {
	const { open, openMenu, closeMenu } = useMenu();

	const product = {
		name,
		description,
		category,
		feedbacksCount,
		link,
		id,
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
