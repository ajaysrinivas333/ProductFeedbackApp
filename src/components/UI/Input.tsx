import React,{Fragment} from 'react'

interface InputProps {
  className?: string;
  placeholder?: string;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  value?: string;
  helperText?: string;
  helperTextClass?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => {
    return (
      <Fragment>
        <input
          className={props.className}
          onChange={props.changeHandler}
          placeholder={props.placeholder}
          ref={ref}
          style={props.style}
          value={props.value ?? ""}
        />
        <br />
        <small className={props.helperTextClass}>{props.helperText}</small>
      </Fragment>
    );
  }
);

Input.displayName = "Input"

export default Input