import Button from 'components/UI/Button';
import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/roadmap.module.scss';
import { GiPlainCircle } from 'react-icons/gi';
import { useRouter } from 'next/router';
import { tabList } from 'lib/constants';
type RoadMapCardProps = {
	className: string;
	productId: string;
	statusCount: Record<string, number>;
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
				{tabList.map((tab) => (
					<div key={tab}>
						<span>
							<GiPlainCircle className={styles.bulletIcon} />
							{tab}
						</span>
						<span>{props.statusCount[tab]}</span>
					</div>
				))}
			</div>
		</Card>
	);
};

export default RoadMapCard;
