<template>
	<view class="orders">
		<view class="orders_item" v-for="o in list" :key="o.id">
			<navigator :url="'/pages/member/orderList/orderDetail?id=' + o.id" style='display: inline-block;width: 100%;'>
				<view class="item_title">
					订单编号：<text>{{o.orderNo}}</text>
					<text class="orderState">{{o.statusName}}</text>
					</view>
			</navigator>
			<view class="item_title">商品信息</view>
			<view class="uni-flex uni-row order_info" v-for="g in o.goodsList" :key="g.id">
				<view class="flex-item goods_img">
					<image :src="g.logo" mode=""></image>
				</view>
				<view class="flex-item goods_info">
					<p class="goods_title">{{g.goodsTitle}}</p>
					<text class="goods_intr" v-if="g.zhaiyao!=null">{{g.zhaiyao}}</text>
					<view class="goods_sku">{{g.skuInfo|sku}}</view>
					<view class="goods_price">
					<!-- ￥<text>{{g.priceSale}}</text> -->
					<price-slice :price="g.priceSale"></price-slice>
					</view>
				</view>
				<view class="flex-item goods_num">
					x{{g.quantity}}
				</view>
				</view>
					<view class="operation">
						<text v-if="o.statusPay==0&&o.statusReceipt==0">应付金额</text>
						<text v-else>已付金额</text>
						<!-- <text>￥{{o.moneyPayReal}}</text> -->
						<price-slice :price="o.moneyPayReal"></price-slice>
					<navigator :url="'/pages/member/pay/pay?orderNo=' + o.orderNo+'&price='+o.moneyPayReal" style='display: inline-block;float: right;'>
						<button v-if="o.status==0&&o.statusPay==0&&o.statusReceipt==0" class="submit_btn">立即付款</button>
					</navigator>
					<button v-if="o.status==0&&o.statusPay==0&&o.statusReceipt==0" class="cancel_btn" @click="cancelOrder" v-bind:id="o.id">取消订单</button>
					<button v-if="o.status==1&&o.statusPay==1&&o.statusReceipt==0" class="submit_btn">等待发货</button>
					<navigator v-if="o.goodsList.length>1" :url="'/pages/member/orderList/orderDetail?id=' + o.id" style='display: inline-block;float: right;'>
						<button v-if="o.status==2&&o.statusPay==1&&o.statusReceipt==1" class="submit_btn">查看详情</button>
					</navigator>
					<navigator v-else :url="'/pages/member/orderList/logisticsInfo?id=' + o.id+'&goodsId='+o.goodsList[0].id" style='display: inline-block;float: right;'>
						<button v-if="o.status==2&&o.statusPay==1&&o.statusReceipt==1" class="submit_btn">查看物流</button>
					</navigator>
					<button v-if="o.status==2&&o.statusPay==1&&o.statusReceipt==1" class="cancel_btn" @click="confirmGoods" v-bind:id="o.id" :data-goods="o.goodsList">确认收货</button>
					<navigator v-if="o.goodsList.length>1" :url="'/pages/member/orderList/orderDetail?id=' + o.id" style='display: inline-block;float: right;'>
						<button v-if="o.status==3&&o.isCommnet==0" class="submit_btn">查看详情</button>
					</navigator>
					<navigator v-else :url="'/pages/member/orderComment/commitComment?info='+JSON.stringify(o.goodsList)" style='display: inline-block;float: right;'>
						<button v-if="o.status==3&&o.isCommnet==0" class="submit_btn">去评价</button>
					</navigator>
					<navigator url="/pages/goods/goodsByCategory/goodsByCategory" open-type="switchTab" style='display: inline-block;float: right;'>
					<button v-if="o.status==3" class="cancel_btn">再次购买</button>
					</navigator>
					
			   <!-- <button v-if="c.statusPay==1&&c.statusReceipt==1" class="submit_btn">删除订单</button>
					<button v-if="c.statusPay==1&&c.statusReceipt==1" class="cancel_btn">再次购买</button> -->
				</view>
		</view>
	</view>
</template>

<script>
import priceSlice from './price-slice';
	import {cancelOrderBtn,ConfirmReceipt} from '@/common/order.js';
	export default {
		props:['list','orderStatus'],
		components:{
			priceSlice,
		},
		data(){
			return {
			}
		},
		onLoad() {
			uni.$on('refreshed',this.refreshed);
		},
		methods: {
			cancelOrder(e){
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确认要取消订单吗？',
					cancelText:"再想想",
				    success: function (res) {
				        if (res.confirm) {
				           that.$if0(cancelOrderBtn,e.target.id).then(data => {
				           	//console.log(data);
				           	uni.showToast({
				           		title:"取消订单成功！",
				           		duration: 2000,
				           		success: function () {
				           			uni.$emit("refreshed");
				           		}
				           	});
				           })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			},
			confirmGoods(e){
				let that=this;
				let orderGoogsId=0;
				console.log(e.target.dataset.goods.length==1);
				if(e.target.dataset.goods.length==1){
					orderGoogsId=e.target.dataset.goods[0].id;
				}else{
					orderGoogsId=0;
				}
				uni.showModal({
				    title: '提示',
				    content: '确认收到商品了吗？',
					confirmText:"确认收货",
				    success: function (res) {
				        if (res.confirm) {
				           that.$if0(ConfirmReceipt,e.target.id,orderGoogsId).then(data => {
				           	//console.log(data);
				           	uni.showToast({
				           		title:"已经确认收货！",
				           		duration: 2000,
				           		success: function () {
				           			uni.$emit("refreshed");
				           		}
				           	});
				           })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
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
	price-slice{
		display: inline-block;
		color: #FF6000;
	}
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
	.item_title .orderState{
		float: right;
		color: #FF6000;
		font-size: 26rpx;
	}
	.order_info{
		height: 210rpx;
		border-bottom: 1px solid #DDDDDD;
		padding: 35rpx 0;
	}
	.goods_info .goods_sku{
		font-size: 20rpx;
		color: #666;
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
	.cancel_btn{
		float: right;
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 32rpx;
		color: #666666;
		padding:0 14rpx;
		margin-right: 30rpx;
		margin-top: 25rpx;
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
