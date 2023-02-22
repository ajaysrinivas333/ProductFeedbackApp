import { Comment } from '@api/types';
import Button from 'components/UI/Button';
import Card from 'components/UI/Card';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../../styles/add-comment-form.module.scss';

type CommentFormData = {
	comment: string | null;
};
type CommentFormProps = {
	className?: string;
	style?: React.CSSProperties;
	onSubmit: (data: Pick<Comment, 'comment'>) => void;
	type?: 'New' | 'Reply';
	formValues?: CommentFormData;
};

export const commentValidations = {
	required: {
		value: true,
		message: 'This Field is required',
	},
	minLength: {
		value: 2,
		message: 'Comment should be atleast 2 character long',
	},
	maxLength: {
		value: 250,
		message: 'Comment cannot contain more than 250 characters',
	},
};

export const CommentForm = (props: CommentFormProps) => {
	const [charactersLeft, setCharactersLeft] = useState<number>(250);
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CommentFormData>({
		mode: 'onTouched',
		defaultValues: props?.formValues ?? {
			comment: null,
		},
	});

	const comment = watch('comment');

	useEffect(() => {
		if (comment !== null) {
			comment?.length < 250
				? setCharactersLeft((c) => 250 - comment.length)
				: setCharactersLeft(0);
		}
	}, [comment]);

	return (
		<form
			className={styles.commentForm}
			onSubmit={handleSubmit(props.onSubmit as (s: CommentFormData) => void)}
		>
			<textarea
				placeholder='Write something nice!'
				maxLength={250}
				{...register('comment', commentValidations)}
			/>
			{errors.comment ? (
				<span className={styles.commentError}>
					{errors?.comment?.message! ?? ''}
				</span>
			) : (
				''
			)}

			<div className={styles.formFooter}>
				<span className={styles.charactersLeft}>
					{charactersLeft} Characters left
				</span>

				<Button
					type='submit'
					text={`Post ${props.type === 'New' ? 'Comment' : 'Reply'}`}
					className={styles.postCommentBtn}
				/>
			</div>
		</form>
	);
};

const AddCommentForm = (props: CommentFormProps) => {
	const classes = `${styles.addCommentForm} ${props?.className ?? ''}`;

	return (
		<Card className={classes}>
			<h3>Add Comment</h3>
			<CommentForm onSubmit={props.onSubmit} type='New' />
		</Card>
	);
};

export default AddCommentForm;
