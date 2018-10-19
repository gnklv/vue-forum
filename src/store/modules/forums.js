import { makeAppendChildToParentMutation } from '@/store/assetHelpers';

export default {
  namespaced: true,

  state: {},

  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ child: 'threads' })
  },

  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '🌧' }, { root: true }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '🌧'}, { root: true })
  }
}