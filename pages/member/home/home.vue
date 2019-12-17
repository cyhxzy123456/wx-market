<template>
	<view class="content-wrap">
		<view class="percenter-index">
			<view class="percenter-top mt20 content">
				<view class="flex_row account">
					<view class="fl flex_row">
						<image :src="userInfo.avator==null?'../../../static/personcenter/mrtx.png':userInfo.avator"></image>
						<view>
							<view class="name">{{userInfo.userName ? userInfo.userName : userInfo.nickName}}</view>
							<!-- <view class="tips">你还未获得赚取奖金权限</view> -->
						</view>
					</view>
					<view class="fr">
						<view>
							<navigator url="/pages/member/setting/setting" class="img-link"><image src="../../../static/personcenter/icon-setting.png" mode="widthFix"></image></navigator>
							<navigator url="/pages/member/message/message" class="img-link"><image src="../../../static/personcenter/icon-duanxin.png" mode="widthFix"></image></navigator>
						</view>
						<navigator url="/pages/member/drawing/drawing"><button type="primary" class="btn-cash">提现</button></navigator>
					</view>
					
				</view>
				<view class="flex_row jifen mt10">
					<navigator url="/pages/member/credit/credit" class="item flex1">
						<view >
							<view>消费积分</view>
							<view>{{integral}}</view>
						</view>
					</navigator>
					<navigator url="/pages/member/reward/reward" class="item flex1">
						<view >
							<view>分享奖金</view>
							<view><span>{{shareMoney}}</span><span>元</span></view>
						</view>
					</navigator>
					<navigator url="/pages/member/recommend/recommend" class="item flex1">
						<view >
							<view>分享人数</view>
							<view>{{recommend}}</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="main-cell">
				<view class="order-list">
					<view class="item">
						<navigator url="/pages/member/orderList/orderList" class="">
							<!-- <text class="num" v-if="orderCount.allCount>0">{{orderCount.allCount}}</text> -->
							<view class="img">
								<image src="../../../static/personcenter/icon-order.png"></image>
							</view>
							<view>我的订单</view>
						</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/member/orderList/orderList?status=0" class="">
							<text class="num" v-if="orderCount.generated >0">{{orderCount.generated}}</text>
							<view class="img">
								<image src="../../../static/personcenter/icon-cash.png"></image>
							</view>
							<view>待付款</view>
						</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/member/orderList/orderList?status=1" class="">
							<text class="num" v-if="orderCount.confirmed >0">{{orderCount.confirmed}}</text>
							<view class="img">
								<image src="../../../static/personcenter/icon-daifa.png"></image>
							</view>
							<view>待发货</view>
						</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/member/orderList/orderList?status=2" class="">
							<text class="num" v-if="orderCount.receipt>0">{{orderCount.receipt}}</text>
							<view class="img">
								<image src="../../../static/personcenter/icon-receive.png"></image>
							</view>
							<view>待收货</view>
						</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/member/orderList/orderList?status=3" class="">
							<!-- <text class="num" v-if="orderCount.succ>0">{{orderCount.succ}}</text> -->
							<view class="img">
								<image src="../../../static/personcenter/icon-finished.png"></image>
							</view>
							<view>已完成</view>
						</navigator>
					</view>
				</view>
				<view class="cell-lists content">
					<!-- <navigator url="/pages/member/credit/credit" class=""><view class="item"><span class="fl">我的积分</span><span class="fr">></span></view></navigator>
					<navigator url="/pages/member/reward/reward" class=""><view class="item"><span class="fl">我的奖金</span><span class="fr">></span></view></navigator> -->
					<navigator open-type="switchTab" url="/pages/member/usercart/usercart" class=""><view class="item"><span class="fl">购物车<text class="num cart-num" v-if="cartCount>0">{{cartCount}}</text></span><span class="fr">></span></view></navigator>
					<navigator url="/pages/member/business/business" class=""><view class="item"><span class="fl">我的分销</span><span class="fr">></span></view></navigator>
					<navigator url="/pages/member/addressMange/addressList" class=""><view class="item"><span class="fl">地址管理</span><span class="fr">></span></view></navigator>
					<navigator url="/pages/member/collect/collectList" class=""><view class="item"><span class="fl">我的收藏</span><span class="fr">></span></view></navigator>
					<navigator url="/pages/member/message/message"><view class="item"><span class="fl">我的消息</span><span class="fr">></span></view></navigator>
					<navigator v-if="!isOpenExtension" url="/pages/member/invitation/invitation"><view class="item"><span class="fl">邀请好友</span><span class="fr">></span></view></navigator>
					<navigator url="/pages/member/orderComment/orderComment"><view class="item"><span class="fl">我的评价</span><span class="fr">></span></view></navigator>
					<view class="item"><button open-type="contact" class="btn-contact"><span class="fl">帮助与客服</span><span class="fr">></span></button></view>
					<navigator url="/pages/member/about/about" class=""><view class="item last-line"><span class="fl">关于</span><span class="fr">></span></view></navigator>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import {getIntegralInfo,getuserBonusInfo,getUserInfo,getOrderCount} from "@/common/rjm-member.js"
	import {getPromote , getshareNum} from "@/common/member.js"
	import {getCartLists} from '@/common/cart.js';
	export default {
		data() {
			return {
				userInfo:null,
				integral:0,
				shareMoney:0,
				cartCount:0,
				orderCount:{},
				isOpenExtension:0,
				recommend:0,
			}
		},
		components: {
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){},
		onShow(){
			this.isOpenExtension = uni.getStorageSync('site_config').isOpenExtension;
			this.getUserInfo();
			// this.getIntegralInfo();
			// this.getuserBonusInfo();
			this.getOrderCount();
			this.getCartList();
			this.$if0(getshareNum).then(res => {
				this.recommend = res.Data.refCount;
				this.integral = res.Data.integralBalance;
				this.shareMoney = res.Data.bonusBalance;
			}).catch(err => {
				console.log(err);
			})
		},
		methods: {
			getCartList(){//获取购物车列表

				this.$if0(getCartLists , 1,10).then(res => {
					this.cartCount = res.Data.PageCount
				})
			},
			getUserInfo(){
				getUserInfo().then(res => {
					this.userInfo=res;
					if(!res.phoneNumber){
						this.$logOut();
						return;
					}
				})
			},
			getIntegralInfo(){
				getIntegralInfo().then(res => {
					this.integral=Math.abs(res.Data.integralBalance);
				})
			},
			getuserBonusInfo(){
				getuserBonusInfo().then(res => {
					this.shareMoney=res.Data.bonusBalance;
				})
			},
			getOrderCount(){
				this.$if0(getOrderCount).then(res => {
					this.orderCount=res.Data;
					console.log(res.Data)
					//this.shareMoney=res.Data.bonusCount;
				}).catch(err=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						success: function (res) {

						}
					});
				})
			}
		}
	}
</script>

<style>
	.content-wrap{padding-bottom: 100rpx;}
	.percenter-index{background-color: #eeeeee;font-size: 28rpx;}
	.percenter-index .percenter-top{background-color: #fff;}
	.percenter-index .account .fl image{width:124rpx;height:124rpx;margin-right: 20rpx;}
	.percenter-index .account .fl{width:70%;white-space: nowrap;}
	.percenter-index .account .fl view{width: 70%;}
	.percenter-index .account .fl .name{font-weight: 700;font-size: 30rpx;}
	.percenter-index .account .fl .tips{color:#666666}
	.percenter-index .account .fr{text-align: right;width:30%;}
	.percenter-index .account .fr .img-link{display: inline-block;}
	.percenter-index .account .fr .img-link image{width:40rpx;}
	.percenter-index .account .fr .img-link+.img-link{margin-left:30rpx;}
	.percenter-index .account .fr .btn-cash{background-color: #ff6000;width:180rpx;height:60rpx;line-height: 60rpx;margin:20rpx 0rpx;border-radius: 20rpx;float:right}
	.percenter-index .jifen{
		padding-bottom:20rpx;
		font-weight: 700;
		justify-content: space-around;
	}
	.percenter-index .jifen .item{
		width:30%;
		text-align: center;
	}
	.percenter-index .jifen .item+.item{border-left: 1rpx solid #dddddd;}
	.percenter-index .main-cell{margin-top:20rpx;background-color: #fff;}
	.percenter-index .main-cell .order-list{padding:50rpx 0rpx 30rpx;display: flex;flex-direction: row;font-size:28rpx;}
	.percenter-index .main-cell .item{position:relative;width:20%;text-align: center;white-space: nowrap;}
	.percenter-index .main-cell .item .num{position: absolute;right: 10rpx;top:-25rpx;border: 1rpx solid #ff3a3a;color:#ff3a3a;font-size: 24rpx;width:30rpx;height:30rpx;line-height:30rpx;border-radius: 50%;}
	.percenter-index .main-cell .item .img{height:60rpx;line-height: 60rpx;padding: 10rpx 0rpx;}
	.percenter-index .main-cell .item image{height:57rpx;width:70rpx;}
	.percenter-index .cell-lists .item{padding:30rpx 0;overflow: hidden;width:100%;border-top:1rpx solid #dddddd;}
	.percenter-index .cell-lists .item .fl{color:#333;}
	.percenter-index .cell-lists .item .fr{color:#666;}
	.percenter-index .main-cell .item .cart-num{
		position: static;
		display: inline-block;
		background: red;
		color: white;
		margin-left: 10rpx;
		
	}
	.last-line{border-bottom:1rpx solid #dddddd;}
	.btn-contact{border:none;outline:none;background:#ffffff;padding:0;margin:0;
		line-height: 1.4;
		font-size: 28rpx;
		color: #333333;}
	.btn-contact::after{border:none;}
</style>
