import Card from 'components/UI/Card';
import React, {
	cloneElement,
	Fragment,
	isValidElement,
	useEffect,
	useState,
} from 'react';
import styles from '../../styles/addfeedback.module.scss';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsVectorPen } from 'react-icons/bs';
import FeedbackForm, { FormData } from 'components/Feedback/FeedbackForm';
import { NextPage } from 'next';
import Link from 'next/link';
import ClientAuthGuard from 'components/Auth/AuthGuard';
import { useRouter } from 'next/router';

const EditFeedbackPage: NextPage = () => {
	return (
		<FeedbackIdentityCheckWrapper>
			<Form />
		</FeedbackIdentityCheckWrapper>
	);
};

type FormProps = {
	feedback?: FormData;
};

const Form = ({ feedback }: FormProps) => {
	return (
		<div className={styles.addFeedbackContainer}>
			<div className={styles.innerContainer}>
				<div className={styles.backButtonWrapper}>
					<BiChevronLeft className={styles.backIcon} />
					<Link style={{ width: '100%' }} href={'/home'}>
						<Button className={styles.backButton} text='Go Back' />
					</Link>
				</div>
				<Card className={styles.addFeedbackCard}>
					<BsVectorPen className={styles.editButton} />
					<FeedbackForm mode='edit' formData={feedback} />
				</Card>
			</div>
		</div>
	);
};

const FeedbackIdentityCheckWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const router = useRouter();
	const [feedback, setFeedback] = useState<FormData>({} as FormData);

	useEffect(() => {
		async function fetchFeedback() {
			const res = await (
				await fetch(`/api/private/feedback?id=${router.query?.id}`)
			).json();
			res.ok ? setFeedback(res.feedback) : router.replace('/auth');
		}
		if (router.query?.id) {
			fetchFeedback();
		}
	}, [router.query?.id, router]);

	return (
		<ClientAuthGuard>
			{React.Children.map(children, (child) =>
				isValidElement(child) ? (
					<Fragment>
						{cloneElement(child, { ...child.props, feedback })}
					</Fragment>
				) : null,
			)}
		</ClientAuthGuard>
	);
};

export default EditFeedbackPage;
