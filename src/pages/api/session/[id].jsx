import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		const payment = await prisma.entranceFeeRecord.findFirst({
			where: {
				session: req.query.id
			}
		});

		if ( !payment ) {
			res.status(404);
			return res.send({message: 'Such session doesn\'t exist'});
		}

		res.send(payment.groupId);
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	}
}