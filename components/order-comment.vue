<template>
	<view>
		<view v-if="faBuComment">
			<view class="orders">
				<view class="orders_item" v-for="g in list" :key="g.id">
					<view class="uni-flex uni-row order_info">
						<view class="flex-item goods_img">
							<image :src="g.logo" mode=""></image>
						</view>
						<view class="flex-item goods_info">
							<p class="goods_title">{{g.goodsTitle}}</p>
							<text class="goods_intr">{{g.skuInfo|sku}}</text>
							<view class="goods_price">
								￥<text>{{g.priceSale}}</text>
							</view>
							<navigator :url="'/pages/member/orderComment/commitComment?info='+JSON.stringify(g)"><view class="operation submit_btn">发布评价</view></navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="showComment">
			<view class="orders comment_main">
				<view class="orders_item" v-for="g in list" :key="g.id">
					<view class="uni-flex uni-row comment_info">
						<view class="comment_top">
							<view class="fl">
								<image :src="g.avator" mode="widthFix" class="img_info"></image>
								<text v-if="g.nickName">{{g.nickName}}</text>
								<text v-else>您还未设置昵称</text>
							</view>
							<view class="fr rate_num">
								<iRate
										:disabled="true"
										:value="g.score"
										size="20">
								</iRate>
							</view>
						</view>
						<view class="rate_txt">{{g.content}}</view>
					</view>
					<view class="uni-flex uni-row order_goods_info">
						<view class="flex-item order_goods_img">
							<image :src="g.logo" mode=""></image>
						</view>
						<view class="flex-item goods_info">
							<p class="goods_title">{{g.goodsTitle}}</p>
							<text class="goods_intr">{{g.skuInfo|sku}}</text>

						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import iRate from 'iview-mpvue/dist/components/rate/rate'
	import {delCollect} from "@/common/collect.js"
	export default {
		props:{
			list:{
				type: [Array, String],
				default: true
			},
			faBuComment:{
				//是否显示发布评价按钮
				type: [Boolean, String],
				default: false
			},
			showComment:{
				//是否显示发布评价按钮
				type: [Boolean, String],
				default: false
			}
		},
		data(){
			return {
			}
		},
		components:{
			iRate
		},
		methods:{

		},
		computed:{
			// list1:function(){
			// 	let tem
			// 	for(let key in data){
			// 		return key + ':' + data[key];
			// 	}
			// }
		},
		filters:{
			sku:function(data){
				let skuData=JSON.parse(data);
				let skuStr="";
				for(let key in skuData){
					skuStr+=(key + '：' + skuData[key])+'，';
				}
				return skuStr.substring(0,skuStr.length-1)
			}
		}
	}
</script>

<style scoped>
	.i-rate-text{
		display: none!important;}
	.orders_item{
		background-color: #FFFFFF;
		width: 94%;
		padding: 0 3%;
		margin-bottom: 20rpx;
	}
	.order_info{
		height: 210rpx;
		border-bottom: 1px solid #DDDDDD;
		padding: 35rpx 0;
	}
	.order_goods_info{height: 160rpx;border-bottom: 1px solid #DDDDDD;
		padding: 20rpx 0;}
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
	.order_goods_img{
		width: 20%;
		height: 20vw;
		border: 1px solid #007AFF;
		float: left;
	}
	.order_goods_img  image{
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
	.goods_info .goods_price{
		font-size: 36rpx;
		position: absolute;
		bottom: 0rpx;
		color: #FF6000;
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
		margin-top: 30rpx;
		border-radius: 10rpx;
		text-align: center;
	}
	.submit_btn::after{
		border: none;
	}
	.comment_main{}
	.comment_main .comment_info{border-bottom: 1px solid #DDDDDD;
		padding: 35rpx 0;}
	.comment_main .comment_info .comment_top{
		height: 100rpx;
		overflow: hidden;}
	.comment_main .comment_info .comment_top image{
		width: 110rpx;
		height: 110rpx;
		border-radius:110rpx;
		will-change: transform;
	}
	.comment_main .comment_info .rate_txt{padding-top:20rpx;}
	.comment_main .comment_info .img_info{width:100rpx;
		vertical-align: middle;
		margin-right: 10rpx;}
	.comment_main .comment_info .rate_num{width:40%;padding-top:20rpx;}
	.comment_main{}
</style>
