<template>
  <div
    v-if="thread && user"
    class="thread"
  >
    <div>
      <p>
        <router-link :to="{name: 'ThreadShow', params: {id: thread['.key']}}">
          {{ thread.title }}
        </router-link>
      </p>
      <p class="text-faded text-xsmall">
        By <a href="#">{{ user.name }}</a>, <AppDate :timestamp="thread.publishedAt"/>.
      </p>
    </div>
    <div class="activity">
      <p class="replies-count">
        {{ repliesCount(thread['.key']) }} replies
      </p>
      <!--<img class="avatar-medium" src="http://i0.kym-cdn.com/photos/images/facebook/000/010/934/46623-batman_pikachu_super.png" alt="">-->
      <!--<div>-->
      <!--<p class="text-xsmall">-->
      <!--<a href="#">Bruce Wayne</a>-->
      <!--</p>-->
      <!--<p class="text-xsmall text-faded">2 hours ago</p>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    thread: {
      required: true,
      type: Object
    }
  },

  computed: {
    ...mapState({
      users: state => state.users
    }),
    ...mapGetters('threads', {
      repliesCount: 'threadRepliesCount'
    }),
    user() {
      return this.users[this.thread.userId];
    }
  }
};
</script>
