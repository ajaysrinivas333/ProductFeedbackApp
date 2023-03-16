import { FEEDBACK_STATUS } from '@api/constants';
import connectDb from '@api/db/connection';
import { findFeedbacksWithUserDetails, isAuthenticated } from '@api/helpers';
import Product from '@api/models/product';
import CommentSection from 'components/Comments/CommentSection';
import FeedbackCard, { Feedback } from 'components/Feedback/FeedbackCard';
import Button from 'components/UI/Button';
import EmptyMessageScreen from 'components/UI/EmptyMessageScreen';
import GlobalLoader from 'components/UI/GlobalLoader';
import useAuth from 'hooks/use-auth';
import useUpvote from 'hooks/use-upvote';
import { Types } from 'mongoose';
import { GetServerSideProps, GetStaticProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
	useCallback,
	useState,
	useEffect,
	useMemo,
	Fragment,
} from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import styles from '../../styles/discussion-page.module.scss';

type DiscussionPageProps = {
	feedback: Feedback[];
	productOwner: boolean;
};

const DiscussionPage = (props: DiscussionPageProps) => {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const [feedbackData, setFeedbackData] = useState(props?.feedback ?? []);
	const { isUpvoted, upvote, downvote, upvoteApi } = useUpvote();
	const { data: session } = useSession();

	const { productId } = router?.query ?? '';

	useEffect(() => {
		setFeedbackData(props.feedback);
	}, [props.feedback]);

	const updateCommentCount = useCallback(
		(commentsCount: number) => {
			console.log(commentsCount);
			if (feedbackData.length > 0) {
				setFeedbackData((prevData: any) => {
					return [{ ...prevData[0], commentsCount }];
				});
			}
		},
		[feedbackData?.length],
	);

	const onUpvote = useCallback(
		async (feedbackId: string) => {
			if (isAuthenticated) {
				setFeedbackData((prev) =>
					isUpvoted(feedbackId, prev)
						? downvote(feedbackId, prev)
						: upvote(feedbackId, prev),
				);
				return await upvoteApi(feedbackId, productId as string);
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

	const markAsPlanned = async () => {
		const res = await markAsPlannedApi(
			props?.feedback[0]?._id,
			productId as string,
		);

		if (res.ok) {
			alert(res.message);
			return setFeedbackData((f) => [{ ...f[0], status: res.feedback.status }]);
		}
		alert(res?.message ?? 'Something went wrong');
	};
	const canShowMarkAsPlanned = useMemo(
		() =>
			props.productOwner &&
			feedbackData.length > 0 &&
			feedbackData[0].status === FEEDBACK_STATUS.REQUESTED,
		[feedbackData, props.productOwner],
	);

	if (router.isFallback) return <GlobalLoader />;

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.innerContainer}>
				<div className={styles.btnContainer}>
					<div className={styles.backButtonWrapper}>
						<BiChevronLeft className={styles.backIcon} />
						<Link style={{ width: '100%' }} href={`/feedbacks/${productId}`}>
							<Button className={styles.backButton} text='Go Back' />
						</Link>
					</div>

					{canShowMarkAsPlanned && (
						<Button
							text='Mark as Planned'
							className={styles.markAsPlannedBtn}
							onClick={markAsPlanned}
						/>
					)}
				</div>
				{feedbackData?.length > 0 ? (
					<Fragment>
						<FeedbackCard
							feedback={feedbackData[0] ?? {}}
							isUpvoted={feedbackData[0]?.upvotedUsers?.includes(
								session?.user?.id as string,
							)}
							onUpvote={onUpvote}
						/>

						<CommentSection updateCommentCount={updateCommentCount} />
					</Fragment>
				) : (
					<EmptyMessageScreen
						renderTextBelow={() => (
							<p style={{ marginTop: 30 }}>Nothing here</p>
						)}
					/>
				)}
			</div>
		</div>
	);
};

async function markAsPlannedApi(feedbackId: string, productId: string) {
	const res = await fetch(
		`/api/private/roadmap/${productId}?feedbackId=${feedbackId}`,
		{
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: null,
		},
	);

	const data = await res.json();

	return data;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	let feedback = [],
		productOwner = false;

	try {
		await connectDb();
		feedback = await findFeedbacksWithUserDetails({
			_id: new Types.ObjectId(ctx.query?.feedbackId as string),
		});
		productOwner = (await Product.exists({
			_id: ctx.query?.productId as string,
			userId: (await getSession(ctx))?.user?.id ?? '',
		}))
			? true
			: false;
	} catch (error: any) {
		console.log(error?.message);
	} finally {
		return {
			props: {
				feedback: JSON.parse(JSON.stringify(feedback)),
				productOwner,
			},
		};
	}
};

export default DiscussionPage;
