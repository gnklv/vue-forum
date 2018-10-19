<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form 
        class="card card-form" 
        @submit.prevent="signIn">
        <h1 class="text-center">Login</h1>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="form.email" 
            type="text" 
            class="form-input">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="form.password" 
            type="password" 
            class="form-input">
        </div>
        <div class="push-top">
          <button 
            type="submit" 
            class="btn-blue btn-block">Log in</button>
        </div>
        <div class="form-actions text-right">
          <router-link :to="{name: 'Register'}">Create an account?</router-link>
        </div>
      </form>
      <div class="push-top text-center">
        <button 
          class="btn-red btn-xsmall" 
          @click="signInViaGoogle"
        >
          <i class="fa fa-google fa-btn"/>
          Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      form: {
        email: null,
        password: null
      }
    };
  },

  created() {
    this.$emit('ready');
  },

  methods: {
    ...mapActions('auth', ['signInWithEmailAndPassword', 'signInWithGoogle']),
    signIn() {
      this.signInWithEmailAndPassword({ email: this.form.email, password: this.form.password })
        .then(() => this.successRedirect())
        .catch(error => alert('🤷‍️' + error.message));
    },
    signInViaGoogle() {
      this.signInWithGoogle()
        .then(() => this.successRedirect())
        .catch(error => alert('🤷‍️' + error.message));
    },
    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' };
      this.$router.push(redirectTo);
    }
  }
};
</script>
