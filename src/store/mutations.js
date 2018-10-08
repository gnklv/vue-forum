import Vue from 'vue';

const makeAppendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = state[parent][parentId];
    if (!resource[child]) {
      Vue.set(resource, child, {});
    }
    Vue.set(resource[child], childId, childId);
  };
};

export default {
  setItem: (state, { resource, id, item }) => {
    item['.key'] = id;
    Vue.set(state[resource], id, item);
  },

  setAuthId: (state, id) => {
    state.authId = id;
  },

  appendPostToThread: makeAppendChildToParentMutation({
    parent: 'threads',
    child: 'posts'
  }),

  appendContributorToThread: makeAppendChildToParentMutation({
    parent: 'threads',
    child: 'posts'
  }),

  appendPostToUser: makeAppendChildToParentMutation({
    parent: 'users',
    child: 'posts'
  }),

  appendThreadToForum: makeAppendChildToParentMutation({
    parent: 'forums',
    child: 'threads'
  }),

  appendThreadToUser: makeAppendChildToParentMutation({
    parent: 'users',
    child: 'threads'
  })
};
