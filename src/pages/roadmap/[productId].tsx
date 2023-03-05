import {
	Feedback,
	RoadmapFeedbackCard,
} from 'components/Feedback/FeedbackCard';
import { RoadmapNavbar } from 'components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import styles from 'styles/roadmap-page.module.scss';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useRouter } from 'next/router';
import { formatBoards } from 'lib';

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

const BoardsBigScreenView = ({ boards }: { boards: BoardData<BoardId> }) => {
	return (
		<section className={styles.boardsContainer}>
			<DragDropContext onDragEnd={(e) => console.log(e)}>
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
				<BoardsBigScreenView boards={boardData} />
			</div>
		</div>
	);
};

export default RoadmapPage;
