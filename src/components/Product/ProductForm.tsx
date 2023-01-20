import { PRODUCT_CATEGORIES } from '@api/constants';
import Button from 'components/UI/Button';
import Input from 'components/UI/Input';
import { MenuContainer, Menu, MenuItem } from 'components/UI/Menu';
import useMenu from 'hooks/use-menu';
import { productCategories } from 'lib/constants';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsChevronDown } from 'react-icons/bs';
import { TiTick } from 'react-icons/ti';
import styles from '../../styles/product-form.module.scss';
import router from 'next/router';
import Link from 'next/link';

export type FormData = {
	name: string;
	category: keyof typeof PRODUCT_CATEGORIES | null;
	link?: string;
	description: string;
	_id?: string;
};

type ProductFormProps = {
	mode: 'create' | 'edit';
	formData?: FormData;
};

const ProductForm = (props: ProductFormProps) => {
	const { open, openMenu, closeMenu } = useMenu();
	const [category, setCategory] = useState<'Select' | FormData['category']>(
		props.formData?.category ?? 'Select',
	);
	const [closedWithMenuItem, setClosedWithMenuItem] = useState<boolean>(false);
	const [loader, setLoader] = useState<boolean>(false);
	const isCreateMode = props.mode === 'create';

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<FormData>({
		defaultValues: props.formData ?? {
			name: '',
			category: null,
			link: '',
			description: '',
		},
	});

	const onDropdownClick = () => {
		setClosedWithMenuItem(false);
		openMenu();
	};

	const categorySelect = (c: string) => {
		setClosedWithMenuItem(true);
		setCategory(c as FormData['category']);
		setValue('category', c as FormData['category']);
		closeMenu();
	};

	const formSubmit = async (data: FormData) => {
		setLoader(true);
		const baseUrl = '/api/private/product/';
		const apiUrl = isCreateMode ? baseUrl : baseUrl + props.formData?._id;
		const res = await fetch(apiUrl, {
			method: isCreateMode ? 'POST' : 'PATCH',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const json = await res.json();
		setLoader(false);
		json.ok ? router.push('/home') : alert(json?.message);
	};

	return (
		<form onSubmit={handleSubmit(formSubmit, console.log)}>
			<div className={styles.wrapper}>
				<header className={styles.formHeader}>
					{isCreateMode ? 'Create New Product' : 'Edit Product'}
				</header>
				<div className={styles.formControl}>
					<span className={styles.fieldName}>Product Name</span>
					<label>Add a short, descriptive headline</label>
					<Input
						{...register('name', {
							required: {
								value: true,
								message: 'This field is required',
							},
						})}
						inputProps={{
							type: 'text',
							placeholder: 'Product name',
							className: styles.inputBox,
						}}
						helperProps={{
							helperText: errors['name']?.message ?? '',
							helperTextClass: `${styles.inputBoxHelper} ${
								errors['name'] ? styles.error : ''
							}`,
						}}
					/>
				</div>
				<div className={styles.formControl}>
					<span className={styles.fieldName}>Category</span>
					<label>Choose a category for your Product...</label>

					<MenuContainer className={styles.menuContainer}>
						<button
							type='button'
							className={styles.dropdown}
							onClick={onDropdownClick}
							{...register('category', {
								required: {
									value: true,
									message: 'This field is required',
								},
							})}
						>
							<span>{category}</span>
							<BsChevronDown />
						</button>
						<Menu
							closedWithMenuItem={closedWithMenuItem}
							className={styles.menu}
							open={open}
							onBlur={closeMenu}
						>
							{productCategories.slice(1).map((c) => (
								<MenuItem
									className={styles.menuItem}
									onClick={() => categorySelect(c)}
									key={c}
								>
									{c}
									{c === category && (
										<span className={'icon'}>{<TiTick />}</span>
									)}
								</MenuItem>
							))}
						</Menu>
						{!open && category === 'Select' && errors.category && (
							<small
								className={`${styles.inputBoxHelper} ${
									errors['category'] ? styles.error : ''
								}`}
							>
								{errors['category']?.message ?? ''}
							</small>
						)}
					</MenuContainer>
				</div>
				<div className={styles.formControl}>
					<span className={styles.fieldName}>Link</span>
					<label>Provide a link where the product can be accessible...</label>
					<Input
						{...register('link', {})}
						inputProps={{
							type: 'text',
							placeholder: 'Product link',
							className: styles.inputBox,
						}}
					/>
				</div>
				<div className={styles.formControl}>
					<span className={`${styles.fieldName} ${styles.productDesc}`}>
						Product Detail
					</span>
					<label>
						Include any specific details on what the Product is used for, etc...
					</label>

					<textarea
						className={styles.textArea}
						{...register('description', {
							required: {
								value: true,
								message: 'This field is required',
							},
						})}
					/>
					{errors.description && (
						<small
							className={`${styles.inputBoxHelper} ${
								errors['description'] ? styles.error : ''
							}`}
						>
							{errors['description']?.message ?? ''}
						</small>
					)}
				</div>

				<div className={styles.buttonLayout}>
					<Link href={'/home'}>
						<Button
							type='button'
							className={styles.cancelButton}
							text='Cancel'
						/>
					</Link>
					<Button
						type='submit'
						disabled={loader}
						className={styles.submitButton}
						text={
							loader
								? isCreateMode
									? 'Adding...'
									: 'Updating...'
								: isCreateMode
								? 'Add Product'
								: 'Update Product'
						}
					/>
				</div>
			</div>
		</form>
	);
};

export default ProductForm;
