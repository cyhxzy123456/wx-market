<template>
<view class="page">
	<view class="content">
		<view class="pay_info">
			<view class="order_icon"></view>
			<view class="order_text">订单提交成功</view>
			<view class="order_text">
			<view class="example-body">
			  请在<uni-count-down :show-day="false" :hour="00" :minute="59" :second="59" :show-colon="false" 
			  @timeup="timeup" color="#FFFFFF" background-color="#FF6000" border-color="#FF6000"/>内完成支付
			</view>
			</view>
			<view class="order_text">支付金额<text>￥{{totalPrice}}</text></view>
		</view>
		<view class="pay_type">
			<view class="type_title">支付方式</view>
			<uni-list>
				<uni-list-item title="微信支付" :thumb="'/static/order/wechat.png'">
					<template v-slot:right>
						<label class="radio"><radio style="transform:scale(0.7);" color="#FF6000" value="1" checked="true" /></label>
					</template>
				</uni-list-item>
				<!-- <uni-list-item title="支付宝支付" :thumb="'/static/order/zhifubao.png'">
					<template v-slot:right>
						<label class="radio"><radio style="transform:scale(0.7);" color="#FF6000" value="2" /></label>
					</template>
				</uni-list-item> -->
			</uni-list>
		</view>
		<button @click="toPay">确定</button>
	</view>
	<view v-if="showAuthorize" class="mask_bg" @tap="maskClose" @touchmove.stop.prevent="">
			<view class="toast_bot" @tap.stop="">
				<view class="to_cont">需要您的用户信息授权</view>
				<view class="flex_row btns">
					<button type="primary" open-type="getUserInfo" size="mini" @getuserinfo="bindGetUserInfo" class="to_btn flex_a">去授权</button>
					<button class="to_btn flex_a" size="mini" @click="maskClose">取消</button>
				</view>
			</view>
		</view>
		<view v-if="showPhone" class="mask_bg" @tap="maskClose" @touchmove.stop.prevent="">
			<view class="toast_bot" @tap.stop="">
				<view class="to_cont">需要您的手机号码授权</view>
				<view class="flex_row btns">
					<button type="primary" open-type="getPhoneNumber" size="mini" @getphonenumber="getPhone" class="to_btn flex_a">去授权</button>
					<button class="to_btn flex_a" size="mini" @click="maskClose">取消</button>
				</view>
			</view>
		</view>
</view>
</template>

<script>
	import log from "@/common/log.js"
	import {wx_pay} from "@/common/member.js"
	import {DecryptPhoneNumber,DecodeEncryptedData , DecryptNickName} from '@/common/member.js';
	import uniList from '@/components/uni-list';
	import uniListItem from '@/components/uni-list-item';
	import uniCountDown from '@/components/uni-count-down';
	export default {
		components: {
			uniList,
			uniListItem,
			uniCountDown
		},
		data() {
			return {
				totalPrice:"",
				orderNo:'',
				orderId:"",
				showAuthorize:false,
				showPhone:false,
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(opt) {
			console.log(opt);
			this.totalPrice=opt.price;
			this.orderNo = opt.orderNo;
			this.orderId = opt.orderId;
		},
		methods: {
			maskClose(){
				this.showAuthorize = false;
				this.showPhone = false;
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
						title:'',
						mask:true,
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
								log.warn('支付页getPhone储存storage错误err：' , error);
							}
						}
						console.log('解密电话',res);
						uni.showToast({
							title:"登录成功！",
							duration: 2000,
							complete(){
								_this.maskClose();
								_this.pay();
							}
						});
					}).catch(err => {
						uni.hideLoading();
						console.log(err);
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
						title:'',
						mask:true,
					})
					let fromPromote = uni.getStorageSync('fromPromote');
					_this.$wxLogin((hasPhone) => {
						uni.hideLoading();
						_this.userInfoHandle(hasPhone);
					} , fromPromote)
				}else{
					console.log('拒绝')
				}
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
							title:'',
							mask:true,
						})
						_this.$if0(DecryptNickName,data).then(res1 => {
							console.log('解密用户信息',res1);
							uni.hideLoading();
							if(hasPhone){
								uni.showToast({
									title:"登录成功！",
									duration: 2000,
									complete(){
										_this.maskClose();
										_this.pay();
									}
								});
							}else{
								_this.showAuthorize = false;
								_this.showPhone = true;
							}
						}).catch(err => {
							uni.hideLoading();
							console.log(err);
							let app , tk;
							try {
								app = getApp();
							} catch (error) {	
								console.log(error);
								app = error;							
							}
							try {
								tk = uni.getStorageSync('access_token');
							} catch (error) {
								tk = error;
							}
							log.setFilterMsg('userinfo_error');
							log.warn('支付userInfoHandle执行DecryptNickName进入catch错误信息：' , err , 'app:', app , 'storageToken:' , tk);
							_this.$errToast(err);
						})
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
								title:'',
								mask:true,
							})
							let fromPromote = uni.getStorageSync('fromPromote');
							_this.$wxLogin((hasPhone) => {
								_this.userInfoHandle(hasPhone);
							} , fromPromote)
						}else{
							_this.showAuthorize = true;
						}
				  }
				})
			},
			toPay(){
				let _this = this;
				uni.checkSession({
					success(res){
						console.log('wx登录有效',res);
						if(uni.getStorageSync('access_token') && _this.$getMsgKey()){
							_this.pay();
						}else{
							_this.loginEasy();
						}
					},
					fail(){
						console.log('wx登录失效');
						_this.loginEasy();
					}
				})
				return;
				
			},
			pay(){
				this.$if0(wx_pay , this.orderNo).then(res => {
					let data = res.Data;
					data.signType = 'MD5';
					data.success = (res) => {
						console.log('succ' , res)
						uni.redirectTo({
							url: '/pages/member/pay/payOk?orderId='+this.orderId
						});
					}
					data.fail = (fai => {
						console.log('fai' , fai);
					})
					data.complete = com => {
						log.setFilterMsg('pay');
						log.info('订单号:' + this.orderNo , '支付结果：' , com);
					}
					
					wx.requestPayment(data);
				}).catch(err => {
					console.log(err);
					this.$errToast(err);
				})
			},
			timeup() {
			  uni.showToast({
			    title: '时间到'
			  })
			}
		}
	}
</script>

<style lang="scss">
.pay_info{
	width: 100%;
	text-align: center;
}
.pay_info .order_text{
	line-height: 60rpx;
	color:#666666;
	font-size: 32rpx;
}
.pay_info .order_text text{
	color: #FF6000;
}
.pay_info .order_icon{
	width: 140rpx;
	height: 140rpx;
	background: url(~@/static/order/payIcon.png) no-repeat;
	background-size: 100% 100%;
	margin: 70rpx auto;
}
.pay_type .type_title{
	width: 95%;
	padding:0 2.5%;
	color: #333333;
	font-size: 32rpx;
	line-height: 80rpx;
}
 .title {
    margin: 80upx 0 20upx 0;
  }
	.mask_bg{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0,0,0,.7)
	}
	.toast_bot{
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 20rpx 0 ;
		box-sizing: border-box;
		background-color: #fff;
		.to_cont{
			padding: 0 20rpx 20rpx;
			text-align: center;
			font-size: 30rpx;
			color: #333;
		}
		.btns{
			justify-content: space-between;
		}
	}
</style>
