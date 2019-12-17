<template>
	<view class="content">
		<view class="list" v-for="p in list" :key="p.id">
			<text>{{p.zhaiyao.split(':')[0]}}</text>
			<text class="date">{{p.timePrize}}</text>
		</view>
		<view class="noMore" v-if="list.length <= 0">
			<!-- <image class="no_data" src="/static/ico/ico-noGoods.png" mode="widthFix"></image> -->
			<view>暂无数据</view>
		</view>
		<button open-type="contact" class="kf"></button>
	</view>
</template>

<script>
import {getLuckList} from '@/common/member.js';
	export default {
		data() {
			return {
				list:[],
				pageIndex:1,
			};
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onShow(){
			this.$if0(getLuckList , this.pageIndex , 50).then(res => {
				console.log(res);
				this.list = res.Data.Data
			}).catch(err => {
				console.log(err);
				this.$errToast(err);
			})
		}
	}
</script>

<style lang="scss">
.noMore{
	font-size: 28rpx;
	text-align: center;
}
.list{
	border-bottom: 1rpx solid #eee;
	line-height: 80rpx;
	font-size: 28rpx;
	.date{
		color: #666;
		float: right;
	}
}
.kf{
	width: 130rpx;
	height: 86rpx;
	position: fixed;
	bottom: 100rpx;
	left: 20rpx;
	border: none;
	background-color: transparent;
	background-image: url(~@/static/activity/kf.png);
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	&::after{
		border: none;
	}
}
</style>
