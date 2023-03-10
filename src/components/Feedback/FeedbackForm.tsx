import { FEEDBACK_CATEGORIES } from '@api/constants';
import Button from 'components/UI/Button';
import Input from 'components/UI/Input';
import { MenuContainer, Menu, MenuItem } from 'components/UI/Menu';
import useMenu from 'hooks/use-menu';
import { feedbackCategories } from 'lib/constants';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsChevronDown } from 'react-icons/bs';
import { TiTick } from 'react-icons/ti';
import styles from '../../styles/product-form.module.scss';
import Link from 'next/link';
import { revalidatePage } from 'lib';
import router from 'next/router';

export type FormData = {
	title: string;
	category: keyof typeof FEEDBACK_CATEGORIES | null;
	description: string;
	_id?: string;
};

type FeedbackFormProps = {
	mode: 'create' | 'edit';
	formData?: FormData;
};

type CategoryMenuProps = 'Select' | FormData['category'];

const FeedbackForm = (props: FeedbackFormProps) => {
	const { open, openMenu, closeMenu } = useMenu();
	const [category, setCategory] = useState<CategoryMenuProps>(
		props.formData?.category ?? 'Select',
	);
	const [closedWithMenuItem, setClosedWithMenuItem] = useState<boolean>(false);
	const [loader, setLoader] = useState<boolean>(false);
	const isCreateMode = props.mode === 'create';
	const { productId } = router?.query ?? '';
	const { id } = router?.query ?? '';

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		reset,
	} = useForm<FormData>({
		defaultValues: props.formData ?? {
			title: '',
			category: null,
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
		const baseUrl = '/api/private/feedback';
		const addFeedbackUrl = `?productId=${productId}`;
		const editFeedbackUrl = `?id=${id}`;
		const apiUrl = isCreateMode
			? baseUrl + addFeedbackUrl
			: baseUrl + editFeedbackUrl;
		const res = await fetch(apiUrl, {
			method: isCreateMode ? 'POST' : 'PATCH',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const json = await res.json();
		setLoader(false);

		if (json.ok) {
			await revalidatePage(`/feedbacks/${productId}`);
			// !done on purpose to trigger revalidation for discussion page router.push

			window.location.href = `/feedbacks/${productId}`;
		} else alert(json?.message);
	};

	useEffect(() => {
		reset(props.formData);
		setCategory((props.formData?.category as CategoryMenuProps) ?? 'Select');
	}, [props.formData, reset]);

	return (
		<form onSubmit={handleSubmit(formSubmit, console.log)}>
			<div className={styles.wrapper}>
				<header className={styles.formHeader}>
					{isCreateMode ? 'Create New Feedback' : 'Edit Feedback'}
				</header>
				<div className={styles.formControl}>
					<span className={styles.fieldName}>Feedback Title</span>
					<label>Add a short, descriptive headline</label>
					<Input
						{...register('title', {
							required: {
								value: true,
								message: 'This field is required',
							},
						})}
						inputProps={{
							type: 'text',
							placeholder: 'Feedback Title',
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
					<label>Choose a category for your feedback</label>

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
							{feedbackCategories.slice(1).map((c) => (
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
					<span className={`${styles.fieldName} ${styles.feedbackDesc}`}>
						Feedback Detail
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
					<Link href={`/feedbacks/${router.query.productId}`}>
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
								? 'Add Feedback'
								: 'Update Feedback'
						}
					/>
				</div>
			</div>
		</form>
	);
};

export default FeedbackForm;
