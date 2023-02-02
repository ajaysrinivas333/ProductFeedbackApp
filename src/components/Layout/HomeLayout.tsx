import React from 'react';
import styles from 'styles/home-layout.module.scss';

export const SideLayout = (props: any) => {
	return <aside className={styles.sideLayout}>{props.children}</aside>;
};

export const ContentLayout = (props: any) => {
	return <section className={styles.contentLayout}>{props.children}</section>;
};

export const MainLayout = (props: any) => {
	return <main className={styles.mainLayout}>{props.children}</main>;
};
