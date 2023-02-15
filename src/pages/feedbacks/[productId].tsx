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
import NoProductsScreen from 'components/UI/NoProductsScreen';
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

type FeedbackHomePageProps = {
	feedbacks: Feedback[];
};

const upvoteApi = async (feedbackId: string, productId: string) => {
	const res = await fetch(`/api/private/feedback/upvote?id=${feedbackId}`, {
		method: 'PATCH',
		headers: {
			'content-type': 'application/json',
		},
	});
	const data = await res.json();
	await revalidatePage(`/feedbacks/${productId}`);
	return data;
};

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

	const isUpvoted = useCallback(
		(feedbackId: string) =>
			feedbackData
				?.find((f) => f._id === feedbackId)
				?.upvotedUsers.includes(session?.user.id ?? ''),
		[feedbackData, session?.user.id],
	);

	const upvote = useCallback(
		(_id: string) => {
			setFeedbackData((prevData) =>
				prevData.map((feedback) =>
					feedback._id === _id
						? {
								...feedback,
								upvotesCount: feedback.upvotesCount + 1,
								upvotedUsers: [
									session?.user?.id as string,
									...feedback.upvotedUsers,
								],
						  }
						: feedback,
				),
			);
		},
		[session?.user?.id],
	);

	const downvote = useCallback(
		(_id: string) => {
			setFeedbackData((prevData) =>
				prevData.map((feedback) =>
					feedback._id === _id
						? {
								...feedback,
								upvotesCount: feedback.upvotesCount - 1,
								upvotedUsers: feedback.upvotedUsers.filter(
									(f) => f !== session?.user.id,
								),
						  }
						: feedback,
				),
			);
		},
		[session?.user.id],
	);

	const onUpvote = useCallback(
		async (feedbackId: string) => {
			if (isAuthenticated) {
				isUpvoted(feedbackId) ? downvote(feedbackId) : upvote(feedbackId);
				const res = await upvoteApi(
					feedbackId,
					router.query?.productId as string,
				);
				return;
			}

			router.replace('/auth');
		},
		[downvote, isAuthenticated, isUpvoted, router, upvote],
	);

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
					onSortBy={(c) => console.log(c)}
					itemCount={12}
					sortOptions={feedbackSortOptions}
					buttonLink={'/add-product'}
					buttonInnerText={'Add Feedback'}
					itemType={'Feedbacks'}
				/>

				{feedbackData?.length === 0 ? (
					<NoProductsScreen />
				) : (
					feedbackData?.map((feedback: Feedback) => (
						<FeedbackCard
							key={feedback._id}
							feedback={feedback}
							onUpvote={onUpvote}
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
