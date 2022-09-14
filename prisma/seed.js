const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt' );

const prisma = new PrismaClient();

const load = async () => {
  try {
    const admin = await prisma.user.create({
		data: {
			role: Role.ADMIN,
			name: "topprivatetours",
			email: "topprivatetorus@gmail.com",
			firstName: "Fernando",
			lastName: "Torress",
			password: bcrypt.hashSync('123456', 0 ),
			country: "es"
		}
	})

	await prisma.team.createMany({
		data: [
			{
				name: "QA",
				group: 1
			},
			{
				name: "EC",
				group: 1
			},
			{
				name: "SN",
				group: 1
			},
			{
				name: "NL",
				group: 1
			},
			{
				name: "GB-ENG",
				group: 2
			},
			{
				name: "IR",
				group: 2
			},
			{
				name: "US",
				group: 2
			},
			{
				name: "GB-WLS",
				group: 2
			},
			{
				name: "AR",
				group: 3
			},
			{
				name: "SA",
				group: 3
			},
			{
				name: "MX",
				group: 3
			},
			{
				name: "PL",
				group: 3
			},
			{
				name: "FR",
				group: 4
			},
			{
				name: "AU",
				group: 4
			},
			{
				name: "DK",
				group: 4
			},
			{
				name: "TN",
				group: 4
			},
			{
				name: "ES",
				group: 5
			},
			{
				name: "CR",
				group: 5
			},
			{
				name: "DE",
				group: 5
			},
			{
				name: "JP",
				group: 5
			},
			{
				name: "BE",
				group: 6
			},
			{
				name: "CA",
				group: 6
			},
			{
				name: "MA",
				group: 6
			},
			{
				name: "HR",
				group: 6
			},
			{
				name: "BR",
				group: 7
			},
			{
				name: "RS",
				group: 7
			},
			{
				name: "CH",
				group: 7
			},
			{
				name: "CM",
				group: 7
			},
			{
				name: "PT",
				group: 8
			},
			{
				name: "GH",
				group: 8
			},
			{
				name: "UY",
				group: 8
			},
			{
				name: "KR",
				group: 8
			}
		]
	})

	await prisma.group.create({
		data: {
			title: "General",
			description: "This is general competition where anyone can join.",
			fee: 0,
			origin: 'globe',
			UsersOnGroups: {
				create: [{
					userId: admin.id
				}]
			}
		}
	})
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
