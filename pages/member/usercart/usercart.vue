<template>
	<view class="content">
		<view class="noData" v-if="cartListData.cartList.length==0&&cartListData.loseList.length==0">
			<image src="../../../static/personcenter/icon-noData.png" mode="widthFix"></image>
			<view class="txt">
				购物车空空如也哦
				 <br>去挑选几件喜欢的商品吧
				 <navigator url="/pages/goods/goodsByCategory/goodsByCategory" open-type="switchTab">
				  <button class="goSelectGoods">随便逛逛</button>
				 </navigator>
				
			</view>
		</view>
		<view v-else>
			<cart-list :list="cartListData" :allSelecdPlice="amountPayable" @updataList="updataList" @priceValue="totalPrice" @refreshed="refreshed"></cart-list>
			<i-load-more v-if="isShow" :tip="loadTip" @tap="getCartList" :loading="loading" />
			<view class="foot_btn">
				<view class="foot_left">
					<checkbox-group>
						<label for="allSelect" @click="allselet">
							<checkbox id="allSelect"  :checked="allIsSelected"/>全选
							应付金额
							<!-- <text>￥{{amountPayable}}</text> -->
							<price-slice :price="amountPayable"></price-slice>
						</label>
					</checkbox-group>
				</view>
				<button class="submit_order" @click="submitOrderComfirm">提交订单</button>
			</view>
		</view>
	</view>
</template>

<script>
	import priceSlice from '@/components/price-slice';
	import {cartList} from "@/components/cart-list";
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more';
	import {getCartLists} from '@/common/cart.js';
	import {sumbitOrdersInfo} from '@/common/order.js';
	export default {
		data() {
			return {
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				isShow:true,
				pageIndex:1,
				pageSize:10,
				pageCount:0,
				amountPayable:0,
				allIsSelected:false,
				orderItem:{
					goodsList:[],
				},
				cartListData:{
					cartList:[],
					loseList:[]
				}
			}
		},
		onLoad(){
			uni.$on('refreshed',this.refreshed);
			uni.$on('updataList',this.updataList);
		},
		onShow() {
			this.hasMore = true;
			this.pageIndex = 1;
			this.cartListData.cartList = [];
			this.cartListData.loseList = [];
			this.getCartList();
			this.totalPrice();
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		computed:{
		},
		methods: {
			getCartList(){//获取购物车列表
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				this.$if0(getCartLists , this.pageIndex,this.pageSize).then(res => {
					//console.log(res);
					this.isShow=this.pageIndex*this.pageSize<res.Data.PageCount;
					if(res.Data.Data.length>0){
						this.loading = false;
						this.pageIndex++;
						for(let n=0;n<res.Data.Data.length;n++){
							if(res.Data.Data[n].status==0){
								this.cartListData.cartList = this.cartListData.cartList.concat(res.Data.Data[n]);
							}else{
								this.cartListData.loseList = this.cartListData.loseList.concat(res.Data.Data[n]);
							}
						}
						// this.cartListData = this.cartListData.concat(res.Data.Data);
					}else {
						this.loading = false;
						this.hasMore = false;
						//this.loadTip = '暂无数据'
					}
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
			refreshed(e){
				//console.log(1,e)
				this.pageIndex=1;
				this.hasMore=true;
				this.cartListData.cartList=[];
				this.cartListData.loseList=[];
				this.getCartList();
			},
			updataList(e){
				//console.log(e);
				this.cartListData.cartList=e;
				let status = e.some( item => item.isChecked === false)
				if(status){
					this.allIsSelected=false;
					//console.log("没有全选");
				}else{
					this.allIsSelected=true;
					//console.log("全选了")
				}
			},
			totalPrice(e,orderItem){
				this.amountPayable=e;
				if(orderItem){
					//console.log(orderItem.goodsList);
					if(orderItem.goodsList.length==this.cartListData.cartList.length){
						this.allIsSelected=true;
					}else{
						this.allIsSelected=false;
					}
					this.orderItem=orderItem;
				}
			},
			submitOrderComfirm(){//计算商品信息
				if(this.orderItem.goodsList.length<=0){
					uni.showToast({
						title:"请选择商品!",
						icon:"none"
					});
					return;
				}
				uni.showLoading({
					title:"",
					mask:true
				})
				this.$if0(sumbitOrdersInfo,this.orderItem).then(res => {
					console.log(res.Data);
					let app = getApp();
					app.globalData.addOrderData=res.Data;
					uni.hideLoading();
					uni.navigateTo({
						 url: '/pages/member/orderList/confirmOrder'
					});
				})
			},
			allselet(){
				this.orderItem.goodsList=[];
				this.amountPayable=0;
				if(this.allIsSelected){
					this.allIsSelected=false;
					for(let i=0;i<this.cartListData.cartList.length;i++){
						this.cartListData.cartList[i].isChecked=false;
						this.orderItem.goodsList=[];
					}
				}else{
					this.allIsSelected=true;
					let _this = this
					for(let i=0;i<this.cartListData.cartList.length;i++){
						this.amountPayable+=this.cartListData.cartList[i].quantity*this.cartListData.cartList[i].priceSale;
						this.cartListData.cartList[i].isChecked=true;
						// console.log(this.cartListData);
						// // console.log(_this,_this.setData)
						// let key =  _this.cartListData[i].isChecked
						
						this.orderItem.goodsList.push({
							goodsId:this.cartListData.cartList[i].goodsId,
							skuId:this.cartListData.cartList[i].skuId,
							quantity:this.cartListData.cartList[i].quantity,
						});
					}
				}
				this.$mp.page.setData({
				      ['this.cartListData']:this.cartListData
				    })
			}
		},
		components: {
			priceSlice,
			cartList,
			iLoadMore
		}
	}
</script>

<style>
	page{
		background-color: #EEEEEE;
	}
	price-slice{
		display: inline-block;
		color: #FF6000;
	}
.content{
	width: 100%;
	background-color:#eeeeee;
	padding: 20rpx 0 100rpx;
}
	.noData{text-align: center;padding:176rpx 0;}
	.noData image{width: 160rpx;}
	.noData .txt{padding-top:20rpx;font-size: 28rpx;color:#666666;}
	.goSelectGoods{
		width: 220rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		padding: 0;
		background-color: #1abc9c;
		margin: 40rpx auto;
	}
	.foot_btn{
		background-color: #FFFFFF;
		width: 96%;
		height: 100rpx;
		line-height: 100rpx;
		padding:0 2%;
		position: fixed;
		bottom: 0;
		font-size: 32rpx;
		z-index: 100;
		box-shadow: 0 -2rpx 5rpx #DDDDDD;
	}
	.foot_left{
		float: left;
		width: 60%;
	}
	.foot_btn text{
		color: #FF6000;
		font-size: 36rpx;
	}
	.foot_left checkbox{
		transform:scale(0.6);
		vertical-align: top;
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
</style>
