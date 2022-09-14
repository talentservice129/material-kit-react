import Head from 'next/head';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getSession } from 'next-auth/react';
import { Autocomplete, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import StepWizard from 'react-step-wizard';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';

import { getPredictions, savePredictions } from '~/utils/api/prediction';
import { getTeams } from '~/utils/api/team';
import { DashboardLayout } from '~/components/dashboard-layout';
import { COUNTRIES, ROUNDS } from '~/utils/constant';

const getCountryName = (code) => {
	const country = COUNTRIES.find(item => item.code === code);
	return country && country.label;
}

const PredictionsWizard = ( {initialValues, teams} ) => {
	const router = useRouter();
	const { mutate: savePredictionMutation } = useMutation( savePredictions, {
		onSuccess: () => {
			formik.setSubmitting(false);
		},
		onError: (err) => {
			formik.setSubmitting(false);
		}
	} );
	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: () => {
			savePredictionMutation( {
				...formik.values,
				groupId: router.query.group_id
			});
		}
	});

	const GroupStep = ({ nextStep }) => {
		const groups = teams.reduce( (acc, team) => {
			if(!acc[team.group - 1]) {
				acc[team.group - 1] = [];
			}
			acc[team.group - 1].push(team);
			return acc;
		}, [] );

		return (
			<>
				<Typography
					variant="h6"
					sx={{
						mb: 3
					}}
				>
					Please enter scores for each match.
				</Typography>
				<Grid
					container
					spacing={2}
					sx={{
						mb: 3
					}}
				>
					{
						groups.map((group, index) => (
							<Grid
								item
								sm={6}
								lg={3}
								key={'group-' + index }
							>
								<Card>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell
													align="center"
													padding="checkbox"
													colSpan={5}
													height={40}
												>
													Group {String.fromCharCode('A'.charCodeAt(0) + index)}
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody color="primary">
											{ group.map((team1) => (
												<TableRow key={"team-" + team1.name}>
													<TableCell variant="footer">
														<img
															loading="lazy"
															width="20"
															src={`https://flagcdn.com/w20/${team1.name.toLowerCase()}.png`}
															srcSet={`https://flagcdn.com/w40/${team1.name.toLowerCase()}.png 2x`}
															alt=""
														/>
													</TableCell>
													{ group.map((team2) => (
														<TableCell key={"team-" + team2.name}>
															{
																team1.name !== team2.name &&												
																<TextField
																	type="number"
																	name={ "group[" + team1.id + '][' + team2.id + ']' }
																	InputLabelProps={{ shrink: true,}}
																	variant="standard"
																	inputProps={{ min: 0 }}
																	value={ formik.values.group && formik.values.group[team1.id] && formik.values.group[team1.id][team2.id] }
																	onBlur={ formik.handleBlur }
																	onChange={ formik.handleChange }
																/>
															}
														</TableCell>
													))}
												</TableRow>
											)) }
										</TableBody>
									</Table>
								</Card>
							</Grid>
						))
					}
				</Grid>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between'
					}}
				>
					<Button
						color="primary"
						variant="outlined"
						onClick={ () => router.back() }
					>
						Back
					</Button>
					<Button
						color="primary"
						variant="contained"
						onClick={ nextStep }
					>
						Next
					</Button>
				</Box>
			</>
		)
	}

	const RoundStep = ({previousStep}) => {
		return (
			<>
				<Typography
					variant="h6"
					sx={{
						mb: 3
					}}
				>
					Please select teams for round match.
				</Typography>
				<Card sx={{ mb: 3 }}>
					<CardContent>
						{
							[16,8,4,1].map((round) => (
								<Autocomplete
									key={ 'round' + round }
									sx={{ mb: 3 }}
									multiple
									disableCloseOnSelect={true}
									options={teams}
									getOptionLabel={(option) => getCountryName(option.name)}
									onChange={ (e, value) => { formik.setFieldValue(`round[${round}]`, value.length <= round ? value : formik.values.round[round]) } }
									defaultValue={ formik.values.round && formik.values.round[round] }
									renderOption={(props, option) => (
										<Box
											component="li"
											sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
											{...props}
										>
											<img
												loading="lazy"
												width="20"
												src={`https://flagcdn.com/w20/${option.name.toLowerCase()}.png`}
												srcSet={`https://flagcdn.com/w40/${option.name.toLowerCase()}.png 2x`}
												alt=""
											/>
											{getCountryName(option.name)}
										</Box>
									)}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="standard"
											label={ROUNDS[round]}
										/>
									)}
								/>
							))
						}
					</CardContent>
				</Card>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between'
					}}
				>
					<Button
						color="primary"
						variant="outlined"
						onClick={ previousStep }
					>
						To Group
					</Button>
					<Button
						color="primary"
						variant="contained"
						type="submit"
						disabled={ formik.isSubmitting }
					>
						Save
					</Button>
				</Box>
			</>
		)
	}

	return (
		<form onSubmit={formik.handleSubmit}>
			<Box sx={{ overflow: 'hidden' }}>
				<StepWizard>
					<GroupStep />
					<RoundStep />
				</StepWizard>
			</Box>
		</form>
	);
}

const Prediction  = () => {
	const router = useRouter();
	const { isLoading: isTeamsLoading, data: teams } = useQuery('teams', getTeams);
	const { isLoading, data: predictions } = useQuery(
		['group-prediction', router.query.group_id],
		() => getPredictions( router.query.group_id ),
		{
			enabled: !!router.query.group_id,
		}
	);

	if ( isLoading || isTeamsLoading ) {
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

	return (
		<>
			<Head>
				<title>
					Prediction | PPenca
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
						sx={{
							mb: 3
						}}
					>
						Predictions
					</Typography>
					<PredictionsWizard
						initialValues={predictions.data}
						teams={ teams.data }
					/>
				</Container>
			</Box>
		</>
	)
}

export const getServerSideProps = async (context) => {
	const queryClient = new QueryClient();
	const session = await getSession(context);
	
	await queryClient.prefetchQuery('teams', getTeams)

	if ( !session ) {
		return {
			redirect: {
				destination: '/auth/login',
				permanent: false
			},
			props: {
				dehydratedState: dehydrate(queryClient),
			}
		}
	}

	return {
		props: {
			session,
			dehydratedState: dehydrate(queryClient),
		},
	};
};

Prediction.getLayout = (page) => (
  <DashboardLayout>
	{page}
  </DashboardLayout>
);

export default Prediction;