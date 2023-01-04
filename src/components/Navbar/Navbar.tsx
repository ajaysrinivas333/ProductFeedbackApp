import React, { useState, useCallback, useEffect } from 'react';
import useMenu from '../../hooks/use-menu';
import styles from '../../styles/navbar.module.scss';
import Button from '../UI/Button';
import { MenuContainer, Menu, MenuItem } from '../UI/Menu';
import { BsChevronDown } from 'react-icons/bs';
import SuggestionIcon from '../UI/SuggestionIcon';
import { TiTick } from 'react-icons/ti';

const productSortOptions: string[] = ['Most Feedbacks', 'Least Feedbacks'];

type NavbarProps = {
	onSortBy:(v:string) => void;
}

const Navbar = ({onSortBy}:NavbarProps) => {
	const { open, openMenu, closeMenu } = useMenu();
	const [sortByOption, setSortByOption] = useState<string>(
		productSortOptions[0],
	);

	const sortProduct = (value: string) => {
		setSortByOption(value);
		onSortBy(value)
	}
	

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
							<span>{sortByOption}</span>
							<BsChevronDown />
						</span>
						<Menu className={styles.menu} open={open} onBlur={closeMenu}>
							{productSortOptions.map((option) => (
								<MenuItem onClick={() => sortProduct(option)} key={option}>
									{option}
									<span className={'icon'}>
										{sortByOption === option ? <TiTick /> : ''}
									</span>
								</MenuItem>
							))}
						</Menu>
					</MenuContainer>
				</li>
				<Button className={styles.addProjectButton} text='Add Product' />
			</ul>
		</nav>
	);
};

export default React.memo(Navbar);
