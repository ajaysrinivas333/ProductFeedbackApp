import { useState, useCallback } from 'react';
const useMenu = () => {
	const [open, setOpen] = useState<boolean>(false);
	const toggleMenu = useCallback(() => {
		setTimeout(() => setOpen(!open), 200);
	}, [open]);
	const openMenu = useCallback(() => {
		setTimeout(() => setOpen(true), 100);
	}, []);
	const closeMenu = useCallback(() => {
		setTimeout(() => setOpen(false), 100);
	}, []);

	return { open, toggleMenu, openMenu, closeMenu };
};

export default useMenu;
