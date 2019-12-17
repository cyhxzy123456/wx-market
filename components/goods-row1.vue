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
						{{g.tags}}
					</view>
					<view class="price">
						超值价 ￥<text>{{g.priceSale}}</text>
						<!-- <view class="fr iblk">分享赚n元</view> -->
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		props:['list'],
		data(){
			return {
			}
		}
	}
</script>

<style scoped>
	.goods_item{
		width: 100%;
		flex-flow:wrap;
		justify-content:flex-start;
		font-size: 24rpx;
	}
	.goods{
		width: 100%;
	}
	.blk_r{
		display: inline-block;
		width: calc(100% - 200rpx);
		vertical-align: top;
	}
	image{
		width: 200rpx;
		height: 200rpx;
		background-color: #007AFF;
	}
</style>
