import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import styles from './auth.module.scss';
import type { NextPage } from 'next';

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
        <div className={styles['avatar-wrapper']}></div>
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

        {/* <AuthForm></AuthForm> */}
      </Card>
    </div>
  );
};

export default AuthPage;
