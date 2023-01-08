import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/addproduct.module.scss';
import Input from 'components/UI/Input';
import { useForm } from 'react-hook-form';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsChevronDown, BsPlusCircleFill } from 'react-icons/bs';
import { Menu, MenuContainer, MenuItem } from 'components/UI/Menu';
import { productCategories } from 'lib/constants';
import { TiTick } from 'react-icons/ti';
import useMenu from '../../hooks/use-menu';

const AddProductPage = () => {
	const { open, openMenu, closeMenu } = useMenu();
	const { handleSubmit } = useForm();
	return (
		<div className={styles.addProductContainer}>
			<div className={styles.innerContainer}>
				<div className={styles.backButtonWrapper}>
					<BiChevronLeft className={styles.backIcon} />
					<Button className={styles.backButton} text='Go Back' />
				</div>
				<Card className={styles.addProductCard}>
					<BsPlusCircleFill className={styles.plusButton} />
					<form onSubmit={handleSubmit((d) => console.log(d))}>
						<div className={styles.addProductWrapper}>
							<header className={styles.header}>Create New Product</header>
							<span className={styles.fieldName}>Product Title</span>
							<label>Add a short, descriptive headline</label>
							<Input
								inputProps={{
									type: 'text',
									placeholder: 'Product Description',
									className: styles.inputBox,
								}}
							/>
							<span className={styles.fieldName}>Category</span>
							<label>Choose a category for your Product</label>

							<MenuContainer className={styles.dropdownContainer}>
								<button className={styles.dropdown} onClick={openMenu}>
									<span>{'Category'}</span>
									<BsChevronDown />
								</button>
								<Menu className={styles.menu} open={open} onBlur={closeMenu}>
									{productCategories.map((category) => (
										<MenuItem
											className={styles.menuItem}
											onClick={() => {}}
											key={category}
										>
											{category}
											<span className={'icon'}>{<TiTick />}</span>
										</MenuItem>
									))}
								</Menu>
							</MenuContainer>

							<span className={styles.fieldName}>Product Detail</span>
							<label>
								Include any specific details on what the Product is used for,
								etc.
							</label>

							<textarea className={styles.textArea}></textarea>
							<div className={styles.buttonLayout}>
								<Button className={styles.cancelButton} text='Cancel' />
								<Button className={styles.submitButton} text='Add Product' />
							</div>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default AddProductPage;
