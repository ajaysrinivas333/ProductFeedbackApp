import React from 'react';
import Image from 'next/image';

const avatarUrl = 'https://avatars.dicebear.com/api/bottts';

export interface AvatarProps {
	slug: string;
	height: number;
	width: number;
	onClick?: () => void;
	className?: string;
}

const Avatar = (props: AvatarProps) => {
	return (
		<Image
			src={`${avatarUrl}/${props.slug}.svg`}
			className={`${props.className ?? ''} avatar`}
			alt='Avatar'
			height={props.height}
			width={props.width}
			priority
			onClick={props?.onClick}
		/>
	);
};

export default React.memo(Avatar);
