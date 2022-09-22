import { getSession } from 'next-auth/react';

import http from '~/utils/axios';

export const getPredictions = async ( groupId ) => {
	const session = await getSession();

	return http.get('/api/predictions', {
		params: {
			group: session && session.user.role === 'ADMIN'? null : groupId,
			user: session && session.user.id,
		}
	})
}

export const savePredictions = async ( { groupId, ...data } ) => {
	const session = await getSession();

	return http.post('/api/predictions', data, {
		params: {
			group: session && session.user.role === 'ADMIN'? null : groupId,
			user: session && session.user.id
		}
	});
}

export const endPredictions = async () => {
	const session = await getSession();

	return http.post('/api/predictions/stop', {
		user: session && session.user.id
	});
}

export const startPredictions = async () => {
	const session = await getSession();
	return http.post('/api/predictions/start');
}