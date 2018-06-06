import { createAction, createReducer } from 'redux-act';
import { firebaseApp, firebaseAuth, firebaseFunctions, firebaseStore } from '../firebase';

const signInSuccess = createAction('Sign in success');
const signInFailure = createAction('Sign in failed');
const signOutSuccess = createAction('Sign out success');
const signOutFailure = createAction('Sign out success');
const finishAuthenticating = createAction('Finished authenticating');
const requireInvitationCode = createAction('Require invitation code');
const invitationCodeValid = createAction('Valid invitation code entered');

const fbAuthProvider = new firebaseApp.auth.FacebookAuthProvider();

export const signIn = () => {
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
};

export const checkAuth = () => {
  return (dispatch, getState) => {
    return firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        return firebaseStore
          .collection('users')
          .doc(user.uid)
          .onSnapshot(userSnapshot => {
            const userProfile = userSnapshot.data();

            if (userProfile && userProfile.verified) {
              dispatch(signInSuccess(userProfile));
            } else {
              dispatch(requireInvitationCode());
            }
          });
      } else {
        return firebaseAuth
          .getRedirectResult()
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            dispatch(finishAuthenticating());
          });
      }
    });
  }
};

export const verifyUser = (code) => {
  return dispatch => {
    firebaseFunctions
      .httpsCallable('verifyUser')({code: code})
      .then(result => {
        dispatch(invitationCodeValid());
      })
      .catch(err => {
        console.error(err);
      });
  };
};

export default createReducer({
  [signInSuccess]: (state, user) => {
    return Object.assign({}, { ...state, user, error: null });
  },
  [signInFailure]: (state, error) => {
    return Object.assign({}, { ...state, user: null, error });
  },
  [signOutSuccess]: (state, user) => {
    return Object.assign({}, { ...state, user: null, error: null, isAuthenticating: false });
  },
  [signOutFailure]: (state, error) => {
    return Object.assign({}, { ...state, user: null, error });
  },
  [finishAuthenticating]: (state) => {
    return Object.assign({}, { ...state, isAuthenticating: false });
  },
  [requireInvitationCode]: (state) => {
    return Object.assign({}, { ...state, invitationCodeRequired: true, isAuthenticating: false });
  },
  [invitationCodeValid]: (state) => {
    return Object.assign({}, { ...state, invitationCodeRequired: false, isAuthenticating: false });
  }
}, {
  user: null,
  isAuthenticating: true,
  invitationCodeRequired: false
});
