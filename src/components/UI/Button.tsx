import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

interface ButtonProps {
	onClick?: () => void;
	className?: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	text: string;
	type?:'submit' | 'reset' | 'button' | undefined;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props: ButtonProps, ref) => {
		return (
			<button {...props} type={props.type}  ref={ref}>
				{props.text}
			</button>
		);
	},
);

Button.displayName = 'Button';

export default Button;
