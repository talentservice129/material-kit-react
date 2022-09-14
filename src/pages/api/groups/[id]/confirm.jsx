import { PrismaClient, Role, Gender } from '@prisma/client';
import { confirmPasswordHash } from '~/utils/auth';

function exclude(user, ...keys) {
	for (let key of keys) {
	  delete user[key]
	}
	return user
}

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();
		
		const group = await prisma.group.findFirst({
			where: {
				id: req.query.id
			},
			include: {
				UsersOnGroups: {
					include: {
						User: true,
						GroupPrediction: true,
						RoundPrediction: true
					}
				}
			}
		});

		if ( group ) {
			const match = await confirmPasswordHash(req.body.password, group.password);
			
			if (match) {
				return res.send(exclude( group, 'password', 'id' ));
			}
		}
		res.send(null);
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	}
}