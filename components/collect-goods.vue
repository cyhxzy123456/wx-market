<template>
	<view class="orders">
		<view class="orders_item flex_a" v-for="g in list" :key="g.id">
			<navigator :url="'/pages/goods/goodsDetail/goodsDetail?id='+g.goodsId">
				<view class="uni-flex uni-row order_info">
					<view class="flex-item goods_img">
						<image :src="g.goodsLogo" mode=""></image>
					</view>
					<view class="flex-item goods_info">
						<p class="goods_title">{{g.goodsTitle}}</p>
						<text class="goods_intr">{{g.zhaiyao?g.zhaiyao:''}}</text>
						<view class="goods_price">
							￥<text>{{g.priceSale}}</text>
						</view>
					</view>
					<view class="flex-item goods_num" @tap.native.stop="delCollect(g.goodsId)">
						<image src="../static/ico/ico-like-act.png" mode="widthFix"></image>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import {delCollect} from "@/common/collect.js"
	export default {
		props:['list'],
		data(){
			return {
			}
		},
		methods:{
			delCollect(id){
				console.log(id);
				this.$if0(delCollect,id).then(res => {
					uni.showModal({
						title: '提示',
						content: "删除成功！",
						showCancel:false,
						success: function (res) {
							uni.redirectTo({
								url: '/pages/member/collect/collectList'
							});
						}
					});
					
				}).catch(err=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (res) {
							
						}
					});
				})
			}
		}
	}
</script>

<style scoped>
	.orders_item{
		background-color: #FFFFFF;
		width: 94%;
		padding: 0 3%;
	}
	.order_info{
		height: 196rpx;
		border-bottom: 1px solid #DDDDDD;
		padding: 35rpx 0;
	}
	.goods_img{
		width: 25%;
		height: 25vw;
		border: 1px solid #007AFF;
		float: left;
	}
	.goods_img  image{
		width: 100%;
		height: 100%;
	}
	.goods_info{
		width: 60%;
		padding: 0 30rpx;
		float: left;
		height: 100%;
		position: relative;
	}
	.goods_info .goods_title{
		font-size: 26rpx;
		color: #333333;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.goods_info .goods_intr{
		font-size: 20rpx;
		color: #666;
		line-height: 35rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		padding-top: 10rpx;
	}
	.goods_info .goods_price{
		font-size: 36rpx;
		position: absolute;
		bottom: 0rpx;
		color: #FF6000;
	}
	.goods_num{
		width: 5%;
		color: #666666;
		font-size: 26rpx;
		float: left;
	}
	.goods_num image{width: 40rpx;}
	.operation{
		height: 110rpx;
		line-height: 110rpx;
	}
	.submit_btn{
		float: right;
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 32rpx;
		color:#FF6000;
		padding:0 14rpx;
		border: 1px solid #FF6000;
		margin-top: 25rpx;
	}
	.submit_btn::after{
		border: none;
	}
</style>
