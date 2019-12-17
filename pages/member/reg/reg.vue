<template>
	<view class="content">
		<view class="title">账户注册</view>
		<view class="flex_row select-area">
			<view class="icons ico-user"></view><input class="phoneText flex1" type='text' placeholder="请输入手机号" v-model="phone"/>
		</view>
		<view class="flex_row select-area">
			<view class="icons ico-yanzhengma"></view>
			<input  class="phoneText flex1"  type="text" placeholder="请输入图形验证码" v-model="imgCode"/>
			<ImgVCode  class="regPhoneCode flex1"></ImgVCode>
		</view>
		<view class="flex_row select-area">
			<view class="icons ico-yanzhengma"></view>
			<input  class="phoneText flex1"  type="text" placeholder="请输入验证码" v-model="phoneCode"/>
			<regPhoneCode callIndex="reg" :code_img="imgCode" :mobile="phone" phoneValidate="1"  class="regPhoneCode flex1"></regPhoneCode>
		</view>
		<view class="flex_row select-area">
			<view class="icons ico-pass"></view><input class="phoneText flex1" type='password' placeholder="请设置密码" v-model="password"/>
		</view>
		<view class="flex_row select-area">
			<view class="icons ico-pass"></view><input class="phoneText flex1" type='text' placeholder="请输入推荐码(选填)" v-model="recommend"/>
		</view>
		<view class="agree">
			<view class="dian" :class="{'active':check==true}" v-on:click="checkProtocol"><text></text></view>我已阅读并同意
			<navigator :url="'/pages/member/protocol/protocol?callIndex='+callIndex" class="protocol-link">《注册协议》</navigator>
		</view>
		<button v-on:click="reg" class="btn-save">保存</button>
		<!-- <view class="imgCode">
			<i-row>
			    <i-col span="16" i-class="col-class">
					<input  class="phoneText"  type="text" placeholder="请输入图形验证码" v-model="imgCode"/>
				</i-col>
			    <i-col span="8" i-class="col-class">
					<img :src="codeUrl" alt="验证码" title="点击切换验证码" @click="toggleVerifyCode()">
				</i-col>
			</i-row>
		</view> -->
		<!--<view class="phoneCode">
			<i-row>
			    <i-col span="16" i-class="col-class">
					<input  class="phoneText"  type="text" placeholder="请输入验证码" v-model="phoneCode"/>
				</i-col>
			    <i-col span="8" i-class="col-class">
					<i-button v-on:click="handleClick" type="primary" shape="circle" size="small" >获取验证码</i-button>
				</i-col>
			</i-row>
		</view>-->
	</view>
</template>

<script>
	import {ImgVCode} from '@/components/ImgVCode';
	import {regPhoneCode} from '@/components/regPhoneCode';
	import {reg} from "@/common/login.js"
	export default {
		components: {
            ImgVCode,
			regPhoneCode
		},
		data() {
			return {
				phone:"",
				phoneCode:"",
				imgCode:"",
				password:"",
				nickName:"",
				recommend:"",
				check:false,
				callIndex:"zhucexieyi"
			}
		},
		onLoad() {
		},
		methods: {
			checkProtocol(){
				if(!this.check){
					this.check=true;
				}else {
					this.check=false;
				}
			},
			reg(){
				if(this.phone == ''){
					uni.showModal({
						title: '提示',
						content: '请输入手机号码',
						success: function (res) {

						}
					});
					return
				}
				if(this.imgCode == ''){
					uni.showModal({
						title: '提示',
						content: '请输入图形验证码',
						success: function (res) {

						}
					});
					return
				}
				if(this.phoneCode == ''){
					uni.showModal({
						title: '提示',
						content: '请输入短信验证码',
						success: function (res) {

						}
					});
					return
				}
				if(this.password == ''){
					uni.showModal({
						title: '提示',
						content: '请设置密码',
						success: function (res) {

						}
					});
					return
				}
				if(!this.check){
					uni.showModal({
						title: '提示',
						content: '请阅读并勾选同意相关协议以完成注册',
						success: function (res) {

						}
					});
					return;
				}
				uni.showLoading({
					title: '提交中',
					mask:true
				});
				this.$if0(reg,this.phone,this.password,this.imgCode,this.phoneCode,this.nickName,this.recommend).then(res => {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: '注册成功！',
						showCancel:false,
						success: function (res) {
							uni.redirectTo({
								url: '/pages/member/login/login'
							});
						}
					});
				}).catch(err=>{
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (res) {

						}
					});
				})
			}
		}
	}
</script>
<style scoped>
	.title{
		line-height: 95rpx;border-bottom: 1rpx solid #eeeeee;font-size:30rpx;}
	.btn-save{position:fixed;bottom:60rpx;width:70%;left:15%;background-color:#ff6000;color:#fff;}
	.select-area{
		font-size: 28rpx;color:#495060;border-bottom: 1rpx solid #eeeeee;position: relative;
		padding: 20rpx 0;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		background: #fff;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		line-height: 1.4;
		overflow: hidden;
		height: 80rpx;
	}
	.select-area .icons{
		display:inline-block;width:110rpx;height: 128rpx;
		}
	.select-area .icons.ico-user{background:url("../../../static/ico/ico-user.png")no-repeat center;
		-webkit-background-size: auto 50rpx;
		background-size: auto 50rpx;}
	.select-area .icons.ico-yanzhengma{background:url("../../../static/ico/ico-yanzhengma.png")no-repeat center;
		-webkit-background-size: auto 50rpx;
		background-size: auto 50rpx;}
	.select-area .icons.ico-pass{background:url("../../../static/ico/ico-pass.png")no-repeat center;
		-webkit-background-size: auto 50rpx;
		background-size: auto 50rpx;}
	/*.select-area .icons image{width:75rpx;height:60rpx;}*/
	.regPhoneCode{
		margin: 20rpx 0;
		text-align: right;
	}
.phoneText{
	border: none;
	padding-left: 10rpx;
}
.imgCode image{
	width: 160rpx;
	height: 40rpx;
	border:1px solid #ddd;
}
	.agree{
		font-size: 28rpx;
		text-align: center;
		padding:30rpx 0rpx;
		white-space: nowrap;
	}
	.agree .dian{
		display:inline-block;
		width:30rpx;height:30rpx;border:1rpx solid #ff6000;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		vertical-align: middle;
		margin-right: 10rpx;
		text-align: center;
		line-height: 30rpx;
	}
	.agree .dian.active text{
		display: inline-block;
		width:20rpx;height:20rpx;background-color:#ff6000;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;}
	.agree .protocol-link{
		display: inline-block;color:#ff6000;}
</style>
