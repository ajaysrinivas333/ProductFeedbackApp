import React from 'react';
import Image from 'next/image';

const avatarUrl = 'https://avatars.dicebear.com/api/avataaars';

interface AvatarProps {
	slug: string;
}

const Avatar = (props: AvatarProps) => {
	return (
		<Image
			src={`${avatarUrl}/${props.slug}.svg`}
			className='avatar'
			alt='Avatar'
			height={85}
			width={85}
			priority
		/>
	);
};

export default React.memo(Avatar);
