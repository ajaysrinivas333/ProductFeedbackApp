export const userName = {
	label: 'Username',
	type: 'text',
	id: 'username',
	placeholder: 'John Doe',
};

export const fields = [
	{
		label: 'Email',
		type: 'email',
		id: 'email',
		placeholder: 'person@example.com',
	},
	{
		label: 'Password',
		type: 'password',
		id: 'password',
		placeholder: '********',
	},
];

const EMAIL_REGEX: RegExp =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const VALIDATORS = {
	email: {
		required: 'This field is required',
		pattern: {
			value: EMAIL_REGEX,
			message: 'Invalid Email',
		},
	},
	password: {
		required: 'This field is required',
		minLength: {
			value: 8,
			message: 'Password should be atleast 8 characters long',
		},
	},
	username: {
		required: 'This field is required',
		minLength: {
			value: 2,
			message: 'Username should be atleast 2 characters long',
		},
	},
};
