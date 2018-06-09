import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'
import authReducer from './authentication';
import commonReducer from './common';

export default combineReducers({
  router: routerReducer,
  form: formReducer,
  common: commonReducer,
  auth: authReducer
});
