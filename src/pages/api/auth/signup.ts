import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../backend/models/user';
import bcrypt from 'bcrypt';
import { EMAIL_REGEX } from '../../../backend/constants';
import connectDb from '../../../backend/db/connection';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await connectDb();

      if (req.body?.username?.trim().length < 2)
        throw new Error('Username should be atleast 2 characters long');

      if (!EMAIL_REGEX.test(req.body?.email))
        throw new Error('Invalid Email entered');

      if (req.body?.password?.trim().length < 8)
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
    res.status(400).json({ message: 'Method not allowed' });
  }
}
