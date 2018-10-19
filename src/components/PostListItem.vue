<template>
  <div
    v-if="post && user"
    class="post"
  >

    <div class="user-info">
      <a 
        href="#" 
        class="user-name">{{ user.name }}</a>
      <a href="#">
        <img 
          :src="user.avatar" 
          class="avatar-large" 
          alt="">
      </a>
      <p class="desktop-only text-small">{{ userThreadsCount(post.userId) }} threads</p>
      <p class="desktop-only text-small">{{ userPostsCount(post.userId) }} posts</p>
    </div>

    <div class="post-content">
      <template v-if="!editing">
        <div>
          {{ post.text }}
        </div>
        <a 
          href="#" 
          style="margin-left: auto;" 
          class="link-unstyled" 
          title="Make a change" 
          @click.prevent="editing = true"
        >
          <i class="fa fa-pencil"/>
        </a>
      </template>
      <template v-else>
        <PostEditor
          :post="post"
          @save="editing = false"
          @cancel="editing = false"
        />
      </template>
    </div>

    <div class="post-date text-faded">
      <div 
        v-if="post.edited" 
        class="edition-info"
      >
        edited
      </div>
      <AppDate :timestamp="post.publishedAt"/>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PostEditor from './PostEditor';

export default {
  components: {
    PostEditor
  },

  props: {
    post: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      editing: false
    };
  },

  computed: {
    ...mapState({
      users: state => state.users
    }),
    ...mapGetters('users', ['userPostsCount', 'userThreadsCount']),
    user() {
      return this.users[this.post.userId];
    }
  }
};
</script>
