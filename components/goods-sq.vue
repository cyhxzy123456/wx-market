<template>
	<view class="goods_item flex_row">
		<view class="goods txt_l flex_a" v-for="g in list" :key="g.id">
			<navigator :url="'/pages/goods/goodsDetail/goodsDetail?id=' + g.id">
				<image :src="g.logo" mode=""></image>
				<view class="goods_name">
					{{g.title}}
				</view>
				<view class="point">
					{{g.zhaiyao ? g.zhaiyao : ''}}
				</view>
				<view class="price">
					<!-- ￥<text>{{g.priceSale}}</text> -->
					<price-slice :price="g.priceSale"></price-slice>
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
		justify-content:space-between;
		font-size: 24rpx;
	}
	.goods{
		width: 343rpx;
		height: 488rpx;
		box-sizing: border-box;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #ccc;
		.goods_name{
			height: 40rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.point{
			height: 30rpx;
			font-size: 22rpx;
			line-height: 30rpx;
			color: #666;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.price{
			height: 48rpx;
			font-size: 30rpx;
			line-height: 48rpx;
			font-weight: 700;
			color: #ee5b00;
		}
	}
	image{
		width: 303rpx;
		height: 303rpx;
		margin-bottom: 20rpx;
		// background-color: #007AFF;
		background-image: url(~@/static/ico/ico-noGoods.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: 80%;
	}
</style>
