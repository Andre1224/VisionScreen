<!--
  针对/sellerpage路径显示出来
  在这个组件中，通过子组件注册的方式，要显示Seller.vue这个组件
-->
<template>
  <div class="com-page">
    <seller></seller>
  </div>

</template>

<script>
import seller from '@/components/seller'

export default {
  name: 'SellerPage',
  data () {
    return {}
  },
  methods: {},
  components: {
    seller
  }
}
</script>

<style scoped>

</style>
