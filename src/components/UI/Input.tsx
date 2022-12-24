import React, { Fragment } from 'react';

interface InputProps {
	className?: string;
	placeholder?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	style?: React.CSSProperties;
	helperText?: string;
	helperTextClass?: string;
	id?: string;
  type?:string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(props: InputProps, ref) => {
		return (
			<Fragment>
				<input {...props} ref={ref} id={props.id} />
				<br />
				<small className={props.helperTextClass}>{props.helperText}</small>
			</Fragment>
		);
	},
);

Input.displayName = 'Input';

export default Input;
