<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input 
        id="thread_title" 
        v-model="form.title"
        type="text" 
        class="form-input" 
        name="title">
    </div>
    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea 
        id="thread_content" 
        v-model="form.text"
        class="form-input" 
        name="content" 
        rows="8" 
        cols="140"/>
    </div>
    <div class="btn-group">
      <button 
        class="btn btn-ghost" 
        @click.prevent="cancel">Cancel</button>
      <button 
        class="btn btn-blue" 
        type="submit" 
        name="Publish">{{ isUpdate ? 'Update' : 'Publish' }}</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      form: {}
    };
  },

  computed: {
    isUpdate() {
      return !!this.title;
    }
  },

  created() {
    const { title, text } = this;
    this.form = { title, text };
  },

  methods: {
    save() {
      this.$emit('save', { title: this.form.title, text: this.form.text });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
