import { ButtonWithChild } from 'components/UI/Button';
import Card from 'components/UI/Card';
import { Menu, MenuContainer, MenuItem } from 'components/UI/Menu';
import UserRunDown from 'components/User/UserRunDown';
import { formatDate } from 'lib';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { BiChevronUp } from 'react-icons/bi';
import { FaComment } from 'react-icons/fa';
import styles from '../../styles/feedback-card.module.scss';
import { AiOutlineMore as OptionIcon } from 'react-icons/ai';
import useMenu from 'hooks/use-menu';
import useAuth from 'hooks/use-auth';

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
	status?: string;
}

interface FeedbackDetailProps {
	feedback: Feedback;
	onUpvote: (id: string) => void;
	isUpvoted: boolean;
}

const FeedbackCard = (props: FeedbackDetailProps) => {
	const { feedback, onUpvote, isUpvoted } = props;
	const [color, setColor] = useState('#f2f4ff');

	const { open, openMenu, closeMenu } = useMenu();

	const { user } = useAuth();

	const isFeedbackOwner = useMemo(
		() => feedback?.userId === user?.id,
		[feedback?.userId, user?.id],
	);

	useEffect(() => {
		isUpvoted && setColor('#cfd7ff');
	}, [isUpvoted]);

	return (
		<Card className={styles.feedbackCard}>
			<ButtonWithChild
				className={styles.upvoteButton}
				style={{
					backgroundColor: color,
				}}
				onClick={() => onUpvote(feedback?._id)}
			>
				<BiChevronUp className={styles.upIcon} />
				<span>{feedback?.upvotesCount}</span>
			</ButtonWithChild>
			<div className={styles.detailsWrapper}>
				<UserRunDown
					height={45}
					width={45}
					slug={feedback?.user?._id}
					username={feedback?.user?.username}
					subText={formatDate(feedback?.createdAt)}
					subTextStyles={{
						color: 'grey',
						fontWeight: 400,
					}}
				/>
				<Link
					href={`/discussion/${feedback._id}?productId=${feedback.productId}`}
				>
					<div className={styles.productDetails}>
						<h4>{feedback?.title}</h4>
						<p>{feedback?.description}</p>
						<span className={styles.category}>{feedback?.category}</span>
					</div>
				</Link>
			</div>
			<div className={styles.comments}>
				<FaComment className={styles.commentsIcon} />
				<h4>{feedback?.commentsCount}</h4>
			</div>

			{isFeedbackOwner && (
				<div className={styles.options}>
					<MenuContainer className={styles.moreOptionsMenu}>
						<OptionIcon className={styles.optionIcon} onClick={openMenu} />
						<Menu open={open} onBlur={closeMenu}>
							<MenuItem
								onClick={() =>
									Router.push(
										`/edit-feedback/?id=${feedback._id}&productId=${feedback.productId}`,
									)
								}
							>
								Edit
							</MenuItem>
							<MenuItem>Delete</MenuItem>
						</Menu>
					</MenuContainer>
				</div>
			)}
		</Card>
	);
};

export default FeedbackCard;

interface RoadmapFeedbackCardProps
	extends Omit<FeedbackDetailProps, 'onUpvote'> {
	onUpvote: (boardId: string, feedbackId: string) => void;
	style?: React.CSSProperties;
}

export const RoadmapFeedbackCard = (props: RoadmapFeedbackCardProps) => {
	const { feedback, onUpvote, isUpvoted } = props;

	const classes = `${styles.roadmapFeedbackCard}`;

	return (
		<Card className={classes} style={props.style}>
			<Link
				style={{ textDecoration: 'none' }}
				href={`/discussion/${feedback._id}?productId=${feedback.productId}`}
			>
				<div className={styles.roadmapFeedbackDetails}>
					<h4>{feedback?.title}</h4>
					<p>{feedback?.description}</p>
					<span className={styles.category}>{feedback?.category}</span>
				</div>
			</Link>
			<div className={styles.roadmapFeedbackCardFooter}>
				<ButtonWithChild
					className={styles.roadmapUpvoteButton}
					style={{
						backgroundColor: isUpvoted ? '#cfd7ff' : '',
					}}
					onClick={() => onUpvote(feedback?.status as string, feedback?._id)}
				>
					<BiChevronUp
						style={{ cursor: 'pointer' }}
						className={styles.upIcon}
					/>
					<span>{feedback?.upvotesCount}</span>
				</ButtonWithChild>

				<div className={styles.roadmapComments}>
					<FaComment className={styles.roadmapCommentIcon} />
					<h4>{feedback?.commentsCount}</h4>
				</div>
			</div>
		</Card>
	);
};
