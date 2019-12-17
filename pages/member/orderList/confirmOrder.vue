<template>
	<view class="content">
		<view class="main_content">
			<uni-list v-if="defaultAddress!=null">
			  <uni-list-item :title="(defaultAddress.area?defaultAddress.area:'')+' '+(defaultAddress.address?defaultAddress.address:'')" :note="(defaultAddress.consignee?defaultAddress.consignee:'')+' '+(defaultAddress.phoneNumber?defaultAddress.phoneNumber:'')" @click="changeAdd"/>
			</uni-list>
			<uni-list v-else>
				<uni-list-item title="请填写收货人地址" @click="changeAdd"/>
			</uni-list>
			<add-order :list="goodsList"></add-order>
			<uni-list-item title="积分抵现" :note="integralTips+'使用'+trueIntegral+'积分抵扣'+(trueIntegral/100).toFixed(2)+'元'" class="switchIntegral switchStyle">
				<template v-slot:right>
					<button class="selet_credit" @click="addCreditNum(1)">选择</button>
				</template>
			</uni-list-item>
			<uni-list-item title="分享金抵现" :note="bonusTips+'使用'+truebonus+'分享金抵扣'+truebonus+'元'" class="switchIntegral">
				<template v-slot:right>
					<button class="selet_credit" @click="addCreditNum(2)">选择</button>
				</template>
			</uni-list-item>
			<!-- <uni-list-item :show-arrow="false" :show-switch="true" :switch-checked="true" :extra-icon="extraIcon1" class="switchIntegral" title="" note=""
			  @switchChange="switchChange" /> -->
			
			  <view class="order_intrduce">
				  <view class="order_total">商品总计<text style="color:#FF6000;">￥{{orderData.moneyCount?orderData.moneyCount:''}}</text></view>
				  <view class="order_total">运费<view class="total_price"><span>包邮</span><text>￥0.00</text></view></view>
				  <view class="order_total">发票<text>开发票请联系客服</text></view>
			  </view>
			  <view class="foot_btn">
				<view class="dk_total">抵扣:<text>￥{{dikouTotal}}</text><br/>
				应付金额:<text>￥{{orderData.moneyPayReal<=0?0.00:orderData.moneyPayReal}}</text>
				</view>
			  	<button class="submit_order" @click="submitOrder">提交订单</button>
			  </view>
		</view>
		 <view class="seletCreditDalog" v-if="showDalog" @click="colseDalog(1)">
			<view class="dalog_body">
				<text class="close_dalog" style="float: right;" @click="colseDalog(1)">x</text>
				<view @tap.stop="">
		        <view class="uni-padding-wrap">
		            <view class="uni-title">选择抵扣积分</view>
		            <view class="uni-title">可使用{{userCredit}}积分抵扣{{(userCredit/100).toFixed(2)}}元</view>
		        </view>
		        <view> 
				<input class="credit_num" type="number" v-model="orderData.integralUse" @input="validNum" placeholder="请输入积分值"/>
				<button class="submit_credit" @click="selectedCreditNum">确定</button>
				</view>
				</view>
			</view>
		</view>
		<view class="seletCreditDalog" v-if="showBonusDalog" @click="colseDalog(2)">
			<view class="dalog_body">
				<text class="close_dalog" style="float: right;" @click="colseDalog(2)">x</text>
				<view @tap.stop="">
		        <view class="uni-padding-wrap">
		            <view class="uni-title">分享金抵现</view>
		            <view class="uni-title">可使用{{userBonus}}分享金抵扣{{userBonus}}元</view>
		        </view>
		        <view> 
				<input class="credit_num" type="number" v-model="orderData.bonusUse" @input="validNum" placeholder="请输入分享金金额"/>
				<button class="submit_credit" @click="selectedBonusNum">确定</button>
				</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list';
	import uniListItem from '@/components/uni-list-item';
	import {addOrder} from "@/components/add_order";
	import {getOrderDetlle,addOrderDo,sumbitOrdersInfo} from '@/common/order.js';
	import {getDefaultAddr} from "@/common/address.js";
	import {getCreditInfo} from "@/common/credit.js";
	import {getRewardInfo} from "@/common/reward.js";
	export default {
		data() {
			return {
				orderId:'',
				orderNo:'',
				dikouTotal:0,
				trueIntegral:0,
				truebonus:0,
				goodsList:[],
				showDalog:false,
				showBonusDalog:false,
				numberArr:[0,1,2,3,4,5,6,7,8,9],
				orderDo:false,
				userCredit:0,
				userBonus:0,
				bonusTips:"可",
				integralTips:"可",
				orderData:{
					userId: 0,
					integralUse: 0,
					bonusUse: 0,
					userReceiptId: 0,
					moneyPayReal:0,
					moneyCount:0,
					goodsList: [],
				},
				defaultAddress:[],
				extraIcon1: {
				  color: '#ff6000',
				  size: '12',
				  type: 'gear-filled'
				}
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(opt) {
			this.orderId=opt.id;
			this.getUserCredit();
		},
		onShow(){
			let orderInfo=getApp().globalData;
			this.goodsList=orderInfo.addOrderData.goodsList;
			this.orderDo=orderInfo.orderDo;
			this.orderData.userId=orderInfo.addOrderData.userId;
			this.orderData.goodsList=orderInfo.addOrderData.goodsList;
			this.orderData.moneyCount=orderInfo.addOrderData.moneyCount;
			this.orderData.moneyPayReal=orderInfo.addOrderData.moneyPayReal;
			this.orderNo=orderInfo.addOrderData.orderNo;
			console.log(getApp().globalData);
			if(this.orderDo&&orderInfo.addressInfo){
				this.defaultAddress=JSON.parse(orderInfo.addressInfo);
				this.defaultAddress.area=this.defaultAddress.area.replace(/,/g, '');
				this.orderData.userReceiptId=this.defaultAddress.id;
				getApp().globalData.orderDo=false;
			}else{
				this.getDefaultAddData();
			}
		},
		watch:{
			dikouTotal(newVal){
				let that=this;
				//console.log(that.orderData.moneyPayReal);
				// if(newVal>that.orderData.moneyCount){
				// 	uni.showModal({
				// 		title: '提示',
				// 		content:"所选择积分会使价格不大于0元，最低0.01元，否则无法支付！",
				// 		showCancel:false,
				// 		success: function () {
				// 			//that.orderData.moneyPayReal=0.01;
				// 		}
				// 	});
				// 	
				// }
			}
		},
		methods: {
			getUserCredit(){//获取积分奖金getRewardInfo
				this.$if0(getCreditInfo).then(res => {
					this.userCredit=res.Data.integralBalance;
					this.trueIntegral=res.Data.integralBalance;
					console.log(this.trueIntegral);
					//this.orderData.integralUse=res.Data.integralBalance;
				}).catch(err=>{
					console.log(err)
					// uni.showModal({
					// 	title: '提示',
					// 	content: err.Message,
					// 	showCancel:false,
					// 	success: function (err) {
					// 		
					// 	}
					// });
				});
				this.$if0(getRewardInfo).then(res => {
					//console.log(res.Data.bonusBalance)
					this.userBonus=res.Data.bonusBalance;
					this.truebonus=res.Data.bonusBalance;
					console.log(this.truebonus);
					//this.orderData.bonusUse=res.Data.bonusBalance;
				}).catch(err=>{
					console.log(err)
					// uni.showModal({
					// 	title: '提示',
					// 	content: err.Message,
					// 	showCancel:false,
					// 	success: function (err) {
					// 		
					// 	}
					// });
				})
			},
			getDefaultAddData(){//获取默认地址
				this.$if0(getDefaultAddr).then(res => {
					console.log(res);
					this.defaultAddress=res.Data;
					if(res.Data){
						this.defaultAddress.area=res.Data.area.replace(/,/g, '');
						this.orderData.userReceiptId=res.Data.id;
					}
				}).catch(err=>{
					console.log(err)
					if(err.Message){
						uni.showModal({
							title: '提示',
							content: err.Message,
							showCancel:false,
							success: function (res) {
								
							}
						})
					}
				})
			},
			validNum(e){
				console.log(e);
				var reg = /^[0-9]*$/;
				if (!reg.test(e.target.value)) {
				uni.showToast({
					title:"请输入整数！",
					icon:"none",
				})
				return false;
				}
			},
			submitOrderComfirm(){
				if(this.orderData.integralUse==''){
					this.orderData.integralUse=0;
				}
				if(this.orderData.bonusUse==''){
					this.orderData.bonusUse=0;
				}
				this.$if0(sumbitOrdersInfo,this.orderData).then(res => {
					console.log(res.Data);
					this.orderData.moneyPayReal=res.Data.moneyPayReal;
				})
			},
			addCreditNum(e) {//打开选择积分弹窗
				if(e==1){
					this.showDalog=true;
				}else{
					this.showBonusDalog=true;
				}
				
			},
			colseDalog(e){//关闭选择积分弹窗
				if(e==1){
					this.showDalog=false;
				}else{
					this.showBonusDalog=false;
				}
			},
			selectedCreditNum(){//选择积分
				let that=this;
				if(this.orderData.integralUse%1 !=0){
					uni.showToast({
						title:"请输入整数！",
						icon:"none",
						success:function(){
							that.orderData.integralUse=0;
						}
					})
					return;
				}
				//console.log(this.orderData.integralDeduct)
				if(this.orderData.integralUse>this.userCredit){
					uni.showToast({
						title:"不能大于您的积分值！",
						icon:"none",
						success:function(){
							that.orderData.integralUse=0;
						}
					});
					return;
				}
				this.submitOrderComfirm();
				this.trueIntegral=+this.orderData.integralUse;
				this.integralTips="已";
				//console.log(this.orderData);
				this.dikouTotal=+this.orderData.bonusUse+ +(this.orderData.integralUse/100).toFixed(2);
				this.showDalog=false;
			},
			selectedBonusNum(){//选择奖励金
				//console.log(this.orderData.bonusDeduct)
				let that=this;
				if(this.orderData.bonusUse%1 !=0){
					uni.showToast({
						title:"请输入整数！",
						icon:"none",
						success:function(){
							that.orderData.bonusUse=0;
						}
					})
					return;
				}
				if(this.orderData.bonusUse>this.userBonus){
					uni.showToast({
						title:"不能大于您的奖金值！",
						icon:"none",
						success:function(){
							that.orderData.bonusUse=0;
						}
					});
					return;
				}
				this.submitOrderComfirm();
				this.truebonus=+this.orderData.bonusUse;
				this.bonusTips="已";
				//this.orderData.moneyPayReal=this.orderData.moneyPayReal-this.orderData.bonusUse;
				this.dikouTotal=+this.orderData.bonusUse+ +(this.orderData.integralUse/100).toFixed(2);
				this.showBonusDalog=false;
				
			},
			changeAdd(e) {
				this.orderDo=true;
				uni.navigateTo({
					url: '/pages/member/addressMange/addressList?orderDo='+this.orderDo,
				});
			},
			submitOrderFun(){
				let that=this;
				this.$if0(addOrderDo,this.orderData).then(res => {
					//console.log(res);
					let orderNo = res.Data.orderNo;
					let orderData= res.Data;
					uni.hideLoading();
					uni.showToast({
						title:"提交成功！",
						duration: 2000,
						success: function () {
							console.log(orderData)
							if(orderData.status==1){
								uni.redirectTo({
									url: '/pages/member/pay/payOk?orderId='+orderData.id
								});
							}else{
								uni.redirectTo({
									url: '/pages/member/pay/pay?orderNo='+orderNo+'&price='+orderData.moneyPayReal+'&orderId='+orderData.id
								});
							}
						}
					});
				}).catch(err=>{
					uni.hideLoading();
					console.log(err)
					if(err.Message){
						uni.showToast({
							title:err.Message,
							icon:"none",
						});
					}else{
						uni.showToast({
							title:'提交失败',
							icon:"none",
						});
					}
				});
			},
			submitOrder(){//提交订单
			let _this=this;
			if(_this.orderData.userReceiptId){}else{
				uni.showToast({
					title:"请选择收货地址！",
					icon:"none",
				});
				return;
			}
			_this.orderData.integralUse=+_this.orderData.integralUse;
			_this.orderData.bonusUse=+_this.orderData.bonusUse;
			if(_this.dikouTotal>_this.orderData.moneyCount){
				uni.showModal({
				    title: '提示',
				    content: '您所选择的抵扣积分与分享金总和超过商品的价格，多余的将被扣除，确定支付吗？',
				    success: function (res) {
				        if (res.confirm) {
							uni.showLoading({
								title:"",
								mask:true
							});
							_this.submitOrderFun();
				     
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}else{
				uni.showLoading({
					title:"",
					mask:true
				})
				_this.submitOrderFun();
			}
			}
		},
		components: {
			addOrder,
			uniList,
			uniListItem
		}
	}
</script>

<style>
.content{
	width: 100%;
	background-color:#eeeeee;
	padding: 20rpx 0 100rpx;
	position: relative;
	z-index: 1;
}
.main_content{
	background-color: #FFFFFF;
	width: 100%;
	min-height: 88vh;
}
.main_content .uni-list{
	width: 95%;
	margin: 0 20rpx;
}
.main_content .switchIntegral .uni-list-item__container{
	padding: 0rpx 30rpx;
}
.main_content .switchIntegral .uni-list-item__content{
	position: relative;
	padding: 0;
	height: 120rpx;
}
.main_content .switchIntegral .uni-list-item__content-title{
	height: 120rpx;
	line-height: 120rpx;
}
.main_content .switchIntegral .uni-list-item__content-note{
	position: absolute;
	left: 30%;
	top:34rpx;
}
.main_content .switchStyle .uni-list-item__content-note{
	left: 24%;
}
.order_total{
	height: 60rpx;
	line-height: 60rpx;
	font-size: 32rpx;
	color: #666666;
	padding: 0 20rpx;
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
	height:40rpx;
	padding-left: 20rpx;
	line-height: 40rpx;
	background-image: url(~@/static/order/baoyou.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	color: #FF6000;
	margin-right: 20rpx;
	font-size: 24rpx;
}
.foot_btn{
		background-color: #FFFFFF;
		width: 96%;
		height: 100rpx;
		line-height: 40rpx;
		padding:0 2%;
		position: fixed;
		bottom: 0;
		font-size: 32rpx;
		z-index: 100;
	}
.dk_total{
	padding-top: 10rpx;
	display: inline-block;
	font-size: 26rpx;
	color: #666666;
}
.dk_total text{
	font-size: 26rpx;
	color: #FF6000;
}
	.submit_order{
		width: 165rpx;
		height: 65rpx;
		padding: 0;
		line-height: 65rpx;
		float: right;
		color: #FFFFFF;
		background-color: #FF6000;
		font-size: 32rpx;
		margin-top: 17rpx;
	}
	.submit_credit{
		width: 165rpx;
		height: 65rpx;
		padding: 0;
		line-height: 65rpx;
		color: #FFFFFF;
		background-color: #FF6000;
		font-size: 32rpx;
		margin-top: 17rpx;
	}
	.selet_credit{
		width: 135rpx;
		height: 45rpx;
		padding: 0;
		line-height: 45rpx;
		color: #666666;
		font-size: 26rpx;
		border-radius: 8rpx;
	}
.seletCreditDalog .uni-title{
		line-height: 50rpx;
		font-size: 32rpx;
		color: #666666;
	}
.seletCreditDalog{
	width: 100%;
	height: 102%;
	background-color:rgba(0,0,0,0.6);
	z-index: 100;
	position:absolute;
	top: 0;
}
	.seletCreditDalog .dalog_body{
		width:80%;
		height: 300rpx;
		position: absolute;
		left: 50%;
		top:40%;
		border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx #DDDDDD;
		margin-left: -44%;
		background-color: #FFFFFF;
		z-index: 1000;
		text-align: center;
		padding: 30rpx;
	}
	.credit_num{
		width: 80%;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		margin: 20rpx auto;
	}
.close_dalog{
	display: block;
	position: absolute;
	right: 20rpx;
	top: 15rpx;
	width: 30rpx;
	height: 30rpx;
	text-align: center;
	line-height: 30rpx;
	color: #666666;
}
</style>