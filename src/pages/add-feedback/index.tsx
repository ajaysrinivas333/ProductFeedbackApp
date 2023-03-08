import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/addfeedback.module.scss';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsPlus } from 'react-icons/bs';
import Link from 'next/link';
import ClientAuthGuard from 'components/Auth/AuthGuard';
import FeedbackForm from 'components/Feedback/FeedbackForm';
import { useRouter } from 'next/router';

const AddFeedbackPage = () => {
	const router = useRouter();
	return (
		<ClientAuthGuard>
			<div className={styles.addFeedbackContainer}>
				<div className={styles.innerContainer}>
					<div className={styles.backButtonWrapper}>
						<BiChevronLeft className={styles.backIcon} />
						<Button
							className={styles.backButton}
							text='Go Back'
							onClick={router.back}
						/>
					</div>
					<Card className={styles.addFeedbackCard}>
						<BsPlus className={styles.plusButton} />
						<FeedbackForm mode='create' />
					</Card>
				</div>
			</div>
		</ClientAuthGuard>
	);
};

export default AddFeedbackPage;
