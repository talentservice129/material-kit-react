import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery, Skeleton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useQuery } from 'react-query';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';

import { getGroups } from '~/utils/api/group';
import { useAuth } from '~/hooks/useAuth';
import { COUNTRIES } from '~/utils/constant';

const getCountryName = (code) => {
	const country = COUNTRIES.find(item => item.code.toLowerCase() === code.toLowerCase());
	return country && country.label;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
	backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
	padding: theme.spacing(1, 1, 1, 0),
	// vertical padding + font size from searchIcon
	paddingLeft: `calc(1em + ${theme.spacing(4)})`,
	transition: theme.transitions.create('width'),
	width: '100%',
	[theme.breakpoints.up('md')]: {
	  width: '20ch',
	},
  },
}));

export const DashboardSidebar = (props) => {
	const { open, onClose } = props;
	const { session } = useAuth();
	const router = useRouter();
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
		defaultMatches: true,
		noSsr: false
	});
	const [search, setSearch] = useState('');
	const { isLoading, data: fetchData } = useQuery('groups', getGroups);

	let data = fetchData && [...fetchData.data];
	data && data.sort((a,b) => {
		if ( a.title === 'General' ) {
			return -1;
		}
		if ( b.title === 'General' ) {
			return 1;
		}
		if ( a.title === 'General for ' + getCountryName( session.user.country ) ) {
			return -1;
		}
		if ( b.title === 'General for ' + getCountryName( session.user.country ) ) {
			return 1;
		}
		if ( a.title.startsWith('General for ') && !b.title.startsWith('General for ') ) {
			return -1;
		}
		if ( !a.title.startsWith('General for ') && b.title.startsWith('General for ') ) {
			return 1;
		}
		return a.title < b.title ? -1 : 1;
	})

	useEffect(
		() => {
			if (!router.isReady) {
				return;
			}

			if (open) {
				onClose?.();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath]
	);

	const content = (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%'
				}}
			>
				<div>
					<Box sx={{ p: 3 }}>
						<NextLink
							href="/"
							passHref
						>
							<a style={{ textDecoration: 'none' }}>
								<Logo
									sx={{
										height: 42,
										width: 42
									}}
								/>
							</a>
						</NextLink>
					</Box>
					<Box sx={{ px: 2 }}>
						<Box
							sx={{
								alignItems: 'center',
								backgroundColor: 'rgba(255, 255, 255, 0.04)',
								cursor: 'pointer',
								display: 'flex',
								justifyContent: 'space-between',
								px: 3,
								py: '11px',
								borderRadius: 1
							}}
						>
							<div>
								<Typography
									color="inherit"
									variant="subtitle1"
								>
									{ session && session.user.firstName + ' ' + session.user.lastName }
								</Typography>
								{/* <Typography
									color="neutral.400"
									variant="body2"
								>
									Your tier
									{' '}
									: Premium
								</Typography> */}
							</div>
							<SelectorIcon
								sx={{
									color: 'neutral.500',
									width: 14,
									height: 14
								}}
							/>
						</Box>
					</Box>
				</div>
				<Divider
					sx={{
						borderColor: '#2D3748',
						my: 3
					}}
				/>
				<Box sx={{ flexGrow: 1 }}>
					<Search sx={{ mb: 3 }}>
						<SearchIconWrapper>
						<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search…"
							inputProps={{
								'aria-label': 'search',
								value: search,
								onChange: (e) => { setSearch(e.target.value) }
							}}
						/>
					</Search>

					{ !(session && session.user.role === 'ADMIN') &&
						<NavItem
							href="/groups/new"
							title="Add new group"
						/>
					}
					{/* {
						isLoading && <Box
							sx={{
								py: 0,
								px: 2
							}}
						>
							{
								[0,1,2,3,4,5,6,7,8,9,10,11].map((index) => (
									<Skeleton
										sx={{
											backgroundColor: '#E5E7EB11',
											mb: 0.5
										}}
										key={ 'skel-' + index }
										variant="rectangular"
										width="100%"
										height={40}
									/>
								))
							}
						</Box>
					} */}
					{ (data && session && session.user.role === 'ADMIN') &&
						<NavItem
							href={"/groups/" + data[0].id + "/prediction" }
							title="Competition Results"
						/>
					}
					{data && data.filter(item => (!search || item.title.match(new RegExp(search, 'i')) )).map((item) => (
						<NavItem
							key={item.title}
							// icon={item.icon}
							href={'/groups/' + item.id}
							title={item.title}
						/>
					))}
				</Box>
			</Box>
		</>
	);

	if (lgUp) {
		return (
			<Drawer
				anchor="left"
				open
				PaperProps={{
					sx: {
						backgroundColor: 'neutral.900',
						color: '#FFFFFF',
						width: 280
					}
				}}
				variant="permanent"
			>
				{content}
			</Drawer>
		);
	}

	return (
		<Drawer
			anchor="left"
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					backgroundColor: 'neutral.900',
					color: '#FFFFFF',
					width: 280
				}
			}}
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
			variant="temporary"
		>
			{content}
		</Drawer>
	);
};

DashboardSidebar.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool
};
