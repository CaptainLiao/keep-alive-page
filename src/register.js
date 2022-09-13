import keepAliveStore from './store'
import Vue from 'vue'

let _isRouteForward = true

export let _moduleName = null
export let _store = null
export default function register(router, store, {moduleName = 'keepAlive', minMemo = false} = {}) {
  store.registerModule(moduleName, keepAliveStore)
  _moduleName = moduleName
  _store = store

  const _push = router.push.bind(router);
  const _replace = router.replace.bind(router);
  router.push = (...args) => {
    _isRouteForward = true
    _push(...args)
  }
  router.replace = (...args) => {
    _isRouteForward = true
    _replace(...args)
  }

  router.afterEach((to, from) => {
    // 后退时删除，可减少内存消耗，缺点是通过【浏览器按钮】进行导航时都会删除缓存组件
    if (!_isRouteForward && minMemo) {
      const matchedInfo = getMatchedComponent(from, router)
      if (matchedInfo && matchedInfo.id) {
        _store.commit(`${_moduleName}/removeKeepAliveComp`, matchedInfo.index)
      }
      return
    }

    _isRouteForward = false

    const matchedInfo = getMatchedComponent(to, router)
    if (!matchedInfo) return

    if (!matchedInfo.id) {
      _store.commit(`${_moduleName}/addKeepAliveComp`, {
        name: matchedInfo.keepAliveName,
        id: Date.now()
      })
    }
  })

  return removeBeforeRouteForward(router)
}

function removeBeforeRouteForward(router) {
  if (router.beforeHooks.length >= 1) {
    throw new Error('keepAliveManage 需放在beforeEach的首位')
  }

  // 保证 pageA->pageB->pageA，pageA页面能刷新
  router.beforeEach((to, from, next) => {
    const matchedInfo = getMatchedComponent(to, router)
    if (!matchedInfo) return next()

    if (matchedInfo.id && _isRouteForward) {
      _store.commit(`${_moduleName}/removeKeepAliveComp`, matchedInfo.index)
      return Vue.nextTick(() => next())
    }

    return next()
  })
}

function getMatchedComponent(to, router) {
  const matchedComponents = router.getMatchedComponents(to);
  const comp = matchedComponents && matchedComponents[0];
  const keepAliveName = comp && comp.keepAlive && comp.name
  if (!keepAliveName) return null

  const {keepAliveIncludes} = _store.state[_moduleName]
  const idx = keepAliveIncludes.findIndex(i => i.name === keepAliveName)
  const cur = keepAliveIncludes[idx]
  if (cur) {
    return {
      keepAliveName,
      id: cur.id,
      index: idx
    }
  }

  return {
    keepAliveName
  }
}
