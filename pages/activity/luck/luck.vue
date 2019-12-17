<template>
  <view class="page">
    <view class="luck_map flex_row">
      <view v-for="l in list" class="luck_item flex_a flex_col" :class="{active:l.active}" :key="l.content">
				<image class="luck_logo" mode="aspectFit" :src="l.logo"></image>
				<view class="luck_title">{{l.title}}</view>
			</view>
    </view>

		<view class="luck_info">
			<text>我的抽奖次数:{{luck_cunt}}次</text>
			<text class="fr" @click="toPrizeLog">我的记录</text>
		</view>
    <button class="luck_start" @click="luck">点击抽奖</button>
		<view class="mid_btns flex_row">
			<button class="mid_btn flex_a" open-type="share">分享<image  mode="scaleToFill" class="btn_ico" src="/static/ico/ico-share1.png"></image></button>
			<button class="mid_btn flex_a" @click="toOrder">下单<image  mode="scaleToFill" class="btn_ico" src="/static/ico/ico-order.png"></image></button>
		</view>
		<view class="luck_rule">
			<view class="luck_rule_title">活动规则</view>
			<rich-text class="rule_content" :nodes="rule_content">

			</rich-text>
		</view>
  </view>
</template>

<script>
import {getLuckNum , getLuckRes , getLuckPrize} from '@/common/member.js';
export default {
  data() {
    return {
			img:'',
			list: [],
			rule_content:'',
			luck_cunt:0,
			luck_index:-1,
			isGetting:false,
			status:-1,
			prizeNum:9,
		};
	},
	onShareAppMessage(res) {
		return this.$share();
	},
	onShow(){
		for(let i = 0 ; i < 9 ; i++){
			this.list.push({
				content:i,
				active:false,
			})
		}
		this.getCount();
		this.$if0(getLuckPrize).then(res => {
			this.img = res.Data.luckPrize[1].logo;
			this.rule_content = res.Data.content;
			this.status = res.Data.status;
			let prize = res.Data.luckPrize;
			prize.forEach(ele => {
				ele.active = false;
			});
			this.list = prize;
			this.prizeNum = prize.length;
		}).catch(err => {
			console.log(err)
		})
	},
  methods: {
		toPrizeLog(){
			uni.navigateTo({
				url:'/pages/activity/luck_log/luck_log'
			})
		},
		toOrder(){
			uni.switchTab({
				url:'/pages/goods/goodsByCategory/goodsByCategory'
			});
		},
		getCount(){
			this.$if0(getLuckNum).then(res => {
				this.luck_cunt = res.Data.PageCount;
			}).catch(err => {
				console.log(err)
			});
		},
		luck() {
			if(this.status != 0){
				this.$toast('活动未开启')
			}
			if(this.isGetting){
				return;
			}
			if(this.luck_cunt <= 0){
				this.$toast('您当前没有抽奖机会，快去做任务吧');
				return;
			}
			this.isGetting = true;
			uni.showLoading({
				title:'',
				mask:true,
			})
			this.$if0(getLuckRes).then(res => {
				uni.hideLoading();
				console.log(res)
				this.getCount();
				let title = res.Message.split(':')[0];
				if(title == "您未中奖，感谢您的参与")title = '谢谢惠顾';
				for(let i = 0 ; i < this.list.length ; i++){
					if(this.list[i].title == title){
						this.luck_index = i;
						this.around_ease_in(3 , 1 , 1 , i + 1);
						break;
					}
				}
				
			}).catch(err => {
				uni.hideLoading();
				console.log(err)
				this.getCount();
				if(err.Message){
					this.$errToast(err);
					this.isGetting = false;
				}else{
					this.isGetting = false;
					this.$toast('出错了，再试一下吧');
				}
			})
			// this.around_ease_in(3 , 1 , 1 , 5);

		},
		around_ease_in(n , ease_in_n , ease_out_n , luck){
			let i = 0 ,  m = 0  , _this = this  , vt = 500;
			let dt = (vt - 100);
			ease_in_n = ease_in_n * _this.prizeNum;
			function next(){
				let timer = setTimeout(() => {
					if(i > 0){
						_this.list[i - 1].active = false;
					}else{
						_this.list[_this.prizeNum - 1].active = false;
					}
					_this.list[i].active = true;
					i = (++i + _this.prizeNum) % _this.prizeNum
					m++;
					vt = vt -  dt / ease_in_n;
					if(m >= ease_in_n){
						clearInterval(timer);
						_this.aroundNum(n , ease_out_n , luck , vt)
					}else{
						next();
					}
				}, vt);
			}
			next()
		},
		aroundNum(n , ease_out_n , luck , vt){
			let i = 0 ,  m = 0 , _this = this;
			n = n * _this.prizeNum;
			let timer = setInterval(() => {
				if(i > 0){
					this.list[i - 1].active = false;
				}else{
					this.list[_this.prizeNum - 1].active = false;
				}
				this.list[i].active = true;
				i = (++i + _this.prizeNum) % _this.prizeNum
				m++;
				if(m >= n){
					clearInterval(timer);
					_this.around_ease_out(ease_out_n , luck , vt)
				}
			}, vt);
		},
		around_ease_out(n , l , vt){
			let _this  = this;
			n = n * _this.prizeNum + l;
			let i = 0 ,  m = 0 , dt = (800 - vt) / n ;
			function next(){
				let timer = setTimeout(() => {
					if(i > 0){
						_this.list[i - 1].active = false;
					}else{
						_this.list[_this.prizeNum - 1].active = false;
					}
					_this.list[i].active = true;
					i = (++i + _this.prizeNum) % _this.prizeNum
					m++;
					vt += dt;
					if(m >= n){
						clearInterval(timer);
						setTimeout(() => {
							_this.isGetting = false;//抽奖结束
							if(_this.list[_this.luck_index].num == 0){
								uni.showModal({
									title: '提示',
									content: '没抽中奖品，请再接再厉',
									showCancel:false,
									success: function (res) {
										if (res.confirm) {
											console.log('用户点击确定');
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
										_this.list.forEach(ele => {
											ele.active = false;
										})
									},
									fail(){
										_this.list.forEach(ele => {
											ele.active = false;
										})
									}
								});
							}else{
								uni.showModal({
									title: '提示',
									confirmText:'查看记录',
									content: '抽中' + _this.list[_this.luck_index].title + '请到奖品记录页面将中奖记录截屏后发给平台客服领取奖品',
									success: function (res) {
										if (res.confirm) {
											console.log('用户点击确定');
											_this.toPrizeLog();
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
											_this.list.forEach(ele => {
											ele.active = false;
										})
									},
									fail(){
										_this.list.forEach(ele => {
											ele.active = false;
										})
									}
								});
							}
						} , 1000)
					}else{
						next();
					}
				}, vt);
			}
			next()
		}
  }
};
</script>

<style lang="scss">
.fr{
	float: right;
}
.page{
	position: relative;
	overflow: hidden;
	min-height: 100vh;
	background-image: bgi('/static/activity/luck_bg.jpg');
	background-position: top;
	background-repeat: no-repeat;
	background-size: 100% auto;
	background-color: #fd7239;
	.luck_map{
		width: 506rpx;
		height: 458rpx;
		position: absolute;
		top: 466rpx;
		left: 122rpx;
		flex-wrap:wrap;
		justify-content: space-between;
		align-content: space-between;
		overflow: hidden;
		// background-color: aquamarine;
		.luck_item {
			width: 162rpx;
			height: 138rpx;
			border-radius: 20rpx;
			background-color: #fdf2f0;
			border-bottom:10rpx solid #eeb9ab;
			.luck_logo{
				width: 110rpx;
				height: 86rpx;
			}
			.luck_title{
				font-size: 28rpx;
				color: #893f31;
				text-align: center;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
		.luck_item.active{
			height: 148rpx;
			background-color: #ccc0c0;
			border-bottom:none;
		}
	}
	.luck_info{
		position: absolute;
		top: 1046rpx;
		width: 100%;
		box-sizing: border-box;
		padding: 0 46rpx;
		font-size: 26rpx;
		color: #fff;
	}
	.luck_start{
		position: absolute;
		top:1100rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 340rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background-color: #fed1b2;
		color: #ca3a1f;
		font-weight: 700;
		font-size: 48rpx;
	}
	.mid_btns{
		width: 300rpx;
		margin: 1310rpx 0 auto;
		justify-content: space-between;
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		.mid_btn{
			width: 122rpx;
			height: 42rpx;
			padding: 0;
			line-height: 42rpx;
			color: #fd7239;
			font-size: 26rpx;
			.btn_ico{
				width: 30rpx;
				height: 30rpx;
				margin-left: 10rpx;
				position: relative;
				top: 4rpx;
				// transform: translateY(-50%);
			}
		}
	}
	.luck_rule{
		padding: 0 40rpx 28rpx;
		margin-top: 76rpx;
		color: #fff;
		.luck_rule_title{
			font-size: 32rpx;
		}
		.rule_content{
			line-height: 46rpx;
			font-size: 28rpx;
		}
	}
}

</style>
