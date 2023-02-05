import { useState } from 'react';
import { ProfileCard } from 'components/Layout/Components';
import {
	ContentLayout,
	MainLayout,
	SideLayout,
} from 'components/Layout/HomeLayout';
import { Categories } from 'components/Layout/Components';
import { feedbackCategories, feedbackSortOptions } from 'lib/constants';
import styles from '../../styles/feedback-page.module.scss';
import useMenu from 'hooks/use-menu';
import React from 'react';
import { FeedbackCategoriesState } from 'types';
import RoadMapCard from 'components/RoadMap/RoadMapCard';
import Navbar from 'components/Navbar/Navbar';
import NoProductsScreen from 'components/UI/NoProductsScreen';
import ProductCard from 'components/Product/ProductCard';
import { formatDate } from 'lib';
import { useSession } from 'next-auth/react';
import FeedbackCard from 'components/Feedback/FeedbackCard';

const FeedbackHomePage = () => {
	const { open, openMenu } = useMenu();
	const [activeCategory, setActiveCategory] =
		useState<FeedbackCategoriesState>('All');

	const { data: session } = useSession();

	return (
		<MainLayout>
			<SideLayout>
				<ProfileCard
					className={styles.feedbackProfileCard}
					hamburgerMenuOpen={open}
					openHamburgerMenu={openMenu}
				/>
				<Categories
					className={styles.feedbackCategories}
					categories={feedbackCategories}
					activeCategory={activeCategory}
					onClick={setActiveCategory}
				/>
				<RoadMapCard />
				{/* <ProfileCard hamburgerMenuOpen={open} openHamburgerMenu={openMenu} /> */}
			</SideLayout>
			<ContentLayout>
				<Navbar
					onSortBy={(c) => console.log(c)}
					itemCount={12}
					sortOptions={feedbackSortOptions}
					buttonLink={'/add-product'}
					buttonInnerText={'Add Feedback'}
					itemType={'Feedbacks'}
				/>

				{[...new Array(10)].map((_, i) => (
					<FeedbackCard key={i} />
				))}
			</ContentLayout>
		</MainLayout>
	);
};

export default FeedbackHomePage;
