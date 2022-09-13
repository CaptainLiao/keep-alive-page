import register from './register'
import widget from './widget'

const keepAlivePage = register
keepAlivePage.install = install

export default keepAlivePage

function install(Vue) {
  if (install.installed) return
  install.installed = true

  Vue.component('KeepAlivePage', widget)
}

