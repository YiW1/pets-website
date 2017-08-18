// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './vuex/store'
import routes from './router/index'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Icon from 'vue-svg-icon/Icon.vue'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.component('icon', Icon)
Vue.http.options.emulateJSON = true;


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    // sessionStorage.removeItem('user');
    sessionStorage.setItem("userName", '');
    sessionStorage.setItem("adminId", '');
    sessionStorage.setItem("orgName", '');
    sessionStorage.setItem("auth", '');
    sessionStorage.setItem("areaCode", '');

  }
  if(sessionStorage.getItem("userName")==='' && to.path != '/login'){
    alert("未登陆");
    next({path: '/login'})
  } else{
    next()
  }
  // sessionStorage.setItem("userName", 'test');
  // sessionStorage.setItem("adminId", '');
  // sessionStorage.setItem("orgName", '宁波效实中学');
  // sessionStorage.setItem("auth", '2');
  // sessionStorage.setItem("areaCode", '315000');
})

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
