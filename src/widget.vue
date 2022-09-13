<!--  -->
<template>
  <keep-alive v-if="max > 0" :max="max" :include="keepAliveInclude"><slot></slot></keep-alive>
  <keep-alive v-else :include="keepAliveInclude"><slot></slot></keep-alive>
</template>

<script>
import {_store, _moduleName} from './register'
export default {
  props: {
    max: {
      type: Number,
    }
  },
  computed: {
    keepAliveInclude() {
      return _store.state[_moduleName].keepAliveIncludes.map(i => i.name)
    }
  },
}
</script>
