import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => (
	<>
		<Head>
			<title>
				404 | PPenca
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
			<Container maxWidth="md">
				<Box
					sx={{
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}
				>
					<Box sx={{
						display: 'flex',
						alignItems: 'flex-start',
						mb: 9
					}}>
						<Typography
							align="center"
							variant="h2"
							sx={{
								color: '#0125fd',
								fontSize: '430px',
								fontWeight: 900,
								lineHeight: 1
							}}
						>
							4
						</Typography>
						<img
							src="/static/images/not_found.png"
							alt="logo"
							width="492"
							height="492"
						/>
						<Typography
							align="center"
							variant="h2"
							sx={{
								color: '#0125fd',
								fontSize: '430px',
								fontWeight: 900,
								lineHeight: 1
							}}
						>
							4
						</Typography>
					</Box>
					<Typography
						align="center"
						color="textPrimary"
						variant="subtitle2"
						sx={{
							color: '#020202',
							fontWeight: 900,
							fontSize: '50px',
							letterSpacing: '1'
						}}
					>
						Sorry, page not found.
					</Typography>
					<NextLink
						href="/"
						passHref
					>
						<Button
							component="a"
							startIcon={(<ArrowBackIcon fontSize="small" />)}
							sx={{ mt: 3 }}
							variant="contained"
						>
							Go back to dashboard
						</Button>
					</NextLink>
				</Box>
			</Container>
		</Box>
	</>
);

export default NotFound;
