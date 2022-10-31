import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';

import { getEnv } from '~/utils/env';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();
		
		let group = await prisma.group.findFirst({
			where: {
				id: req.query.id,	
			},
			include: {
				UsersOnGroups: {
					include: {
						User: {
							select: {
								email: true
							}
						}
					}
				}
			}
		});

		if ( ! group || group.owner !== req.body.user  ) {
			res.status(401);
			return res.send('Only owner can change password');
		}

		await prisma.group.update({
			where: {
				id: req.query.id
			},
			data: {
				password: bcrypt.hashSync(req.body.password, 0 ),
			}
		});

		sgMail.setApiKey(getEnv('EMAIL_API_KEY'));
		let msg = [];

		group.UsersOnGroups.forEach(item=> {
			msg.push({
				to: item.User.email,
				from: 'talentservice129@gmail.com', // Use the email address or domain you verified above
				subject: 'Password Reset for Group"' + group.title + '"',
				text: `Group password changed to: ` + req.body.password,
			});
		})
		await sgMail.send(msg);

		res.send('ok');
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	} 
}