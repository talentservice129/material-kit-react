import { getSession } from 'next-auth/react';

import http from '~/utils/axios';

export const getGroups = async () => {
	const session = await getSession();
	
	return http.get('/api/groups', {
		params: {
			user: session.user.role === 'ADMIN' ? 'all' : session.user.country
		}
	});
}

export const getGroup = (id) => {
	return http.get('/api/groups/' + id);
}

export const loginToGroup = (id, password) => {
	return http.post('/api/groups/' + id + '/confirm', {
		password
	})
}

export const addGroup = async (data) => {
	const session = await getSession();

	return http.post('/api/groups', {
		...data,
		user: session && session.user.id
	});
}