import { revalidatePage } from 'lib';
import { useSession } from 'next-auth/react';
import React, { useCallback } from 'react';
import { Feedback } from 'components/Feedback/FeedbackCard';
import useAuth from './use-auth';

function useUpvote(
	feedbacks: Feedback[],
	setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>,
) {
	const { data: session } = useSession();
	const upvoteApi = async (feedbackId: string, productId: string) => {
		const res = await fetch(`/api/private/feedback/upvote?id=${feedbackId}`, {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json',
			},
		});
		const data = await res.json();
		await Promise.all([
			revalidatePage(`/feedbacks/${productId}`),
			revalidatePage(`/discussion/${feedbackId}?productId=${productId}`),
		]);

		return data;
	};

	const isUpvoted = useCallback(
		(feedbackId: string) =>
			feedbacks
				?.find((f) => f._id === feedbackId)
				?.upvotedUsers.includes(session?.user?.id ?? ''),
		[feedbacks, session?.user.id],
	);

	const upvote = useCallback(
		(_id: string) => {
			setFeedbacks((prevData) =>
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
		[session?.user?.id, setFeedbacks],
	);

	const downvote = useCallback(
		(_id: string) => {
			setFeedbacks((prevData) =>
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
		[session?.user.id, setFeedbacks],
	);

	return { upvoteApi, isUpvoted, upvote, downvote };
}

export default useUpvote;

export function useUpvoteRoadmap() {
	const { data: session } = useSession();
	const upvoteApi = async (feedbackId: string, productId: string) => {
		const res = await fetch(`/api/private/feedback/upvote?id=${feedbackId}`, {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json',
			},
		});
		const data = await res.json();
		await Promise.all([
			revalidatePage(`/feedbacks/${productId}`),
			revalidatePage(`/discussion/${feedbackId}?productId=${productId}`),
		]);

		return data;
	};

	const isUpvoted = useCallback(
		(feedbackId: string, feedbacks: Feedback[]) =>
			feedbacks
				?.find((f) => f._id === feedbackId)
				?.upvotedUsers.includes(session?.user?.id ?? ''),
		[session?.user.id],
	);

	const upvote = useCallback(
		(_id: string, feedbacks: Feedback[]) =>
			feedbacks.map((feedback) =>
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
		[session?.user?.id],
	);

	const downvote = useCallback(
		(_id: string, feedbacks: Feedback[]) =>
			feedbacks.map((feedback) =>
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
		[session?.user.id],
	);

	return { upvoteApi, isUpvoted, upvote, downvote };
}
