import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../backend/models/user';
import connectDb from '../../../backend/db/connection';

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: {},
				password: {},
			},
			async authorize(
				credentials: Record<'email' | 'password', string> | undefined,
			) {
				try {
					await connectDb();
					//  Uncomment to test login with test credentials
					/* 
					if (
						credentials?.email === 'test@test.com' &&
						credentials?.password === 'password'
					) {
						return {
							id: 'test',
							email: 'test@test.com',
							image: 'random.png',
							name: 'test',
						};
					 }
					*/
					const user = await User.findOne({
						email: credentials?.email,
					});

					if (!user) throw new Error("User doesn't exist");

					const isPasswordMatch = await bcrypt.compare(
						credentials?.password as string,
						user.password,
					);

					if (!isPasswordMatch) throw new Error('Invalid credentials');

					return {
						id: user._id.toString(),
						email: user.email,
						image: user.avatar,
						name: user.userName,
					};
				} catch (err) {
					throw err;
				}
			},
		}),
	],
	pages: {
		signIn: '/auth',
	},
	callbacks: {
		async jwt(data) {
			if (data.user) {
				data.token['id'] = data.user.id;
			}
			return data.token;
		},

		async session(data) {
			if (data.session.user && data.token) {
				data.session.user.id = data.token.id;
			}
			return data.session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		maxAge: 60 * 60,
		/**
		 * How often the session should be updated in seconds.
		 * If set to `0`, session is updated every time.
		 */
		updateAge: 60 * 50,
	},
});
