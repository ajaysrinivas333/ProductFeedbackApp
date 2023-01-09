import React, { Fragment } from 'react';

interface InputProps {
	helperProps?: { helperText?: string; helperTextClass?: string };
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
		const inputClasses = `${inputProps.className} customInputBox`;
		const helperTextClasses = `${helperProps?.helperTextClass} customInputBoxHelperText`;
		return (
			<div className='customInputWrapper'>
				<input
					{...inputProps}
					{...restProps}
					className={inputClasses}
					ref={ref}
				/>
				{helperProps?.helperText ? (
					<small className={helperTextClasses}>{helperProps?.helperText}</small>
				) : (
					''
				)}
			</div>
		);
	},
);

Input.displayName = 'Input';

export default Input;
