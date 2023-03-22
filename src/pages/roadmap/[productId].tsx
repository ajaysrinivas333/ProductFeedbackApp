import FeedbackCard, {
	Feedback,
	RoadmapFeedbackCard,
} from 'components/Feedback/FeedbackCard';
import { RoadmapNavbar } from 'components/Navbar/Navbar';
import { useCallback, useEffect, useState, useMemo } from 'react';
import styles from 'styles/roadmap-page.module.scss';
import {
	DragDropContext,
	Draggable,
	Droppable,
	OnDragEndResponder,
} from 'react-beautiful-dnd';
import { useRouter } from 'next/router';
import {
	formatBoards,
	getMultiBoardMovePayload,
	getSingleBoardMovePayload,
	removeAndAdd,
	reorder,
} from 'lib';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { isAuthenticated } from '@api/helpers';
import connectDb from '@api/db/connection';
import Product from '@api/models/product';
import useUpvote from 'hooks/use-upvote';
import useAuth from 'hooks/use-auth';
import React from 'react';
import { tabList } from 'lib/constants';

type BoardId = 'planned' | 'in-progress' | 'live';

type Board = {
	id: BoardId;
	name: string;
	desc: string;
	feedbacks: Feedback[];
	color?: string;
};

type BoardData<T extends BoardId> = {
	[K in T]: Board;
};

type BoardViewProps = {
	boards: BoardData<BoardId>;
	handleDrag: OnDragEndResponder;
	handleUpvote: (boardId: string, feedbackId: string) => void;
};

type DraggableFeedbackProps = {
	feedback: Feedback;
	index: number;
	color: string;
} & Pick<BoardViewProps, 'handleUpvote'>;

const DraggableFeedback = React.memo(
	({ feedback, index, color, handleUpvote }: DraggableFeedbackProps) => {
		const { user } = useAuth();
		return (
			<Draggable draggableId={feedback._id} index={index}>
				{(provided, _) => (
					<div
						ref={provided.innerRef}
						{...provided.dragHandleProps}
						{...provided.draggableProps}
						style={{
							...provided.draggableProps.style,
						}}
					>
						<RoadmapFeedbackCard
							style={{
								borderTop: `5px solid ${color}`,
								borderTopLeftRadius: '8px',
								borderTopRightRadius: '8px',
							}}
							key={feedback._id}
							isUpvoted={feedback.upvotedUsers.includes(user?.id as string)}
							onUpvote={handleUpvote}
							feedback={feedback}
						/>
					</div>
				)}
			</Draggable>
		);
	},
);
DraggableFeedback.displayName = 'DraggableFeedback';

const BoardsMobileScreenView = React.memo(
	({ boards, handleDrag, handleUpvote }: BoardViewProps) => {
		const [tabSwitch, setTabSwitch] = useState<string>(tabList[0]);

		const switchTabs = (view: string) => setTabSwitch(view);

		const activeBoard = useMemo(
			() => boards[tabSwitch?.toLowerCase()],
			[boards, tabSwitch],
		);

		return activeBoard ? (
			<div className={styles.roadmapMobileScreen}>
				<div className={styles.statusTabSwitch}>
					<div className={styles.statusTabSwitchWrapper}>
						{tabList.map((tab) => (
							<span
								key={tab}
								onClick={() => switchTabs(tab)}
								className={`${styles.tab} ${
									tabSwitch === tab ? styles.active : ''
								}`}
							>
								{tab}
							</span>
						))}
						<span
							className={`${styles.slider} ${
								styles[tabSwitch.toLowerCase() + 'Tab']
							}`}
						/>
					</div>
					<hr />
				</div>
				<DragDropContext onDragEnd={handleDrag}>
					<Droppable droppableId={activeBoard?.id}>
						{(provided, snapshot) => (
							<div className={styles.boardsMobileScreen}>
								<h4 className={styles.boardName}>
									{tabSwitch}({activeBoard?.feedbacks?.length})
								</h4>

								<p className={styles.boardDesc}>{activeBoard?.desc}</p>
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={styles.boardItems}
									style={{
										transition: '0.2s ease-in',
										background: !activeBoard?.feedbacks.length
											? 'rgb(122 137 214 / 3%)'
											: snapshot.isDraggingOver
											? '#373f6808'
											: '',
									}}
								>
									{activeBoard?.feedbacks?.map(
										(feedback: Feedback, idx: number) => (
											<DraggableFeedback
												index={idx}
												key={feedback._id}
												feedback={feedback}
												handleUpvote={handleUpvote}
												color={activeBoard?.color as string}
											/>
										),
									)}
									<div>{provided.placeholder}</div>
								</div>
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		) : null;
	},
);

BoardsMobileScreenView.displayName = 'BoardsMobileScreenView';

const BoardsBigScreenView = React.memo(
	({ boards, handleDrag, handleUpvote }: BoardViewProps) => {
		return (
			<section className={styles.boardsContainer}>
				<DragDropContext onDragEnd={handleDrag}>
					{Object.entries(boards ?? {})?.map(([_, board]) => {
						return (
							<Droppable key={board.id} droppableId={board.id}>
								{(provided, snapshot) => (
									<div className={styles.boards} key={board.id}>
										<ul className={styles.boardName}>
											{' '}
											<li className={styles.boardName}>
												{board.name} ({board.feedbacks?.length ?? 0})
											</li>
											<li className={styles.boardDesc}>{board.desc}</li>
										</ul>
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className={styles.boardItems}
											style={{
												transition: '0.2s ease-in',
												background: !board.feedbacks.length
													? 'rgb(122 137 214 / 3%)'
													: snapshot.isDraggingOver
													? '#373f6808'
													: '',
											}}
										>
											{board?.feedbacks?.map((feedback, idx) => (
												<DraggableFeedback
													index={idx}
													key={feedback._id}
													feedback={feedback}
													handleUpvote={handleUpvote}
													color={board.color as string}
												/>
											))}
											<div>{provided.placeholder}</div>
										</div>
									</div>
								)}
							</Droppable>
						);
					})}
				</DragDropContext>
			</section>
		);
	},
);

BoardsBigScreenView.displayName = 'BoardsBigScreenView';

type RoadmapPageProps = {
	isProductOwner: boolean;
	message: string;
};

const RoadmapPage = (props: RoadmapPageProps) => {
	const [boardData, setBoardData] = useState<BoardData<BoardId>>(
		{} as BoardData<BoardId>,
	);

	const { isProductOwner, message: error } = props;
	const router = useRouter();

	const { productId } = router.query;
	const { isAuthenticated } = useAuth();

	const { isUpvoted, upvote, downvote, upvoteApi } = useUpvote();

	const handleUpvote = useCallback(
		async (boardId: string, feedbackId: string) => {
			if (!isAuthenticated) return router.replace('/auth');
			boardId = boardId.toLowerCase();

			setBoardData((prev) => {
				const list = prev[boardId].feedbacks;
				const updatedFeedbacks = isUpvoted(feedbackId, list)
					? downvote(feedbackId, list)
					: upvote(feedbackId, list);

				return {
					...prev,
					[boardId]: {
						...prev[boardId],
						feedbacks: updatedFeedbacks,
					},
				};
			});

			const res = await upvoteApi(feedbackId, productId as string);
		},
		[
			downvote,
			isAuthenticated,
			isUpvoted,
			productId,
			router,
			upvote,
			upvoteApi,
		],
	);

	const handleDrag: OnDragEndResponder = useCallback(
		async (e) => {
			const source = e.source;
			const destination = e.destination;
			if (!destination) return;

			if (!isProductOwner) return alert(error);

			if (
				source.droppableId === destination.droppableId &&
				source.index !== destination.index
			) {
				const destId = destination.droppableId;
				const list = [...boardData[destId]?.feedbacks];

				const updatedFeedbacks = reorder(
					list,
					destination.index,
					list[source.index],
				);

				const apiPayload = getSingleBoardMovePayload(
					updatedFeedbacks,
					source.index,
					destination.index,
				);

				setBoardData((prev) => ({
					...prev,
					[destId]: {
						...prev[destId],
						feedbacks: updatedFeedbacks,
					},
				}));
				const res = await boardMoveApi(productId as string, apiPayload);
			} else if (source.droppableId !== destination.droppableId) {
				let multi = true;
				const sourceIndex = source.index;
				const destinationIndex = destination.index;
				const sourceId = source.droppableId;
				const destId = destination.droppableId;
				const sourceList = [...boardData[sourceId].feedbacks];
				const destList = [...boardData[destId].feedbacks];
				const destinationBoard = boardData[destId]?.name ?? 'In-Progress';
				const modifiedList = removeAndAdd(
					sourceList,
					destList,
					destinationIndex,
					sourceList[sourceIndex],
					destinationBoard,
				);

				const apiPayload = getMultiBoardMovePayload(
					modifiedList.source,
					sourceIndex,
					modifiedList.destination,
					destination.index,
				);

				setBoardData((prev) => ({
					...prev,
					[sourceId]: {
						...prev[sourceId],
						feedbacks: modifiedList.source,
					},
					[destId]: {
						...prev[destId],
						feedbacks: modifiedList.destination,
					},
				}));
				const res = await boardMoveApi(productId as string, apiPayload, {
					multi,
				});
			}
		},
		[boardData, error, isProductOwner, productId],
	);

	useEffect(() => {
		async function getBoards() {
			const res = await fetch(`/api/public/roadmap/${productId}`);
			const json = await res.json();
			json.ok
				? setBoardData(formatBoards(json.feedbacks) as BoardData<BoardId>)
				: alert(json.message);
		}
		document.documentElement.style.overflowX = 'visible';
		document.body.style.overflowX = 'visible ';

		router.isReady && getBoards();
	}, [productId, router.isReady]);

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.innerContainer}>
				<RoadmapNavbar
					link={`/add-feedback?productId=${productId}`}
					goBackLink={`/feedbacks/${productId}`}
				/>
				<BoardsBigScreenView
					boards={boardData}
					handleDrag={handleDrag}
					handleUpvote={handleUpvote}
				/>
				<BoardsMobileScreenView
					boards={boardData}
					handleDrag={handleDrag}
					handleUpvote={handleUpvote}
				/>
			</div>
		</div>
	);
};

async function boardMoveApi<T>(
	productId: string,
	docs: T[],
	options: { multi: boolean } = { multi: false },
) {
	const res = await fetch(
		`/api/private/roadmap/${productId}?operationType=${
			options.multi ? 'multi_list_move' : 'single_list_move'
		}`,
		{
			method: 'PATCH',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				affectedDocs: docs,
			}),
		},
	);
	const json = await res.json();
	return json;
}

export const getServerSideProps: InferGetServerSidePropsType<
	GetServerSideProps
> = async (ctx: any) => {
	await connectDb();

	let props = {
		isProductOwner: false,
		message: "You don't have permissions to do this operation.",
	};

	const userId = await isAuthenticated(ctx.req);

	const productOwner = await Product.exists({
		_id: ctx.query.productId,
		userId,
	});

	if (productOwner) props.isProductOwner = true;

	return { props };
};

export default RoadmapPage;
