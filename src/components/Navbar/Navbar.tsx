import React from 'react';
import styles from '../../styles/navbar.module.scss';

const Navbar = () => {
	return (
		<header>
			<nav className={styles.navbarHome}>
				<ul className={styles.navbarHome}>
					<li>
            50 Feedbacks</li>
					<li>
						Sort by: <b>Most Upvotes </b>
					</li>
					<li>+Add Feedback</li>
				</ul>
			</nav>
		</header>
	);
};

export default Navbar;
