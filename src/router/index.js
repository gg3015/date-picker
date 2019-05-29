import Vue from 'vue'
import Router from 'vue-router'
import { getMineRouter } from './primary/index'
Vue.use(Router)

let loadLazy = (str) => {
  return (resolve) => require([`@/views/${str}.vue`], resolve)
}
export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: [
    ...getMineRouter(loadLazy)
  ]
})
