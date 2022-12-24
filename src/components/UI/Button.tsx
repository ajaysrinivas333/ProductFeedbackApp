import React from 'react';

interface ButtonProps {
	onClick?: () => void;
    className?: string;
    style?:React.CSSProperties,
    disabled?: boolean,
	text:string,
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props: ButtonProps, ref) => {
		return <button {...props} ref={ref}>{props.text}</button>;
	},
);

Button.displayName = 'Button';

export default Button;
