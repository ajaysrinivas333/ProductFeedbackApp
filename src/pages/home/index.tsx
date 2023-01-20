import React, { Fragment, useState, useEffect, useCallback } from 'react';
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
import { formatDate, getUserNameFromEmail } from '../../lib';
import connectDb from '@api/db/connection';
import { findProductsWithUserDetails } from '@api/helpers';
import { Product } from '@api/types';
import { PRODUCT_CATEGORIES } from '@api/constants';
import { useSession } from 'next-auth/react';
import { productCategories } from 'lib/constants';
import LoginText from 'components/Auth/LoginText';
import Router from 'next/router';
import NoProductsScreen from 'components/UI/NoProductsScreen';

type ProductCategoriesState = 'All' | keyof typeof PRODUCT_CATEGORIES;

type CategoryItemsProps = {
	categories: string[];
	onClick: (v: ProductCategoriesState) => void;
	activeCategory: ProductCategoriesState;
};

const CategoryItems = (props: CategoryItemsProps) => {
	return (
		<Fragment>
			{props.categories?.map((category, i) => {
				return (
					<span
						onClick={() => props.onClick(category as ProductCategoriesState)}
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
	const [myProductView, setMyProductView] = useState<boolean>(false);
	const [activeCategory, setActiveCategory] =
		useState<ProductCategoriesState>('All');
	const { data: session, status } = useSession();

	const isAuthenticated = status === 'authenticated';

	const changeActiveCategory = (value: ProductCategoriesState) => {
		setActiveCategory(value);
	};

	const handleSort = (filter: string) => {
		const sortFunc = (a: Record<string, any>, b: Record<string, any>) =>
			filter === 'Most Feedbacks'
				? a['name'].localeCompare(b['name'])
				: b['name'].localeCompare(a['name']);
		setProductData((p) => {
			const cp = [...p];
			cp.sort(sortFunc);
			return cp;
		});
	};

	// Filter products when user isn't logged in
	const filterAllProductsByCategory = useCallback(() => {
		return activeCategory === 'All'
			? products
			: products.filter((product) => product.category === activeCategory);
	}, [activeCategory, products]);

	// Filter products when user is logged in
	const filterProductsByUserAndCategory = useCallback((): Product[] => {
		return activeCategory === 'All'
			? products.filter((p) => p.userId === session?.user?.id)
			: products.filter(
					(product) =>
						product.userId === session?.user?.id &&
						product.category === activeCategory,
			  );
	}, [activeCategory, products, session?.user.id]);

	useEffect(() => {
		setProductData(() =>
			session?.user?.id && myProductView
				? filterProductsByUserAndCategory()
				: filterAllProductsByCategory(),
		);
	}, [
		myProductView,
		session?.user.id,
		filterAllProductsByCategory,
		filterProductsByUserAndCategory,
	]);

	const switchToAllProducts = () => setMyProductView(false);

	const switchToMyProducts = () => {
		isAuthenticated ? setMyProductView(true) : Router.replace('/auth');
	};

	return (
		<main className={styles.mainLayout}>
			<aside className={styles.sideLayout}>
				<Card className={styles.box}>
					{isAuthenticated ? (
						<UserRunDown
							className={styles.hiddenUser}
							height={45}
							width={45}
							slug={session?.user?.id as string}
							username={session?.user?.name as string}
							subText={`@${getUserNameFromEmail(
								session?.user?.email as string,
							)}`}
						/>
					) : (
						<LoginText className={styles.hiddenUser} />
					)}

					<div className={styles.avatarWithHamburgerMenu}>
						{isAuthenticated ? (
							<Avatar
								height={45}
								width={45}
								slug={session?.user?.id as string}
							/>
						) : (
							<LoginText />
						)}
						{!open ? (
							<RxHamburgerMenu
								className={styles.hamburger}
								onClick={openMenu}
							/>
						) : (
							<VscChromeClose className={styles.hamburger} />
						)}
					</div>

					<div className={styles.boardTitle}>
						<h4>Frontend Mentor</h4>
						<p>Feedback board</p>
					</div>
				</Card>
				<Card className={styles.box}>
					<CategoryItems
						categories={productCategories}
						onClick={changeActiveCategory}
						activeCategory={activeCategory}
					/>
				</Card>
			</aside>

			<section className={styles.contentLayout}>
				<Navbar onSortBy={handleSort} productCount={productData.length} />
				<div className={styles.productSwitchTabContainer}>
					<div className={styles.productSwitchTabWrapper}>
						<span
							onClick={switchToMyProducts}
							className={`${styles.tab} ${myProductView ? styles.active : ''}`}
						>
							My Products
						</span>
						<span
							onClick={switchToAllProducts}
							className={`${styles.tab} ${!myProductView ? styles.active : ''}`}
						>
							{' '}
							All Products
						</span>
					</div>
					<span
						className={`${styles.slider} ${
							myProductView ? styles.myProductView : ''
						}`}
					></span>
					<hr />
				</div>
				{productData.length === 0 ? (
					<NoProductsScreen />
				) : (
					productData?.map((product) => (
						<ProductCard
							key={product?._id as string}
							id={product?._id as string}
							createdAt={formatDate(product?.createdAt)}
							avatarId={product?.userId}
							displayName={product?.user[0].username}
							name={product?.name}
							description={product?.description}
							category={product?.category}
							link={product?.link}
							feedbackCount={390}
							isProductOwner={product?.userId === session?.user?.id}
						/>
					))
				)}
			</section>
			<Drawer className={styles.drawer} open={open} onBlur={closeMenu}>
				<h3>Filter by Categories</h3>
				<Card className={`shadow ${styles.drawerCategoryItems}`}>
					<CategoryItems
						categories={productCategories}
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
