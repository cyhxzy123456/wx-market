
<template>
 <view class="img">
     <image :src="codeUrl" alt="验证码" title="点击切换验证码" @click="toggleVerifyCode()"></image>
 </view>
</template>

<script>
  import {host} from '@/common/net.js'
  export default {
    data() {
      return {
        codeUrl: String
      }
    },

    methods: {
      toggleVerifyCode() {
        this.codeUrl = host + '/api/verifyCode/getCode?' + new Date()
      }
    },
    mounted() {
      this.toggleVerifyCode()
    }
  }
</script>
<style scoped>
  .img image{width: 200rpx;height:70rpx;}
</style>
