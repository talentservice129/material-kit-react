import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useMutation } from 'react-query'
import { useFormik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Alert, Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';
import { useState } from 'react';

import { resetPassword } from '~/utils/api/auth';

const ResetPassword = () => {
	const router = useRouter();
	const { mutate: resetPasswordMutation } = useMutation(resetPassword, {
		onSuccess: () => {
			formik.setSubmitting(false);
			setSuccess(true);
		},
		onError: (err) => {
			formik.setErrors({
				token: 'Invalid Token'
			});
			formik.setSubmitting(false);
		}
	});
	const formik = useFormik({
		initialValues: {
			password: '',
			passwordConfirm: ''
		},
		validationSchema: Yup.object({
			password: Yup
				.string()
				.max(255)
				.required('Password is required'),
			passwordConfirm: Yup
				.string()
				.max(255)
				.oneOf([Yup.ref("password")], "Both password need to be the sames")
				.required('Enter password again for confirmation'),
		}),
		onSubmit: () => {
			resetPasswordMutation({
				token: router.query.token,
				password: formik.values.password
			})
		}
	});
	const [success, setSuccess] = useState(false);

	return (
		<>
			<Head>
				<title>Reset password | PPenca</title>
			</Head>
			<Box
				component="main"
				sx={{
					alignItems: 'center',
					display: 'flex',
					flexGrow: 1,
					minHeight: '100%'
				}}
			>
				<Container maxWidth="sm">
					<form onSubmit={formik.handleSubmit}>
						<Box sx={{ my: 3 }}>
							<Typography
								color="textPrimary"
								variant="h4"
							>
								Reset password
							</Typography>
						</Box>
						{success ?
							<Typography
								color="textSecondary"
								variant="body2"
							>
								Password is reset successfully
								{' '}
								<NextLink
									href="/auth/login"
								>
									<Link
										to="/login"
										variant="subtitle2"
										underline="hover"
										sx={{
											cursor: 'pointer'
										}}
									>
										Sign In
									</Link>
								</NextLink>
							</Typography>

						:
						<>
							{ formik.errors.token &&
							<Alert variant="filled" severity="error" sx={{ mb: 2 }}>
								{formik.errors.token}
							</Alert>
							}
							<TextField
								error={Boolean(formik.touched.password && formik.errors.password)}
								fullWidth
								helperText={formik.touched.password && formik.errors.password}
								label="Password"
								margin="normal"
								name="password"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="password"
								value={formik.values.password}
								variant="outlined"
							/>
							<TextField
								error={Boolean(formik.touched.passwordConfirm && formik.errors.passwordConfirm)}
								fullWidth
								helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
								label="Password Confirmation"
								margin="normal"
								name="passwordConfirm"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="password"
								value={formik.values.passwordConfirm}
								variant="outlined"
							/>
							<Box sx={{ py: 2 }}>
								<Button
									color="primary"
									disabled={formik.isSubmitting}
									fullWidth
									size="large"
									type="submit"
									variant="contained"
								>
									Reset Password
								</Button>
							</Box>
						</>
						}
					</form>
				</Container>
			</Box>
		</>
	);
};

export const getServerSideProps = async (context) => {
	const session = await getSession(context);

	if ( session ) {
		return {
			redirect: {
				destination: '/'
			}
		}
	}
	
	return {
		props: {}
	};
};

export default ResetPassword;
