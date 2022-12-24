import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import styles from './AuthForm.module.scss';
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
	} = useForm<FormData>({
		defaultValues: {
			username: null,
			email: null,
			password: null,
		},
	});

	const { isLogin } = props;

	const formFields = useMemo(() => getFields(isLogin), [isLogin]);

	return (
		<form
			className={styles.authForm}
			onSubmit={handleSubmit((data) => console.log(data))}
		>
			{formFields.map((field) => (
				<div key={field.id} className={styles.inputWrapper}>
					<label htmlFor={field.id}>{field.label}</label>
					<Input
						id={field.id}
						type={field.type}
						placeholder={field.placeholder}
						className={styles.inputBox}
						{...register(field.id as keyof FormData)}
					/>
				</div>
			))}
			<Button
				text={'Login'}
				onClick={() => console.log('')}
				className={styles.submitButton}
			/>
		</form>
	);
};

export default AuthForm;
