import { createAction, createReducer } from 'redux-act';
import _ from 'lodash';
import Promise from 'bluebird';
import { db } from '../firebase';

const profilesLoaded = createAction('Profiles loaded');

export const getProfiles = () => {
  return (dispatch, getState) => {
    const fixtures = getState().competition.fixtures;
    const users = getState().leaderboard.profiles;

    if (users.length === 0) {
      return db
        .collection('users')
        .where('verified', '==', true)
        .get()
        .then(collection => {
          const bcPromises = [];

          collection.forEach(doc => {
            const user = doc.data();
            users.push(_.extend(user, {id: doc.id, bets: []}));

            const bcPromise = db
              .collection('users')
              .doc(doc.id)
              .collection('bets')
              .where('locked', '==', true)
              .get()
              .then(collection => {
                collection.forEach(doc => {
                  user.bets.push(doc.data());
                });

                user.points = user.bets
                  .filter(bet => {
                    return fixtures[bet.fixture.id].status === 'FINISHED';
                  })
                  .reduce((sum, bet) => {
                    const result = fixtures[bet.fixture.id].result;

                    if (bet.goalsHomeTeam === null || bet.goalsAwayTeam === null || result.goalsHomeTeam === null || result.goalsAwayTeam === null) {
                      return sum;
                    } else if (result.goalsHomeTeam === bet.goalsHomeTeam && result.goalsAwayTeam === bet.goalsAwayTeam) {
                      return sum + 3;
                    } else if (result.goalsHomeTeam > result.goalsAwayTeam && bet.goalsHomeTeam > bet.goalsAwayTeam) {
                      return sum + 1;
                    } else if (result.goalsHomeTeam < result.goalsAwayTeam && bet.goalsHomeTeam < bet.goalsAwayTeam) {
                      return sum + 1;
                    } else if (result.goalsHomeTeam === result.goalsAwayTeam && bet.goalsHomeTeam === bet.goalsAwayTeam) {
                      return sum + 1;
                    } else {
                      return sum;
                    }
                  }, 0);

                  return user;
                });

            bcPromises.push(bcPromise);
          });

          return Promise.all(bcPromises);
        })
        .then(users => {
          dispatch(profilesLoaded(users));
          return users;
        });
      } else {
        dispatch(profilesLoaded(users));
        return Promise.resolve(users);
      }
  }
};

export default createReducer({
  [profilesLoaded]: (state, profiles) => {
    return Object.assign({}, { ...state, profiles: profiles, isLoadingProfiles: false });
  }
}, {
  profiles: [],
  isLoadingProfiles: true
});

