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
