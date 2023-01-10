import { NextApiRequest, NextApiResponse } from 'next';
import User from '@api/models/user';
import bcrypt from 'bcrypt';
import { EMAIL_REGEX } from '@api/constants';
import connectDb from '@api/db/connection';
import { APIResponse } from '@api/types';

type UserData = {
	id: string;
	email: string;
	username: string;
};

interface UserSignupResponse extends APIResponse {
	user?: UserData;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserSignupResponse>,
) {
	if (req.method === 'POST') {
		try {
			await connectDb();

			if (!req?.body.username || req.body?.username?.trim().length < 2)
				throw new Error('Username should be atleast 2 characters long');

			if (!req?.body.email || !EMAIL_REGEX.test(req.body?.email))
				throw new Error('Invalid Email entered');

			if (!req?.body.password || req.body?.password?.trim().length < 8)
				throw new Error('Password should be atleast 8 characters long');

			if (await User.exists({ email: req.body?.email }))
				throw new Error('User already exists');

			const hash = await bcrypt.hash(req.body?.password, 5);

			const newUser = await User.create({
				email: req.body?.email,
				password: hash,
				username: req.body?.username,
			});

			res.status(201).json({
				ok: true,
				message: 'User created successfully',
				user: {
					email: newUser.email,
					username: newUser.username,
					id: newUser._id,
				},
			});
		} catch (ex: any) {
			res.status(400).json({ ok: false, message: ex?.message });
		}
	} else {
		res.status(400).json({ ok: false, message: 'Method not allowed' });
	}
}
