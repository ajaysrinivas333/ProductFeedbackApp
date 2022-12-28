export const withDelay = (fn: () => void, delay: number = 200) => {
	const timer = setTimeout(() => fn(), delay);
	return timer;
};
