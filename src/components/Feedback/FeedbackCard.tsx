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

interface Feedback {
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
}

const FeedbackCard = (props: FeedbackDetailProps) => {
	return (
		<Card className={styles.feedbackCard}>
			<ButtonWithChild className={styles.upvoteButton}>
				<BiChevronUp className={styles.upIcon} />

				<span>{props.feedback.upvotesCount}</span>
			</ButtonWithChild>
			<div className={styles.detailsWrapper}>
				<UserRunDown
					height={45}
					width={45}
					slug={props.feedback.user._id}
					username={props.feedback.user.username}
					subText={formatDate(props.feedback.createdAt)}
					subTextStyles={{
						color: 'grey',
						fontWeight: 400,
					}}
				/>
				<div className={styles.productDetails}>
					<h4>{props.feedback.title}</h4>
					<p>{props.feedback.description}</p>
					<span className={styles.category}>{props.feedback.category}</span>
				</div>

				{/* <div className={styles.productDetails}>
					<h4>Product 123</h4>
					<p>
						Give us a roadmap to something, idk, buying a razer Help us choose
						the right razer for us.
					</p>
					<span className={styles.category}>{'Music & Audio'}</span>
				</div> */}
			</div>
			<div className={styles.comments}>
				<FaComment className={styles.commentsIcon} />
				<h4>{props.feedback.commentsCount}</h4>
			</div>
		</Card>
	);
};

export default FeedbackCard;
