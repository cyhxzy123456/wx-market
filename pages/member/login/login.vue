<template>
	<view class="content">
		<!-- <view class="tit">账户登录</view>
		<view class="login-put">
			<ico class="ico-user ico"></ico><input class="phoneText" type='text' placeholder="请输入用户手机号" v-model="phone"/>
		</view>
		<view class="login-put" v-show="showPass">
			<ico class="ico ico-pass"></ico><input class="phoneText" type='password' placeholder="请输入登录密码" v-model="password"/>
		</view>
		<view class="imgCode login-put">
			<i-row>
			    <i-col span="16" i-class="col-class">
					<ico class="ico ico-yanzheng"></ico><input  class="phoneText"  type="text" placeholder="请输入图形验证码" v-model="imgCode"/>
				</i-col>
			    <i-col span="8" i-class="col-class">
					<img :src="codeUrl" alt="验证码" title="点击切换验证码" @click="toggleVerifyCode()">
				</i-col>
			</i-row>
		</view>
		<view class="phoneCode" v-show="showPhoneCode">
			<i-row>
				<i-col span="16" i-class="col-class">
					<ico class="ico ico-yanzheng"></ico>
					<input  class="phoneText"  type="text" placeholder="请输入验证码" v-model="phoneCode"/>
				</i-col>
				<i-col span="8" i-class="col-class">
					<view class="mobile-code">
						<RegPhoneCode :code_img="imgCode" :callIndex="verifyCode" :mobile="phone" :phoneValidate="0"></RegPhoneCode>
					</view>
				</i-col>
			</i-row>
		</view>
		<view class="forget">
			<navigator class="forget-btn" url="/pages/member/login/forget">忘记密码</navigator>
			<text class="phone-reg" @click="showCode">使用短信登录</text>
		</view>
		<button class="login-btn" @click="userLogin" v-show="showPass">登录</button>
		<button class="login-btn" @click="userLoginByPhone" v-show="showPhoneCode">登录</button> -->
		<button type="primary" @click="loginEasy" class="wx_easy">微信快捷登录</button>
		<!-- <view class="go-reg">
			没有账号？<navigator class="reg-btn" url="/pages/member/reg/reg">马上注册!</navigator>
		</view> -->
		<view class="">

			<!-- <button type="primary" @click="wx_getUserInfo">getUserInfo</button>
			<button type="primary" open-type="getPhoneNumber" @getphonenumber="getPhone">获取电话</button> -->
		</view>
		<view v-if="showAuthorize" class="mask_bg" @tap="maskClose" @touchmove.stop.prevent="preventD">
			<view class="authorize"  @tap.stop="">
				<view>需要您的用户信息授权</view>
				<view>
					<button type="primary" open-type="getUserInfo" size="mini" @getuserinfo="bindGetUserInfo">去授权</button>
					<button  size="mini" @click="cancelAuthorize">取消</button>
				</view>
		</view>
		</view>

		<view v-if="showPhone" class="mask_bg" @tap="maskClose" @touchmove.stop.prevent="preventD">
			<view class="authorize"  @tap.stop="">
				<view>需要您的手机号码授权</view>
				<view>
					<button type="primary" open-type="getPhoneNumber" size="mini" @getphonenumber="getPhone">去授权</button>
					<button  size="mini" @click="cancelAuthorize">取消</button>
				</view>
		</view>
		</view>

	</view>
</template>

<script>
	import iRow from 'iview-mpvue/dist/components/row/row';
	import iCol from 'iview-mpvue/dist/components/col/col';
	import iButton from 'iview-mpvue/dist/components/button/button';
	import {getSendCode,Login,LoginBySms} from '@/common/login.js';
	import {DecryptPhoneNumber,DecodeEncryptedData , DecryptNickName} from '@/common/member.js';
	import regPhoneCode from '@/components/regPhoneCode';
	import {host} from "@/common/net.js";
	import log from "@/common/log.js";
	export default {
		components: {regPhoneCode,
			'i-row': iRow,
			'i-col': iCol,
			'i-button': iButton
		},
		data() {
			return {
				phone:"",
				password:"",
				imgCode:"",
				phoneCode:"",
				codeUrl:"",
				token:'',
				showAuthorize:false,
				showPhone:false,
				cryPhone:'',
				fromGoodsDetail:false,
				showPhoneCode:false,
				showPass:true,
				verifyCode:"verifyCode",
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(opt) {
			if(opt.fromGoodsDetail){
				this.fromGoodsDetail = true;
			}
			this.toggleVerifyCode();
				wx.getSetting({
					success:res => {
						console.log(res)
					}
				})
		},
		onShow(){

		},

		methods: {
			showCode(){
				this.showPhoneCode=true
				this.showPass=false
			},
			preventD(){return false;},
			maskClose(){
				this.showPhone = false;
				this.showAuthorize = false;
			},
			getPhone(e){
				let _this = this;
				let data = e.detail;
				if(data.iv){
					console.log('同意电话')
					this.cryPhone = data;
					this.showPhone = false;
					data.sessionId = _this.$getMsgKey();
					uni.showLoading({
						title:''
					})
					this.$if0(DecryptPhoneNumber , data).then(res => {
						uni.hideLoading();
						if(res.Data.access_token){
							try {
								let overTime = new Date().getTime() + res.Data.expires_in * 600;
								let app = getApp();
								let gd;
								let tk;
								if(app){
									gd = app.globalData;
								}
								if(gd){
									tk = gd._token;
									tk.access_token = res.Data.access_token;
									tk.refresh_token = res.Data.refresh_token;
									tk.overTime = overTime;
								}
								uni.setStorageSync('access_token', res.Data.access_token);
								uni.setStorageSync('refresh_token', res.Data.refresh_token);
								uni.setStorageSync('overTime', overTime);
							} catch (error) {
								console.log(error);
								log.warn('登录页getPhone储存storage错误err：' , error);
							}
						}
						console.log('解密电话',res);
						uni.showToast({
							title:"登录成功！",
							duration: 2000,
							complete(){
								// if(_this.fromGoodsDetail){
									// uni.navigateBack({});
								// }
								uni.switchTab({
									url: '/pages/member/home/home'
								})
							}
						});
					}).catch(err => {
						uni.hideLoading();
						console.log(err);
						log.warn('登录页getPhone执行DecryptPhoneNumber进入catch' , err);
						_this.$errToast(err);
					})
				}else{
					console.log('拒绝电话')
				}
			},
			bindGetUserInfo (e){
				let _this = this;
				console.log('授权')
				if(e.detail.userInfo){
					// console.log(e.detail.userInfo)
					this.showAuthorize = false;
					uni.showLoading({
						title:''
					})
					let fromPromote = uni.getStorageSync('fromPromote');
					_this.$wxLogin((hasPhone) => {
						uni.hideLoading();
						_this.userInfoHandle(hasPhone);
					},fromPromote)
				}else{
					console.log('拒绝')
				}
			},
			wx_getUserInfo(){
				let _this = this;
				uni.checkSession({
					success() {
						uni.getUserInfo({
							lang:'zh_CN',
							success: function(res) {
								let data = res.userInfo;
								data.sessionId = _this.$getMsgKey();
								DecryptNickName(data).then(res1 => {
									console.log('解密用户信息',res1);
								})

							}
						})
					}
				})
			},
			userInfoHandle(hasPhone){
				let _this = this;
				uni.getUserInfo({
					withCredentials:true,
					lang:'zh_CN',
					success: function(res) {
						// console.log(res.userInfo);
						let data = res.userInfo;
						data.sessionId = _this.$getMsgKey();
						uni.showLoading({
							title:''
						})
						_this.$if0(DecryptNickName,data).then(res1 => {
							console.log('解密用户信息',res1);
							uni.hideLoading();
							if(hasPhone){
								uni.showToast({
									title:"登录成功！",
									duration: 2000,
									complete(){
										// if(_this.fromGoodsDetail){
										// 	uni.navigateBack({});
										// }
										uni.switchTab({
											url: '/pages/member/home/home'
										})
									}
								});
							}else{
								_this.showPhone = true;
							}
						}).catch(err => {
							uni.hideLoading();
							console.log(err);
							log.warn('登录页userInfoHandle执行DecryptNickName进入catch' , err);
							_this.$errToast(err);
						})
					},
					fail(err){
						log.warn('登录页userInfoHandle获取用户信息进入fail' , err);
					}
				})
			},
			loginEasy(){
				let _this = this;
				uni.authorize({scope: "scope.userInfo"});
				wx.getSetting({
				  success (res){
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称
						uni.showLoading({
							title:''
						})
						let fromPromote = uni.getStorageSync('fromPromote');
						_this.$wxLogin((hasPhone) => {
							_this.userInfoHandle(hasPhone);
						} , fromPromote)
					}else{
						_this.showAuthorize = true;
					}
					},
					fail(err){
						log.warn('登录页loginEasy获取授权设置fail' , err);
					}
				})
			},
			cancelAuthorize(){
				this.showAuthorize = false;
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			handleClick:function(){//获取短信验证码
				this.$if0(getSendCode , this.phone,this.imgCode).then(res => {
					console.log(res)
				})
			},
			userLogin:function(){//登录
				let _this = this;
				uni.showLoading({
				    title: '登录中',
					mask:true,
				});
				this.$if0(Login , this.phone,this.password,this.imgCode,this.phoneCode).then(res => {
					console.log(res.data)
					uni.hideLoading();
					uni.setStorage({
						key: 'access_token',
						data: res.Data.access_token
					});
					uni.setStorage({
						key: 'refresh_token',
						data:res.Data.refresh_token
					});
					let overTime = new Date().getTime() + res.Data.expires_in * 600
					uni.setStorage({
						key: 'overTime',
						data: overTime
					});
					this.token = res.Data.access_token;
					uni.showToast({
						title:"登录成功！",
						duration: 2000,
						complete(){
							// if(_this.fromGoodsDetail){
							// 	uni.navigateBack({});
							// }
							uni.switchTab({
								url: '/pages/member/home/home'
							})
						}
					});

				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
					    title: err.Message,
						icon:'none',
						duration: 5000
					});
				})
			},
			//短信验证码登录
			userLoginByPhone:function(){//登录
				let _this = this;
				uni.showLoading({
					title: '登录中',
					mask:true,
				});
				this.$if0(LoginBySms , this.phone,this.imgCode,this.phoneCode).then(res => {
					console.log(res.data)
					uni.hideLoading();
					uni.setStorage({
						key: 'access_token',
						data: res.Data.access_token
					});
					uni.setStorage({
						key: 'refresh_token',
						data:res.Data.refresh_token
					});
					let overTime = new Date().getTime() + res.Data.expires_in * 600
					uni.setStorage({
						key: 'overTime',
						data: overTime
					});
					this.token = res.Data.access_token;
					uni.showToast({
						title:"登录成功！",
						duration: 2000,
						complete(){
							// if(_this.fromGoodsDetail){
							// 	uni.navigateBack({});
							// }
							uni.switchTab({
								url: '/pages/member/home/home'
							})
						}
					});

				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err.Message,
						icon:'none',
						duration: 5000
					});
				})
			},
			toggleVerifyCode:function() {
				this.codeUrl = host + '/api/verifyCode/getCode?' + new Date()
			}
		}
	}
</script>
<style>
	.mobile-code{padding-top:30rpx}
	.phoneCode{border-bottom: 1px solid #eee}
	.go-reg{text-align: center;padding-top:40rpx}
	.reg-btn{color:#ff6000;display: inline-block}
	.ico{display:inline-block;width:110rpx;height: 128rpx;float:left}
	.ico-user{background: url("../../../static/ico/ico-user.png") no-repeat center;background-size: auto 50rpx;}
	.ico-pass{background: url("../../../static/ico/ico-pass.png") no-repeat center;background-size: auto 50rpx;}
	.ico-yanzheng{background: url("../../../static/ico/ico-yanzhengma.png") no-repeat center;background-size: auto 50rpx;}
	.forget-btn{display: inline-block;line-height: 150rpx;}
	.phone-reg{color:#ff6000;line-height: 150rpx;float:right}
	.content{font-size: 32rpx}
	.tit{line-height:90rpx;border-bottom: 1px solid #eee;font-size: 36rpx}
	.login-put{border-bottom: 1px solid #eee;line-height: 128rpx;}
	.login-put input{border:0;}
	.wx_easy{
		margin: 30rpx 0;
	}
	.mask_bg{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0,0,0,.7)
	}
	.authorize{
		position: fixed;
		top: 40%;
		width: 700rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		background-color: #2DB7F5;
		text-align: center;
	}
.phoneText{
	height: 128rpx;font-size: 32rpx;color:#bbb
}
.code_btn{
	font-size: 24rpx;
}
.imgCode image{
	width: 200rpx;
	height: 40rpx;
}
	.login-btn {background: #ff6000;color:#fff;border:0}
</style>
