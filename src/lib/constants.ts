import { Feedback } from "components/Feedback/FeedbackCard";

export const productCategories = [
	'All',
	'Productivity',
	'Shopping',
	'Communication',
	'Music & Audio',
	'Entertainment',
	'Business',
	'Social',
	'Finance',
];

export const feedbackCategories = [
	'All',
	'UI',
	'UX',
	'Bug',
	'Feature',
	'Enhancement',
];

export const productSortOptions: string[] = [
	'Most Feedbacks',
	'Least Feedbacks',
	'Newest First',
	'Oldest First',
];

export const feedbackSortOptions: string[] = [
	'Most Comments',
	'Least Comments',
	'Most Upvotes',
	'Least Upvotes',
	'Newest First',
	'Oldest First',
];

export const tabList: string[] = ['Planned', 'In-Progress', 'Live'];

export const statusCount = (feedbacks: Feedback[]) =>
	tabList.reduce(
		(ac, cr) => ({
			...ac,
			[cr]: feedbacks?.filter((item) => item.status === cr).length,
		}),
		{},
	);