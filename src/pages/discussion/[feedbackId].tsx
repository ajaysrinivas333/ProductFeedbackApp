import connectDb from '@api/db/connection';
import { findFeedbacksWithUserDetails } from '@api/helpers';
import AddCommentForm from 'components/Comments/AddCommentForm';
import CommentSection from 'components/Comments/CommentSection';
import FeedbackCard, { Feedback } from 'components/Feedback/FeedbackCard';
import Button from 'components/UI/Button';
import GlobalLoader from 'components/UI/GlobalLoader';
import useAuth from 'hooks/use-auth';
import useUpvote from 'hooks/use-upvote';
import { Types } from 'mongoose';
import { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useState, useEffect } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import styles from '../../styles/discussion-page.module.scss';


type DiscussionPageProps = {
	feedback: Feedback[];
};

const DiscussionPage = (props: DiscussionPageProps) => {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const [feedbackData, setFeedbackData] = useState(props?.feedback ?? []);
	const { isUpvoted, upvote, downvote, upvoteApi } = useUpvote(
		feedbackData,
		setFeedbackData,
	);
	const { data: session } = useSession();

	const { productId } = router?.query ?? '';

	useEffect(() => {
		setFeedbackData(props.feedback);
	}, [props.feedback]);

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

	if (router.isFallback) return <GlobalLoader />;

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.innerContainer}>
				<div className={styles.backButtonWrapper}>
					<BiChevronLeft className={styles.backIcon} />
					<Link style={{ width: '100%' }} href={`/feedbacks/${productId}`}>
						<Button className={styles.backButton} text='Go Back' />
					</Link>
				</div>
				{feedbackData && (
					<FeedbackCard
						feedback={feedbackData[0] ?? {}}
						isUpvoted={feedbackData[0]?.upvotedUsers?.includes(
							session?.user?.id as string,
						)}
						onUpvote={onUpvote}
					/>
				)}

				<AddCommentForm className={styles.commentForm} />

				<CommentSection />
			</div>
		</div>
	);
};

export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	let feedback;
	try {
		await connectDb();
		feedback = await findFeedbacksWithUserDetails({
			_id: new Types.ObjectId(ctx.params?.feedbackId as string),
		});
	} catch (error: any) {
		console.log(error?.message);
	} finally {
		return {
			props: {
				feedback: JSON.parse(JSON.stringify(feedback)),
			},
			revalidate: 2,
		};
	}
};

export default DiscussionPage;
