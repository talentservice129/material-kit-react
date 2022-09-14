import { PrismaClient, Role, Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

import { COUNTRIES } from '~/utils/constant';
import { confirmPasswordHash } from '~/utils/auth';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		let user;
		user = await prisma.user.findFirst({
			where: {
				name: req.body.name,
			}
		});

		if ( user ) {
			const check = await confirmPasswordHash(req.body.current_password, user.password);
			
			if (check) {
				await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						email: req.body.email == user.email ? undefined : req.body.email,
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

				return res.send(user);
			}
		}

		res.status(401).send({
			message: "Password is not correc"
		});
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	} 
}