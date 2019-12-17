<template>
	<view class="content">
		<text class="hpl">好评率：{{ pjCount > 0 ? haoPing + '%' : '100%'}}</text>
		<view v-if="elaluteList.length==0" style="font-size: 32rpx;text-align: center;margin-top: 30rpx;">该商品暂无用户评价</view>
		<view v-else class="evaluateList" v-for="item in elaluteList" :key='item.id'>
			<view class="user_info">
				<view class="userLogo">
					<image :src="item.avator"></image>
				</view>
				<text>{{item.nickName}}</text>
			</view>
			<view class="user_evaluate">
				<view class="eva_con">{{item.content}}</view>
				<view class="example-body">
				  <uni-rate :size="14" :value="item.score"/>
				</view>
				<text class="eva_time">{{item.timeAdd}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {uniRate} from "@/components/uni-rate";
	import {GetGoodsCommentById , CommentPraise} from '@/common/goods.js';
	
	export default {
		components: {
		  uniRate
		},
		data() {
			return {
				elaluteList:[],
				haoPing:0,
				pjCount:0,
			}
		},
		onLoad(opt) {
			this.getEvaluateData(opt.id);
			this.$if0(CommentPraise , opt.id).then(res => {
				this.haoPing = res.Data.haoping;
				this.pjCount = res.Data.count;
			}).catch(err => {
				console.log(err);
			})
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		methods: {
			getEvaluateData(goodsId){
				this.$if0(GetGoodsCommentById,goodsId, 1, 10).then(res => {
					console.log(res);
					if(res.Data.Data.length > 0){
						this.elaluteList = res.Data.Data;
					}
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #EEEEEE;
}
.hpl{
	font-size: 28rpx;
	color:#666666;
}
.content{
	width: 100%;
}
.evaluateList{
	width: 96%;
	min-height: 165rpx;
	overflow: hidden;
	padding: 30rpx 0;
	border-bottom: 1px solid #DDDDDD;
}
.content .user_info{
	width: 17%;
	float: left;
}
.content .user_evaluate{
	width: 75%;
	float: left;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding:25rpx;
}
.content .user_info .userLogo{
	width: 110rpx;
	height: 110rpx;
	background-color: #FFFFFF;
	border-radius: 10rpx;
}
.content .user_info .userLogo image{
	width: 100%;
	height: 100%;
}
.content .user_info text{
	font-size: 26rpx;
	color: #333333;
	padding-top: 10rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp:1;
	overflow: hidden;
}
.content .user_evaluate .eva_con{
	font-size: 26rpx;
	min-height: 70rpx;
	color: #333;
	margin-bottom: 10rpx;
}
.content .user_evaluate .example-body{
	width: 45%;
	float: left;
}
.content .user_evaluate .eva_time{
	width: 55%;
	float: right;
	text-align: right;
	line-height: 40rpx;
	color: #666666;
	font-size: 22rpx;
}
</style>
