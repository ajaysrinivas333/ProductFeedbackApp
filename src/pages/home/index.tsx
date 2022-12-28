import React, { Fragment } from 'react';
import { NextPage } from 'next';
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

const HomePage: NextPage = () => {
	const { open, openMenu, closeMenu } = useMenu();
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
				<ProductCard
					user={{
						avatarId: `joshndoe`,
						displayName: 'John Doe',
					}}
					createdAt={'14 Sept,2021'}
					product={{
						name: 'Spotify!',
						description:
							'Listen to your favorite music from anywhere around the world...',
						category: 'Music & Audio',
						feedbackCount: 390,
					}}
				/>

				<ProductCard
					user={{
						avatarId: `johndoe`,
						displayName: 'John Doe',
					}}
					createdAt={'14 Sept,2021'}
					product={{
						name: 'Spotify!',
						description:
							'Listen to your favorite music from anywhere around the world...',
						category: 'Music & Audio',
						feedbackCount: 390,
					}}
				/>
				<ProductCard
					user={{
						avatarId: `johndoe`,
						displayName: 'John Doe',
					}}
					createdAt={'14 Sept,2021'}
					product={{
						name: 'Spotify!',
						description:
							'Listen to your favorite music from anywhere around the world...',
						category: 'Music & Audio',
						feedbackCount: 390,
					}}
				/>
				<ProductCard
					user={{
						avatarId: `johndoe`,
						displayName: 'John Doe',
					}}
					createdAt={'14 Sept,2021'}
					product={{
						name: 'Spotify!',
						description:
							'Listen to your favorite music from anywhere around the world...',
						category: 'Music & Audio',
						feedbackCount: 390,
					}}
				/>
				<ProductCard
					user={{
						avatarId: `johndoe`,
						displayName: 'John Doe',
					}}
					createdAt={'14 Sept,2021'}
					product={{
						name: 'Spotify!',
						description:
							'Listen to your favorite music from anywhere around the world...',
						category: 'Music & Audio',
						feedbackCount: 390,
					}}
				/>
				<ProductCard
					user={{
						avatarId: `johndoe`,
						displayName: 'John Doe',
					}}
					createdAt={'14 Sept,2021'}
					product={{
						name: 'Spotify!',
						description:
							'Listen to your favorite music from anywhere around the world...',
						category: 'Music & Audio',
						feedbackCount: 390,
					}}
				/>
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

export default HomePage;
