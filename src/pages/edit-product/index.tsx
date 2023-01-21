import Card from 'components/UI/Card';
import React, {
	cloneElement,
	Fragment,
	isValidElement,
	useEffect,
	useState,
} from 'react';
import styles from '../../styles/addproduct.module.scss';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsVectorPen } from 'react-icons/bs';
import ProductForm, { FormData } from 'components/Product/ProductForm';
import { NextPage } from 'next';
import Link from 'next/link';
import ClientAuthGuard from 'components/Auth/AuthGuard';
import { useRouter } from 'next/router';

const EditProductPage: NextPage = () => {
	return (
		<ProductIdentityCheckWrapper>
			<Form />
		</ProductIdentityCheckWrapper>
	);
};

type FormProps = {
	product?: FormData;
};

// this product prop is passed via wrapper component
const Form = ({ product }: FormProps) => {
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
					<ProductForm mode='edit' formData={product} />
				</Card>
			</div>
		</div>
	);
};

const ProductIdentityCheckWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const router = useRouter();
	const [product, setProduct] = useState<FormData>({} as FormData);

	useEffect(() => {
		async function fetchProduct() {
			const res = await (
				await fetch(`/api/private/product/${router.query?.productId}`)
			).json();
			res.ok ? setProduct(res.product) : router.replace('/home');
		}
		if (router.query?.productId) {
			fetchProduct();
		}
	}, [router.query?.productId, router]);
	return (
		<ClientAuthGuard>
			{React.Children.map(children, (child) =>
				isValidElement(child) ? (
					<Fragment>
						{cloneElement(child, { ...child.props, product })}
					</Fragment>
				) : null,
			)}
		</ClientAuthGuard>
	);
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	try {
// 		const session = await getSession(context);
// 		if (!session) throw new Error('Auth failed');
// 		await connectDb();
// 		const productDetails = await Product.findOne({
// 			_id: context?.query?.productId,
// 			userId: session.user.id,
// 		});
// 		if (!productDetails) throw new Error('No product found');
// 		return {
// 			props: {
// 				productDetails: JSON.parse(JSON.stringify(productDetails)),
// 			},
// 		};
// 	} catch (error) {
// 		console.log(error);
// 		return {
// 			redirect: {
// 				destination: '/auth',
// 				permanent: false,
// 			},
// 		};
// 	}
// };

export default EditProductPage;
