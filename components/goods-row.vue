<template>
	<view class="goods_item flex_row">
		<view class="goods txt_l flex_a" v-for="g in list" :key="g.id">
			<navigator :url="'/pages/goods/goodsDetail/goodsDetail?id=' + g.id">
				<image :src="g.logo" mode=""></image>
				<view class="blk_r">
					<view class="goods_name">
						{{g.title}}
					</view>
					<view class="point">
						{{g.zhaiyao ? g.zhaiyao : ''}}
					</view>
					<view class="price">
						<!-- 超值价 ￥<text>{{g.priceSale}}</text> -->
						超值价<price-slice class="fmt_price" :price="g.priceSale"></price-slice>
						<!-- <view class="fr iblk">分享赚n元</view> -->
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import priceSlice from './price-slice';
	export default {
		props:['list'],
		data(){
			return {
			}
		},
		components:{
			priceSlice,
		}
	}
</script>

<style lang="scss" scoped>
	.goods_item{
		width: 100%;
		flex-flow:wrap;
		justify-content:flex-start;
		font-size: 30rpx;
	}
	.goods{
		width: 100%;
		height: 366rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		border:1rpx solid #eee;
		background-color: #fff;
		image{
			width: 310rpx;
			height: 310rpx;
			background-image: url(~@/static/ico/ico-noGoods.png);
			background-position: center;
			background-repeat: no-repeat;
			background-size: 80%;
		}
		.goods_name{
			line-height: 40rpx;
			height: 80rpx;
			font-size: 30rpx;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.point{
			height: 30rpx;
			margin-top: 50rpx;
			line-height: 30rpx;
			font-size: 24rpx;
			color: #666;
		}
		.price{
			margin-top: 90rpx;
			height: 40rpx;
			line-height: 40rpx;
			font-size: 30rpx;
			color: #ee5b00;
			font-weight: 700;
			.fmt_price{
				display: inline-block;
			}
		}
	}
	.blk_r{
		display: inline-block;
		width: calc(100% - 330rpx);
		margin-left: 20rpx;
		vertical-align: top;
	}
	
</style>
