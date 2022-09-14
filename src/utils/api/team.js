import http from '~/utils/axios';

export const getTeams = () => {
	
	return http.get('/api/teams');
}