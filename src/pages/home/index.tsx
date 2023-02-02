import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
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
import { signOut, useSession } from 'next-auth/react';
import { productCategories } from 'lib/constants';
import LoginText from 'components/Auth/LoginText';
import Router from 'next/router';
import NoProductsScreen from 'components/UI/NoProductsScreen';
import { Menu, MenuContainer, MenuItem } from 'components/UI/Menu';
import { BiLogOut } from 'react-icons/bi';
import Categories from 'components/Layout/Categories';
import { ProductCategoriesState } from 'types';
import useAuth from 'hooks/use-auth';
import { ContentLayout, MainLayout, SideLayout } from 'components/Layout/HomeLayout';

type SignoutMenuProps = {
	children: React.ReactNode;
	open: boolean;
	closeMenu: () => void;
	className?: string;
};

// TODO: Fix signout-menu popup on resize
const SignOutMenuContainer = (props: SignoutMenuProps) => {
	return (
		<MenuContainer className={props.className}>
			{props.children}
			<Menu
				open={props.open}
				className={styles.logOutMenu}
				onBlur={props.closeMenu}
			>
				<MenuItem className={styles.menuItem} onClick={signOut}>
					<BiLogOut />
					<span>Sign out</span>
				</MenuItem>
			</Menu>
		</MenuContainer>
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

	const { isAuthenticated, isLoading } = useAuth();

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

	const {
		open: logoutOpen,
		openMenu: openLogoutMenu,
		closeMenu: closeLogoutMenu,
	} = useMenu();

	return (
		<MainLayout>
			<SideLayout>
				<Card className={`${styles.sideCard} ${styles.profileCard}`}>
					{isAuthenticated ? (
						<SignOutMenuContainer
							open={logoutOpen}
							closeMenu={closeLogoutMenu}
							className={styles.hiddenUser}
						>
							<UserRunDown
								className={styles.userDetails}
								onClick={openLogoutMenu}
								height={45}
								width={45}
								slug={session?.user?.id as string}
								username={session?.user?.name as string}
								subText={`@${getUserNameFromEmail(
									session?.user?.email as string,
								)}`}
							/>
						</SignOutMenuContainer>
					) : (
						<LoginText className={styles.hiddenUser} />
					)}

					<div className={styles.avatarWithHamburgerMenu}>
						{isAuthenticated ? (
							<SignOutMenuContainer
								open={logoutOpen}
								closeMenu={closeLogoutMenu}
							>
								<Avatar
									onClick={openLogoutMenu}
									height={45}
									width={45}
									slug={session?.user?.id as string}
								/>
							</SignOutMenuContainer>
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
				<Categories
					className={styles.categoryCard}
					styles={styles}
					categories={productCategories}
					onClick={changeActiveCategory}
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
					styles={styles}
					categories={productCategories}
					onClick={changeActiveCategory}
					activeCategory={activeCategory}
				/>
			</Drawer>
		</MainLayout>
	);
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	try {
// 		await connectDb();
// 		const products = await findProductsWithUserDetails();
// 		return {
// 			props: {
// 				products: JSON.parse(JSON.stringify(products)),
// 			},
// 		};
// 	} catch (e) {
// 		return {
// 			props: {
// 				products: [],
// 			},
// 		};
// 	}
// };

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
