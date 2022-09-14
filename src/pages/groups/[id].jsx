import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getSession } from 'next-auth/react';
import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { loginToGroup, getGroup } from '~/utils/api/group';
import { useAuth } from '~/hooks/useAuth';
import { DashboardLayout } from '~/components/dashboard-layout';

const GroupSingle  = () => {
	const router = useRouter();
	const {session} = useAuth()
	const { isLoading, data: group } = useQuery(
		['group', router.query.id],
		() => getGroup( router.query.id ),
		{
			enabled: !!router.query.id,
		}
	);
	const formik = useFormik({
		initialValues: {
			password: ''
		},
		validationSchema: Yup.object({
			password: Yup
				.string()
				.max(255)
				.required('Please enter password')
		}),
		onSubmit: () => {}
	});
	const { data: groupData } = useQuery(
		['group-password', router.query.id],
		() => loginToGroup( router.query.id, formik.values.password ),
		{
			enabled: !!formik.isSubmitting,
			onError: () => {
				formik.setSubmitting(false);
			},
			onSuccess: ({data}) => {
				if(!data) {
					formik.setErrors({
						password: "Password is not correct"
					});
				}
				formik.setSubmitting(false);
			}
		}
	);
	const [login, openLogin] = useState(true);
	const [ payFee, openPayFee ] = useState(false);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(0);

	if ( isLoading ) {
		return (
			<Box
				sx={{
					flexGrow: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					opacity: .7
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	if( !group.data ) {
		router.push('/404');
	}

	if ( group.data.password && (!groupData || !groupData.data) ) {
		return (
			<>
				<Head>
					<title>Enter the password to login to Group - { group.data.title } | PPenca</title>
				</Head>
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						py: 8
					}}
				>
					<Container maxWidth="sm">
					<form onSubmit={formik.handleSubmit}>
						<Card>
							<CardHeader
								subheader="To subscribe to this group, you should enter group password."
								title="Login"
							/>
							<Divider />
							<CardContent>
								<TextField
									autoFocus
									error={Boolean(formik.touched.password && formik.errors.password)}
									fullWidth
									helperText={formik.touched.password && formik.errors.password}
									label="Password"
									margin="dense"
									name="password"
									onBlur={ formik.handleBlur }
									onChange={ formik.handleChange }
									type="password"
									value={ formik.values.password }
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
									color="primary"
									variant="contained"
									type="submit"
								>
									Login
								</Button>
							</Box>
						</Card>
					</form>
					</Container>
				</Box>
			</>
		)
	}

	const records = group.data && group.data.UsersOnGroups;
	const results = group.data && group.data.results;

	const url = {
		pathname: '/prediction',
		query: {
			group_id: group.data.id
		}
	};

	const groupPredicition = () => {
		if ( !group.data.UsersOnGroups.find( (item) => item.User.email === session.user.email ) ) {
			if ( group.data.fee > 0 ) {
				openPayFee(true);
			} else {
				router.push(url);
			}
		} else {
			router.push(url);
		}
	}

	const payEntranceFee = () => {
		openPayFee(false);
		router.push(url);
	}

	const handleLimitChange = (event) => {
	  setLimit(event.target.value);
	};
  
	const handlePageChange = (event, newPage) => {
	  setPage(newPage);
	};

	return (
		<>
			<Head>
				<title>
					Group - { group.data.title } | PPenca
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
					<Box
						sx={{
							alignItems: 'center',
							display: 'flex',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							m: -1
						}}
					>
						<Box sx={{ m: 1 }}>
							<Typography
								variant="h4"
							>
								{ group.data.title }
							</Typography>
							<Typography
								color="textSecondary"
								gutterBottom
								variant="body2"
							>
								{ group.data.description }
							</Typography>
						</Box>
						<Box sx={{ m: 1 }}>
							{ session && session.user.role !== 'ADMIN' &&
								<Button
									color="primary"
									variant="contained"
									onClick={ groupPredicition }
								>
									Prediction
								</Button>
							}
						</Box>
					</Box>
					{ !results && 
					<Alert
						severity="info"
						sx={{ mt: 3 }}
					>
						No results yet.
					</Alert>
					}
					<Card sx={{ mt: 3}}>
						<PerfectScrollbar>
							<Box sx={{ minWidth: 1050 }}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>
											Name
										</TableCell>
										<TableCell>
											Email
										</TableCell>
										<TableCell>
											Score
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{records.slice(0, limit).map((record) => (
									<TableRow
										hover
										key={record.id}
									>
									<TableCell>
										<Box
										sx={{
											alignItems: 'center',
											display: 'flex'
										}}
										>
										<Avatar
											src={null}
											sx={{ mr: 2 }}
										>
											{record.User.firstName[0].toUpperCase() + record.User.lastName[0].toUpperCase()}
										</Avatar>
										<Typography
											color="textPrimary"
											variant="body1"
										>
											{record.User.firstName} {record.User.lastName}
										</Typography>
										</Box>
									</TableCell>
									<TableCell>
										{record.User.email}
									</TableCell>
									<TableCell>
										{ record.score }
									</TableCell>
									</TableRow>
								))}
								{ records.length === 0 &&
									<TableRow>
										<TableCell
											align="center"
											colSpan={3}
										>
											No predictions yet.
										</TableCell>
									</TableRow>
								}
								</TableBody>
							</Table>
							</Box>
						</PerfectScrollbar>
						<TablePagination
							component="div"
							count={records.length}
							onPageChange={handlePageChange}
							onRowsPerPageChange={handleLimitChange}
							page={page}
							rowsPerPage={limit}
							rowsPerPageOptions={[5, 10, 25]}
						/>
					</Card>
				</Container>
			</Box>
			<Dialog
				open={payFee}
				onClose={() => openPayFee( false )}
			>
				<DialogTitle>Pay fee</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You have to pay €{ group.data.fee } to predict results in this group.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={ formik.isSubmitting }
						onClick={ payEntranceFee }
					>
						Pay
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

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

GroupSingle.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default GroupSingle;