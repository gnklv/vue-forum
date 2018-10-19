import Vue from 'vue';
import firebase from 'firebase';
import { countObjectProperties, removeEmptyProperties } from '@/utils';
import { makeAppendChildToParentMutation } from '@/store/assetHelpers';

export default {
  namespaced: true,

  state: {},

  getters: {
    userPosts: (state, getters, rootState) => id => {
      const user = state[id];
      if (user.posts) {
        return Object.values(rootState.posts)
          .filter(post => post.userId === id);
      }
      return [];
    },
    userThreadsCount: state => id => countObjectProperties(state[id].threads),
    userPostsCount: state => id => countObjectProperties(state[id].posts)
  },

  mutations: {
    appendPostToUser: makeAppendChildToParentMutation({ child: 'posts' }),
    appendThreadToUser: makeAppendChildToParentMutation({ child: 'threads' })
  },

  actions: {
    createUser: ({ state, commit }, { id, email, name, username, avatar = null }) =>
      new Promise((resolve, reject) => {
        const registeredAt = Math.floor(Date.now() / 1000);
        const usernameLower = username.toLowerCase();
        email = email.toLowerCase();
        const user = {
          avatar,
          email,
          name,
          username,
          usernameLower,
          registeredAt
        };

        firebase.database().ref('users').child(id).set(user)
          .then(() => {
            commit('setItem', { resource: 'users', id: id, item: user }, { root: true });
            resolve(state.users[id]);
          });
      }),

    updateUser: ({ commit }, user) => {
      const updates = {
        avatar: user.avatar,
        username: user.username,
        name: user.name,
        bio: user.bio,
        website: user.website,
        email: user.email,
        location: user.location
      };

      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(user['.key']).update(removeEmptyProperties(updates))
          .then(() => {
            commit('setItem', { resource: 'users', id: user['.key'], item: user }, { root: true });
            resolve(user);
          });
      });
    },

    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🙋' }, { root: true }),
    fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' }, { root: true })
  }
};
