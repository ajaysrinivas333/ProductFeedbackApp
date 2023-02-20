import Button from 'components/UI/Button';
import Card from 'components/UI/Card';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../../styles/add-comment-form.module.scss';

type CommentFormProps = {
	className?: string;
	style?: React.CSSProperties;
};

type CommentFormData = {
	comment: string | null;
};

const commentValidations = {
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

const AddCommentForm = (props: CommentFormProps) => {
	const classes = `${styles.addCommentForm} ${props?.className ?? ''}`;
	const [charactersLeft, setCharactersLeft] = useState<number>(250);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CommentFormData>({
		mode: 'onTouched',
		defaultValues: {
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
		<Card className={classes}>
			<h3>Add Comment</h3>
			<form onSubmit={handleSubmit(console.log)}>
				<textarea
					placeholder='Write something nice!'
					maxLength={250}
					{...register('comment', commentValidations)}
				/>
				{errors.comment ? (
					<span className={styles.commentError}>
						{errors?.comment?.message! ?? '12'}
					</span>
				) : (
					''
				)}

				<div className={styles.formFooter}>
					<span className={styles.charactersLeft}>
						{charactersLeft} Characters left
					</span>

					<Button text='Post Comment' className={styles.postCommentBtn} />
				</div>
			</form>
		</Card>
	);
};

export default AddCommentForm;
