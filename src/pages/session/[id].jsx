import { useRouter } from 'next/router';
import {
	Box,
	CircularProgress
} from '@mui/material';
import { useQuery } from 'react-query';
import { getSession } from 'next-auth/react';

import { DashboardLayout } from '~/components/dashboard-layout';
import { getPayIdBySession} from '~/utils/api/group';

const SessionPage = () => {
	const router = useRouter();
	const { isLoading, data: group } = useQuery(
		['group', router.query.id],
		() => getPayIdBySession( router.query.id ),
		{
			enabled: !!router.query.id,
			onError: () => {
				router.push('/404');
			},
		}
	);

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

	if (group) {
		router.push('/groups/' + group.data);
	}
	return <></>;
};

SessionPage.getLayout = (page) => (
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

export default SessionPage;
