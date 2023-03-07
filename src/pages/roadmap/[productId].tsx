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
				<RoadmapNavbar />
				<BoardsBigScreenView boards={boardData} handleDrag={handleDrag} />
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
