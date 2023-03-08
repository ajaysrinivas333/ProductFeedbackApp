import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

const useAuth = () => {
	const { data: session, status } = useSession();

	const isAuthenticated = useMemo(() => status === 'authenticated', [status]);

	const isLoading = useMemo(() => status === 'loading', [status]);

	const user = useMemo(
		() => (isAuthenticated ? session?.user : null),
		[isAuthenticated, session?.user],
	);

	return { isAuthenticated, isLoading, user };
};

export default useAuth;
