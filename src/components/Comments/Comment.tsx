import React, { Fragment, useCallback, useState } from 'react';
import { CommentDoc } from 'types';
import styles from 'styles/comment.module.scss';
import Avatar from 'components/UI/Avatar';
import Button from 'components/UI/Button';
import { getUserNameFromEmail } from 'lib';
import { CommentForm } from './AddCommentForm';

type CommentProps = {
	comment: CommentDoc & { replies?: any[] };
	style?: React.CSSProperties;
	onReply: (s: any) => void;
};

type UserProps = {
	user: CommentDoc['user'];
};

const User = (props: UserProps) => (
	<div className={styles.userDetails}>
		<span className={styles.userName}>{props.user.username}</span>
		<span className={styles.userDisplayName}>
			@{getUserNameFromEmail(props.user.email)}
		</span>
	</div>
);

const Comment = React.memo((props: CommentProps) => {
	const { comment: data, onReply: onReplyProp } = props;
	const [replying, setReplying] = useState(false);

	const onReply = useCallback(
		(reply: any) => {
			const comment = {
				...reply,
				parentId: data._id,
			};
			onReplyProp(comment);
			setReplying((r) => !r);
		},
		[data._id, onReplyProp],
	);

	return (
		<Fragment>
			<div className={styles.commentWrapper} style={props?.style}>
				<Avatar
					className={styles.userAvatar}
					slug={data.user?._id ?? Date.now()}
					height={35}
					width={30}
				/>
				<div className={styles.commentDetails}>
					<User user={data?.user ?? {}} />
					<span className={styles.comment}>{data.comment}</span>
				</div>
				<Button
					className={styles.replyBtn}
					text='Reply'
					onClick={() => setReplying(!replying)}
				/>
			</div>

			{replying && (
				<div
					style={{ marginTop: !data.parentId ? -55 : -25, marginBottom: 30 }}
				>
					<CommentForm
						formValues={{
							comment: `@${getUserNameFromEmail(data.user.email)} `,
						}}
						onSubmit={onReply}
					/>{' '}
				</div>
			)}

			{data?.replies &&
				data.replies.map((comment) => (
					<div
						className={styles.replyComment}
						key={comment._id as string}
						style={{ marginLeft: !data.parentId ? 37 : 0 }}
					>
						<Comment comment={comment} onReply={props.onReply} />
					</div>
				))}
		</Fragment>
	);
});

Comment.displayName = 'Comment';

export default Comment;
