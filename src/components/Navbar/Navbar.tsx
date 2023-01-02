import React from 'react';
import useMenu from '../../hooks/use-menu';
import styles from '../../styles/navbar.module.scss';
import Button from '../UI/Button';
import { MenuContainer, Menu, MenuItem } from '../UI/Menu';
import { BsChevronDown } from 'react-icons/bs';
import SuggestionIcon from '../UI/SuggestionIcon';
const Navbar = () => {
	const { open, openMenu, closeMenu } = useMenu();

	return (
		<nav className={styles.navbarHome}>
			<ul className={styles.listItems}>
				<li>
					<SuggestionIcon /> 50 Feedbacks
				</li>
				<li>
					<span className={styles.sortBy}>Sort by: </span>

					<MenuContainer className={styles.dropDownMenu}>
						<span
							role={'button'}
							className={styles.dropDownButton}
							onClick={openMenu}
						>
							<span> Most Upvotes</span> <BsChevronDown />
						</span>
						<Menu className={styles.menu} open={open} onBlur={closeMenu}>
							<MenuItem>Most Upvotes</MenuItem>
							<MenuItem>Least Upvotes</MenuItem>
							<MenuItem>Most Comments </MenuItem>
							<MenuItem>Least Comments</MenuItem>
						</Menu>
					</MenuContainer>
				</li>
				<Button className={styles.addProjectButton} text='Add Product' />
			</ul>
		</nav>
	);
};

export default React.memo(Navbar);
