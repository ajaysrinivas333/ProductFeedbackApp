export const withDelay = (fn: () => void, delay: number = 200) => {
	const timer = setTimeout(() => fn(), delay);
	return timer;
};

export const formatDate = (date: Date | string) => {
	const dateString = new Date(date)
		.toLocaleDateString('en-us', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		})
		.split(' ');
	const [month, day, year] = dateString;

	return [day.replace(',', ''), `${month},`, year].join(' ');
};
