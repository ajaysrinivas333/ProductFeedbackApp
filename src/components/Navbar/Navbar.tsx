import React, { useCallback, useState } from 'react';
import useMenu from '../../hooks/use-menu';
import styles from '../../styles/navbar.module.scss';
import { ButtonWithChild } from '../UI/Button';
import { MenuContainer, Menu, MenuItem } from '../UI/Menu';
import { BsChevronDown } from 'react-icons/bs';
import SuggestionIcon from '../UI/SuggestionIcon';
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';

type NavbarProps = {
	onSortBy: (v: string) => void;
	itemCount: number;
	sortOptions: string[];
	buttonLink: string;
	buttonInnerText: React.ReactElement | string;
	itemType: 'Products' | 'Feedbacks';
};

const Navbar = ({
	onSortBy,
	itemCount,
	sortOptions,
	buttonLink,
	buttonInnerText,
	itemType,
}: NavbarProps) => {
	const { open, openMenu, closeMenu } = useMenu();
	const [sortByOption, setSortByOption] = useState<string>(sortOptions[0]);
	const [closedWithMenuItem, setClosedWithMenuItem] = useState<boolean>(false);

	const sortProduct = useCallback(
		(value: string) => {
			setSortByOption(value);
			onSortBy(value);
			setClosedWithMenuItem(true);
			closeMenu();
		},
		[closeMenu, onSortBy],
	);

	const onDropdownClick = useCallback(() => {
		setClosedWithMenuItem(false);
		openMenu();
	}, [openMenu]);

	const classes = `${styles.navbarHome} ${
		itemType === 'Feedbacks' ? styles.feedbackPage : ''
	}`;
	return (
		<nav className={classes}>
			<ul className={styles.listItems}>
				<li>
					<SuggestionIcon />
					<>
						{itemCount} {itemType}
					</>
				</li>

				<li>
					<span className={styles.sortBy}>Sort by: </span>

					<SortByMenu
						open={open}
						closedWithMenuItem={closedWithMenuItem}
						sortByOption={sortByOption}
						sortOptions={sortOptions}
						closeMenu={closeMenu}
						onMenuItemClick={sortProduct}
						onButtonClick={onDropdownClick}
					/>
				</li>
				<Link href={buttonLink}>
					<ButtonWithChild className={styles.addProjectButton}>
						<MdAdd />
						{buttonInnerText}
					</ButtonWithChild>
				</Link>
			</ul>
		</nav>
	);
};

export default React.memo(Navbar);

type SortByMenuProps = {
	open: boolean;
	closedWithMenuItem: boolean;
	sortByOption: string;
	sortOptions: string[];
	closeMenu: () => void;
	onMenuItemClick: (s: string) => void;
	onButtonClick: () => void;
};

export const SortByMenu = React.memo((props: SortByMenuProps) => {
	const {
		open,
		sortByOption,
		closedWithMenuItem,
		sortOptions,
		closeMenu,
		onMenuItemClick,
		onButtonClick,
	} = props;

	return (
		<MenuContainer className={styles.dropDownMenu}>
			<span
				role={'button'}
				className={styles.dropDownButton}
				onClick={onButtonClick}
			>
				<span>{sortByOption}</span>
				<BsChevronDown />
			</span>
			<Menu
				className={styles.menu}
				open={open}
				onBlur={closeMenu}
				closedWithMenuItem={closedWithMenuItem}
			>
				{sortOptions.map((option) => (
					<MenuItem onClick={() => onMenuItemClick(option)} key={option}>
						{option}
						<span className={'icon'}>
							{sortByOption === option ? <TiTick /> : ''}
						</span>
					</MenuItem>
				))}
			</Menu>
		</MenuContainer>
	);
});
SortByMenu.displayName = 'SortByMenu';
