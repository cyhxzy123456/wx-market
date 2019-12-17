<template>
	<view class="orders">
		<view class="orders_item">
			
				<view class="item_title">商品信息</view>
				<view class="uni-flex uni-row order_info" v-for="(g,index) in list" :key="g.id">
					<view class="flex-item goods_img">
						<image :src="g.logo" mode=""></image>
					</view>
					<view class="flex-item goods_info">
						<p class="goods_title">{{g.goodsTitle}}</p>
						<text class="goods_intr" v-if="g.zhaiyao">{{g.zhaiyao}}</text>
						<view class="goods_sku">{{g.skuInfo|sku}}</view>
						<view class="goods_price">
							￥<text>{{g.priceSale}}</text>
						</view>
						<view class="logistics_btn" v-if="list.length>1&&orderStatus==2" style='display: inline-block;float: right;'>
						<navigator :url="'/pages/member/orderList/logisticsInfo?id=' + orderId+'&goodsId='+g.id" >
							<button class="submit_btn">查看物流</button>
						</navigator>
						</view>
						<view class="logistics_btn" v-if="list.length>1&&orderStatus==3&&g.isCommnet==0" style='display: inline-block;float: right;'>
						<navigator :url="'/pages/member/orderComment/commitComment?info='+JSON.stringify(g)" >
							<button class="submit_btn">去评价</button>
						</navigator>
						</view>
					</view>
					<view class="flex-item goods_num">
						x{{g.quantity}}
					</view>
				</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['list','orderId','orderStatus'],
		data(){
			return {
			}
		},
		filters:{
			sku:function(data){
				let skuData=JSON.parse(data);
				let skuStr="";
				for(let key in skuData){
					skuStr+=(key + ':' + skuData[key]);
					return skuStr
				}
			}
		}
	}
</script>

<style scoped>
	.orders_item{
		background-color: #FFFFFF;
		width: 94%;
		padding: 0 3%;
		margin-bottom: 20rpx;
	}
	.item_title{
		width: 100%;
		height: 100rpx;
		border-bottom: 1px solid #DDDDDD;
		line-height: 100rpx;
		font-size: 32rpx;
	}
	.order_info{
		height: 210rpx;
		border-bottom: 1px solid #DDDDDD;
		padding: 35rpx 0;
	}
	.goods_img{
		width: 26%;
		height: 26vw;
		border: 1px solid #007AFF;
		float: left;
	}
	.goods_img  image{
		width: 100%;
		height: 100%;
	}
	.goods_info{
		width: 60%;
		padding: 0 25rpx;
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
		line-height: 30rpx;
		padding-top: 7rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.goods_info .goods_sku{
		font-size: 20rpx;
		color: #666;
	}
	.goods_info .goods_price{
		font-size: 36rpx;
		position: absolute;
		bottom: 0rpx;
		color: #FF6000;
	}
	.goods_num{
		width: 6%;
		color: #666666;
		font-size: 26rpx;
		float: left;
	}
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
	.logistics_btn{
		position: absolute;
		bottom: -2rpx;
		right: -12rpx;
	}
</style>
