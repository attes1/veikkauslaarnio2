import { createAction, createReducer } from 'redux-act';
import { firebaseApp, firebaseAuth, firebaseFunctions, firebaseStore } from '../firebase';

const signInSuccess = createAction('Sign in success');
const signInFailure = createAction('Sign in failed');
const signOutSuccess = createAction('Sign out success');
const signOutFailure = createAction('Sign out success');
const finishRedirectHandle = createAction('Redirect handler finished');
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

export const handleRedirectResult = () => {
  return (dispatch, getState) => {
    if (getState().auth.isHandlingRedirect) {
      return firebaseAuth
        .getRedirectResult()
        .then(result => {
          if (!result.user) {
            // Remove spinner after 2 secs if not already removed
            setTimeout(() => {
              if (getState().auth.isHandlingRedirect) {
                dispatch(finishRedirectHandle());
              }
            }, 2000);
          }
        })
        .catch(err => {
          console.error(err);
          dispatch(finishRedirectHandle());
        });
    }
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

            if (userProfile) {
              if (userProfile.verified) {
                dispatch(signInSuccess(userProfile));
              } else {
                dispatch(requireInvitationCode());
              }
            }
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
    return Object.assign({}, { ...state, user: null, error: null, isHandlingRedirect: false });
  },
  [signOutFailure]: (state, error) => {
    return Object.assign({}, { ...state, user: null, error });
  },
  [finishRedirectHandle]: (state) => {
    return Object.assign({}, { ...state, isHandlingRedirect: false });
  },
  [requireInvitationCode]: (state) => {
    return Object.assign({}, { ...state, invitationCodeRequired: true, isHandlingRedirect: false });
  },
  [invitationCodeValid]: (state) => {
    return Object.assign({}, { ...state, invitationCodeRequired: false, isHandlingRedirect: false });
  }
}, {
  user: null,
  isHandlingRedirect: true,
  invitationCodeRequired: false
});
