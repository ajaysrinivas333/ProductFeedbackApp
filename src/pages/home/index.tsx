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
	'Music & audio',
	'Entertainment',
	'Business',
	'Social',
	'Finance',
];

// This should accept prop to identify the active category and functionlity
const CategoryItems = () => {
	return (
		<Fragment>
			{categories.map((category, i) => {
				return (
					<span
						className={`${styles.category} ${i === 0 ? styles.active : ''}`}
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
					<CategoryItems />
				</Card>
			</aside>

			<section className={styles.contentLayout}>
				<Navbar />

				{productData.map((product) => (
					<ProductCard
						key={product?._id as string}
						user={{
							avatarId: product?.userId,
							displayName: product?.user[0].username,
						}}
						createdAt={formatDate(product?.createdAt)}
						product={{
							name: product?.name,
							description: product?.description,
							category: product?.category,
							feedbackCount: 390,
						}}
					/>
				))}
			</section>
			<Drawer className={styles.drawer} open={open} onBlur={closeMenu}>
				<h3>Filter by Categories</h3>
				<Card className={`shadow ${styles.drawerCategoryItems}`}>
					<CategoryItems />
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
