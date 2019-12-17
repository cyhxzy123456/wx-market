<template>
	<view class="award">
		<view class=banner-box>
			<navigator class=drawing-btn url="/pages/member/drawing/drawing">提现</navigator>
			<img src="../../../static/credit/banner.png" alt="" class="banner">
			<text class="banner-txt">当前分享奖金{{bonusBalance}}</text>
		</view>
		<view >
			<view class="number">
					<!-- <navigator url="/pages/member/reward/yesterday"  class="left item"><view>
						昨日奖金
						<text>{{yesterdayBonusCount}}</text>
					</view>
					</navigator> -->
					<view url="/pages/member/reward/total" class="right item"><view >
						累计奖金
						<text>{{bonusCount}}</text>
					</view>
					</view>
					<view url="/pages/member/reward/used" class="right item"><view >
						累计使用
						<text>{{bonusUse}}</text>
					</view>
					</view>
			</view>
			<view style="background: white;">
			<view class="nav">
				<text @click="change(item.value)" v-for="(item,index) in nav" :key="index" :class="{active:item.value==nowValue}">{{item.txt}}</text>
			</view>
			<view class="list">
				<view class="data-list">
					<view class="list-item couple flex_row" v-for="(item,index) in list_arr" :key="index" >
						<view class="item_l flea_a">
							<view class="list_money" v-if="item.bonusValue > 0">￥{{item.bonusValue}}</view>
							<view class="item_title">分享金</view>
							<view class="list_money" v-if="item.bonusValue < 0">{{item.bonusValue}}</view>
						</view>
						<view class="item_r flex_a flex_col">
							<view class="lev flex_a" v-if="item.bonusFrom > 0 && item.bonusFrom <= 3 && item.bonusValue > 0">{{(item.bonusFrom > 0 && item.bonusFrom <= 3) ? item.bonusFrom : ''}}级</view>
							<view class="list_title flex_a">{{item.zhaiyao ? item.zhaiyao : item.bonusFromName}}</view>
							<view class="list_info flex_a">
								<text class="date">{{item.timeUpdate}}</text>
							</view>
						</view>
					</view>
					<i-load-more :tip="loadTip" @tap="getMore" :loading="loading" v-if="showMore" class="load-more"/>
			
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import {getRewardInfo} from '@/common/reward.js'
	import {getCouPle} from '@/common/reward.js'
	import {getNoCouPle , getRewardList} from '@/common/reward.js'
import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	export default {
		components:{iLoadMore},
		data() {
			return {
				pageIndex:1,
				pageSize:10,
				id:'',
				yesterdayBonusCount:'',
				bonusCount:'',
				bonusUse:'',
				bonusBalance:'',
				coupleList:[],
				noCoupleList:[],
				nav:[{txt:'奖金获得记录',value:1},{txt:'奖金使用记录',value:2}],
				nowValue:1,
				showDetail:false,
				detail:'',
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				showMore:true,
				list_arr:[],
			}
		},
		methods: {
			showInfo(detail){
				this.detail = detail
				this.showDetail = true
			},
			info(){
				this.$if0(getRewardInfo).then(res => {
					this.bonusCount=res.Data.bonusCount
					this.bonusUse=Math.abs(res.Data.bonusUse) 
					this.bonusBalance = res.Data.bonusBalance
					this.yesterdayBonusCount=res.Data.yesterdayBonusCount
					if(this.bonusBalance==0){
						this.bonusBalance='0'
					}
					if(this.bonusUse==0){
						this.bonusUse='0'
					}if(this.bonusCount==0){
						this.bonusCount='0'
					}if(this.yesterdayBonusCount==0){
						this.yesterdayBonusCount='0'
					}
				})
			},
			//获得记录
			list(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				let parameter = [{
						key:'bonusValue',
						value: 0 ,
						whereType:5
					}]
				
				if(this.serviceId){
					parameter.push({
						key:'serviceId',
						value: this.serviceId ,
						whereType:1
					})
					parameter.push({
						key:'bonusFrom',
						value: 3 ,
						whereType:3
					})
				}
				this.$if0(getRewardList,this.pageIndex,this.pageSize,parameter).then(res => {
					if(res.Data.Data.length > 0){
						this.loading = false;
						this.pageIndex++;
						res.Data.Data.forEach((val)=>{
							if(val.bonusValue>0){
								this.list_arr.push(val)
							}
						})
						if(res.Data.Data.length < 10){
							this.showMore = false;
						}
					}else{
						console.log(111)
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}

				})
			},
			//使用记录
			listNo(){
					if(!this.hasMore){
					return;
				}
				this.loading = true;
				let parameter = [{
					key:'bonusValue',
					value:0,
					whereType:3
				}]
				this.$if0(getRewardList,this.pageIndex,this.pageSize,parameter).then(res => {
					if(res.Data.Data.length > 0){
						this.loading = false;
						this.pageIndex++;
						this.list_arr = this.list_arr.concat(res.Data.Data)
						// res.Data.Data.forEach((val)=>{
						// 	if(val.bonusValue<0){
						// 		this.list.push(val)
						// 	}
						// })
						if(res.Data.Data.length < 10){
							this.showMore = false;
						}
					}else{
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}

				})
			},
			getMore(){
				if(this.nowValue == 1){
					this.list()
				}else{
					this.listNo()
				}
			},
			change(val){
				console.log(val)
				this.nowValue=val
				this.loading=false
				this.loadTip='查看更多'
				this.hasMore=true
				this.showMore=true
				this.pageIndex = 1
				this.list_arr = [];
				if(val==1){
					this.coupleList = []
					this.list()
				}else{
					this.noCoupleList = []
					this.listNo()
				}
				console.log(this.nowValue)
				/*if(this.nowValue==1){
					this.list()
				}else if(this.nowValue==2){
					this.listNo()
				}*/
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
			
			this.list()
		},
		onShow() {
			this.info()
		}
	}
</script>

<style scoped lang="scss">
.list_title{
	font-size: 28rpx;
	color: #333;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.list_info{
	width: 100%;
	font-size: 28rpx;
	color: #333;
	position: relative;
	.date{
		color: #666;
		font-size: 28rpx;
	}
	// .fr_txt{
	// 	position: absolute;
	// 	right: 0;
	// }
}
.fr{float:right}
.fl{float:left}
.level{min-width: 60rpx;float: right;}
.nav{background: #fff;display: flex;justify-content: space-around;line-height: 70rpx;border-bottom: 1px solid #eee}
.nav text.active{border-bottom:1px solid #fe7257}
.award{background: #eee;}
text{font-size: 30rpx;}
.banner-box{position: relative;}
.banner-box .drawing-btn{width:160rpx;height: 50rpx;background: #fff;border-radius: 15rpx;text-align: center;line-height: 50rpx;
	position: absolute;left:20rpx;bottom: 70rpx;color:#fc4b47;font-size: 32rpx;}
.banner-txt{font-size: 50rpx;color:#fff;position: absolute;bottom: 125rpx;left:20rpx}
.line{height:20rpx;background: #eee;}
.banner{height: 300rpx;width:100%}
 .number{display: flex;justify-content:space-around;padding:30rpx 20rpx;margin-bottom: 20rpx;background: #fff;}
.item{padding-top:125rpx;font-size: 28rpx;}
.item:nth-child(1){background: url(../../../static/reward/icon1.png) no-repeat center top;background-size: 110rpx;}
.item:nth-child(2){background: url(../../../static/reward/icon2.png) no-repeat center top;background-size: 110rpx;}
.item:nth-child(3){background: url(../../../static/reward/icon3.png) no-repeat center top;background-size: 110rpx;}
.item navigator{display: inline-block}
.list{font-size: 30rpx;}
.list-item{
	width: 100%;
	box-sizing: border-box;
	padding:32rpx 30rpx;
	margin-top: 20rpx;
	position: relative;
	background: #fff;
	padding:10rpx 20rpx;
	justify-content: space-between;
	.item_l{
		width: 224rpx;
		height: 142rpx;
		padding-top: 30rpx;
		box-sizing: border-box;
		text-align: center;
		background-image: url(~@/static/reward/money-bg.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		color: #ff6100;
		.list_money{
			font-size: 34rpx;
			font-weight: 700;
		}
		.item_title{
			font-size: 26rpx;
		}
	}
	.item_r{
		width: calc(100% - 246rpx);
		height: 142rpx;
		justify-content: space-around;
		align-items: flex-start;
		.lev{
			font-size: 26rpx;
		}
	}
}
.list-l{display: flex;justify-content: space-between;}
.list-l text{display: block;color:#666}
.list-l .txt{font-size: 26rpx;}
.list-l .money{font-size: 38rpx;margin-right: 20rpx;}
.list-l .total{width:220rpx;height:100%;text-align: center;line-height: 60rpx;padding-top:20rpx;
	display: inline-block;background: url(../../../static/reward/money-bg.png) no-repeat center top;background-size: 220rpx 100%;}
.list-l .total text{}
.list-l .num{display: inline-block;padding-left:40rpx;line-height: 60rpx;}
.list-l .num text{display: block;}
.list-l text{display: block;}
.list-l .tit{font-size: 32rpx;padding-bottom: 20rpx;color:#333}
.list-l .see{font-size: 26rpx;color:#666}
 .img-r{position: absolute;right:20rpx;bottom: 50rpx;width:15rpx;height:18rpx;background: url(../../../static/reward/right.png) no-repeat;background-size: 15rpx;}
.noCouple{}
.list-r{
	line-height: 70rpx;
	
}
.list-r-link{
		width: 200rpx;
		text-align: right;
	}
.noCouple text.money{font-size: 26rpx}
.noCouple .tit{display:inline-block ;font-size: 32rpx}
.noCouple .level{display:inline-block }
.noCouple-r{width:460rpx;margin-left:30rpx;}
.noCouple-r text{color:#333;font-size: 26rpx;color:#999}
.noCouple .list-l .total{padding:0}
.couple{position: relative}
.couple-pop{box-shadow: 0 5px 10px 5px rgba(0,0,0,0.1);position: absolute;background: #fff;top:-70rpx;left:50%;min-height:400rpx;
	width:660rpx;border-radius: 20rpx;margin-left:-330rpx;padding:20rpx;box-sizing: border-box}
.couple-pop .time{font-size: 28rpx;}
.couple-pop .time .close{float:right}
.couple-pop .nick{margin-bottom:15rpx;font-size: 34rpx;color:#333;display: block}
.couple-pop .goods{margin-bottom: 20rpx;font-size: 26rpx;}
.pop-item{border-bottom: 1px solid #eee;padding-top:20rpx}
.pop-item:last-child{border:none}
.goods-tit{font-size: 26rpx;color:#999}
.buy-time{color:#999;width: 100%;}
.noCouple .list-l .money{margin:0}
.noCouple-money text{display: inline-block;overflow: hidden;margin-top:10rpx}
.list{
	position: relative;
	background: white;
}
.data-list{
	background: white;
	background: #eee;
	overflow: hidden;
}
.i-load-more{
	margin-top: 0;
}
</style>
