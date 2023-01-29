import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { GenericProps } from './Menu';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  text: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    return (
      <button {...props} type={props.type ?? 'button'} ref={ref}>
        {props.text}
      </button>
    );
  }
);
interface ButtonWithChildProps
  extends GenericProps,
    Omit<ButtonProps, 'text'> {}

export const ButtonWithChild = React.forwardRef<
  HTMLButtonElement,
  ButtonWithChildProps
>((props: ButtonWithChildProps, ref) => {
  return (
    <button {...props} type={props.type ?? 'button'} ref={ref}>
      {props.children}
    </button>
  );
});

Button.displayName = 'Button';
ButtonWithChild.displayName = 'ButtonWithChild';

export default Button;
