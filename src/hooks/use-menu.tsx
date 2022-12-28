import { useState, useCallback } from 'react';
import { withDelay } from '../lib';
const useMenu = () => {
	const [open, setOpen] = useState<boolean>(false);
	const openMenu = useCallback(() => {
		setOpen(true);
	}, []);
	const closeMenu = useCallback(() => {
		withDelay(() => setOpen(false));
	}, []);

	return { open, openMenu, closeMenu };
};

export default useMenu;
