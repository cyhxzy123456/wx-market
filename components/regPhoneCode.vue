<template>
  <view class="phoneCode">
    <button  @click="forgetCode" class="login_code" v-show="showGet" :disabled="disabled">获取验证码</button>
    <button  class="login_code" v-text="'过'+time+'秒后重试'" v-show="reget"></button>
  </view>
</template>

<script>
  import {getRegCode} from '@/common/drawing.js'
  export default {
    name: "regPhoneCode",
    props: ['callIndex', 'code_img','mobile','phoneValidate'],
    data() {
      return {
        reget: false,//显示倒计时
        time: 60,
        showGet: true,//显示验证码
		disabled:false
      }
    },
    methods: {
      //登录前的获取验证码
      forgetCode() {
        if(this.mobile.length<11||this.mobile.substring(0,1)!=1){
          uni.showModal({
            title: '提示',
            content: '手机号码格式不正确',
            showCancel:false,
          });
          return
        }
        if (this.code_img == '') {
          uni.showModal({
            title: '提示',
            content: '请输入阿拉伯数字答案',
            showCancel:false,
          });
          return
        }
		this.disabled = true
        let result = getRegCode(this.mobile,this.code_img,this.callIndex,this.phoneValidate)
        result.then((res) => {
          if(res.Result==0){
            uni.showModal({
              title: '提示',
              content: '验证码发送成功',
              showCancel:false,
            });
            this.repeat()
			this.disabled = false
          }else{
            uni.showModal({
              title: '提示',
              content: res.Message,
              showCancel:false,
            });
			this.disabled = false
          }
        })
      },
      repeat() {
        const self = this
        if (self.time > 0) {
          self.timer = setInterval(function () {
            self.time--
          }.bind(this), 1000)
          self.showGet = false//显示验证码
          self.reget = true//显示倒计时
        }
      }
    },
    updated() {
      if (this.time <=0) {
        clearInterval(this.timer)
        this.reget = false//显示倒计时
        this.showGet = true//显示验证码
        this.time=60
      }

    }
  }

</script>

<style scoped>
/*  .phoneCode{position: absolute;right:0;top:0}*/
  .login_code {background: #FF6100;width:195rpx;vertical-align: text-bottom;font-size: 30rpx;border-radius: 0;
    line-height:70rpx;text-align: center;color:#fff;box-sizing: border-box;padding:0;
  }
</style>
