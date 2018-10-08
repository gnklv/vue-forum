<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-large push-top"
  >
    <h1>
      {{ thread.title }}

      <router-link
        :to="{ name: 'ThreadEdit', id }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      <!-- eslint-disable vue/max-attributes-per-line -->
      By <a href="#" class="link-unstyled">{{ user.name }}</a>, <AppDate :timestamp="thread.publishedAt"/>.
      <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small">
        {{ repliesCount }} replies by {{ contributorsCount }} contributors
      </span>
      <!-- eslint-enable vue/max-attributes-per-line -->
    </p>
    <PostList :posts="posts"/>
    <PostEditor :thread-id="id" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor';
import { countObjectProperties } from '@/utils';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  name: 'ThreadShow',
  components: {
    PostList,
    PostEditor
  },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    repliesCount() {
      return this.$store.getters.threadRepliesCount(this.thread['.key']);
    },
    user() {
      return this.$store.state.users[this.thread.userId];
    },
    contributorsCount() {
      return countObjectProperties(this.thread.contributors);
    },
    posts() {
      const postIds = Object.values(this.thread.posts);
      return Object.values(this.$store.state.posts).filter(post =>
        postIds.includes(post['.key'])
      );
    }
  },

  created() {
    this.fetchThread({ id: this.id })
      .then(thread => {
        this.fetchUser({ id: thread.userId });
        return this.fetchPosts({ ids: Object.keys(thread.posts) });
      })
      .then(posts =>
        Promise.all(
          posts.map(post => {
            this.fetchUser({ id: post.userId });
          })
        )
      )
      .then(() => {
        this.asyncDataStatus_fetched();
      });
  },

  methods: {
    ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts'])
  }
};
</script>
