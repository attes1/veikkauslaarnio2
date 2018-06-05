import { createAction, createReducer } from 'redux-act';
import { firebaseApp, firebaseAuth } from '../firebase';

const signInSuccess = createAction('Sign in success');
const signInFailure = createAction('Sign in failed');
const signOutSuccess = createAction('Sign out success');
const signOutFailure = createAction('Sign out success');
const finishRedirectHandle = createAction('Redirect handler finished');

const fbAuthProvider = new firebaseApp.auth.FacebookAuthProvider();

export const signIn = (invitationCode) => {
  return dispatch => {
    return firebaseAuth.signInWithRedirect(fbAuthProvider);
  };
};

export const signOut = () => {
  return dispatch => {
    return firebaseAuth
      .signOut()
      .then(() => {
        dispatch(signOutSuccess());
      })
      .catch(err => {
        dispatch(signOutFailure());
      });
  }
}

export const handleRedirectResult = () => {
  return (dispatch, getState) => {
    if (getState().auth.isHandlingRedirect) {
      return firebaseAuth
        .getRedirectResult()
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          dispatch(finishRedirectHandle());
        });
    }
  }
};

export const checkAuth = () => {
  return (dispatch, getState) => {
    return firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        dispatch(signInSuccess(user));
      }
    });
  }
}

export default createReducer({
  [signInSuccess]: (state, user) => {
    return Object.assign({}, { ...state, user, error: null });
  },
  [signInFailure]: (state, error) => {
    return Object.assign({}, { ...state, user: null, error });
  },
  [signOutSuccess]: (state, user) => {
    return Object.assign({}, { ...state, user: null, error: null });
  },
  [signOutFailure]: (state, error) => {
    return Object.assign({}, { ...state, user: null, error });
  },
  [finishRedirectHandle]: (state) => {
    return Object.assign({}, { ...state, isHandlingRedirect: false });
  }
}, {
  user: null,
  isHandlingRedirect: true
});
