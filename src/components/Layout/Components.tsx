import React, { Fragment } from 'react';
import styles from 'styles/home-layout-components.module.scss';
import { MenuContainer, Menu, MenuItem } from 'components/UI/Menu';
import { signOut, useSession } from 'next-auth/react';
import { BiLogOut } from 'react-icons/bi';
import LoginText from 'components/Auth/LoginText';
import Avatar from 'components/UI/Avatar';
import Card from 'components/UI/Card';
import UserRunDown from 'components/User/UserRunDown';
import { getUserNameFromEmail } from 'lib';
import { RxHamburgerMenu } from 'react-icons/rx';
import { VscChromeClose } from 'react-icons/vsc';
import useAuth from 'hooks/use-auth';
import useMenu from 'hooks/use-menu';
import { FeedbackCategoriesState, ProductCategoriesState } from 'types';

type SignoutMenuProps = {
	children: React.ReactNode;
	open: boolean;
	closeMenu: () => void;
	className?: string;
};

export const SignOutMenuContainer = React.memo((props: SignoutMenuProps) => {
	return (
		<MenuContainer className={props.className}>
			{props.children}
			<Menu
				open={props.open}
				className={styles.logOutMenu}
				onBlur={props.closeMenu}
			>
				<MenuItem
					className={styles.menuItem}
					onClick={() => signOut({ redirect: false, callbackUrl: '/home' })}
				>
					<BiLogOut />
					<span>Sign out</span>
				</MenuItem>
			</Menu>
		</MenuContainer>
	);
});
SignOutMenuContainer.displayName = 'SignOutMenuContainer';

type ProfileCardProps = {
	hamburgerMenuOpen: boolean;
	openHamburgerMenu: () => void;
	className?: string;
};

export const ProfileCard = React.memo((props: ProfileCardProps) => {
	const { isAuthenticated } = useAuth();
	const { data: session } = useSession();
	const {
		open: signoutLargeMenuOpen,
		openMenu: openLargeSignoutMenu,
		closeMenu: closeLargeSignoutMenu,
	} = useMenu();

	const {
		open: signoutMobileMenuOpen,
		openMenu: openMobileSignoutMenu,
		closeMenu: closeMobileSignoutMenu,
	} = useMenu();

	const classes = `${styles.sideCard} ${styles.profileCard} ${
		props?.className ?? ''
	}`;

	return (
		<Card className={classes}>
			{isAuthenticated ? (
				<SignOutMenuContainer
					open={signoutLargeMenuOpen}
					closeMenu={closeLargeSignoutMenu}
					className={styles.hiddenUser}
				>
					<UserRunDown
						className={styles.userDetails}
						onClick={openLargeSignoutMenu}
						height={45}
						width={45}
						slug={session?.user?.id as string}
						username={session?.user?.name as string}
						subText={`@${getUserNameFromEmail(session?.user?.email as string)}`}
					/>
				</SignOutMenuContainer>
			) : (
				<LoginText className={styles.hiddenUser} />
			)}

			<div className={styles.avatarWithHamburgerMenu}>
				{isAuthenticated ? (
					<SignOutMenuContainer
						open={signoutMobileMenuOpen}
						closeMenu={closeMobileSignoutMenu}
					>
						<Avatar
							onClick={openMobileSignoutMenu}
							height={45}
							width={45}
							slug={session?.user?.id as string}
						/>
					</SignOutMenuContainer>
				) : (
					<LoginText />
				)}
				{!props.hamburgerMenuOpen ? (
					<RxHamburgerMenu
						className={styles.hamburger}
						onClick={props.openHamburgerMenu}
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
	);
});

ProfileCard.displayName = 'ProfileCard';

type CategoryType = ProductCategoriesState | FeedbackCategoriesState;

type CategoryProps = {
	categories: string[];
	onClick: React.Dispatch<React.SetStateAction<any>>;
	activeCategory: CategoryType;
	className?: string;
};

const CategoryItems = (props: CategoryProps) => {
	return (
		<Fragment>
			{props.categories?.map((category, i) => {
				return (
					<span
						onClick={() => props.onClick(category as ProductCategoriesState)}
						className={`${styles.category} ${
							category === props.activeCategory ? styles.active : ''
						}`}
						key={category}
					>
						{category}
					</span>
				);
			})}
		</Fragment>
	);
};

export const Categories = React.memo((props: CategoryProps) => {
	const cardClasses = `${styles.sideCard} ${styles.categoryCard} ${
		props?.className ?? ''
	}`;
	return (
		<Card className={cardClasses}>
			<CategoryItems
				categories={props.categories}
				onClick={props.onClick}
				activeCategory={props.activeCategory}
			/>
		</Card>
	);
});

Categories.displayName = 'Categories';
