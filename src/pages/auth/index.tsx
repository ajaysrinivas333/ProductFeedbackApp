import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import styles from '../../styles/auth.module.scss';
import type { GetServerSideProps, NextPage } from 'next';
import AuthForm from '../../components/Auth/AuthForm';
import Avatar from '../../components/UI/Avatar';
import { getSession } from 'next-auth/react';

const AuthPage: NextPage = () => {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const loginStyleClass: string = isLogin
		? `${styles.active} ${styles.login}`
		: `${styles.login}`;
	const signupStyleClass: string = !isLogin
		? `${styles.active} ${styles.signup}`
		: `${styles.signup}`;

	const activeTabClass: string = isLogin
		? `${styles.activeTab}`
		: `${styles.activeTab} ${styles.isSignUp}`;

	const loginTabHandler = (): void => setIsLogin(true);
	const signupTabHandler = (): void => setIsLogin(false);

	return (
		<div className={styles.wrapper}>
			<Card className={styles['auth-container']}>
				<div className={styles['avatar-wrapper']}>
					<Avatar slug='aut' height={80} width={80} />
				</div>
				<div className={styles['actions-wrapper']}>
					<div className={styles['actions-switch']}>
						<span onClick={loginTabHandler} className={loginStyleClass}>
							Login
						</span>
						<span onClick={signupTabHandler} className={signupStyleClass}>
							Signup
						</span>
					</div>
					<span className={activeTabClass}></span>
					<hr />
				</div>
				{isLogin ? <AuthForm isLogin /> : <AuthForm isLogin={false} />}
			</Card>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session) {
		return {
			props: {},
		};
	}
	return {
		redirect: {
			destination: '/',
			permanent: false,
		},
	};
};

export default AuthPage;
