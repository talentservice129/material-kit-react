import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const Logo = styled((props) => {
	const { variant, ...other } = props;

	const color = variant === 'light' ? '#C1C4D6' : '#5048E5';

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center'
			}}
		>
			<img
				src="/static/logo.png"
				alt="logo"
				width={50}
				height={50}
			/>
			<Typography
				color="white"
				sx={{
					ml: 2,
					fontWeight: 900,
					fontSize: '20px'
				}}
				variant="body2"
			>
				PPenca
			</Typography>
		</Box>
	);
})``;

Logo.defaultProps = {
	variant: 'primary'
};

Logo.propTypes = {
	variant: PropTypes.oneOf(['light', 'primary'])
};
