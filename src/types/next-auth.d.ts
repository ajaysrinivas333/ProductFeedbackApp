import { User, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface User {
		id?: string | undefined;
	}
	interface Session {
		user: User;
	}
	interface JWT {
		id?: string | undefined;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id?: string | undefined;
	}
}
