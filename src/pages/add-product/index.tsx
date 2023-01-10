import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/addproduct.module.scss';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsPlusCircleFill } from 'react-icons/bs';
import ProductForm from 'components/Product/ProductForm';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

const AddProductPage = () => {
	return (
		<div className={styles.addProductContainer}>
			<div className={styles.innerContainer}>
				<div className={styles.backButtonWrapper}>
					<BiChevronLeft className={styles.backIcon} />
					<Link style={{ width: '100%' }} href={'/home'}>
						<Button className={styles.backButton} text='Go Back' />
					</Link>
				</div>
				<Card className={styles.addProductCard}>
					<BsPlusCircleFill className={styles.plusButton} />
					<ProductForm mode='create' />
				</Card>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};

export default AddProductPage;
