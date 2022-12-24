import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import styles from './AuthForm.module.scss';
import { VALIDATORS } from './constants';
import { getFields } from './helper';

interface FormData {
	username?: string | null;
	email: string | null;
	password: string | null;
}

interface AuthFormProps {
	isLogin: boolean;
}

const AuthForm = (props: AuthFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		mode: 'onTouched',
		defaultValues: {
			username: null,
			email: null,
			password: null,
		},
	});

	const { isLogin } = props;

	const formFields = useMemo(() => getFields(isLogin), [isLogin]);

	useEffect(() => {
		reset();
	}, [reset, isLogin]);


	const submitHandler = (data:FormData) => {
		// TODO: Call signup or signin api accordingly
		console.log(data);
	}

	return (
		<form
			className={styles.authForm}
			onSubmit={handleSubmit((data) => console.log({ data }))}
		>
			{formFields.map((field) => (
				<div key={field.id} className={styles.inputWrapper}>
					<label htmlFor={field.id}>{field.label}</label>
					<Input
						inputProps={{
							id: field.id,
							type: field.type,
							placeholder: field.placeholder,
							className: styles.inputBox,
						}}
						helperProps={{
							helperText: errors[field.id as keyof FormData]?.message ?? '',
							helperTextClass: `${styles.inputBoxHelper} ${
								errors[field.id as keyof FormData] ? styles.error : ''
							}`,
						}}
						{...register(
							field.id as keyof FormData,
							VALIDATORS[field.id as keyof FormData],
						)}
					/>
				</div>
			))}

			<Button
				text={isLogin ? 'Login' : 'Sign Up'}
				className={styles.submitButton}
			/>
		</form>
	);
};

export default AuthForm;
