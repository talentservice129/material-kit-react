import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

import { getEnv } from '~/utils/env';

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();
		const user = await prisma.user.findFirst({
			where: {
				email: req.body.email
			}
		});
		if(! user) {
			res.status(401);
			return res.send({
				message: 'User not found'
			});
		}

		const token = jwt.sign({
			email: req.body.email
		}, 'secret', { expiresIn: 60 * 60 });

		// console.log(req.headers);

		sgMail.setApiKey(getEnv('EMAIL_API_KEY'));
		const msg = {
		  to: req.body.email,
		  from: 'talentservice129@gmail.com', // Use the email address or domain you verified above
		  subject: 'Reset Password',
		  text: 'and easy to do anywhere, even with Node.js',
		  html: `<a href="${ req.headers.origin + '/auth/reset-password?token=' + token }">Follow this link</a>`,
		};
		await sgMail.send(msg);
		res.send('ok');
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	} 
}