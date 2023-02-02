import Card from 'components/UI/Card';
import React, { Fragment } from 'react';
import { FeedbackCategoriesState, ProductCategoriesState } from 'types';

type CategoryType = ProductCategoriesState | FeedbackCategoriesState;

type CategoryProps = {
	categories: string[];
	onClick: (v: any) => void;
	activeCategory: CategoryType;
	styles: { readonly [key: string]: string };
	className?: string;
};

const CategoryItems = (props: CategoryProps) => {
	return (
		<Fragment>
			{props.categories?.map((category, i) => {
				return (
					<span
						onClick={() => props.onClick(category as ProductCategoriesState)}
						className={`${props.styles.category} ${
							category === props.activeCategory ? props.styles.active : ''
						}`}
						key={category}
					>
						{category}
					</span>
				);
			})}
		</Fragment>
	);
};

const Categories = (props: CategoryProps) => {
	const cardClasses = `${props.styles.sideCard} ${props?.className ?? ''}`;
	return (
		<Card className={cardClasses}>
			<CategoryItems
				styles={props.styles}
				categories={props.categories}
				onClick={props.onClick}
				activeCategory={props.activeCategory}
			/>
		</Card>
	);
};

export default Categories;
