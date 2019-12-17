<template>
	<view>
		<view class=banner>
			<text class=color>{{txt}}</text>
			<text class=money>￥{{money}}</text>
		</view>
		<view class=reward-list>
			<view class=content>
				<view class=list-item v-for="(item,index) in list" :key="index">
					<view class=tit>
						<!-- <text>编号{{item.id}}</text> -->
						<text>{{item.bonusFromName}}</text>
						<text class=num><text v-if='item.bonusValue>0'>+</text>{{item.bonusValue}}</text>
					</view>
					<view>
						<text class=time>{{item.timeAdd}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['txt','list','money'],
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.banner{box-sizing: border-box;height: 300rpx;width:100%;background: url(~@/static/reward/list-banner.jpg) no-repeat;background-size: contain;padding:56rpx 0 0 24rpx}
	.money{font-size: 72rpx;font-weight: bold;color:#fff;padding-top:20rpx;color: #feeacb;font-weight: bold; background: -webkit-linear-gradient(90deg, #fff, #feeacb);
 -webkit-background-clip: text;-webkit-text-fill-color: transparent}
	.color{font-size: 66rpx;color: #fdc877;font-weight: bold; background: -webkit-linear-gradient(90deg, #fedba5, #fdc877);
 -webkit-background-clip: text;-webkit-text-fill-color: transparent;}
 .banner text{display: block;}
 .reward-list{padding-top:30rpx}
 .list-item{border-bottom: 1px solid #eee;padding:20rpx 0}
 .list-item .tit{font-size: 32rpx;color:#333}
 .num{float:right}
 .list-item .time{font-size: 26rpx;color:#666}
.tip{text-align: center;width:100%;display: block;color:#666}
</style>
