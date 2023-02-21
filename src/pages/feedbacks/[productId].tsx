import React, { useEffect, useCallback, useState } from 'react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { ProfileCard } from 'components/Layout/Components';
import {
	ContentLayout,
	MainLayout,
	SideLayout,
} from 'components/Layout/HomeLayout';
import { Categories } from 'components/Layout/Components';
import RoadMapCard from 'components/RoadMap/RoadMapCard';
import Navbar from 'components/Navbar/Navbar';
import FeedbackCard, { Feedback } from 'components/Feedback/FeedbackCard';
import GlobalLoader from 'components/UI/GlobalLoader';
import Drawer from 'components/UI/Drawer';
import { feedbackCategories, feedbackSortOptions } from 'lib/constants';
import { FeedbackCategoriesState } from 'types';
import { findFeedbacksWithUserDetails } from '@api/helpers';
import useMenu from 'hooks/use-menu';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import mongoose from 'mongoose';
import styles from '../../styles/feedback-page.module.scss';
import connectDb from '@api/db/connection';
import { revalidatePage } from 'lib';
import useAuth from 'hooks/use-auth';
import dynamic from 'next/dynamic';
import useUpvote from 'hooks/use-upvote';

const EmptyMessageScreen = dynamic(
	() => import('components/UI/EmptyMessageScreen'),
	{ loading: () => <GlobalLoader /> },
);

type FeedbackHomePageProps = {
	feedbacks: Feedback[];
};

const ShowText = () => (
	<div className={styles.nofeedbacksScreen}>
		<span>There are no feedbacks available.</span>
	</div>
);

const FeedbackHomePage: NextPage<FeedbackHomePageProps> = ({
	feedbacks,
}: FeedbackHomePageProps) => {
	const { open, openMenu, closeMenu } = useMenu();
	const [activeCategory, setActiveCategory] =
		useState<FeedbackCategoriesState>('All');
	const { data: session } = useSession();
	const router = useRouter();
	const [feedbackData, setFeedbackData] = useState(feedbacks);
	const { isAuthenticated } = useAuth();

	const filterFeedbacksByCategory = useCallback(() => {
		return activeCategory === 'All'
			? feedbacks
			: feedbacks?.filter((feedback) => feedback?.category === activeCategory);
	}, [activeCategory, feedbacks]);

	useEffect(() => {
		setFeedbackData(() => filterFeedbacksByCategory());
	}, [filterFeedbacksByCategory]);

	const { isUpvoted, upvote, downvote, upvoteApi } = useUpvote(
		feedbackData,
		setFeedbackData,
	);

	const { productId } = router?.query ?? '';

	const onUpvote = useCallback(
		async (feedbackId: string) => {
			if (isAuthenticated) {
				isUpvoted(feedbackId) ? downvote(feedbackId) : upvote(feedbackId);
				const res = await upvoteApi(feedbackId, productId as string);
				return;
			}

			router.replace('/auth');
		},
		[
			downvote,
			isAuthenticated,
			isUpvoted,
			productId,
			router,
			upvote,
			upvoteApi,
		],
	);

	const handleSort = useCallback((filter: string) => {
		const sortFunc = (a: Feedback, b: Feedback) => {
			switch (filter) {
				case 'Most Upvotes':
					return b['upvotesCount'] - a['upvotesCount'];
				case 'Least Upvotes':
					return a['upvotesCount'] - b['upvotesCount'];
				case 'Most Comments':
					return 1;
				case 'Least Comments':
					return 1;

				case 'Newest First':
					return b?.createdAt
						?.toString()
						.localeCompare(a?.createdAt?.toString());

				case 'Oldest First':
					return a?.createdAt
						?.toString()
						.localeCompare(b.createdAt?.toString());

				default:
					return a['upvotesCount'] - b['upvotesCount'];
			}
		};
		setFeedbackData((feedback) => {
			const cp = [...feedback];
			cp.sort(sortFunc);
			return cp;
		});
	}, []);

	if (router.isFallback) {
		return <GlobalLoader />;
	}

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
					onSortBy={handleSort}
					itemCount={feedbackData?.length}
					sortOptions={feedbackSortOptions}
					buttonLink={`/add-feedback?productId=${router.query?.productId}`}
					buttonInnerText={'Add Feedback'}
					itemType={'Feedbacks'}
				/>

				{feedbackData?.length === 0 ? (
					<EmptyMessageScreen
						className={styles.nofeedbackWrapper}
						renderTextBelow={ShowText}
					/>
				) : (
					feedbackData?.map((feedback: Feedback) => (
						<FeedbackCard
							key={feedback._id}
							feedback={feedback}
							onUpvote={onUpvote}
							isUpvoted={feedback.upvotedUsers.includes(
								session?.user?.id as string,
							)}
						/>
					))
				)}
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

export const getStaticPaths: GetStaticPaths = (ctx) => {
	return {
		paths: [],
		fallback: true,
	};
};
export const getStaticProps: GetStaticProps = async (context) => {
	let feedbacks = [];
	try {
		await connectDb();
		feedbacks = await findFeedbacksWithUserDetails({
			productId: new mongoose.Types.ObjectId(
				context.params?.productId as string,
			),
		});
	} catch (e: any) {
		console.log(`Error occured : ${e.message}`);
	} finally {
		return {
			props: {
				feedbacks: JSON.parse(JSON.stringify(feedbacks)),
			},
			revalidate: 5,
		};
	}
};

export default FeedbackHomePage;
