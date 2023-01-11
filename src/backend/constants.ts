export const EMAIL_REGEX: RegExp =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export enum PRODUCT_CATEGORIES {
	'Productivity' = 'Productivity',
	'Shopping' = 'Shopping',
	'Communication' = 'Communication',
	'Music and Audio' = 'Music & Audio',
	'Entertainment' = 'Entertainment',
	'Business' = 'Business',
	'Social' = 'Social',
	'Finance' = 'Finance',
}

export enum FEEDBACK_STATUS {
	PLANNED = 'Planned',
	INPROGRESS = 'In-Progress',
	LIVE = 'Live',
	REQUESTED = 'Requested',
}
export enum FEEDBACK_CATEGORIES {
	'UI' = 'UI',
	'UX' = 'UX',
	'Enhancement' = 'Enhancement',
	'Bug' = 'Bug',
	'Feature' = 'Feature',
}
