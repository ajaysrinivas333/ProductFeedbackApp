import { ButtonWithChild } from 'components/UI/Button';
import Card from 'components/UI/Card';
import UserRunDown from 'components/User/UserRunDown';
import { formatDate } from 'lib';
import React from 'react';
import { BiChevronUp } from 'react-icons/bi';
import { FaComment } from 'react-icons/fa';
import styles from '../../styles/feedback-card.module.scss';

interface User {
	_id: string;
	email: string;
	username: string;
}

export interface Feedback {
	user: User;
	_id: string;
	title: string;
	description: string;
	category: string;
	upvotesCount: number;
	commentsCount: number;
	upvotedUsers: string[];
	userId: string;
	productId: string;
	createdAt: string;
}

interface FeedbackDetailProps {
	feedback: Feedback;
	onUpvote: (id: string) => void;
}

const FeedbackCard = (props: FeedbackDetailProps) => {
	const { feedback, onUpvote } = props;
	return (
		<Card className={styles.feedbackCard}>
			<ButtonWithChild
				className={styles.upvoteButton}
				onClick={() => onUpvote(feedback?._id)}
			>
				<BiChevronUp className={styles.upIcon} />
				<span>{feedback.upvotesCount}</span>
			</ButtonWithChild>
			<div className={styles.detailsWrapper}>
				<UserRunDown
					height={45}
					width={45}
					slug={feedback.user._id}
					username={feedback.user.username}
					subText={formatDate(feedback.createdAt)}
					subTextStyles={{
						color: 'grey',
						fontWeight: 400,
					}}
				/>
				<div className={styles.productDetails}>
					<h4>{feedback.title}</h4>
					<p>{feedback.description}</p>
					<span className={styles.category}>{feedback.category}</span>
				</div>
			</div>
			<div className={styles.comments}>
				<FaComment className={styles.commentsIcon} />
				<h4>{feedback.commentsCount}</h4>
			</div>
		</Card>
	);
};

export default FeedbackCard;
