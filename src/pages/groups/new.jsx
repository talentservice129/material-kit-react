import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	Container,
	Divider,
	FormHelperText,
	Grid,
	Link,
	MenuItem,
	TextField,
	Typography
} from '@mui/material';
import { useMutation } from 'react-query';
import { getSession } from 'next-auth/react';

import { DashboardLayout } from '~/components/dashboard-layout';
import { addGroup } from '~/api/group';

const fees = [0,5,10,20,50,100,500];

const NewGroup = () => {
	const router = useRouter();
	const { mutate: addGroupMutation } = useMutation( addGroup, {
		onSuccess: ({data}) => {
			router.push('/groups/' + data.id);
		},
		onError: (err) => {
			formik.setSubmitting(false);
		}
	} )
	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			fee: 0,
			password: '',
			passwordConfirm: '',
		},
		validationSchema: Yup.object({
			title: Yup
				.string()
				.max(255)
				.required('Title is required'),
			description: Yup
				.string()
				.required('Description is required'),
			fee: Yup
				.number()
				.min(0, 'Please enter positive value'),
			password: Yup
				.string()
				.max(255)
				.required('Password is required'),
			passwordConfirm: Yup
				.string()
				.max(255)
				.oneOf([Yup.ref("password")], "Both password need to be the sames")
				.required('Enter password again for confirmation')
		}),
		onSubmit: () => {
			addGroupMutation({
				title: formik.values.title,
				description: formik.values.description,
				fee: formik.values.fee,
				password: formik.values.password,
			});
		}
	});

	return (
		<>
			<Head>
				<title>
					Add new group | PPenca
				</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8
				}}
			>
				<Container maxWidth="lg">
					<Typography
						variant="h4"
						sx={{ mb: 3 }}
					>
						New group
					</Typography>
					<form onSubmit={formik.handleSubmit}>
						<Card>
							<CardHeader
								subheader="Create your own group with password and invite people to compete"
								title="Create your own group"
							/>
							<Divider />
							<CardContent>
								<TextField
									error={Boolean(formik.touched.title && formik.errors.title)}
									fullWidth
									helperText={formik.touched.title && formik.errors.title}
									label="Title"
									margin="normal"
									name="title"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.title}
									variant="outlined"
								/>
								<TextField
									error={Boolean(formik.touched.description && formik.errors.description)}
									fullWidth
									helperText={formik.touched.description && formik.errors.description}
									label="Description"
									margin="normal"
									name="description"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.description}
									variant="outlined"
									minRows={5}
									multiline={true}
								/>
								<TextField
									error={Boolean(formik.touched.fee && formik.errors.fee)}
									fullWidth
									helperText={formik.touched.fee && formik.errors.fee}
									label="Entrance Fee (€)"
									margin="normal"
									name="fee"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									select
									value={formik.values.fee}
									variant="outlined"
								>
									{ fees.map((fee, index) => (
										<MenuItem
											key={index}
											value={fee}
										>
											€{fee}
										</MenuItem>
									))}
								</TextField>
								{/* <TextField
									error={Boolean(formik.touched.fee && formik.errors.fee)}
									fullWidth
									helperText={formik.touched.fee && formik.errors.fee}
									label="Entrance Fee"
									margin="normal"
									name="fee"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									type="number"
									value={formik.values.fee}
									variant="outlined"
								/> */}
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
									type="submit"
									color="primary"
									variant="contained"
									disabled={ formik.isSubmitting }
								>
									Create
								</Button>
							</Box>
						</Card>
					</form>
				</Container>
			</Box>
		</>
	);
};

NewGroup.getLayout = (page) => (
	<DashboardLayout>
		{page}
	</DashboardLayout>
);

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if ( !session ) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      },
      props: {
      }
    }
  }
  
  return {
    props: {
    },
  };
};

export default NewGroup;
