import React from 'react';
import Image from 'next/image';
import EmptyImage from '../../../public/illustration-empty.svg';

const NoProductsScreen = () => {
  return (
    <div className={'custom-nothingHereScreen'}>
      <Image
        className={'custom-nothingHereImage'}
        style={{}}
        src={EmptyImage}
        alt='NoProductsScreen'
      />
      <span>There is nothing here.</span>
      <span>
        Get started by clicking on <strong>Add Product</strong>
      </span>
    </div>
  );
};
// TODO rebase this to master branch before pushing
export default NoProductsScreen;
