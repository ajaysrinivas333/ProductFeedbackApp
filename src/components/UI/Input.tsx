import React, { Fragment } from 'react';

interface InputProps {
	helperProps: { helperText?: string; helperTextClass?: string };
	inputProps: {
		className?: string;
		placeholder?: string;
		onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
		style?: React.CSSProperties;
		id?: string;
		type?: string;
	};
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(props: InputProps, ref) => {
		const { helperProps, inputProps, ...restProps } = props;
		return (
			<Fragment>
				<input {...inputProps} {...restProps} ref={ref} />
				<br />
				<small className={helperProps.helperTextClass}>
					{helperProps.helperText}
				</small>
			</Fragment>
		);
	},
);

Input.displayName = 'Input';

export default Input;
