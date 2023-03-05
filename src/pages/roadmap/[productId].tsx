import {
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
import { formatBoards, removeAndAdd, reorder } from 'lib';

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
};

const BoardsBigScreenView = ({ boards, handleDrag }: BoardViewProps) => {
	return (
		<section className={styles.boardsContainer}>
			<DragDropContext onDragEnd={handleDrag}>
				{Object.entries(boards ?? {})?.map(([boardId, board]) => {
					return (
						<Droppable key={board.id} droppableId={board.id}>
							{(provided, snapshot) => (
								<div className={styles.boards} key={board.id}>
									<ul className={styles.boardName}>
										{' '}
										<li className={styles.boardName}>{board.name} (11)</li>
										<li className={styles.boardDesc}>{board.desc}</li>
									</ul>
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className={styles.boardItems}
										style={{
											background: snapshot.isDraggingOver ? '#373f6808' : '',
											transition: '0.2s ease-in',
										}}
									>
										{board?.feedbacks?.map((feedback, idx) => (
											<Draggable
												key={feedback._id}
												draggableId={feedback._id}
												index={idx}
											>
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
																borderTop: `4px solid ${board.color}`,
																borderTopLeftRadius: '8px',
																borderTopRightRadius: '8px',
															}}
															key={feedback._id}
															isUpvoted={false}
															onUpvote={console.log}
															feedback={feedback}
														/>
													</div>
												)}
											</Draggable>
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
};

const RoadmapPage = () => {
	const [boardData, setBoardData] = useState<BoardData<BoardId>>(
		{} as BoardData<BoardId>,
	);
	const router = useRouter();

	const { productId } = router.query;

	useEffect(() => {
		console.log('BoardData changed', boardData);
	}, [boardData]);

	const handleDrag: OnDragEndResponder = useCallback(
		(e) => {
			const source = e.source;
			const destination = e.destination;
			if (!destination) return;

			if (
				source.droppableId === destination.droppableId &&
				source.index !== destination.index
			) {
				const destId = destination.droppableId;
				const list = [...boardData[destId]?.feedbacks];
				setBoardData((prev) => ({
					...prev,
					[destId]: {
						...prev[destId],
						feedbacks: reorder(list, destination.index, list[source.index]),
					},
				}));
			} else if (source.droppableId !== destination.droppableId) {
				const sourceIndex = source.index;
				const destinationIndex = destination.index;
				const sourceId = source.droppableId;
				const destId = destination.droppableId;
				const sourceList = [...boardData[sourceId].feedbacks];
				const destList = [...boardData[destId].feedbacks];
				const modifiedList = removeAndAdd(
					sourceList,
					destList,
					destinationIndex,
					sourceList[sourceIndex],
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
			}
		},
		[boardData],
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
				<RoadmapNavbar />
				<BoardsBigScreenView boards={boardData} handleDrag={handleDrag} />
			</div>
		</div>
	);
};

export default RoadmapPage;
