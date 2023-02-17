import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GenericProps } from './Menu';

interface DrawerProps extends GenericProps {
	open: boolean;
	onBlur: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
	children,
	className,
	open,
	onBlur,
}: DrawerProps) => {
	const DRAWER_CLOSE_CLASS: string = useMemo<string>(
		() => `custom-drawer ${className ?? ''}`,
		[className],
	);

	const DRAWER_OPEN_CLASS: string = useMemo<string>(
		() => `custom-drawer ${className ?? ''} ${open ? 'open' : ''}`,
		[className, open],
	);

	const [drawerClass, setDrawerClass] = useState<string>(DRAWER_CLOSE_CLASS);

	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const { current } = menuRef;
		if (open && current) {
			current?.focus();
			setDrawerClass(() => DRAWER_OPEN_CLASS);
		}
		return () => setDrawerClass(() => DRAWER_CLOSE_CLASS);
	}, [open, DRAWER_CLOSE_CLASS, DRAWER_OPEN_CLASS]);

	return (
		<div ref={menuRef} onBlur={onBlur} tabIndex={0} className={drawerClass}>
			{children}
		</div>
	);
};

export default React.memo(Drawer);
