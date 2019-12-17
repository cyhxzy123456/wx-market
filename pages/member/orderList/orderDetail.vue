<template>
	<view class="content">
		<view class="main_content">
			<view class="good_state">
				<uni-list-item :title="statusTip" :thumb="thumb">
					<template v-slot:right>
						<text style="color: #333333;">普通快递</text>
					</template>
				</uni-list-item>
			</view>
			
			<view class="detail_body">
			 <uni-list-item v-if="statusTips" :show-arrow="false" :title="statusTips?statusTips:''" :note="timeReceipt?timeReceipt:''"/>
			 <uni-list-item v-if="receiptInfo" :show-arrow="false" :title="receiptInfo.address?receiptInfo.address:''" :note="userInfo" @click="changeAdd"/>
			 <order-goods :list="goodsList" :orderId="orderList.id" :orderStatus="orderList.status"></order-goods>
			 <uni-list-item :show-arrow="false" class="switchIntegral" title="订单信息"/>
			<!-- <uni-list-item :show-arrow="false" :show-switch="true" :switch-checked="true" :extra-icon="extraIcon1" class="switchIntegral" title="订单信息" note="使用200积分可抵扣200现金"
			   @switchChange="switchChange" /> -->
			</view>
			
			  <view class="order_intrduce">
				  <view class="order_total">商品总计<text style="color:#FF6000;">￥{{orderList.moneyCount? orderList.moneyCount : ''}}</text></view>
				  <view class="order_total">运费<view class="total_price"><span v-if="orderList.priceFreight==0||orderList.priceFreight==null">包邮</span><text>￥{{ orderList.priceFreight?orderList.priceFreight:"0.00"}}</text></view></view>
				  <view class="order_total">积分抵现<text>￥{{orderList.integralDeduct?orderList.integralDeduct:'0.00'}}</text></view>
				  <view class="order_total">分享金抵扣<text>￥{{orderList.bonusDeduct?orderList.bonusDeduct:'0.00'}}</text></view>
			  </view>
			  <view class="order_other">
				  <view class="other_btn" v-if="orderList.status==0&&orderList.statusPay==0&&orderList.statusReceipt==0">
					  <navigator :url="'/pages/member/pay/pay?id=' + orderList.id+'&orderNo='+ orderList.orderNo+'&price='+orderList.moneyPayReal" style='display: inline-block;float: right;'>
					  	<button class="submit_btn">立即付款</button>
					  </navigator>
					  <button class="cancel_btn" @click="cancelOrder" v-bind:id="orderList.id">取消订单</button>
				  </view>
				  <view v-else>
					<view class="other_info">订单编号：{{orderList.orderNo?orderList.orderNo:""}}</view>
					<view class="other_info">提交时间：{{orderList.timeAdd?orderList.timeAdd:''}}</view>
					<view class="other_info">支付方式：在线支付/微信支付</view>
					<view v-if="orderList.status!=5" class="other_info">实付金额：￥{{orderList.moneyPayReal?orderList.moneyPayReal:"0.00"}}</view>
					<view v-if="orderList.status!=5" class="other_info">付款时间：{{orderList.timePay?orderList.timePay:''}}</view>
				  </view>
				  <view  class="other_btn" v-if="orderList.status==5">
					  <navigator url="/pages/goods/goodsByCategory/goodsByCategory" open-type="switchTab" style='display: inline-block;float: right;'>
					  	<button class="submit_btn">重新购买</button>
					  </navigator>
					  <button class="cancel_btn" @click="delectOrder" v-bind:id="orderList.id">删除订单</button>
				  </view>
				  <view  class="other_btn" v-if="orderList.status==3">
					<navigator url="/pages/goods/goodsByCategory/goodsByCategory" open-type="switchTab" style='display: inline-block;float: right;'>
				  	<button class="submit_btn">再次购买</button>
				  	</navigator>
					<navigator v-if="goodsList.length==1&&orderList.isCommnet==0"  :url="'/pages/member/orderComment/commitComment?info='+JSON.stringify(orderList.goodsList)" style='display: inline-block;float: right;'><button class="cancel_btn">去评价</button></navigator>
				  	<navigator url="/pages/member/exchangeGoods/exchangeGoods" style='display: inline-block;float: left;font-size: 32rpx;color: #666666;'>
				  	我要换货？
				  	</navigator>
				  </view>
				  <view  class="other_btn" v-if="orderList.status==2&&orderList.statusPay==1&&orderList.statusReceipt==1">
				  <navigator v-if="goodsList.length==1"  :url="'/pages/member/orderList/logisticsInfo?id=' + orderList.id+'&goodsId='+orderList.goodsList[0].id" style='display: inline-block;float: right;'>
				  	<button class="submit_btn">查看物流</button>
				  </navigator>
				  <button class="cancel_btn" v-if="isConfirm" @click="confirmGoods" v-bind:id="orderList.id" :data-goods="goodsList">确认收货</button>
				  </view>
			  </view>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list';
	import uniListItem from '@/components/uni-list-item';
	import {orderGoods} from "@/components/order-goods";
	import {getOrderDetlle,getLogisticsDetlle,cancelOrderBtn,delectOrderBtn,ConfirmReceipt} from '@/common/order.js';
	export default {
		data() {
			return {
				status:'',
				statusKey:10,
				isConfirm:true,
				statusTip:"",
				timeReceipt:"",
				statusTips:'',
				thumb:'',
				userInfo:"",
				orderList:{},
				goodsList:[],
				receiptInfo:{},
				newLogistInfo:{},
				logistList:[]
			}
		},
		onLoad(opt) {
			this.orderId=opt.id;
			//console.log(opt.id);
			this.getDetlleList();
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		computed:{
		},
		methods: {
			changeAdd(){},
			cancelOrder(e){//待付款时取消订单
				this.$if0(cancelOrderBtn,e.target.id).then(res => {
					console.log(res);
					uni.showToast({
						title:"取消订单成功！",
						duration: 2000
					});
				})
			},
			delectOrder(e){//订单完成或作废时删除订单
			let that=this;
			uni.showModal({
			    title: '提示',
			    content: '确认要删除订单吗？',
				confirmText:"删除",
			    success: function (res) {
			        if (res.confirm) {
			           that.$if0(delectOrderBtn,e.target.id).then(res => {
			           	console.log(res);
			           	uni.showToast({
			           		title:"删除订单成功！",
			           		duration: 2000,
			           		success:function(){
			           			uni.redirectTo({
			           			    url: '/pages/member/orderList/orderList'
			           			});
			           		}
			           	});
			           }).catch(err=>{
						   uni.showModal({
							   title: '提示',
							   content: err.Message,
							   showCancel:false
							   });
							   })
			        } else if (res.cancel) {
			            console.log('用户点击取消');
			        }
			    }
			});
				
			},
			goEvaluate(e){
				uni.redirectTo({
				    url: '/pages/member/orderComment/orderComment'
				});
			},
			getDetlleList(sortOpt){//获取订单详情
				this.$if0(getOrderDetlle ,this.orderId).then(res => {
					console.log(res)
					this.orderList = res.Data;
					this.goodsList = res.Data.goodsList;
					this.statusTip=res.Data.statusTip;
					this.statusTips=res.Data.statusTips;
					this.timeReceipt=res.Data.timeReceipt;
					this.receiptInfo=res.Data.receiptInfo;
					this.userInfo=res.Data.receiptInfo.consignee+' '+res.Data.receiptInfo.phoneNumber;
					if(res.Data.status==5||res.Data.status==4){
						this.thumb='/static/order/alertIcon.png';
					}else if(res.Data.status==3){
						this.thumb='/static/order/finishedIcon.png';
					}else{
						this.thumb='/static/order/timeIcon.png';
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
									that.isConfirm=false;
									that.getDetlleList();
				           			// uni.$emit("refreshed");
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
		components: {
			orderGoods,
			uniList,
			uniListItem
		}
	}
</script>

<style>
.content{
	width: 100%;
	background-color:#eeeeee;
	padding: 20rpx 0;
}
.main_content{
	background-color: #FFFFFF;
	width: 100%;
}
.main_content .good_state{
	width: 100%;
	height: 100rpx;
	background-color: #EEEEEE;
}
.main_content .good_state .uni-list-item__container{
	padding: 18rpx 30rpx;
}
.main_content .good_state .uni-list-item__container:after{
	height: 0;
}
.main_content .detail_body{
	padding-right:20rpx;
}
.main_content .switchIntegral .uni-list-item__content{
	position: relative;
}
.main_content .switchIntegral .uni-list-item__content-note{
	position: absolute;
	left: 34%;
	top:2rpx
}
.main_content .switchIntegral .uni-list-item__extra switch{
	transform:scale(0.7,0.5);
}
.order_total{
	height: 60rpx;
	line-height: 60rpx;
	font-size: 32rpx;
	color: #666666;
	padding: 0 30rpx;
}
.order_total>text{
	float: right;
}
.total_price{
	float: right;
}
.total_price span{
	display: inline-block;
	width:100rpx;
	height:45rpx;
	padding-left: 20rpx;
	line-height: 45rpx;
	background-image: url(~@/static/order/baoyou.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	color: #FF6000;
	margin-right: 20rpx;
	font-size: 24rpx;
}
.main_content .detail_body .orders_item{
	width: 96%;
	padding-left: 3.5%;
}
.main_content .order_other{
	margin-top: 40rpx;
	border-top: 1px solid #DDDDDD;
	overflow: hidden;
	width: 93%;
	margin: 0 auto;
	padding: 20rpx 0;
}
.main_content .order_other .other_info{
	color: #666666;
	font-size: 26rpx;
	line-height: 50rpx;
}
.other_btn{
	border-top: 1px solid #DDDDDD;
	overflow: hidden;
	width: 100%;
	padding-top: 30rpx;
	margin: 40rpx auto;
}
.other_btn button{
	float: right;
	width: 138rpx;
	height: 55rpx;
	line-height: 55rpx;
	font-size: 26rpx;
	color: #666666;
	padding: 0;
}
.other_btn .submit_btn{
	color: #FF6000;
	border:1px solid #FF6000;
	margin-left: 30rpx;
}
.other_btn .submit_btn::after{
	border: none;
}
</style>