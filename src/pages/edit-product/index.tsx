import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/addproduct.module.scss';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsVectorPen } from 'react-icons/bs';
import ProductForm, { FormData } from 'components/Product/ProductForm';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import connectDb from '@api/db/connection';
import Product from '@api/models/product';

type EditProductPageProps = {
	productDetails: FormData;
};

const EditProductPage: NextPage<EditProductPageProps> = ({
	productDetails,
}: EditProductPageProps) => {
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
					<BsVectorPen className={styles.editButton} />
					<ProductForm mode='edit' formData={productDetails} />
				</Card>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		const session = await getSession(context);
		if (!session) throw new Error('Auth failed');
		await connectDb();
		const productDetails = await Product.findOne({
			_id: context?.query?.productId,
			userId: session.user.id,
		});
		if (!productDetails) throw new Error('No product found');
		return {
			props: {
				productDetails: JSON.parse(JSON.stringify(productDetails)),
			},
		};
	} catch (error) {
		console.log(error);
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}
};

export default EditProductPage;
