import Link from 'next/link';
import React from 'react';
import { FiLogIn } from 'react-icons/fi';

const LoginText = ({ className }: { className?: string }) => {
	const classes = `loginTextWrapper ${className}`;
	return (
		<Link href={'/auth'} className={classes} role='button'>
			<FiLogIn />
			<span> Login</span>
		</Link>
	);
};

export default LoginText;
