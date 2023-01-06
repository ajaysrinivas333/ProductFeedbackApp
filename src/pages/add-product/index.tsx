import { Product } from '@api/types';
import Card from 'components/UI/Card';
import React from 'react';
import styles from '../../styles/addproduct.module.scss';
import Input from 'components/UI/Input';
import { useForm } from 'react-hook-form';
import Button from 'components/UI/Button';

const AddProductPage = () => {
  return (
    <div className={styles.addProductContainer}>
      <Card className={styles.addProductCard}>
        <form>
          <div className={styles.addProductWrapper}>
            <header className={styles.header}>Create New Feedback</header>
            <span className={styles.fieldName}>Feedback Title</span>
            <label>Add a short, descriptive headline</label>
            <Input
              inputProps={{
                type: 'text',
                placeholder: 'description',
                className: styles.inputBox,
              }}
            />
            <span className={styles.fieldName}>Category</span>
            <label>Choose a category for your feedback</label>
            <select className={styles.dropdown} name='category' id='category'>
              <option value='Shopping'>Shopping</option>
              <option value='Music & Audio'>Music & Audio</option>
              <option value='Productivity'>Productivity</option>
              <option value='Business'>Business</option>
            </select>
            <span className={styles.fieldName}>Feedback Detail</span>
            <label>
              Include any specific comments on what should be improved, added,
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
  );
};

export default AddProductPage;
