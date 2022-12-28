import React, { useEffect, useRef, useState, useMemo } from 'react';

export interface GenericProps {
	className?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}

interface MenuContainerProps extends GenericProps {}

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

interface MenuProps extends GenericProps {
	open: boolean;
	onBlur?: () => void;
}

export const Menu: React.FC<MenuProps> = ({
	children,
	className,
	open,
	onBlur,
}: MenuProps) => {
	const MENU_CLOSE_CLASS: string = useMemo<string>(
		() => `custom-menu ${className ?? ''}`,
		[className],
	);

	const MENU_OPEN_CLASS: string = useMemo<string>(
		() => `custom-menu ${className ?? ''} ${open ? 'open' : ''}`,
		[className, open],
	);

	const [menuClass, setMenuClass] = useState<string>(MENU_CLOSE_CLASS);

	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const { current } = menuRef;
		if (open && current) {
			current?.focus();
			setMenuClass(() => MENU_OPEN_CLASS);
		}
		return () => setMenuClass(() => MENU_CLOSE_CLASS);
	}, [open, MENU_CLOSE_CLASS, MENU_OPEN_CLASS]);

	return (
		<div ref={menuRef} onBlur={onBlur} tabIndex={0} className={menuClass}>
			{children}
		</div>
	);
};

interface MenuItemProps extends GenericProps {}

export const MenuItem: React.FC<MenuItemProps> = ({
	children,
	className,
}: MenuItemProps) => {
	const classes = `custom-menu-item ${className ?? ''}`;
	return <span className={classes}>{children}</span>;
};
