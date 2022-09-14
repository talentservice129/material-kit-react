import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';

import { AccountProfile } from '~/components/account/account-profile';
import { AccountProfileDetails } from '~/components/account/account-profile-details';
import { DashboardLayout } from '~/components/dashboard-layout';

const Account = ({ currentUser }) => (
  <>
    <Head>
      <title>
        Account | PPenca
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
          sx={{ mb: 3 }}
          variant="h4"
        >
          Account
        </Typography>
        {/* <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <AccountProfile />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          > */}
            <AccountProfileDetails currentUser={ currentUser } />
          {/* </Grid>
        </Grid> */}
      </Container>
    </Box>
  </>
);

Account.getLayout = (page) => (
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
      currentUser: session.user
    },
  };
};

export default Account;
