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

export const getGroup = async (id) => {
	const session = await getSession();

	return http.get('/api/groups/' + id, {
		params: {
			user: session && session.user.id
		}
	});
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

export const getPayInfo = async ( id ) => {
	const session = await getSession();

	return http.get( '/api/groups/' + id + '/pay', {
		params: {
			user: session.user.id
		}
	} );
}

export const payGroup = async ( id ) => {
	const session = await getSession();

	return http.post( '/api/groups/' + id + '/pay', {
		user: session.user.id
	} );
}

export const getPayIdBySession = (session) => {
	return http.get('/api/session/' + session);
}

export const resetGroupPassword = async (data) => {
	const session = await getSession();
	console.log(data);

	return http.post('/api/groups/' + data.id + '/reset-password', {
		user: session.user.id,
		password: data.password
	});
}