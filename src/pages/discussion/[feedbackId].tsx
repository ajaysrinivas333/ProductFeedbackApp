import AddCommentForm from 'components/Comments/AddCommentForm';
import CommentSection from 'components/Comments/CommentSection';
import FeedbackCard from 'components/Feedback/FeedbackCard';
import Button from 'components/UI/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import styles from '../../styles/discussion-page.module.scss';

const dummyFeedback = {
	_id: '63c973e3b3ec4e81af4c9c73',
	title: 'Make comments editable',
	description:
		"Users should be able to edit their comments. This isn't Twitter 😕",
	category: 'Feature',
	upvotesCount: 2,
	upvotedUsers: ['63bdbba7321830e0cf4f7a20', '63bdaebb321830e0cf4f79fc'],
	commentsCount: 0,
	userId: '63bdaebb321830e0cf4f79fc',
	productId: '63bdbe29321830e0cf4f7a24',
	createdAt: '2023-01-19T16:46:27.869Z',
	updatedAt: '2023-02-18T11:14:27.926Z',
	user: {
		_id: '63bdaebb321830e0cf4f79fc',
		username: 'Varadarajan M',
		email: 'varad2k12@gmail.com',
		__v: 0,
	},
};

const DiscussionPage = () => {
	const router = useRouter();

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.innerContainer}>
				<div className={styles.backButtonWrapper}>
					<BiChevronLeft className={styles.backIcon} />
					<Link style={{ width: '100%' }} href={'/home'}>
						<Button className={styles.backButton} text='Go Back' />
					</Link>
				</div>
				<FeedbackCard
					feedback={dummyFeedback}
					isUpvoted
					onUpvote={(s) => console.log(s)}
				/>

				<AddCommentForm className={styles.commentForm} />

				<CommentSection />
			</div>
		</div>
	);
};

export default DiscussionPage;
