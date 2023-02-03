import { useState } from 'react';
import { ProfileCard } from 'components/Layout/Components';
import {
	ContentLayout,
	MainLayout,
	SideLayout,
} from 'components/Layout/HomeLayout';
import { Categories } from 'components/Layout/Components';
import { feedbackCategories } from 'lib/constants';
import styles from '../../styles/feedback-page.module.scss';
import useMenu from 'hooks/use-menu';
import React from 'react';
import { FeedbackCategoriesState } from 'types';
import RoadMapCard from 'components/RoadMap/RoadMapCard';

const FeedbackHomePage = () => {
	const { open, openMenu } = useMenu();
	const [activeCategory, setActiveCategory] =
		useState<FeedbackCategoriesState>('All');

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
                <RoadMapCard/>
				{/* <ProfileCard hamburgerMenuOpen={open} openHamburgerMenu={openMenu} /> */}
			</SideLayout>
			<ContentLayout>
				<h1>content blah blah</h1>
			</ContentLayout>
		</MainLayout>
	);
};

export default FeedbackHomePage;
