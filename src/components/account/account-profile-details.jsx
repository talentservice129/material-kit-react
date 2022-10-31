import { useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	MenuItem,
	TextField
} from '@mui/material';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { useFormik } from 'formik';
import { signOut } from 'next-auth/react';

import { updateUser } from '~/utils/api/auth';
import { COUNTRIES } from '~/utils/constant';

export const AccountProfileDetails = ({currentUser, ...props}) => {
	const { mutate: updateUserMutation } = useMutation( updateUser, {
		onSuccess: ({data}) => {
			formik.setSubmitting(false);
			signOut();
		},
		onError: (err) => {
			console.log(err);
			formik.setSubmitting(false);
		}
	} )
	const formik = useFormik({
		initialValues: {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			email: currentUser.email,
			country: currentUser.country,
			current_password: '',
			password: '',
			passwordConfirm: ''
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
			current_password: Yup
				.string()
				.max(255)
				.required(
					'Password is required')
				,
			password: Yup
				.string()
				.max(255)
				// .required('Password is required')
				,
			passwordConfirm: Yup
				.string()
				.max(255)
				.oneOf([Yup.ref("password")], "Both password need to be the sames")
				// .required('Enter password again for confirmation')
				,
			country: Yup
				.string()
				.required(
					'Country is required'),
		}),
		onSubmit: () => {
			updateUserMutation({
				...formik.values,
				name: currentUser.name
			});
		}
	});

	return (
		<form
			onSubmit={formik.handleSubmit}
			{...props}
		>
			<Card>
				<CardHeader
					subheader="The information can be edited"
					title="Profile"
				/>
				<Divider />
				<CardContent>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							md={6}
							xs={12}
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
							md={6}
							xs={12}
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
						<Grid
							item
							md={6}
							xs={12}
						>
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
						</Grid>
						<Grid
							item
							md={6}
							xs={12}
						>
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
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={Boolean(formik.touched.current_password && formik.errors.current_password)}
								fullWidth
								helperText={formik.touched.current_password && formik.errors.current_password}
								label="Current Password"
								margin="normal"
								name="current_password"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="password"
								value={formik.values.current_password}
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12}>
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
						</Grid>
						<Grid item xs={12}>
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
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						p: 2
					}}
				>
					<Button
						color="primary"
						variant="contained"
						type="submit"
					>
						Save details
					</Button>
				</Box>
			</Card>
		</form>
	);
};
