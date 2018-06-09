import { createAction, createReducer } from 'redux-act';

export const showNavigation = createAction('Navigation shown');
export const hideNavigation = createAction('Navigation hidden');

export default createReducer({
  [showNavigation]: (state) => {
    return Object.assign({}, { isNavigationVisible: true });
  },
  [hideNavigation]: (state) => {
    return Object.assign({}, { isNavigationVisible: false });
  }
}, {
  isNavigationVisible: false
});
