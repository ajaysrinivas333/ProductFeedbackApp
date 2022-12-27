import React from 'react';
import useMenu from '../../hooks/use-menu';
import styles from '../../styles/navbar.module.scss';
import Button from '../UI/Button';
import { MenuContainer, Menu, MenuItem } from '../UI/Menu';
import { BsChevronDown } from 'react-icons/bs';
const Navbar = () => {
	const { open, toggleMenu, closeMenu } = useMenu();

	return (
		<nav>
			<ul className={styles.navbarHome}>
				<li>50 Feedbacks</li>
				<li>
					<span>Sort by: </span>

					<MenuContainer className={styles.dropDownMenu}>
						<span
							role={'button'}
							className={styles.dropDownButton}
							onClick={toggleMenu}
						>
							Most Upvotes <BsChevronDown />
						</span>

						<Menu open={open} onBlur={closeMenu}>
							<MenuItem>Most Upvotes</MenuItem>
							<MenuItem>Least Upvotes</MenuItem>
							<MenuItem>Most Comments </MenuItem>
							<MenuItem>Least Comments</MenuItem>
						</Menu>
					</MenuContainer>
				</li>
				<Button className={styles.addProjectButton} text='+Add Product' />
			</ul>
		</nav>
	);
};

export default Navbar;
