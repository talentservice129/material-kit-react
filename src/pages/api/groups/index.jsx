import { PrismaClient, Role, Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		const query = req.query.user == 'all' ? {} : {
			origin: {
				in: ['globe', req.query.user, '']
			}
		};

		if ( req.method === 'GET' ) {
			const groups = await prisma.group.findMany({
				where: query,
				select: {
					id: true,
					title: true
				}
			});

			res.send(groups);
		} else {
			const group = await prisma.group.create({
				data: {
					title: req.body.title,
					description: req.body.description,
					fee: req.body.fee,
					password: bcrypt.hashSync(req.body.password, 0 ),
					owner: req.body.user,
				}
			});

			res.send(group);
		}
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	} 
}