import Vue from 'vue';
import firebase from 'firebase';
import App from './App';
import router from './router/';
import store from './store/';
import AppDate from '@/components/AppDate';

Vue.component('AppDate', AppDate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  beforeCreate() {
    // Initialize Firebase
    const config = {
      apiKey: 'AIzaSyCYxzMp0N4Rz5k4JhiOKJuLI-FkpD5k2tY',
      authDomain: 'vue-forum-grg.firebaseapp.com',
      databaseURL: 'https://vue-forum-grg.firebaseio.com',
      projectId: 'vue-forum-grg',
      storageBucket: 'vue-forum-grg.appspot.com',
      messagingSenderId: '534442582993'
    };
    firebase.initializeApp(config);

    store.dispatch('fetchUser', { id: store.state.authId });
  },
  render: h => h(App)
}).$mount('#app');
