import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		if ( req.method === 'GET' ) {
			const payment = await prisma.entranceFeeRecord.findFirst({
				where: {
					userId: req.query.user,
					groupId: req.query.id
				}
			});
			return res.send( payment );
		} else if ( req.method === 'POST' ) {
			const payment = await prisma.entranceFeeRecord.create({
				data: {
					userId: req.body.user,
					groupId: req.query.id,
				}
			});
			return res.send(payment.id)
		}
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	}
}