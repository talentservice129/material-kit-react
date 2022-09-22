import { PrismaClient, Role } from '@prisma/client';

export default async function handler(req, res) {
	const prisma = new PrismaClient();
	try{
		const admin = await prisma.user.findFirst({
			where: {
				id: req.body.user,
				role: Role.ADMIN
			}
		});
		if ( admin ) {
			await prisma.group.updateMany({
				data: {
					finished: false
				}
			});
			return res.send('ok');
		}
		res.status(401);
		res.send('Only user can start');
	} catch(e) {
		console.log(e);
		res.status(590);
		res.send({
			message: e.message
		});
	}
}