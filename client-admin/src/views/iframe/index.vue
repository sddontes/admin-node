<template>
  <div class="app-container">
    <iframe v-if="iframeUrl" name="myIframe" sandbox="allow-forms allow-scripts allow-same-origin" :src="iframeUrl" frameborder="0" />
    <div v-else>无效的外部链接</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
// import { wangpu } from '@/api/users'

@Component({ name: 'wangpu' })
export default class extends Vue {
  private iframeUrl = ''

  get userRoleId() {
    return UserModule.roles[0]
  }

  get name() {
    return UserModule.name
  }

  created() {
    this.iframeUrl = this.$route.meta.url
  }

  mounted() {
    // this.$nextTick(() => {
    // const a = wangpu({})
    // setTimeout(() => {
    //   document.getElementById('boxer').append(a)
    // }, 2000)
    // })
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 50px);
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
