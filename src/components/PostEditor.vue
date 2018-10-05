<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea
        v-model="text"
        cols="30"
        rows="10"
        class="form-input"
      />
    </div>
    <div class="form-actions">
      <button
        v-if="isUpdate"
        class="btn btn-ghost"
        @click.prevent="cancel"
      >Cancel</button>
      <button
        class="btn-blue"
        type="submit"
      >
        {{ isUpdate ? 'Update' : 'Submit Post' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    threadId: {
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    post: {
      type: Object,
      validator: obj => {
        const keyIsValid = typeof obj['.key'] === 'string';
        const textIsValid = typeof obj.text === 'string';
        const valid = keyIsValid && textIsValid;
        if (!textIsValid)
          console.error(
            '😳 The post prop object must include a `text` attribute.'
          );
        if (!keyIsValid)
          console.error(
            '😳 The post prop object must include a `.key` attribute.'
          );
        return valid;
      }
    }
  },
  data() {
    return {
      text: this.post ? this.post.text : ''
    };
  },
  computed: {
    isUpdate() {
      return !!this.post;
    }
  },
  methods: {
    save() {
      this.persist().then(post => {
        this.$emit('save', { post });
      });
    },
    create() {
      const post = {
        text: this.text,
        threadId: this.threadId
      };
      this.text = '';

      this.$emit('save', { post });
      return this.$store.dispatch('createPost', post);
    },
    update() {
      const post = {
        id: this.post['.key'],
        text: this.text
      };

      return this.$store.dispatch('updatePost', post);
    },
    cancel() {
      this.$emit('cancel');
    },
    persist() {
      return this.isUpdate ? this.update() : this.create();
    }
  }
};
</script>
