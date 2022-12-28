import React from 'react';
import Avatar, { AvatarProps } from '../UI/Avatar';

interface UserRunDownProps extends AvatarProps {
	username: string;
	subText: string;
	className?: string;
	usernameStyles?: React.CSSProperties;
	subTextStyles?: React.CSSProperties;
}
const UserRunDown = (props: UserRunDownProps) => {
	const classes = `userRunDownDetails ${props.className}`;
	return (
		<div className={classes}>
			<Avatar height={props.height} width={props.width} slug={props.slug} />
			<div className={'userTextDetails'}>
				<span style={props.usernameStyles}>{props.username}</span>
				<span style={props.subTextStyles}>{props.subText}</span>
			</div>
		</div>
	);
};

export default UserRunDown;
