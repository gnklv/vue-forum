<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-large push-top"
  >
    <h1>{{ thread.title }}
      <router-link
        :to="{name: 'ThreadEdit', id}"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By
      <a 
        href="#" 
        class="link-unstyled">
        {{ user.name }}
      </a>,
      <AppDate :timestamp="thread.publishedAt"/>.
      <span 
        style="float:right; margin-top: 2px;" 
        class="hide-mobile text-faded text-small"
      >
        {{ repliesCount(thread['.key']) }} replies by {{ contributorsCount }} contributors
      </span>
    </p>
    <PostList :posts="filteredPosts"/>
    <PostEditor
      v-if="authUser"
      :thread-id="id"
    />
    <div 
      v-else 
      class="text-center" 
      style="margin-bottom: 50px;"
    >
      <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign in</router-link> or
      <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">Register</router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { countObjectProperties } from '@/utils';
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
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
    ...mapState({
      threads: state => state.threads,
      users: state => state.users,
      posts: state => state.posts
    }),
    ...mapGetters({
      authUser: 'auth/authUser',
      repliesCount: 'threads/threadRepliesCount'
    }),
    thread() {
      return this.threads[this.id];
    },
    user() {
      return this.users[this.thread.userId];
    },
    contributorsCount() {
      return countObjectProperties(this.thread.contributors);
    },
    filteredPosts() {
      const postIds = Object.values(this.thread.posts);
      return Object.values(this.posts)
        .filter(post => postIds.includes(post['.key']));
    }
  },

  created() {
    this.fetchThread({ id: this.id })
      .then(thread => {
        this.fetchUser({ id: thread.userId });
        return this.fetchPosts({ ids: Object.keys(thread.posts) });
      })
      .then(posts =>
        Promise.all(posts.map(post => {
          this.fetchUser({ id: post.userId });
        }))
      )
      .then(() => {
        this.asyncDataStatus_fetched();
      });
  },

  methods: {
    ...mapActions('posts', ['fetchPosts']),
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUser'])
  }
};
</script>
