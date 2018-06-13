import { createAction, createReducer } from 'redux-act';
import _ from 'lodash';
import { firebaseAuth, db } from '../firebase';
import { firebase } from '@firebase/app';

const profileLoaded = createAction('Profile loaded');
const profileNotFound = createAction('Profile not found');
const betsUpdated = createAction('Bets updated');

export const getProfile = (userId) => {
  return dispatch => {
    const userDoc = db
      .collection('users')
      .doc(userId || firebaseAuth.currentUser.uid);

    let user;
    return userDoc
      .get()
      .then(_user => {
        user = _user.data();
        return userDoc.collection('bets').get();
      })
      .then(betCollection => {
        const bets = {};
        betCollection.forEach(betDoc => {
          const bet = betDoc.data();
          bets[bet.fixture.id] = {
            id: betDoc.id,
            fixtureId: bet.fixture.id,
            lockDateId: bet.lockDate.id,
            goalsHomeTeam: bet.goalsHomeTeam,
            goalsAwayTeam: bet.goalsAwayTeam
          };
        });

        return bets;
      })
      .then(bets => {
        const profile = Object.assign(user, {bets: bets});
        dispatch(profileLoaded(profile));

        return profile;
      })
      .catch(console.error);
  };
};

const updateBet = _.debounce((bet) => {
  db
    .collection('users')
    .doc(firebaseAuth.currentUser.uid)
    .collection('bets')
    .doc(bet.id)
    .update({
      goalsHomeTeam: bet.goalsHomeTeam,
      goalsAwayTeam: bet.goalsAwayTeam
    });
}, 500);

export const increment = (fixtureId, selector, isKipecheMode) => {
  return (dispatch, getState) => {
    const bets = getState().profile.bets;
    const bet = Object.assign({}, { ...bets[fixtureId] });

    if (bet[selector] === null) {
      bet[selector] = 0;
    } else if (!isKipecheMode) {
      bet[selector]++;
    } else {
      bet[selector] = Math.floor(Math.random() * (10 - bet[selector]) + bet[selector]);
    }

    updateBet(bet);
    bets[fixtureId] = bet;
    dispatch(betsUpdated(bets));

    return bets;
  };
};

export const decrement = (fixtureId, selector, isKipecheMode) => {
  return (dispatch, getState) => {
    const bets = getState().profile.bets;
    const bet = Object.assign({}, { ...bets[fixtureId] });

    if (bet[selector] === null || bet[selector] === 0) {
      bet[selector] = 0;
    } else if (!isKipecheMode) {
      bet[selector]--;
    } else {
      bet[selector] = Math.floor(Math.random() * bet[selector]);
    }

    updateBet(bet);
    bets[fixtureId] = bet;
    dispatch(betsUpdated(bets));

    return bets;
  };
};

export default createReducer({
  [profileLoaded]: (state, profile) => {
    return Object.assign({}, { ...state, info: _.omit(profile, 'bets'), bets: profile.bets, isLoadingProfile: false });
  },
  [profileNotFound]: (state) => {
    return Object.assign({}, { ...state, info: null, bets: null, isLoadingProfile: false });
  },
  [betsUpdated]: (state, bets) => {
    return Object.assign({}, { ...state, bets: Object.assign({}, { ...bets }) });
  }
}, {
  info: {},
  isLoadingProfile: true
});
