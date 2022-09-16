import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { getEnv } from '~/utils/env';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		const info = jwt.verify( req.body.token, 'secret' );

		const user = await prisma.user.findFirst({
			where: {
				email: info.email
			}
		});
		if(! user) {
			res.status(401);
			return res.send({
				message: 'User not found'
			});
		}

		await prisma.user.update({
			where: {
				email: info.email
			},
			data: {
				password: bcrypt.hashSync(req.body.password, 0 ),
			}
		});

		res.send('ok');
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	} 
}