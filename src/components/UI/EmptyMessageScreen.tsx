import React, { useState } from 'react';
import Image from 'next/image';
import EmptyImage from '../../../public/illustration-empty.svg';

type NoProductProps = {
	renderTextBelow?: () => JSX.Element;
	className?: string;
};

const EmptyMessageScreen = (props: NoProductProps) => {
	return (
		<div className={`custom-nothingHereScreen ${props.className}`}>
			<Image
				className={'custom-nothingHereImage'}
				src={EmptyImage}
				alt='EmptyMessageScreen'
			/>
			{props.renderTextBelow?.()}
		</div>
	);
};
export default EmptyMessageScreen;
