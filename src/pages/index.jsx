import Head from 'next/head';
import { Box, Card, CardContent, Container, Grid, List, ListItem, Typography } from '@mui/material';
import { dehydrate, QueryClient } from 'react-query';
import { getSession } from 'next-auth/react';

import { Budget } from '~/components/dashboard/budget';
import { LatestOrders } from '~/components/dashboard/latest-orders';
import { LatestProducts } from '~/components/dashboard/latest-products';
import { Sales } from '~/components/dashboard/sales';
import { TasksProgress } from '~/components/dashboard/tasks-progress';
import { TotalCustomers } from '~/components/dashboard/total-customers';
import { TotalProfit } from '~/components/dashboard/total-profit';
import { TrafficByDevice } from '~/components/dashboard/traffic-by-device';
import { DashboardLayout } from '~/components/dashboard-layout';

const Dashboard = () => (
	<>
		<Head>
			<title>
				Dashboard | PPenca
			</title>
		</Head>
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				backgroundImage: 'url(/static/images/bg.jpg)',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				py: 8,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center'
			}}
		>
			<Container maxWidth={false}>
				<Typography
					variant="h2"
					color="white"
					sx={{
						textAlign: 'center',
						mb: 2
					}}
				>
					Worldcup Prediction
				</Typography>
				<Card
					// sx={{
					// 	background: '#fff',
					// 	p: 2
					// }}
				>
					<CardContent>
						<Typography
							variant="body1"
							color="primary"
							sx={{
								fontSize: '18px',
								fontWeight: 600
							}}
						>
							To predict results you have to introduce how many goals each team will do at each game in group.
						</Typography>
						<List
							sx={{
								mb: 3
							}}
						>
							<ListItem>
								10: Exact result
							</ListItem>
							<ListItem>
								7: The winner and the difference of goals between each teams 
							</ListItem>
							<ListItem>
								5: Only the winner
							</ListItem>
							<ListItem>
								2: How many goals scoreed by one of teams
							</ListItem>
						</List>
						<Typography
							variant="body1"
							color="primary"
							sx={{
								fontSize: '18px',
								fontWeight: 600
							}}
						>
							You also predict which teams will qualified to the next rounds 
						</Typography>
						<List>
							<ListItem>
								5: per teams in Round Sixteen
							</ListItem>
							<ListItem>
								10: per teams in Quarter Final
							</ListItem>
							<ListItem>
								20: per teams in Semi Final
							</ListItem>
							<ListItem>
								40: World Champion
							</ListItem>
						</List>
					</CardContent>
				</Card>
			</Container>
		</Box>
	</>
);

Dashboard.getLayout = (page) => (
	<DashboardLayout>
		{page}
	</DashboardLayout>
);

export const getServerSideProps = async (context) => {
	const queryClient = new QueryClient();
	const session = await getSession(context);

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
			dehydratedState: dehydrate(queryClient),
		},
	};
};

export default Dashboard;
