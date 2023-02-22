import { Comment } from '@api/types';
import Card from 'components/UI/Card';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { CommentDoc } from 'types';
import styles from '../../styles/comment-section.module.scss';
import AddCommentForm from './AddCommentForm';
import CommentList from './CommentList';

const addComment = async (
	data: Pick<Comment, 'comment' | 'feedbackId' | 'parentId'>,
) => {
	try {
		const res = await fetch(
			`/api/private/comment?feedbackId=${data.feedbackId ?? ''}`,
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					comment: data.comment,
					parentId: data.parentId,
				}),
			},
		);

		const json = await res.json();

		return json;
	} catch (e: any) {
		console.log(e.message);
		return { ok: false, message: e.message };
	}
};

const CommentSection = () => {
	const [commentsCount, setCommentsCount] = useState<number>(0);
	const router = useRouter();
	const [comments, setComments] = useState<CommentDoc[]>([]);

	const onAddComment = useCallback(
		async (data: Pick<Comment, 'comment'>) => {
			const res = await addComment({
				comment: data.comment,
				feedbackId: router.query.feedbackId as string,
				parentId: null,
			});
			if (res.ok) {
				setComments((c) => [...c, { ...res.comment }]);
				setCommentsCount((c) => c + 1);
				return;
			}
			alert(res?.message);
		},
		[router.query.feedbackId],
	);

	useEffect(() => {
		async function fetchComments(feedbackId: string) {
			try {
				const res = await fetch(
					`/api/public/comment?feedbackId=${feedbackId ?? ''}`,
				);
				const data = await res.json();

				if (data.ok) {
					setCommentsCount(
						(c) =>
							data?.comments?.filter((comment: CommentDoc) => !comment.parentId)
								?.length ?? 0,
					);
					setComments((c) => data.comments);
				}
			} catch (e: any) {
				alert(e.message);
			}
		}
		fetchComments(router?.query?.feedbackId as string);
	}, [router.query.feedbackId]);

	const onReply = useCallback(
		async (reply: any) => {
			const res = await addComment({
				comment: reply.comment,
				feedbackId: router.query.feedbackId as string,
				parentId: reply.parentId,
			});
			res.ok
				? setComments((c) => [...c, { ...res.comment }])
				: alert(res?.message);
		},
		[router.query.feedbackId],
	);
	return (
		<Fragment>
			<AddCommentForm onSubmit={onAddComment} className={styles.commentForm} />

			<Card className={styles.commentSectionWrapper}>
				<h3>{commentsCount} Comment(s)</h3>

				<CommentList comments={comments} onReply={onReply} />
			</Card>
		</Fragment>
	);
};

export default CommentSection;
