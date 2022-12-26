import React from 'react';
import { NextPage } from 'next';
import styles from '../../styles/home.module.scss';
import Card from '../../components/UI/Card';
import Avatar from '../../components/UI/Avatar';

const HomePage: NextPage = () => {
	return (
		<main className={styles.mainLayout}>
			<aside className={styles.sideLayout}>
				<Card className={styles.box}>
					<div className={styles.userDetails}>
						<Avatar height={45} width={45} slug={Date.now().toString()} />
						<div className={styles.userNames}>
							<span>John Doe</span>
							<span>@johndoe</span>
						</div>
					</div>
					<div className={styles.boardTitle}>
						<p>Frontend Mentor</p>
						<p>Feedback board</p>
					</div>
				</Card>
				<Card className={styles.box}>Category</Card>
				<Card className={styles.box}>Roadmap</Card>
			</aside>

			<section className={styles.contentLayout}>
				<Card>Some content</Card>

				<Card>Some content</Card>

				<Card>Some content</Card>
			</section>
		</main>
	);
};

export default HomePage;
