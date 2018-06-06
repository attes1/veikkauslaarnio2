const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const invitationCode = functions.config().veikkauslaarnio.invitation_code;

exports.createUser = functions.auth.user().onCreate(user => {
  const userProfile = {
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    verified: false,
    bets: []
  };

  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set(userProfile)
    .then(user => user)
    .catch(err => {
      console.error(err);
      return user.delete();
    });
});

exports.deleteUser = functions.auth.user().onDelete(user => {
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .delete();
});

exports.verifyUser = functions.https.onCall((data, context) => {
  if (data.code === invitationCode) {
    return admin
      .firestore()
      .collection('users')
      .doc(context.auth.uid)
      .update({
        verified: true
      });
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid invitation code.');
  }
});
