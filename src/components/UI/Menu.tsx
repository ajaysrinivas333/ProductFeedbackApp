import React, { useEffect, useRef } from 'react';

interface MenuGenericProps {
	className?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}

interface MenuContainerProps extends MenuGenericProps {}

export const MenuContainer: React.FC<MenuContainerProps> = ({
	children,
	className,
	style,
}: MenuContainerProps) => {
	const classes = `custom-menu-container ${className ?? ''}`;
	return (
		<div style={style} className={classes}>
			{children}
		</div>
	);
};

interface MenuProps extends MenuGenericProps {
	open: boolean;
	onBlur?: () => void;
}

export const Menu: React.FC<MenuProps> = ({
	children,
	className,
	open,
	onBlur,
}: MenuProps) => {
	const classes = `custom-menu ${open ? 'open' : ''} ${className ?? ''}`;

	const menuRef = useRef<HTMLDivElement | null>(null);

	const { current } = menuRef;

	useEffect(() => {
		if (current) {
			current?.focus();
		}
	}, [current, open]);

	return (
		<div ref={menuRef} onBlur={onBlur} tabIndex={0} className={classes}>
			{children}
		</div>
	);
};

interface MenuItemProps extends MenuGenericProps {}

export const MenuItem: React.FC<MenuItemProps> = ({
	children,
	className,
}: MenuItemProps) => {
	const classes = `custom-menu-item ${className ?? ''}`;
	return <span className={classes}>{children}</span>;
};
