<template>
  <div 
    v-if="asyncDataStatus_ready"
    class="col-full push-top"
  >
    <h1>Editing <i>{{ thread.title }}</i></h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ThreadEditor from '@/components/ThreadEditor';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  components: {
    ThreadEditor
  },

  mixins: [asyncDataStatus],

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState({
      threads: state => state.threads,
      posts: state => state.posts
    }),
    thread() {
      return this.threads[this.id];
    },
    text() {
      const post = this.posts[this.thread.firstPostId];
      return post ? post.text : null;
    }
  },

  created() {
    this.fetchThread({ id: this.id })
      .then(thread => this.fetchPost({ id: thread.firstPostId }))
      .then(() => { this.asyncDataStatus_fetched(); });
  },

  methods: {
    ...mapActions('posts', ['fetchPost']),
    ...mapActions('threads', ['updateThread', 'fetchThread']),
    save({ title, text }) {
      this.updateThread({ id: this.id, title, text }).then(() => {
        this.$router.push({ name: 'ThreadShow', params: { id: this.id } });
      });
    },
    cancel() {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } });
    }
  }
};
</script>
