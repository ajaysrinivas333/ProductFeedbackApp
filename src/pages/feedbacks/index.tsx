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
import Drawer from 'components/UI/Drawer';

const feedbackArray = [
	{
		_id: '63befa27395cf14c6c837453',
		title: 'Make feedback cards dragable on Mobile!',
		description:
			"The feedback cards on the Roadmap page are only dragable on tablet/desktop. It'll be nice to have that functionality on Mobile",
		category: 'Feature',
		upvotesCount: 40,
		upvotedUsers: [],
		commentsCount: 10,
		userId: '63bdbba7321830e0cf4f7a20',
		productId: '63bdbe29321830e0cf4f7a24',
		createdAt: '2023-01-11T18:04:23.586Z',
		updatedAt: '2023-01-24T17:03:23.034Z',
		user: {
			_id: '63bdbba7321830e0cf4f7a20',
			username: 'Cristiano Ronaldo',
			email: 'cristiano@cr7.com',
			__v: 0,
		},
	},
	{
		_id: '63befe57395cf14c6c83745a',
		title: 'Make comments editable',
		description:
			"Users should be able to edit their comments. This isn't Twitter 😕",
		category: 'Feature',
		upvotesCount: 5,
		upvotedUsers: [],
		commentsCount: 20,
		userId: '63bdbba7321830e0cf4f7a20',
		productId: '63bdbe29321830e0cf4f7a24',
		createdAt: '2023-01-11T18:22:15.551Z',
		updatedAt: '2023-01-11T18:22:15.551Z',
		user: {
			_id: '63bdbba7321830e0cf4f7a20',
			username: 'Cristiano Ronaldo',
			email: 'cristiano@cr7.com',
			__v: 0,
		},
	},
	{
		_id: '63beff16395cf14c6c837462',
		title: 'Make comments editable',
		description:
			"Users should be able to edit their comments. This isn't Twitter 😕",
		category: 'Feature',
		upvotesCount: 30,
		upvotedUsers: [],
		commentsCount: 10,
		userId: '63bdbba7321830e0cf4f7a20',
		productId: '63bdbe29321830e0cf4f7a24',
		createdAt: '2023-01-11T18:25:26.306Z',
		updatedAt: '2023-01-11T18:25:26.306Z',
		user: {
			_id: '63bdbba7321830e0cf4f7a20',
			username: 'Cristiano Ronaldo',
			email: 'cristiano@cr7.com',
			__v: 0,
		},
	},
	{
		_id: '63c973e3b3ec4e81af4c9c73',
		title: 'Make comments editable',
		description:
			"Users should be able to edit their comments. This isn't Twitter 😕",
		category: 'Feature',
		upvotesCount: 1,
		upvotedUsers: ['63bdaebb321830e0cf4f79fc'],
		commentsCount: 0,
		userId: '63bdaebb321830e0cf4f79fc',
		productId: '63bdbe29321830e0cf4f7a24',
		createdAt: '2023-01-19T16:46:27.869Z',
		updatedAt: '2023-01-24T16:56:47.328Z',
		user: {
			_id: '63bdaebb321830e0cf4f79fc',
			username: 'Varadarajan M',
			email: 'varad2k12@gmail.com',
			__v: 0,
		},
	},
];

const FeedbackHomePage = () => {
	const { open, openMenu, closeMenu } = useMenu();
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
				<RoadMapCard className={styles.roadMapCard} />
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

				{feedbackArray.map((feedback, i) => (
					<FeedbackCard key={i} feedback={feedback} />
				))}
			</ContentLayout>
			<Drawer className={styles.drawer} open={open} onBlur={closeMenu}>
				<h4>Filter by Categories</h4>
				<Categories
					className={`shadow ${styles.drawerCategoryItems} `}
					categories={feedbackCategories}
					onClick={setActiveCategory}
					activeCategory={activeCategory}
				/>
				<RoadMapCard className={`${styles.roadMapCard} shadow`} />
			</Drawer>
		</MainLayout>
	);
};

export default FeedbackHomePage;
