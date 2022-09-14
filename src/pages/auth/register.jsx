import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Autocomplete,
	Box,
	Button,
	Checkbox,
	Container,
	FormHelperText,
	Grid,
	Link,
	MenuItem,
	TextField,
	Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation } from 'react-query';

import { COUNTRIES } from '~/utils/constant';
import { registerUser } from '~/utils/api/auth';

const Register = () => {
	const router = useRouter();
	const { mutate: registerUserMutation } = useMutation( registerUser, {
		onSuccess: () => {
			router.push('/');
		},
		onError: (err) => {
			formik.setSubmitting(false);
			formik.setErrors({
				name: "Username is not correct",
				email: "Email address is not correct"
			});
		}
	} );
	const formik = useFormik({
		initialValues: {
			email: '',
			firstName: '',
			lastName: '',
			name: '',
			password: '',
			gender: 'male',
			country: 'ES'
			// policy: false,
		},
		validationSchema: Yup.object({
			email: Yup
				.string()
				.email(
					'Must be a valid email')
				.max(255)
				.required(
					'Email is required'),
			firstName: Yup
				.string()
				.max(255)
				.required(
					'First name is required'),
			lastName: Yup
				.string()
				.max(255)
				.required(
					'Last name is required'),
			name: Yup
				.string()
				.max(255)
				.required(
					'Username is required'),
			password: Yup
				.string()
				.max(255)
				.required(
					'Password is required'),
			country: Yup
				.string()
				.required(
					'Password is required'),
			// policy: Yup
			// 	.boolean()
			// 	.oneOf(
			// 		[true],
			// 		'This field must be checked'
			// 	)
		}),
		onSubmit: () => {
			registerUserMutation(formik.values);
		}
	});

	return (
		<>
			<Head>
				<title>
					Register | PPenca
				</title>
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
					<NextLink
						href="/"
						passHref
					>
						<Button
						component="a"
						startIcon={<ArrowBackIcon fontSize="small" />}
						>
						Dashboard
						</Button>
					</NextLink>
					<form onSubmit={formik.handleSubmit}>
						<Box sx={{ my: 3 }}>
							<Typography
								color="textPrimary"
								variant="h4"
							>
								Create a new account
							</Typography>
							<Typography
								color="textSecondary"
								gutterBottom
								variant="body2"
							>
								Use your email to create a new account
							</Typography>
						</Box>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								sm={6}
							>
								<TextField
									error={Boolean(formik.touched.firstName && formik.errors.firstName)}
									fullWidth
									helperText={formik.touched.firstName && formik.errors.firstName}
									label="First Name"
									margin="normal"
									name="firstName"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.firstName}
									variant="outlined"
								/>
							</Grid>
							<Grid
								item
								sm={6}
							>
								<TextField
									error={Boolean(formik.touched.lastName && formik.errors.lastName)}
									fullWidth
									helperText={formik.touched.lastName && formik.errors.lastName}
									label="Last Name"
									margin="normal"
									name="lastName"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.lastName}
									variant="outlined"
								/>
							</Grid>
						</Grid>
						<TextField
							error={Boolean(formik.touched.name && formik.errors.name)}
							fullWidth
							helperText={formik.touched.name && formik.errors.name}
							label="Username"
							margin="normal"
							name="name"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							value={formik.values.name}
							variant="outlined"
						/>
						<TextField
							error={Boolean(formik.touched.email && formik.errors.email)}
							fullWidth
							helperText={formik.touched.email && formik.errors.email}
							label="Email Address"
							margin="normal"
							name="email"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="email"
							value={formik.values.email}
							variant="outlined"
						/>
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
							fullWidth
							label="Gender"
							margin="normal"
							name="gender"
							variant="outlined"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							value={formik.values.gender}
							select
						>
							<MenuItem value="male">Male</MenuItem>
							<MenuItem value="female">Female</MenuItem>
						</TextField>
						<Autocomplete
							margin="normal"
							sx={{ marginTop: '1rem', marginBottom: '.5rem' }}
							options={COUNTRIES}
							autoHighlight
							getOptionLabel={(option) => option.label}
							onChange={(e, value) => formik.setFieldValue('country', value && value.code)}
							defaultValue={ COUNTRIES.find( (item) => item.code === formik.values.country ) }
							renderOption={(props, option) => (
								<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
									<img
										loading="lazy"
										width="20"
										src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
										srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
										alt=""
									/>
									{option.label} ({option.code})
								</Box>
							)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Choose a country"
									onBlur={formik.handleBlur}
									inputProps={{
										...params.inputProps,
										autoComplete: 'new-password', // disable autocomplete and autofill
									}}
								/>
							)}
						/>
						{/* <Box
							sx={{
								alignItems: 'center',
								display: 'flex',
								ml: -1
							}}
						>
							<Checkbox
								checked={formik.values.policy}
								name="policy"
								onChange={formik.handleChange}
							/>
							<Typography
								color="textSecondary"
								variant="body2"
							>
								I have read the
								{' '}
								<NextLink
									href="#"
									passHref
								>
									<Link
										color="primary"
										underline="always"
										variant="subtitle2"
									>
										Terms and Conditions
									</Link>
								</NextLink>
							</Typography>
						</Box>
						{Boolean(formik.touched.policy && formik.errors.policy) && (
							<FormHelperText error>
								{formik.errors.policy}
							</FormHelperText>
						)} */}
						<Box sx={{ py: 2 }}>
							<Button
								color="primary"
								disabled={formik.isSubmitting}
								fullWidth
								size="large"
								type="submit"
								variant="contained"
							>
								Sign Up Now
							</Button>
						</Box>
						<Typography
							color="textSecondary"
							variant="body2"
							sx={{ marginBottom: '1.5rem' }}
						>
							Have an account?
							{' '}
							<NextLink
								href="/auth/login"
								passHref
							>
								<Link
									variant="subtitle2"
									underline="hover"
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

export default Register;
