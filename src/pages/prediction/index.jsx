import Head from 'next/head';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getSession } from 'next-auth/react';
import NextLink from 'next/link';
import { Autocomplete, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import StepWizard from 'react-step-wizard';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { DashboardLayout } from '~/components/dashboard-layout';
import { getPredictions, savePredictions, endPredictions, startPredictions } from '~/utils/api/prediction';
import { getTeams } from '~/utils/api/team';
import { COUNTRIES, ROUNDS, SCHEDULE } from '~/utils/constant';

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
		const getTeamID = (code) => {
			const team = teams.find(team => code === team.name );
			return team && team.id;
		}

		const getTeamName = (code) => {
			const country = COUNTRIES.find(country => country.code === code);
			return country && country.label;
		}

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
						mb: 3,
					}}
					justifyContent={"center"}
				>
					{
						SCHEDULE.map((group, index) => (
							<Grid
								item
								sm={6}
								lg={4}
								key={'group-' + index }
							>
								<Card sx={{ height: '100%' }}>
									<Table size="small">
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
											{ group.map(({team1, team2}) => (
												<TableRow key={team1 + '-' + team2}>
													<TableCell variant="footer" align="center">
														<img
															loading="lazy"
															width="20"
															src={`https://flagcdn.com/w20/${team1.toLowerCase()}.png`}
															srcSet={`https://flagcdn.com/w40/${team1.toLowerCase()}.png 2x`}
															alt="team1"
														/>
													</TableCell>
													<TableCell align="center">										
														<TextField
															select
															name={ "group[" + getTeamID( team1 ) + '][' + getTeamID( team2 ) + ']' }
															variant="standard"
															value={ formik.values.group && formik.values.group[getTeamID( team1 )] && formik.values.group[getTeamID( team1 )][getTeamID( team2 )] }
															onBlur={ formik.handleBlur }
															onChange={ formik.handleChange }
														>
															{ [0,1,2,3,4,5,6,7,8,9,10].map(score => (
																<MenuItem
																	key={'score-' + score }
																	value={score}
																>
																	{score}
																</MenuItem>
															)) }
														</TextField>
													</TableCell>
													<TableCell align="center">:</TableCell>
													<TableCell align="center">						
														<TextField
															select
															name={ "group[" + getTeamID( team2 ) + '][' + getTeamID( team1 ) + ']' }
															variant="standard"
															value={ formik.values.group && formik.values.group[getTeamID( team2 )] && formik.values.group[getTeamID( team2 )][getTeamID( team1 )] }
															onBlur={ formik.handleBlur }
															onChange={ formik.handleChange }
														>
															{ [0,1,2,3,4,5,6,7,8,9,10].map(score => (
																<MenuItem
																	key={'score-' + score }
																	value={score}
																>
																	{score}
																</MenuItem>
															)) }
														</TextField>
													</TableCell>
													<TableCell
														variant="footer"
														align="center"
													>
														<img
															loading="lazy"
															width="20"
															src={`https://flagcdn.com/w20/${team2.toLowerCase()}.png`}
															srcSet={`https://flagcdn.com/w40/${team2.toLowerCase()}.png 2x`}
															alt="team2"
														/>
													</TableCell>
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
									options={teams.sort((a,b) => {
										let country1 = getCountryName(a.name),
											ccountry2 = getCountryName(b.name);

										if(country1 < ccountry2) { return -1;}
										if(country1 > ccountry2) { return 1;}
										return 0;
									})}
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

const Prediction  = ({ session }) => {
	const router = useRouter();
	const { isLoading: isTeamsLoading, data: teams } = useQuery('teams', getTeams);
	const { isLoading, data: predictions } = useQuery(
		['group-prediction', router.query.group_id],
		() => getPredictions( router.query.group_id ),
		{
			enabled: !!router.query.group_id,
		}
	);
	const { mutate: startPredictionsMutation, isLoading: starting } = useMutation( startPredictions, {
		onSuccess: () => {
			toast.success('Prediction started');
		}
	} );
	const { mutate: endPredictionsMutation, isLoading: ending } = useMutation( endPredictions, {
		onSuccess: () => {
			toast.success('Prediction finished');
		}
	} );

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
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 3
						}}
					>
						<Typography variant="h4">
							Predictions
						</Typography>
						{ session.user.role === 'ADMIN' && (
							!predictions.data.finished ?
								<Button
									color="primary"
									variant="contained"
									onClick={endPredictionsMutation}
									disabled={ ending }
								>
									End Prediction
								</Button>
								:
								<Button
									color="primary"
									variant="contained"
									onClick={startPredictionsMutation}
									disabled={ starting }
								>
									Start Prediction
								</Button>
							)
						}
					</Box>
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