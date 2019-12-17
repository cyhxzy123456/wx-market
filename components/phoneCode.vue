<template>
    <view class="phoneCode">
      <button  @click="forgetCode" class="login_code" v-show="showGet" :disabled="disabled">获取验证码</button>
      <button  class="login_code" v-text="'过'+time+'秒后重试'" v-show="reget"></button>
    </view>
</template>

<script>
  import {getPhoneCode} from '@/common/drawing.js'
    export default {
      name: "phoneCode",
      props: ['callIndex', 'code_img'],
      data() {
        return {
			disabled:false,
          reget: false,//显示倒计时
          time: 60,
          showGet: true,//显示验证码

        }
      },
      methods: {
        //修改登录密码的获取验证码
        forgetCode() {
          if (this.code_img == '') {
              uni.showModal({
                  title: '提示',
                  content: '请输入阿拉伯数字答案',
                  showCancel:false,
              });
              return
          }
		  this.disabled = true
          let result = getPhoneCode('verifyCode', this.code_img)
          result.then((res) => {
              if(res.Result==0){
                  uni.showModal({
                      title: '提示',
                      content: '验证码发送成功',
                      showCancel:false,
                  })
				 
                  this.repeat()
				   this.disabled = false
              }else{
                  uni.showModal({
                      title: '提示',
                      content: res.Message,
                      showCancel:false,
                  })
 this.disabled = false
              }
          })
        },
        repeat() {
          if (this.time > 0) {
            this.timer = setInterval(function () {
              this.time--
            }.bind(this), 1000)
            this.showGet = false//显示验证码
            this.reget = true//显示倒计时
          }
        },
			
		clearTime(){
			clearInterval(this.timer)
			this.reget = false//显示倒计时
			this.showGet = true//显示验证码
			this.time=60
		}
      },
      updated() {
        if (this.time < 0) {
          this.clearTime()
        }
      }
    }

</script>

<style scoped>
/*  .phoneCode{position: absolute;right:0;top:0}*/
.login_code {
  display: inline-block;
  cursor: pointer;
  color: #fff;
  line-height: 60rpx;
  height: 60rpx;
  border: 0;
  font-size: 26rpx;
  text-align: center;
  background-color: #566B96;
}
</style>
