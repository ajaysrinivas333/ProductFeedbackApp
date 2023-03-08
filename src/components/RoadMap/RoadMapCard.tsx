import Button from 'components/UI/Button';
import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/roadmap.module.scss';
import { GiPlainCircle } from 'react-icons/gi';
import { useRouter } from 'next/router';

type RoadMapCardProps = {
	className: string;
	productId: string;
};

const RoadMapCard = (props: RoadMapCardProps) => {
	const classes = `${styles.roadMapWrapper} ${props.className}`;
	const router = useRouter();
	return (
		<Card className={classes}>
			<div className={styles.roadMap}>
				<h4>Roadmap</h4>
				<Button
					className={styles.viewButton}
					text='View'
					onClick={() => router.push('/roadmap/' + props.productId)}
					style={{ cursor: 'pointer' }}
				/>
			</div>
			<div className={styles.roadmapList}>
				<div>
					<span>
						<GiPlainCircle className={styles.bulletIcon} />
						Planned
					</span>
					<span>{12}</span>
				</div>
				<div>
					<span>
						<GiPlainCircle className={styles.bulletIcon} />
						In Progress
					</span>
					<span>{16}</span>
				</div>
				<div>
					<span>
						<GiPlainCircle className={styles.bulletIcon} />
						Live
					</span>
					<span>{16}</span>
				</div>
			</div>
		</Card>
	);
};

export default RoadMapCard;
