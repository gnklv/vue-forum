<template>
  <div id="app">
    <TheNavbar />
    <div class="container">
      <router-view
        v-show="showPage"
        :key="$route.path"
        @ready="pageReady"/>
      <AppSpinner v-show="!showPage"/>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar';
import AppSpinner from '@/components/AppSpinner';
import NProgress from 'nprogress';

export default {
  components: {
    TheNavbar,
    AppSpinner
  },

  data() {
    return {
      showPage: false
    };
  },

  created() {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    });
    NProgress.start();
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false;
      NProgress.start();
      next();
    });
  },

  methods: {
    pageReady() {
      this.showPage = true;
      NProgress.done();
    }
  }
};
</script>

<style lang="scss">
@import 'assets/css/style.css';
@import '~nprogress/nprogress.css';

#nprogress .bar {
  background: #57ad8d;
}
</style>
