interface CardProps {
	className?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const Card = (props: CardProps) => {
	const classes = `card ${props.className}`;
	return (
		<div style={props?.style} className={classes}>
			{props.children}
		</div>
	);
};

export default Card;
