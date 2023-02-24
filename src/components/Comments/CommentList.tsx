import { makeCommentTree } from 'lib';
import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import { CommentDoc } from 'types';
import Comment from './Comment';

type CommentListProps = {
	comments: CommentDoc[];
	onReply: (s: any) => void;
};

const CommentList = React.memo((props: CommentListProps) => {
	const commentTree = useMemo(
		() => makeCommentTree(JSON.parse(JSON.stringify(props.comments))),
		[props.comments],
	);

	return (
		<Fragment>
			{commentTree?.map((comment) => {
				return (
					<Comment
						key={comment._id as string}
						comment={comment}
						onReply={props.onReply}
					/>
				);
			})}
		</Fragment>
	);
});

CommentList.displayName = 'CommentList';
export default CommentList;
