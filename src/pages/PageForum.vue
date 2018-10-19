<template>
  <div
    v-if="asyncDataStatus_ready"
    class="forum-wrapper"
  >
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link
          :to="{name: 'ThreadCreate', params: {forumId: forum['.key']}}"
          class="btn-green btn-small"
        >
          Start a thread
        </router-link>
      </div>
    </div>
    <div class="col-full push-top">
      <ThreadList :threads="filteredThreads"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ThreadList from '@/components/ThreadList';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  components: {
    ThreadList
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
      forums: state => state.forums,
      threads: state => state.threads
    }),
    forum() {
      return this.forums[this.id];
    },
    filteredThreads() {
      return Object.values(this.threads)
        .filter(thread => thread.forumId === this.id);
    }
  },

  created() {
    this.fetchForum({ id: this.id })
      .then(forum => this.fetchThreads({ ids: forum.threads }))
      .then(threads =>
        Promise.all(threads.map(thread =>
          this.fetchUser({ id: thread.userId }))))
      .then(() => { this.asyncDataStatus_fetched(); });
  },

  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreads']),
    ...mapActions('users', ['fetchUser'])
  }
};
</script>

<style scoped>
.forum-wrapper {
  width: 100%;
}
</style>
