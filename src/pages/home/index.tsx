import React, { useState, useEffect, useCallback } from 'react';
import { GetStaticProps, NextPage } from 'next';
import styles from '../../styles/home-page.module.scss';
import ProductCard from '../../components/Product/ProductCard';
import Navbar from '../../components/Navbar/Navbar';
import { Drawer } from './../../components/UI/Drawer';
import useMenu from './../../hooks/use-menu';

import { formatDate } from '../../lib';
import connectDb from '@api/db/connection';
import { findProductsWithUserDetails } from '@api/helpers';
import { Product } from '@api/types';
import { useSession } from 'next-auth/react';
import { productCategories } from 'lib/constants';
import Router from 'next/router';
import NoProductsScreen from 'components/UI/NoProductsScreen';
import { Categories } from 'components/Layout/Components';
import { ProductCategoriesState } from 'types';
import useAuth from 'hooks/use-auth';
import {
	ContentLayout,
	MainLayout,
	SideLayout,
} from 'components/Layout/HomeLayout';
import { ProfileCard } from 'components/Layout/Components';

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
	const { data: session } = useSession();

	const { isAuthenticated, isLoading } = useAuth();

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
		<MainLayout>
			<SideLayout>
				<ProfileCard hamburgerMenuOpen={open} openHamburgerMenu={openMenu} />
				<Categories
					categories={productCategories}
					onClick={setActiveCategory}
					activeCategory={activeCategory}
				/>
			</SideLayout>

			<ContentLayout>
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
			</ContentLayout>
			<Drawer className={styles.drawer} open={open} onBlur={closeMenu}>
				<h3>Filter by Categories</h3>
				<Categories
					className={`shadow ${styles.drawerCategoryItems} 
					${styles.categoryCard}
					`}
					categories={productCategories}
					onClick={setActiveCategory}
					activeCategory={activeCategory}
				/>
			</Drawer>
		</MainLayout>
	);
};

// *Experimental ISR
export const getStaticProps: GetStaticProps = async (context) => {
	let products = [];
	try {
		await connectDb();
		products = await findProductsWithUserDetails();
	} catch (error: any) {
		console.log(error.message);
	} finally {
		return {
			props: {
				products: JSON.parse(JSON.stringify(products)),
			},
			revalidate: 5,
		};
	}
};
export default HomePage;
