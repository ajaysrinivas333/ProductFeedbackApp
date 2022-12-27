import React, { Fragment } from 'react';
import { NextPage } from 'next';
import styles from '../../styles/home.module.scss';
import Card from '../../components/UI/Card';
import ProductCard from '../../components/Product/ProductCard';
import Navbar from '../../components/Navbar/Navbar';
import UserRunDown from '../../components/User/UserRunDown';

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
	return (
		<main className={styles.mainLayout}>
			<aside className={styles.sideLayout}>
				<Card className={styles.box}>
					<UserRunDown
						height={45}
						width={45}
						slug={Date.now().toString()}
						username={'John Doe'}
						subText={'@john_doe'}
					/>

					<div className={styles.boardTitle}>
						<h4>Frontend Mentor</h4>
						<p>Feedback board</p>
					</div>
				</Card>
				<Card className={styles.box}>
					<CategoryItems />
				</Card>
				{/* <Card className={styles.box}>Roadmap</Card> */}
			</aside>

			<section className={styles.contentLayout}>
				<Navbar />
				<ProductCard
					user={{
						avatarId: Date.now().toString(),
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
		</main>
	);
};

export default HomePage;
