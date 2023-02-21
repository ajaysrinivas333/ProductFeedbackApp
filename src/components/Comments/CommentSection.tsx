import Card from 'components/UI/Card';
import React, { useState } from 'react';
import styles from '../../styles/comment-section.module.scss';

const CommentSection = () => {
	const [commentsCount, setCommentsCount] = useState<number>(0);
	return (
		<Card className={styles.commentSectionWrapper}>
			<h3>{commentsCount} Comment(s)</h3>
		</Card>
	);
};

export default CommentSection;
