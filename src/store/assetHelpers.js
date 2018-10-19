import Vue from 'vue';

export const makeAppendChildToParentMutation = ({ child }) => (state, { childId, parentId }) => {
  const resource = state[parentId];

  if (!resource[child]) {
    Vue.set(resource, child, {});
  }
  Vue.set(resource[child], childId, childId);
};
