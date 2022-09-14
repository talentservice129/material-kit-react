import { PrismaClient, Role, Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

import { COUNTRIES } from '~/utils/constant';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		await prisma.user.create({
			data: {
				role: Role.USER,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				gender: req.body.gender === 'male' ? Gender.MALE : Gender.FEMALE,
				name: req.body.name,
				email: req.body.email,
				password: bcrypt.hashSync(req.body.password, 0 ),
				country: req.body.country,
			}
		});

		const group = await prisma.group.findFirst({
			where: {
				origin: req.body.country
			}
		});

		if(! group) {
			const country = COUNTRIES.find( item => item.code === req.body.country );

			await prisma.group.create({
				data: {
					title: "General for " + country.label,
					description: "This is general competition where anyone from " + country.label + ' can join.',
					fee: 0,
					origin: country.code,
				}
			})
		}
		res.send('ok');
	} catch (e) {
		res.status(500);
		res.send(e);
	} 
}