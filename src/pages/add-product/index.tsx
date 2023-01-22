import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/addproduct.module.scss';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsPlus } from 'react-icons/bs';
import ProductForm from 'components/Product/ProductForm';
import Link from 'next/link';
import ClientAuthGuard from 'components/Auth/AuthGuard';

const AddProductPage = () => {
	return (
		<ClientAuthGuard>
			<div className={styles.addProductContainer}>
				<div className={styles.innerContainer}>
					<div className={styles.backButtonWrapper}>
						<BiChevronLeft className={styles.backIcon} />
						<Link style={{ width: '100%' }} href={'/home'}>
							<Button className={styles.backButton} text='Go Back' />
						</Link>
					</div>
					<Card className={styles.addProductCard}>
						<BsPlus className={styles.plusButton} />
						<ProductForm mode='create' />
					</Card>
				</div>
			</div>
		</ClientAuthGuard>
	);
};

export default AddProductPage;
