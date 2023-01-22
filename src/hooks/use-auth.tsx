import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

const useAuth = () => {
	const { status } = useSession();

	const isAuthenticated = useMemo(() => status === 'authenticated', [status]);

	const isLoading = useMemo(() => status === 'loading', [status]);

	return { isAuthenticated, isLoading };
};

export default useAuth;
