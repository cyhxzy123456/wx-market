<template>
	<view>
		<button type="primary" @click="loginEasy">微信快捷登录</button>
		<view class="authorize" v-show="showAuthorize">
			<view>需要用户信息授权</view>
			<view>
				<button open-type="getUserInfo" size="mini" @getuserinfo="bindGetUserInfo">授权</button>
				<button type="primary" size="mini" @click="cancelAuthorize">取消</button>
			</view>
			<view class="">
				<button type="primary" @click="wx_getUserInfo">getUserInfo</button>
				<button type="primary" open-type="getPhoneNumber" @getphonenumber="getPhone">获取电话</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {DecryptPhoneNumber,DecodeEncryptedData} from '@/common/member.js';
	export default {
		data() {
			return {
				showAuthorize:true,
			};
		},
		methods:{
			getPhone(e){
				console.log(e.detail);
				let data = e.detail;
				data.sessionId = uni.getStorageSync('msgKey');
				DecryptPhoneNumber(data).then(res => {
					console.log('解密电话',res)
				})
			},
			bindGetUserInfo (e){
				console.log('授权')
				if(e.detail.userInfo){
					console.log(e.detail.userInfo)
				}else{
					console.log('拒绝')
				}
			},
			wx_getUserInfo(){
				uni.checkSession({
					success() {
						uni.getUserInfo({
							lang:'zh_CN',
							success: function(res) {
								console.log(res);
								let data = res.userInfo;
								data.sessionId = uni.getStorageSync('msgKey');
								DecryptNickName(data).then(res1 => {
									console.log('解密用户信息',res1);
								})
								
							}
						})
					}
				})
			},
			loginEasy(){
				let _this = this;
				uni.authorize({scope: "scope.userInfo"});
				console.log('weixinDenglu');
				wx.getSetting({
				  success (res){
					if (res.authSetting['scope.userInfo']) {
					  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
					  _this.$wxLogin(() => {
						uni.getUserInfo({
							withCredentials:true,
							lang:'zh_CN',
							success: function(res) {
								console.log(res.userInfo)
								uni.showToast({
									title:"登录成功！",
									duration: 2000,
									complete(){
										uni.switchTab({
											url: '/pages/member/home/home'
										})
									}
								});
							}
						})
					  }
					  )
					}else{
						_this.showAuthorize = true;
					}
				  }
				})
				
				// function(){
				// 	wx.getSetting({
				// 	  success (res){
				// 		if (res.authSetting['scope.userInfo']) {
				// 		  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
				// 			uni.getUserInfo({
				// 				withCredentials:true,
				// 				lang:'zh_CN',
				// 				success: function(res) {
				// 					console.log(res.userInfo)
				// 					uni.showToast({
				// 						title:"登录成功！",
				// 						duration: 2000,
				// 						complete(){
				// 							uni.switchTab({
				// 								url: '/pages/member/home/home'
				// 							})
				// 						}
				// 					});
				// 				}
				// 			})
				// 		}else{
				// 			_this.showAuthorize = true;
				// 		}
				// 	  }
				// 	})
				// })
				
				// this.$wxLogin();
			},
			cancelAuthorize(){
				this.showAuthorize = false;
			},
		}
	}
</script>

<style scoped>
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
</style>
