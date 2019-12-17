<template>
	<view class="content">
		<view class="flex_row select-area">
			<input type="text" placeholder="请输入手机号码" v-model="phone" class="flex1" />
		</view>
		<view class="flex_row select-area">
			<input type="text" placeholder="请输入图形验证码" v-model="imgCode" class="flex1" />
			<view class="img-code">
				<imgCode></imgCode>
			</view>
		</view>
		<view class="flex_row select-area">
			<input type="text" placeholder="请输入短信验证码" v-model="phoneCode" class="flex1" />
			<view class="reg-code">
				<regPhoneCode :code_img="imgCode" :callIndex="verifyCode" :mobile="phone" :phoneValidate="2"></regPhoneCode>
			</view>
		</view>
		<view class="flex_row select-area">
			<input type="password" placeholder="请输入新密码(8~16位字母+数字)" v-model="pwd" class="flex1" />
		</view>
		<view class="flex_row select-area">
			<input type="password" placeholder=" 再次输入新密码(8~16位字母+数字)" v-model="pwd2" class="flex1" />
		</view>
		<button v-on:click="forgetLoginPwd" class="btn-save">忘记密码</button>
	</view>
</template>

<script>
	import imgCode from '@/components/ImgVCode.vue'
	import regPhoneCode from '@/components/regPhoneCode'
	import {ForgetLoginPwd} from "@/common/login.js"
	export default {
		components: {imgCode,regPhoneCode},
		data() {
			return {
				phone:"",
				pwd:"",
				pwd2:"",
				imgCode:"",
				phoneCode:"",
				codeUrl:"",
				verifyCode:'verifyCode',
			}
		},
		/*Password,ConfirmPassword,phoneNumber,SmsCode,ImgCode*/
		methods: {
			forgetLoginPwd(){
				if(this.phone==''){
					uni.showModal({
						title: '提示',
						content: "请输入手机号码",
						showCancel:false,
					});
					return
				}
				if(this.imgCode==''){
					uni.showModal({
						title: '提示',
						content: "请输入图形验证码",
						showCancel:false,
					});
					return
				}
				if(this.phoneCode==''){
					uni.showModal({
						title: '提示',
						content: "请输入短信验证码",
						showCancel:false,
					});
					return
				}
				if(this.pwd==''){
					uni.showModal({
						title: '提示',
						content: "请输入新密码",
						showCancel:false,
					});
					return
				}
				if(this.pwd2==''){
					uni.showModal({
						title: '提示',
						content: "请再次输入新密码",
						showCancel:false,
					});
					return
				}
				this.$if0(ForgetLoginPwd,this.pwd,this.pwd2,this.phone,this.phoneCode,this.imgCode).then(res => {
					uni.showModal({
						title: '提示',
						content: "找回密码成功！",
						showCancel:false,
						success: function (res) {
							uni.redirectTo({
								url: '/pages/member/login/login'
							});
						}
					})
				}).catch(err => {
					uni.showModal({
						title: '提示',
						content:  err.Message,
						showCancel:false,
					});
				})
			}
		}
	}
</script>
<style>
	.content{font-size: 32rpx}
.imgCode image{
	width: 200rpx;
	height: 40rpx;
}
	.login-btn button{background: #ff6000;color:#fff;border:0}
	.btn-save{position:fixed;bottom:60rpx;width:70%;left:15%;background-color:#ff6000;color:#fff;}
	.select-area{
		font-size: 28rpx;color:#495060;border-bottom: 1px solid #eeeeee;position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		background: #fff;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		overflow: hidden;
		height:128rpx
	}
</style>
