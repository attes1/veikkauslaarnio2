const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const Promise = require('bluebird');
const _ = require('lodash');

admin.initializeApp();
const db = admin.firestore();

const invitationCode = functions.config().veikkauslaarnio.invitation_code;
const competitionId = functions.config().veikkauslaarnio.competition_id;
const footballDataApiKey = functions.config().veikkauslaarnio.football_data_api_key;

axios.defaults.baseURL = 'http://api.football-data.org/v1';
axios.defaults.headers.common['X-Auth-Token'] = footballDataApiKey;
axios.defaults.headers.common['X-Response-Control'] = 'minified';

exports.createUser = functions.auth.user().onCreate(user => {
  const userProfile = {
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    verified: false
  };

  return db
    .collection('users')
    .doc(user.uid)
    .set(userProfile)
    .then(() => {
      return db.collection('fixtures').get();
    })
    .then(collection => {
      return collection.docs.map(fixt => {
        let lockDate = '';

        switch (fixt.matchday) {
          case 1:
          case 2:
          case 3:
            lockDate = 'groupStage';
            break;
          case 4:
            lockDate = 'roundOf16';
            break;
          case 5:
            lockDate = 'quarterfinals';
            break;
          case 6:
            lockDate = 'semifinals';
            break;
          case 7:
            lockDate = 'thirdPlace';
            break;
          case 8:
            lockDate = 'final';
            break;
          default:
            lockDate = 'groupStage';
            break;
        }

        return {
          lockDate: db.collection('lockDates').doc(lockDate),
          fixture: db.collection('fixtures').doc(fixt.id.toString()),
          goalsHomeTeam: null,
          goalsAwayTeam: null
        };
      });
    })
    .then(bets => {
      const betCollection = db
        .collection('users')
        .doc(user.uid)
        .collection('bets');

      return Promise.all(bets.map(bet => {
        return betCollection.add(bet);
      }));
    })
    .catch(err => {
      console.error(err);
      return user.delete();
    });
});

exports.deleteUser = functions.auth.user().onDelete(user => {
  return db
    .collection('users')
    .doc(user.uid)
    .delete();
});

exports.verifyUser = functions.https.onCall((data, context) => {
  if (data.code === invitationCode) {
    return db
      .collection('users')
      .doc(context.auth.uid)
      .update({
        verified: true
      });
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid invitation code.');
  }
});

exports.addLastModifiedTimestampToBets = functions
  .firestore
  .document('/users/{userId}/bets/{betId}')
  .onUpdate((change, context) => {
    return change.after.ref.set({
      lastModified: admin.firestore.FieldValue.serverTimestamp()
    }, {merge: true});
  });

exports.fetchFixtures = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const fixtureMeta = db
    .collection('_meta')
    .doc('fixtures');

  let fixtures;
  return fixtureMeta
    .get()
    .then(meta => {
      if (!meta.exists || meta.data().lastFetched + (10 * 60 * 1000) < Number(new Date())) {
        return axios.get(`/competitions/${competitionId}/fixtures`);
      } else {
        throw new functions.https.HttpsError('failed-precondition', 'The function must not be called again within ten minutes of last call.');
      }
    })
    .then(response => {
      return Promise.all(response.data.fixtures.map(fixt => {
        let fixture = _.omit(fixt, ['homeTeamName', 'homeTeamName', 'homeTeamId', 'awayTeamId', 'competitionId']);
        fixture = _.extend(fixture, {
          homeTeam: fixt.homeTeamId,
          awayTeam: fixt.awayTeamId,
          competition: fixt.competitionId
        });

        return db
          .collection('fixtures')
          .doc(fixture.id.toString())
          .set(fixture);
      }));
    })
    .then((_fixtures) => {
      fixtures = _fixtures;
      return fixtureMeta.set({lastFetched: Number(new Date())});
    })
    .then(() => {
      return fixtures;
    });
});

exports.fetchCompetitionData = functions.https.onCall((data, context) => {
  // This function was implemented for testing / initializing purposes only and should not be used in production
  throw new functions.https.HttpsError('unavailable', 'This function is disabled');

  // let competition;
  // return axios
  //   .get(`/competitions/${competitionId}`)
  //   .then(response => {
  //     return db
  //       .collection('competitions')
  //       .doc(competitionId.toString())
  //       .set(response.data);
  //   })
  //   .then(comp => {
  //     competition = comp;
  //     return axios.get(`/competitions/${competitionId}/teams`);
  //   })
  //   .then(response => {
  //     return Promise.all(response.data.teams.map(team => {
  //       return db
  //         .collection('teams')
  //         .doc(team.id.toString())
  //         .set(team);
  //     }));
  //   })

  //   .then(teams => {
  //     competition.teams = teams;
  //     return axios.get(`/competitions/${competitionId}/fixtures`);
  //   })
  //   .then(response => {
  //     return Promise.all(response.data.fixtures.map(fixt => {
  //       let fixture = _.omit(fixt, ['homeTeamName', 'awayTeamName', 'homeTeamId', 'awayTeamId', 'competitionId']);
  //       fixture = _.extend(fixture, {
  //         homeTeam: fixt.homeTeamId,
  //         awayTeam: fixt.awayTeamId,
  //         competition: fixt.competitionId
  //       });

  //       return db
  //         .collection('fixtures')
  //         .doc(fixture.id.toString())
  //         .set(fixture);
  //     }));
  //   })
  //   .then(fixtures => {
  //     competition.fixtures = fixtures;
  //     return competition;
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     throw new functions.https.HttpsError('unknown', 'Unknown error');
  //   });
});
