import firebase from 'firebase';

export default {
  namespaced: true,

  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },

  getters: {
    authUser: (state, getters, rootState) => state.authId ? rootState.users[state.authId] : null
  },

  mutations: {
    setAuthId: (state, id) => {
      state.authId = id;
    },

    setUnsubscribeAuthObserver: (state, unsubscribe) => {
      state.unsubscribeAuthObserver = unsubscribe;
    }
  },

  actions: {
    initAuthentication: ({ dispatch, commit, state }) =>
      new Promise((resolve, reject) => {
        // unsubscribe observer if already listening
        if (state.unsubscribeAuthObserver) state.unsubscribeAuthObserver();

        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log('👣 the user has changed');
          if (user) {
            dispatch('fetchAuthUser')
              .then(dbUser => resolve(dbUser));
          } else {
            resolve(null);
          }
        });
        commit('setUnsubscribeAuthObserver', unsubscribe);
      }),

    registerUserWithEmailAndPassword: ({ dispatch }, { email, name, username, password, avatar = null }) =>
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => dispatch('createUser', { id: user.uid, email, name, username, password, avatar }))
        .then(() => dispatch('fetchAuthUser')),

    signInWithEmailAndPassword: (context, { email, password }) =>
      firebase.auth().signInWithEmailAndPassword(email, password),

    signInWithGoogle: ({ dispatch }) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithPopup(provider)
        .then(data => {
          const user = data.user;

          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
              if (!snapshot.exists()) {
                return dispatch('users/createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL }, { root: true })
                  .then(() => dispatch('fetchAuthUser'));
              }
            });
        });
    },

    signOut: ({ commit }) => firebase.auth().signOut().then(() => { commit('setAuthId', null); }),

    fetchAuthUser: ({ dispatch, commit }) => {
      const userId = firebase.auth().currentUser.uid;
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(userId).once('value', snapshot => {
            if (snapshot.exists()) {
              return dispatch('users/fetchUser', { id: userId }, { root: true })
                .then(user => {
                  commit('setAuthId', userId);
                  resolve(user);
                });
            } else {
              resolve(null);
            }
          });
      });
    }
  }
};
