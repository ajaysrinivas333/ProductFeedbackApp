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
	closedWithMenuItem?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
	children,
	className,
	open,
	onBlur,
	closedWithMenuItem,
	style,
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
		// *only triggers when the menu is closed by clicking menu item
		if (closedWithMenuItem) setMenuClass(MENU_CLOSE_CLASS);

		// !This was causing problems with menuclick close will be removed after monitoring for while.
		// return () => {
		// 	if (open && current) {
		// 		setMenuClass(() => MENU_CLOSE_CLASS);
		// 	}
		// };
	}, [open, MENU_CLOSE_CLASS, MENU_OPEN_CLASS, closedWithMenuItem]);

	// *only triggers when the clicked outside of menu component.
	const onBlurFn = () => {
		setMenuClass(MENU_CLOSE_CLASS);
		onBlur?.();
	};

	return (
		<div
			ref={menuRef}
			style={style}
			onBlur={onBlurFn}
			tabIndex={0}
			className={menuClass}
		>
			{children}
		</div>
	);
};

interface MenuItemProps extends GenericProps {
	onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
	children,
	className,
	onClick,
}: MenuItemProps) => {
	const classes = `custom-menu-item ${className ?? ''}`;
	return (
		<span onClick={onClick} className={classes}>
			{children}
		</span>
	);
};
