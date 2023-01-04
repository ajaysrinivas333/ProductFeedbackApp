import React, { Fragment, useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import styles from '../../styles/home.module.scss';
import Card from '../../components/UI/Card';
import ProductCard from '../../components/Product/ProductCard';
import Navbar from '../../components/Navbar/Navbar';
import UserRunDown from '../../components/User/UserRunDown';
import { Drawer } from './../../components/UI/Drawer';
import useMenu from './../../hooks/use-menu';
import Avatar from '../../components/UI/Avatar';
import { RxHamburgerMenu } from 'react-icons/rx';
import { VscChromeClose } from 'react-icons/vsc';
import { formatDate } from '../../lib';
import connectDb from '@api/db/connection';
import { findProductsWithUserDetails } from '@api/helpers';
import { Product } from '@api/types';

const categories = [
	'All',
	'Productivity',
	'Shopping',
	'Communication',
	'Music & Audio',
	'Entertainment',
	'Business',
	'Social',
	'Finance',
];

type CategoryItemsProps = {
	categories: string[];
	onClick: (v: string) => void;
	activeCategory: string;
};

// This should accept prop to identify the active category and functionlity
const CategoryItems = (props: CategoryItemsProps) => {
	return (
		<Fragment>
			{props.categories?.map((category, i) => {
				return (
					<span
						onClick={() => props.onClick(category)}
						className={`${styles.category} ${
							category === props.activeCategory ? styles.active : ''
						}`}
						key={category}
					>
						{category}
					</span>
				);
			})}
		</Fragment>
	);
};

type HomePageProps = {
	products: Product[];
};

const HomePage: NextPage<HomePageProps> = (props: HomePageProps) => {
	const { products } = props;
	const { open, openMenu, closeMenu } = useMenu();
	const [productData, setProductData] = useState<Product[]>(products);

	const [activeCategory, setActiveCategory] = useState<string>('All');

	const changeActiveCategory = (value: string) => {
		setActiveCategory(value);
	};

	/*
		Approach 1

		- in this comp. activeCategory - state.var ✔️
		- changeActiveCategory -> (value) -> sets value as active category ✔️
		- pass activeCategory as a props to category Items ✔️
		- in categoryItems comp. check if arr.value category equals activeCategory ✔️
		- whenever activeCategory changes filter products upon the category

		Approach 2

		- Set up a product filter context
		- Wrap _app with Filter Context
		- set up active category state.var in ctx
		- whenever activeCategory changes filter products upon the category
		- 

	*/

	useEffect(() => {
		activeCategory === 'All'
			? setProductData(products)
			: setProductData((_) =>
					products.filter((product) => product.category === activeCategory),
			  );
	}, [activeCategory, products]);

	return (
		<main className={styles.mainLayout}>
			<aside className={styles.sideLayout}>
				<Card className={styles.box}>
					<UserRunDown
						className={styles.hiddenUser}
						height={45}
						width={45}
						slug={`johndoe`}
						username={'John Doe'}
						subText={'@john_doe'}
					/>

					<div className={styles.avatarWithHamburgerMenu}>
						<Avatar height={45} width={45} slug={`johndoe`} />
						{!open ? (
							<RxHamburgerMenu onClick={openMenu} />
						) : (
							<VscChromeClose />
						)}
					</div>

					<div className={styles.boardTitle}>
						<h4>Frontend Mentor</h4>
						<p>Feedback board</p>
					</div>
				</Card>
				<Card className={styles.box}>
					<CategoryItems
						categories={categories}
						onClick={changeActiveCategory}
						activeCategory={activeCategory}
					/>
				</Card>
			</aside>

			<section className={styles.contentLayout}>
				<Navbar />

				{productData.map((product) => (
					<ProductCard
						key={product?._id as string}
						createdAt={formatDate(product?.createdAt)}
						avatarId={product?.userId}
						displayName={product?.user[0].username}
						name={product?.name}
						description={product?.description}
						category={product?.category}
						feedbackCount={390}
					/>
				))}
			</section>
			<Drawer className={styles.drawer} open={open} onBlur={closeMenu}>
				<h3>Filter by Categories</h3>
				<Card className={`shadow ${styles.drawerCategoryItems}`}>
					<CategoryItems
						categories={categories}
						onClick={changeActiveCategory}
						activeCategory={activeCategory}
					/>
				</Card>
			</Drawer>
		</main>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		await connectDb();
		const products = await findProductsWithUserDetails();
		return {
			props: {
				products: JSON.parse(JSON.stringify(products)),
			},
		};
	} catch (e) {
		return {
			props: {
				products: [],
			},
		};
	}
};
export default HomePage;
