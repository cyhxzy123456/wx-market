<template>
	<view class="goods_item flex_row">
		<view class="goods txt_c flex_a" v-for="g in list" :key="g.id">
			<navigator :url="'/pages/goods/goodsDetail/goodsDetail?id=' + g.id">
				<image :src="g.logo" mode=""></image>
				<view class="goods_name">
					{{g.title}}
				</view>
				<view class="price">
					￥<text>{{g.priceSale}}</text>
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
		},
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
		width: 50%;
	}
	image{
		width: 200rpx;
		height: 200rpx;
		background-color: #007AFF;
	}
</style>
