import GlobalLoader from 'components/UI/GlobalLoader';
import useAuth from 'hooks/use-auth';
import Router from 'next/router';
import React, { Fragment, useEffect } from 'react';

type ClientAuthGuardProps = {
	children: React.ReactNode;
};

const ClientAuthGuard = ({ children }: ClientAuthGuardProps) => {
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			Router.replace('/auth');
		}
	}, [isAuthenticated, isLoading]);

	if (isLoading) return <GlobalLoader />;

	if (!isLoading && isAuthenticated) {
		return <Fragment> {children}</Fragment>;
	}

	return null;
};

export default ClientAuthGuard;
