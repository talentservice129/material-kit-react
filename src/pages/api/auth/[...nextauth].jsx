import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import CredentialsProvicer from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';

import { getEnv } from '~/utils/env';
import { confirmPasswordHash } from '~/utils/auth';

const prisma = new PrismaClient();

export default NextAuth({
	providers: [
		CredentialsProvicer({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text", required: true },
				password: { label: "Password", type: "password", required: true }
			},
			async authorize(credentials, req) {
				let user;
				user = await prisma.user.findFirst({
					where: {
						name: credentials.user,
					}
				});

				if ( user ) {
					const res = await confirmPasswordHash(credentials.password, user.password);
					
					if (res) {
						return user;
					}
				}

				return null;
			}
		}),
	],
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/auth/login',
		newUser: '/auth/register'
	},
	adapter: PrismaAdapter(prisma),
	secret: getEnv('SECRET'),
	callbacks: {
		jwt: async function ({token, user }) {
			return {
				...token,
				user: {
					...token.user,
					...user
				}
			};
		},
		session: async function ({session, user, token}) {
			return {
				...session,
				user: {
					id: token.user.id,
					name: token.user.name,
					firstName: token.user.firstName,
					lastName: token.user.lastName,
					email: token.user.email,
					role: token.user.role,
					country: token.user.country
				}
			};
		}
	}
});
