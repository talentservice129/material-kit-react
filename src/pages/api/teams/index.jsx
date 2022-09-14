import { PrismaClient, Role, Gender } from '@prisma/client';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		if ( req.method === 'GET' ) {
			const teams = await prisma.team.findMany();

			res.send(teams);
		} else {
			// const group = await prisma.group.create({
			// 	data: {
			// 		title: req.body.title,
			// 		description: req.body.description,
			// 		fee: req.body.fee,
			// 		password: bcrypt.hashSync(req.body.password, 0 ),
			// 		owner: req.body.user,
			// 	}
			// });

			// res.send(group);
		}
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	} 
}