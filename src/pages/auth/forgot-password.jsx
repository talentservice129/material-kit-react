import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useFormik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';
import { useMutation } from 'react-query';

import { requestForgotPassword } from '~/utils/api/auth';

const ForgotPassword = () => {
	const { mutate: forgotPassword } = useMutation(requestForgotPassword, {
		onSuccess: () => {
			formik.setSubmitting(false);
		},
		onError: (err) => {
			formik.setErrors({
				email: 'Unregistered email address'
			});
			formik.setSubmitting(false);
		}
	});
	const formik = useFormik({
		initialValues: {
			email: ''
		},
		validationSchema: Yup.object({
			email: Yup
				.string()
				.email()
				.max(255)
				.required(
					'Email Address is required'),
		}),
		onSubmit: () => {
			forgotPassword( formik.values.email )
		}
	});

	return (
		<>
			<Head>
				<title>Forgot Password | PPenca</title>
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
								Forgot password
							</Typography>
							<Typography
								color="textSecondary"
								gutterBottom
								variant="body2"
							>
								Please send us your email address.
							</Typography>
						</Box>
						<TextField
							error={Boolean(formik.touched.email && formik.errors.email)}
							fullWidth
							helperText={formik.touched.email && formik.errors.email}
							label="Email"
							margin="normal"
							name="email"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="email"
							value={formik.values.email}
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
								Send Request
							</Button>
						</Box>
						<Typography
							color="textSecondary"
							variant="body2"
						>
							Remembered it?
							{' '}
							<NextLink
								href="/auth/login"
							>
								<Link
									to="/;pgom"
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

export default ForgotPassword;
