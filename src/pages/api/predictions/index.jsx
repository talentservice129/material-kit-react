import { PrismaClient, Role, Gender } from '@prisma/client';

function convertGroup(group) {
	return group.reduce((acc, cur) => {
		return {
			...acc,
			[cur.team1]: {
				...acc[cur.team1],
				[cur.team2]: cur.score1
			},
			[cur.team2]: {
				...acc[cur.team2],
				[cur.team1]: cur.score2
			}
		};
	}, {});
}

function convertRound(round) {
	return round.reduce((acc, cur) => {
		if(!acc[cur.round]) {
			acc[cur.round] = [];
		}
		acc[cur.round].push(cur.Team);
		return acc;
	}, {});
}

function revertGroup(group) {
	let temp = [];
	for(let team1 in group) {
		for(let team2 in group[team1]) {
			let index = temp.findIndex( item => {
				return ( item.team1 == team1 && item.team2 == team2 ) ||( item.team2 == team1 && item.team1 == team2 );
			} );
			
			if (index < 0 && group[team1][team2] !== null) {
				temp.push({
					team1: parseInt(team1),
					team2: parseInt(team2),
					score1: parseInt(group[team1][team2]),
					score2: (group[team2] && group[team2][team1]) ? parseInt(group[team2][team1]) : 0
				});
			}
		}
	}
	return temp;
}

function revertRound(round) {
	let temp = [];
	for( let step in round ) {
		temp = temp.concat( round[step].map(team => {
			return {
				team: team.id,
				round: parseInt(step)
			}
		}));
	}
	return temp;
}

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();

		if ( req.method === 'GET' ) {
			const predictions = await prisma.usersOnGroups.findFirst({
				where: {
					OR: [
						{
							groupId: req.query.group,
							userId: req.query.user
						},
						{
							userId: req.query.user,
							User: {
								role: Role.ADMIN
							}
						}
					]
				},
				include: {
					GroupPrediction: true,
					RoundPrediction: {
						include: {
							Team: true
						}
					}
				}
			});

			const finished = await prisma.group.findFirst({
				where: {
					finished: true
				}
			})

			if ( predictions ) {
				return res.send({
					group: convertGroup( predictions.GroupPrediction ),
					round: convertRound( predictions.RoundPrediction ),
					finished: !!finished
				});
			}
			res.send({
				group: {},
				round: {},
				finished: !!finished
			});
		} else if ( req.method === 'POST' ) {
			let predictions  = await prisma.usersOnGroups.findFirst({
				where: {
					groupId: req.query.group,
					userId: req.query.user
				}
			});

			if ( !predictions ) {
				predictions = await prisma.usersOnGroups.create({
					data: {
						userId: req.query.user,
						groupId: req.query.group,
						GroupPrediction: {
							createMany: {
								data: revertGroup(req.body.group)
							}
						}, 
						RoundPrediction: {
							createMany: {
								data: revertRound(req.body.round)
							}
						}
					}
				});
			} else {
				await prisma.usersOnGroups.update({
					where: {
						id: predictions.id
					},
					data: {
						GroupPrediction: {
							deleteMany: {}
						},
						RoundPrediction: {
							deleteMany: {}
						}
					}
				});
				await prisma.usersOnGroups.update({
					where: {
						id: predictions.id
					},
					data: {
						GroupPrediction: {
							createMany: {
								data: revertGroup(req.body.group)
							}
						},
						RoundPrediction: {
							createMany: {
								data: revertRound(req.body.round)
							}
						}
					}
				});
			}

			res.send('ok');
		}
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	} 
}