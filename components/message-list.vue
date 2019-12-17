<template>
	<view class="bg-grey">
		<view class="msg-list" v-for="item in list" :key="item.id">
			<navigator :url="'/pages/member/message/messageDetail?id='+item.id">
				<view class="msg-tit bottom-line">{{item.title}}</view>
				<view class="msg-txt"><rich-text :nodes="item.sketch"></rich-text></view>
				<view class="author">{{item.timeAdd}}</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		props:['list'],
		data() {
			return {

			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.bg-grey{background: #eeeeee;}
	.bottom-line{border-bottom:1rpx solid #dddddd;}
	.msg-list{padding:20rpx 20rpx 0;line-height:2.75;margin-top: 20rpx;
		background: #ffffff;}
	.msg-list .msg-tit{font-size: 26rpx;
		color: #333333;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;}
	.msg-list .msg-txt{font-size:28rpx;overflow: hidden;}
	.msg-list .author{font-size:26rpx;color:#666666;}
</style>
