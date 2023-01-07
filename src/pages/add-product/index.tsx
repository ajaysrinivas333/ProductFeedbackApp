import { Product } from '@api/types';
import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/addproduct.module.scss';
import Input from 'components/UI/Input';
import { useForm } from 'react-hook-form';
import Button from 'components/UI/Button';
import { BiChevronLeft } from 'react-icons/bi';
import { BsPlusCircleFill } from 'react-icons/bs';

const AddProductPage = () => {
  return (
    <div className={styles.addProductContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.backButtonWrapper}>
          <BiChevronLeft className={styles.backIcon} />
          <Button className={styles.backButton} text='Go Back' />
        </div>
        <Card className={styles.addProductCard}>
          <BsPlusCircleFill className={styles.plusButton} />
          <form>
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
              <select className={styles.dropdown} name='category' id='category'>
                <option value='Shopping'>Shopping</option>
                <option value='Music & Audio'>Music & Audio</option>
                <option value='Productivity'>Productivity</option>
                <option value='Business'>Business</option>
              </select>
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
