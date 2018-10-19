<template>
  <div class="forum-list">
    <h2 class="list-title">
      <router-link :to="{name: 'Category', params: {id: category['.key']}}">
        {{ category.name }}
      </router-link>
    </h2>
    <ForumList :forums="categoryForums"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ForumList from './ForumList';

export default {
  components: {
    ForumList
  },

  props: {
    category: {
      required: true,
      type: Object
    }
  },

  computed: {
    ...mapState({
      forums: state => state.forums
    }),
    categoryForums() {
      return Object.values(this.forums)
        .filter(forum => forum.categoryId === this.category['.key']);
    }
  }
};
</script>
