import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import vue3GoogleLogin from "vue3-google-login";

library.add(fas);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app
  .use(router)
  .use(store)
  .use(vuetify)
  .use(vue3GoogleLogin, {
    clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
  })
  .mount("#app");

loadFonts();
