<template>
	<view class="page">
		<view class="content">
			<view class="input_wrap" @tap="toSearch">
				<image src="/static/ico/ico-search.png" mode="aspectFit"></image>
				<input type="text" value="" disabled confirm-type="search" :placeholder="searchTip" @confirm="search" />
			</view>
			<swiper :indicator-dots="true" circular :autoplay="true" :interval="5000" :duration="1000">
				<swiper-item v-for="ad in adList" :key="ad.id" @click="tonav(ad.remark)">
					<view class="swiper-item"><image class="ad_list" :src="ad.imgUrl" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="nav_tabs">
				<view class="nav_tab">
					<navigator url="/pages/goods/cheapGoods/cheapGoods" hover-class="none">
						<view class="nav_ico nav_ico1">
							
						</view>
						超值商品
					</navigator>
				</view>
				<view class="nav_tab">
					<navigator url="/pages/index/activityRules/activityRules">
						<view class="nav_ico nav_ico2">
							
						</view>
						赚钱攻略
					</navigator>
				</view>
				<view class="nav_tab">
					<navigator url="/pages/member/business/business">
						<view class="nav_ico nav_ico4">
							
						</view>
						分销申请
					</navigator>
				</view>
				<view class="nav_tab" v-if="!showExtension">
					<navigator  url="/pages/member/invitation/invitation">
						<view class="nav_ico nav_ico3">
							
						</view>
						分享赚钱
					</navigator>
				</view>
			</view>
		</view>
		<view class="line" v-if="activity_list.length > 0"></view>
		<view class="content activity_wrap" v-if="activity_list.length > 0">
			<view class="activity">
				<swiper :indicator-dots="true"  :interval="5000" :duration="1000">
					<swiper-item v-for="(act) in activity_list" @click="tonav1(act.callIndex)" :key="act.id">
						<view class="swiper-item"><image class="act_list" :src="act.imgUrl" mode="scaleToFill"></image></view>
					</swiper-item>
					<swiper-item @click="tonav1(2)">
						<view class="swiper-item">更多活动</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="line"></view>
		<view class="reward_wrap">
			<view class="reward_title">奖品获得记录</view>
			<view class="reward_notice" >
					<view v-if="show_reward" class="reward_notice_items" @transitionend="reward_end" :animation="animationData">
						<view class="reward_notice_item" v-for="(r , i) in reward_list" :key="i"><view class="nickName">{{r.nickName}}</view><text class="reward_info">{{r.zhaiyao}}</text></view>
					</view>
					<view v-if="reward_list.length == 0" class="no_reward"><view>暂无数据</view><view>快去购物或邀请好友获得奖品/分享金吧</view></view>
			</view>
		</view>
		<view class="line" v-if="listTop.length > 0"></view>
		<view class="content" v-if="listTop.length > 0">
			<view class="nav_title flex_row">
				<view class="nav_title_item flex1">
					置顶商品
				</view>
				<navigator url="/pages/goods/cheapGoods/cheapGoods?type=1" class="nav_link flex1 txt_r">
					更多>
				</navigator>
			</view>
			<goods-sq :list="listTop"></goods-sq>
			
		</view>
		<view class="line" v-if="listCheap.length > 0"></view>
		<view class="content" v-if="listCheap.length > 0">
			<view class="nav_title flex_row">
				<view class="nav_title_item flex1">
					超值商品
				</view>
				<navigator url="/pages/goods/cheapGoods/cheapGoods?type=3" class="nav_link flex1 txt_r">
					更多>
				</navigator>
			</view>
			<goods-sq :list="listCheap"></goods-sq>
			
		</view>
		<view class="line" v-if="listHot.length > 0"></view>
		<view class="content" v-if="listHot.length > 0">
			<view class="nav_title flex_row">
				<view class="nav_title_item flex1">
					热销商品
				</view>
				<navigator url="/pages/goods/cheapGoods/cheapGoods?type=2" class="nav_link flex1 txt_r">
					更多>
				</navigator>
			</view>
			<goods-sq :list="listHot"></goods-sq>
			
		</view>
		<view class="line">
		</view>
		<view class="content" v-if="listYou.length > 0">
			<view class="nav_title flex_row">
				<view class="nav_title_item flex1">
					推荐商品
				</view>
			</view>
			<goods-row :list="listYou"></goods-row>
			<i-load-more :tip="loadTip" @tap="getList" :loading="loading" />
		</view>
		<view v-if="showMask" class="mask_bg" @tap="maskClose" @touchmove.stop.prevent="">
			<view class="toast_bot" @tap.stop="">
				<view class="to_cont">登录才能参加分享赚钱活动哦</view>
				<view class="flex_row btns">
					<button type="primary" @click="loginEasy" size="mini" class="to_btn flex_a">微信快捷登录</button>

					<!-- <button class="to_btn flex_a" size="mini" @click="toLogin">账号密码登录</button> -->
				</view>
			</view>
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
		<view class="tel" v-if="ourTel != ''" @click="phoneUs"></view>
	</view>
</template>

<script>
	import log from "@/common/log.js"
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import {goodsSq} from "@/components/goods-sq"
	import {goodsRow} from "@/components/goods-row"
	import {getGoods , getCheapGoods , getGoodsYou , GetBonusList , getHotGoods , getTopGoods} from "@/common/goods.js"
	import {getSiteInfo,getWebSiteConfig} from "@/common/site.js"
	import {adListIndex , searchHotKey , GetCategoryChildren} from "@/common/ArticleShows.js"
	import {DecryptPhoneNumber,DecodeEncryptedData , DecryptNickName} from '@/common/member.js';
	import {fileHost} from "@/common/net.js";
	export default {
		data() {
			return {
				activity_list:[],
				searchTip: '搜索',
				adList:[],
				listCheap:[],
				listYou:[],
				listTop:[],
				listHot:[],
				pageIndex:1,
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				showMask:false,
				showAuthorize:false,
				showPhone:false,
				showExtension:0,
				reward_list:[],
				animationData:{},
				animation:{},
				duration:1500,
				ourTel:'',
				show_reward:true,
			}
		},
		onShareAppMessage(res) {
			let obj = this.$share();
			log.warn('warn:share：' + obj.path);
			return obj;
		},
		onLoad(){
			let _this = this;
			this.$if0(GetBonusList).then(res => {
				if(res.Data.Data.length > 3){
					this.reward_list = res.Data.Data.concat(res.Data.Data.slice(0,3));
				}else{
					this.reward_list = res.Data.Data;
				}
				if(this.reward_list.length == 0){
					this.show_reward = false;
				}else{
					this.show_reward = true;
				}
				if(this.reward_list.length > 3) this.animation_action();
			}).catch(err => {
				this.$errToast(err);
			})
		},
		onShow() {
			let _this = this;
			this.$if0(adListIndex).then(res => {
				this.adList = res.Data;
			}).catch(err => {console.log(err)})
			this.$if0(GetCategoryChildren ,'HDHB').then(
				res => {
					if(res.Data && res.Data.length){
						this.activity_list = res.Data.slice(0 , 2);
					}
				}
			).catch(err => {
				console.log(err);
			})
			_this.$if0(getTopGoods).then(res => {
				this.listTop = res.Data.Data;
			}).catch(err => {console.log(err)});
			_this.$if0(getHotGoods).then(res => {
				this.listHot = res.Data.Data;
			}).catch(err => {console.log(err)});
			_this.$if0(getCheapGoods).then(res => {
				this.listCheap = res.Data.Data;
			}).catch(err => {console.log(err)});
			this.hasMore = true;
			this.listYou = [];
			this.pageIndex = 1;
			this.getList();
			
			let app = getApp();
			if(app.globalData.siteInfo){
				uni.setNavigationBarTitle({title:app.globalData.siteInfo.wechat})
				_this.ourTel = app.globalData.siteInfo.tel;
			}else{
				getSiteInfo().then(res => {
					try{
						if(res.wechat){uni.setNavigationBarTitle({title:res.wechat})}
						_this.ourTel = res.tel;
					}catch(e){
						//TODO handle the exception
					}
				}).catch(err => {})
			}
			getWebSiteConfig().then(res=>{
				this.showExtension = res.isOpenExtension
				try {
				    uni.setStorageSync('site_config', res);
				} catch (e) {
				    // error
				}
			})
			if(!uni.getStorageSync('access_token')){
				uni.hideTabBar();
				this.showMask = true;
			}
		},
		onHide(){
			this.maskClose()
		},
		methods: {
			phoneUs(){
				uni.makePhoneCall({
					phoneNumber: this.ourTel
			});
			},
			animation_action(){
				let _this = this;
				let dur = _this.reward_list.length - 3;
				let animation = uni.createAnimation({
					duration: _this.duration * dur + (Math.random()*10),
					timingFunction: 'linear',
				})
				animation.top(-40 * dur - 4 + 'rpx').step().top('0rpx').step({
					duration: 0,
					timingFunction: 'step-start',
				})
				this.animation = animation;
				this.animationData = animation.export();
			},
			reward_end(){
				this.animation_action();
			},
			resetReward(){
				this.reward_top = 0;
			},
			tonav1(f){
				switch(f){
					case 'zpcj':
						uni.navigateTo({
							url:"/pages/activity/luck/luck",
						})
						break;
					case 'fxhy':
						uni.navigateTo({
							url:"/pages/ADself/ADself",
						})
						break;
					case 2 :
						uni.navigateTo({
							url:"/pages/activity/activity_list/activity_list",
						})
						break;
				}
			},
			tonav(f){
				switch(f){
					case 'HDGZ':
						uni.navigateTo({
							url:"/pages/index/activityRules/activityRules",
						})
						break;
					case 'ADself':
						uni.navigateTo({
							url:"/pages/ADself/ADself",
						})
						break;
				}
			},
			toLogin(){
				uni.navigateTo({
					url:"/pages/member/login/login",
				})
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
								log.warn('首页getPhone储存storage错误err：' , error);
							}
						}
						console.log('解密电话',res);
						uni.showToast({
							title:"登录成功！",
							duration: 2000,
							complete(){
								_this.maskClose();
							}
						});
					}).catch(err => {
						uni.hideLoading();
						console.log(err);
						log.warn('首页getPhone执行DecryptPhoneNumber进入catch' , err);
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
									}
								});
							}else{
								_this.showMask = false;
								_this.showAuthorize = false;
								_this.showPhone = true;
							}
						}).catch(err => {
							uni.hideLoading();
							let app_tk , tk;
							try {
								app_tk = getApp()._token;
							} catch (error) {	
								console.log(error);
								app_tk = error;							
							}
							try {
								tk = uni.getStorageSync('access_token');
							} catch (error) {
								tk = error;
							}
							log.setFilterMsg('userinfo_error');
							log.warn('首页userInfoHandle执行DecryptNickName进入catch错误信息：' , err , 'app:', app_tk , 'storageToken:' , tk);
							try {
								log.warn('绑定用户信息系统信息',wx.getSystemInfoSync())
								
							} catch (error) {
								
							}
							_this.$errToast(err);
						})
					},
					fail(err){
						log.warn('首页userInfoHandle获取用户信息fail' , err);
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
							_this.showMask = false;
							_this.showAuthorize = true;
						}
					},
					fail(err){
						log.warn('首页loginEasy获取授权设置fail' , err);
					}
				})
			},
			maskClose(){
				this.showMask = false;
				this.showAuthorize = false;
				this.showPhone = false;
				uni.showTabBar();
			},
			toSearch(){
				uni.navigateTo({
					url:'/pages/goods/search/search'
				})
			},
			search(e){
				let v = '';
				if(e.detail.value == ''){
					v = this.searchTip;
				}else{
					v = e.detail.value;
				}
				console.log('search' , v)
			},
			getList(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				this.$if0(getGoodsYou , this.pageIndex , 10).then(res => {
					if(res.Data.Data.length + this.listYou.length <= res.Data.PageCount){
						this.loading = false;
						this.pageIndex++;
						this.listYou = this.listYou.concat(res.Data.Data);
					}else{
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
					if(res.Data.Data.length < 10){
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
					if(res.Data.Data.length + this.listYou.length == res.Data.PageCount){
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
				}).catch(err => {console.log(err)})
			},
		},
		components:{
			goodsSq,
			goodsRow,
			iLoadMore
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 20rpx;
	}
	.tel{
		width: 80rpx;
		height: 80rpx;
		position: fixed;
		top: 70%;
		right: 6rpx;
		border-radius: 50%;
		// border: 4rpx solid #ff7b56;
		background-image: url(~@/static/ico/ico-tel.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: 90% 90%;
		background-color: #fff;
		box-shadow: 0 0 6rpx 4rpx rgba(238,91,0,.5);
	}
	.activity_wrap{
		padding: 20rpx 20rpx;
	}
	.activity{
		width: 710rpx;
		height: 240rpx;
		background-color: #ccc;
		border-radius: 10rpx;
		swiper{
			width: 100%;
			height: 100%;
			margin: 0;
			.swiper-item{
				width: 100%;
				height: 100%;
				font-size: 32rpx;
				line-height: 240rpx;
				text-align: center;
			}
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.ad_list{
		width: 100%;
		height: 350rpx;
	}
	.input_wrap{
		width: 708rpx;
		height: 78rpx;
		margin-top: 20rpx;
		padding: 10rpx 10rpx;
		box-sizing: border-box;
		border: 1rpx solid #ccc;
		border-radius: 20rpx;
		image{
			width: 34rpx;
			height: 34rpx;
			margin-right: 20rpx;
			line-height: 58rpx;
			vertical-align: middle;
		}
		
		input{
			display: inline-block;
			width: calc(100% - 78rpx);
			height: 58rpx;
			line-height: 58rpx;
			vertical-align: middle;
			font-size: 28rpx;
		}
	}
	swiper{
		width: 100%;
		height: 350rpx;
		margin-top: 30rpx;
		overflow: hidden;
		border-radius: 10rpx;
		background-color: #eee;
	}
	.nav_tabs{
		width: 100%;
		height: 200rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.nav_tab{
		flex: 1;
		width: 130rpx;
		text-align: center;
		font-size: 32rpx;
		.nav_ico{
			width: 100rpx;
			height: 100rpx;
			margin: 0 auto;
			border-radius: 50%;
			background-position: center;
			background-size: 48rpx 48rpx;
			background-repeat: no-repeat;
			color: #333333;
		}
		.nav_ico1{
			background-color: #ff696a;
			background-image: url(~@/static/ico/ico-cheap.png);
		}
		.nav_ico2{
			background-color: #07de7e;
			background-image: url(~@/static/ico/ico-usercart.png);
		}
		.nav_ico3{
			background-color: #ff7b56;
			background-image: url(~@/static/ico/ico-share.png);
		}
		.nav_ico4{
			background-color: #ab71e1;
			background-image: url(~@/static/ico/ico-business.png);
		}
	}
	.nav_title{
		height: 100rpx;
		background-color: #fff;
		color: #333;
		.nav_title_item{
			font-size: 38rpx;
		}
		.nav_link{
			font-size: 26rpx;
			color: #666;
		}
	}
	goods-sq{
		width: 100%;
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
	.reward_wrap{
		width: 100%;
		position: relative;
		padding-top: 10rpx;
		overflow: hidden;
		.reward_mask{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}
		.reward_title{
			text-align: center;
			font-size: 34rpx;
		}
		.reward_notice{
			box-sizing: border-box;
			height: 120rpx;
			margin: 20rpx;
			overflow: hidden;
			position: relative;
			.reward_notice_items{
				position: absolute;
				top: 0;
				.reward_info{
					display: inline-block;
					width: 514rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
			.no_reward{
				width: 100%;
				height: 100%;
				font-size: 28rpx;
				color: #666;
				text-align: center;
			}
			.reward_hide{
				display: none;
			}
			.reward_notice_item{
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				color: #666;
				.nickName{
					width: 150rpx;
					text-align: center;
					display: inline-block;
					vertical-align: top;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.reward_info{
					margin-left: 10rpx;
					vertical-align: top;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>
