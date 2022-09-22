import { PrismaClient, Role, Gender } from '@prisma/client';

const getScore = ( predictions, results ) => {
	let score = predictions.GroupPrediction.reduce(( acc, cur ) => {
		let match = results.GroupPrediction.find((item) => (( cur.team1 === item.team1 && cur.team2 === item.team2 ) || ( cur.team2 === item.team1 && cur.team1 === item.team2 ) ));

		if ( match ) {
			let score1, score2;
			if ( cur.team1 === match.team1 ) {
				score1 = match.score1;
				score2 = match.score2;
			} else {
				score1 = match.score2;
				score2 = match.score1;
			}

			if ( cur.score1 === score1 && cur.score2 === score2 ) {
				acc += 10;
			} else if ( (cur.score1 - cur.score2) === ( score1 - score2 ) ) {
				acc += 7;
			} else if ( ( cur.score1 - cur.score2 ) * ( score1 - score2 ) > 0 ) {
				acc += 5;
			} else if (cur.score1 === score1 || cur.score2 === score2 ) {
				acc += 2;
			}
		}
		return acc;
	}, 0);

	score = predictions.RoundPrediction.reduce((acc, cur) => {
		let match = results.RoundPrediction.find((item) => ( item.round === cur.round && item.team === cur.team ))

		if ( match ) {
			switch( cur.round ) {
				case 16:
					acc += 5;
					break;
				case 8:
					acc += 10;
					break;
				case 4:
					acc += 20;
					break;
				case 1:
					acc += 40;
					break;
				default:
					break;
			};
		}

		return acc;
	}, score);

	return score;
}

export default async function handler(req, res) {
	try {
		const prisma = new PrismaClient();
		
		let group = await prisma.group.findFirst({
			where: {
				id: req.query.id
			},
			include: {
				UsersOnGroups: {
					where: {
						User: {
							role: {
								not: Role.ADMIN
							}
						}	
					},
					include: {
						User: true,
						GroupPrediction: true,
						RoundPrediction: true
					}
				}
			}
		});
		
		const results = await prisma.usersOnGroups.findFirst({
			where: {
				User: {
					role: Role.ADMIN
				}
			},
			include: {
				GroupPrediction: true,
				RoundPrediction: true
			}
		});

		let payment = null;

		if ( group.fee > 0 ) {
			payment = await prisma.entranceFeeRecord.findFirst({
				where: {
					userId: req.query.user,
					groupId: req.query.id,
					session: {
						not: null
					}
				}
			});
		}

		group = {
			...group,
			results: !!results,
			payment: payment,
			UsersOnGroups: group.UsersOnGroups.map((item) => {
				return {
					id: item.id,
					User: item.User,
					score: results ? getScore(item, results) : 0
				}
			}).sort( (a,b) => b.score - a.score )
		}

		res.send(group);
	} catch (e) {
		console.log(e);
		res.status(500);
		res.send(e);
	}
}