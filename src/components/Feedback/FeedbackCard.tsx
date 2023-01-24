import { ButtonWithChild } from 'components/UI/Button';
import Card from 'components/UI/Card';
import UserRunDown from 'components/User/UserRunDown';
import React from 'react';
import { BiChevronUp } from 'react-icons/bi';
import { FaComment } from 'react-icons/fa';
import styles from '../../styles/feedback-card.module.scss';

const FeedbackCard = () => {
	return (
		<Card className={styles.feedbackCard}>
			<ButtonWithChild className={styles.upvoteButton}>
				<BiChevronUp className={styles.upIcon} />

				<span>{'80'}</span>
			</ButtonWithChild>
			<div className={styles.detailsWrapper}>
				<UserRunDown
					height={45}
					width={45}
					slug={'avatarId'}
					username={'displayName'}
					subText={'createdAt'}
					subTextStyles={{
						color: 'grey',
						fontWeight: 400,
					}}
				/>
				<div className={styles.productDetails}>
					<h4>Product 123</h4>
					<p>
						Give us a roadmap to something, idk, buying a razer Help us choose
						the right razer for us.
					</p>
					<span className={styles.category}>{'Music & Audio'}</span>
				</div>
			</div>
			<div className={styles.comments}>
				<FaComment className={styles.commentsIcon} />
				<h4>{' 30 '}</h4>
			</div>
		</Card>
	);
};

export default FeedbackCard;
