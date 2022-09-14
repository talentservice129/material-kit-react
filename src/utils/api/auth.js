import http from '~/utils/axios';

export const registerUser = (user) => {
	return http.post('/api/auth/new', user);
}

export const updateUser = ( user ) => {
	console.log("Userdata", user);
	return http.put('/api/auth/update', user)
}