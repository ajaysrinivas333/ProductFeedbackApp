import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import styles from '../../styles/home-page.module.scss';
import ProductCard from '../../components/Product/ProductCard';
import Navbar from '../../components/Navbar/Navbar';
import Drawer from './../../components/UI/Drawer';
import useMenu from './../../hooks/use-menu';

import { formatDate } from '../../lib';
import connectDb from '@api/db/connection';
import { findProductsWithUserDetails } from '@api/helpers';
import { Product } from '@api/types';
import { useSession } from 'next-auth/react';
import { productCategories, productSortOptions } from 'lib/constants';
import Router from 'next/router';
import { Categories } from 'components/Layout/Components';
import { ProductCategoriesState } from 'types';
import useAuth from 'hooks/use-auth';
import {
	ContentLayout,
	MainLayout,
	SideLayout,
} from 'components/Layout/HomeLayout';
import { ProfileCard } from 'components/Layout/Components';
import GlobalLoader from 'components/UI/GlobalLoader';
import Head from 'next/head';

type HomePageProps = {
	products: Product[];
};

const ShowText = () => (
	<div className={styles.noproductsScreen}>
		<span>There is nothing here.</span>
		<span>
			Get started by clicking on <strong>Add Product</strong>
		</span>
	</div>
);

const EmptyMessageScreen = dynamic(
	() => import('components/UI/EmptyMessageScreen'),
	{ loading: () => <GlobalLoader /> },
);

const HomePage: NextPage<HomePageProps> = (props: HomePageProps) => {
	const { products } = props;
	const { open, openMenu, closeMenu } = useMenu();
	const [productData, setProductData] = useState<Product[]>(products);
	const [myProductView, setMyProductView] = useState<boolean>(false);
	const [activeCategory, setActiveCategory] =
		useState<ProductCategoriesState>('All');
	const { data: session } = useSession();

	const { isAuthenticated, isLoading } = useAuth();

	const handleSort = useCallback((filter: string) => {
		const sortFunc = (a: Product, b: Product) => {
			switch (filter) {
				case 'Most Feedbacks':
					return (b?.feedbacksCount ?? 0) - (a?.feedbacksCount ?? 0);
				case 'Least Feedbacks':
					return (a?.feedbacksCount ?? 0) - (b?.feedbacksCount ?? 0);
				case 'Newest First':
					return b?.createdAt
						?.toString()
						.localeCompare(a?.createdAt?.toString());

				case 'Oldest First':
					return a?.createdAt
						?.toString()
						.localeCompare(b.createdAt?.toString());

				default:
					return (a?.feedbacksCount ?? 0) - (b?.feedbacksCount ?? 0);
			}
		};
		setProductData((p) => {
			const cp = [...p];
			cp.sort(sortFunc);
			return cp;
		});
	}, []);

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
		<Fragment>
			<Head>
				<meta name='title' content='Product Feedback Board' />
				<title>Product Feedback Board</title>
				<meta
					name='keywords'
					content='Products, feedbacks, SDLC, Software development, customer management, '
				/>
				{products?.map((p) => (
					<meta
						name='description'
						key={Date.now() + p.name}
						content={`${p.name} | ${p.description}`}
					/>
				))}
				<meta name='robots' content='index, follow' />
				<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
				<meta name='language' content='English' />
				<meta name='author' content='Varadarajan M, Ajay Srinivas' />
			</Head>
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
					<Navbar
						onSortBy={handleSort}
						itemCount={productData.length}
						sortOptions={productSortOptions}
						buttonLink={'/add-product'}
						buttonInnerText={'Add Product'}
						itemType={'Products'}
					/>
					<div className={styles.productSwitchTabContainer}>
						<div className={styles.productSwitchTabWrapper}>
							<span
								onClick={switchToMyProducts}
								className={`${styles.tab} ${
									myProductView ? styles.active : ''
								}`}
							>
								My Products
							</span>
							<span
								onClick={switchToAllProducts}
								className={`${styles.tab} ${
									!myProductView ? styles.active : ''
								}`}
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
						<EmptyMessageScreen renderTextBelow={ShowText} />
					) : (
						productData?.map((product) => (
							<ProductCard
								key={product?._id as string}
								id={product?._id as string}
								createdAt={formatDate(product?.createdAt)}
								avatarId={product?.userId}
								displayName={product?.user?.username}
								name={product?.name}
								description={product?.description}
								category={product?.category}
								link={product?.link}
								feedbacksCount={product?.feedbacksCount}
								isProductOwner={product?.userId === session?.user?.id}
							/>
						))
					)}
				</ContentLayout>
				<Drawer className={styles.drawer} open={open} onBlur={closeMenu}>
					<h4>Filter by Categories</h4>
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
		</Fragment>
	);
};

// // *Experimental ISR
// export const getStaticProps: GetStaticProps = async (context) => {
// 	let products = [];
// 	try {
// 		await connectDb();
// 		products = await findProductsWithUserDetails();
// 	} catch (error: any) {
// 		console.log(error.message);
// 	} finally {
// 		return {
// 			props: {
// 				products: JSON.parse(JSON.stringify(products)),
// 			},
// 			revalidate: 5,
// 		};
// 	}
// };

// SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
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
		};
	}
};
export default HomePage;
