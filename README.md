# keep-alive-page
缓存指定页面，自动创建和销毁，适用于Vue2

## 使用
````js
import Vue from 'vue'
import keepAlivePage from './keep-alive-page'
import store from './store'
import router from './router'

Vue.use(keepAlivePage);
keepAlivePage(router, store);

new Vue({
  router,
  store,
  render(h) {
    return h('keep-alive-page', [
      h('router-view'})
    ])
  }
})
````
