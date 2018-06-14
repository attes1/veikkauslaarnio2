import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'
import authReducer from './authentication';
import commonReducer from './common';
import profileReducer from './profile';
import competitionReducer from './competition';
import leaderboardReducer from './leaderboard';

export default combineReducers({
  router: routerReducer,
  form: formReducer,
  common: commonReducer,
  auth: authReducer,
  profile: profileReducer,
  competition: competitionReducer,
  leaderboard: leaderboardReducer
});
