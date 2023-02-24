import { CommentDoc } from 'types';

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

export const getUserNameFromEmail = (email: string) =>
	email?.split('@')[0]?.toLowerCase();

export const revalidatePage = async (url: string) =>
	fetch(`/api/revalidate?url=${url}`);

export const makeUrl = (url: string = '') =>
	url.startsWith('https://') || url.startsWith('http://')
		? url
		: `http://${url}`;

export const debounce = <T>(fn: Function, delay: number) => {
	let timer: NodeJS.Timeout | null;
	return (...args: T[]) => {
		timer && clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
};

export const getFeedbackText = (count: number) => {
	switch (count) {
		case 0:
			return `No Feedbacks`;
		case 1:
			return `${count} Feedback`;
		default:
			return `${count} Feedbacks`;
	}
};

export const makeCommentTree = (comments: CommentDoc[]) => {
	comments
		.filter((c) => c.parentId)
		.forEach((comment) => {
			const parent = comments.find((c) => c._id === comment.parentId);

			if (parent && parent['replies']) {
				parent['replies'].push(comment);
			}

			if (parent && !parent['replies']) {
				parent['replies'] = [comment];
			}
		});
	return comments.filter((c) => !c.parentId);
};
