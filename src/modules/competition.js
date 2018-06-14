import { createAction, createReducer } from 'redux-act';
import _ from 'lodash';
import Promise from 'bluebird';
import { db } from '../firebase';

const fixturesLoaded = createAction('Fixtures loaded');
const lockDatesLoaded = createAction('Lock dates loaded');
const teamsLoaded = createAction('Teams loaded');

export const getLockDates = () => {
  return (dispatch, getState) => {
    const lockDates = getState().competition.lockDates;

    if (_.isEmpty(lockDates)) {
      return db
        .collection('lockDates')
        .get()
        .then(collection => {
          const lockDates = {};
          collection.forEach(doc => {
            const d = new Date(0);
            d.setUTCSeconds(doc.data().value.seconds);
            lockDates[doc.id] = d;
          });
          dispatch(lockDatesLoaded(lockDates));

          return lockDates;
        });
      } else {
        return Promise.resolve(lockDates);
      }
  };
};

export const getTeams = () => {
  return (dispatch, getState) => {
    const teams = getState().competition.teams;

    if (_.isEmpty(teams)) {
      return db
        .collection('teams')
        .get()
        .then(collection => {
          const teams = {};
          collection.forEach(doc => {
            teams[doc.id] = doc.data();
          });
          dispatch(teamsLoaded(teams));

          return teams;
        });
    } else {
      return Promise.resolve(teams);
    }
  };
};

export const getFixtures = () => {
  return (dispatch, getState) => {
    const fixtures = getState().competition.fixtures;

    if (_.isEmpty(fixtures)) {
      return db
        .collection('fixtures')
        .get()
        .then(collection => {
          const fixtures = {};
          collection.forEach(doc => {
            fixtures[doc.id] = doc.data();
            fixtures[doc.id].date = new Date(fixtures[doc.id].date);
          });
          dispatch(fixturesLoaded(fixtures));

          return fixtures;
        });
    } else {
      return Promise.resolve(fixtures);
    }
  };
};

export const addFixtureObserver = () => {
  return dispatch => {
    return db
      .collection('fixtures')
      .onSnapshot(fixtures => {
        dispatch(fixturesLoaded(fixtures.data()));
      });
  }
};

export default createReducer({
  [fixturesLoaded]: (state, fixtures) => {
    return Object.assign({}, { ...state, fixtures: fixtures, isLoadingFixtures: false });
  },
  [lockDatesLoaded]: (state, lockDates) => {
    return Object.assign({}, { ...state, lockDates: lockDates, isLoadingLockDates: false });
  },
  [teamsLoaded]: (state, teams) => {
    return Object.assign({}, { ...state, teams: teams, isLoadingTeams: false });
  }
}, {
  fixtures: {},
  lockDates: {},
  teams: {},
  isLoadingTeams: true,
  isLoadingFixtures: true,
  isLoadingLockDates: true
});
