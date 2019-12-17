<template>
	<view class="orders">
			<view class="orders_item" v-for="(item,index) in list.cartList" :key="index">
				<view class="uni-flex uni-row order_info">
					<view class="flex-item goods_radio">
						<checkbox-group>
							<label for="cheakCart">
								<checkbox :data-goods="item" v-bind:id="index" :checked="list.cartList[index].isChecked" @click="radioChange(index)" />
							</label>
						</checkbox-group>
						<!-- <label class="radio"><radio :data-goods="item" v-bind:id="index" :checked="list[index].isChecked" @click="radioChange"/></label> -->
					</view>
					<view class="flex-item goods_img">
						<image :src="item.goodsLogo" mode=""></image>
					</view>
					<view class="flex-item goods_info">
						<navigator :url="'/pages/goods/goodsDetail/goodsDetail?id='+item.goodsId">
							<p class="goods_title">{{item.goodsTitle}}</p>
							<text class="goods_intr" v-if="item.zhaiyao!=null">{{item.zhaiyao?item.zhaiyao:''}}</text>
							<view class="goods_sku">{{item.skuInfo|sku}}</view>
							<view class="goods_price">
								<!-- ￥<text>{{item.priceSale}}</text> -->
								<price-slice :price="item.priceSale"></price-slice>
							</view>
						</navigator>
						<view class="example-body">
						  <uni-number-box :index="index" :value="list.cartList[index].quantity"  @change="change"/>
						</view>
					</view>
					<view class="flex-item cancel_btn">
						<view class="deletGood" @click="delectGoods" v-bind:id="item.id">删除</view>
					</view>
				</view>
			</view>
			<view class="lose_title" v-if="list.loseList.length>0">失效商品</view>
			<view class="orders_item lose_item" v-for="(item,index) in list.loseList" :key="index">
				<view class="uni-flex uni-row order_info">
					<view class="flex-item goods_radio">
						<!-- <checkbox-group>
							<label>
								<checkbox :data-goods="item" v-bind:id="index" :checked="list[index].isChecked" @click="radioChange(index)" />
							</label>
						</checkbox-group> -->
						<!-- <label class="radio"><radio :data-goods="item" v-bind:id="index" :checked="list[index].isChecked" @click="radioChange"/></label> -->
					</view>
					<view class="flex-item goods_img">
						<image :src="item.goodsLogo" mode=""></image>
					</view>
					<view class="flex-item goods_info">
						<navigator :url="'/pages/goods/goodsDetail/goodsDetail?id='+item.goodsId">
							<p class="goods_title">{{item.goodsTitle}}</p>
							<text class="goods_intr" v-if="item.zhaiyao!=null">{{item.zhaiyao}}</text>
							<view class="goods_sku">{{item.skuInfo|sku}}</view>
							<view class="goods_price">
								<!-- ￥<text>{{item.priceSale}}</text> -->
								<price-slice :price="item.priceSale"></price-slice>
							</view>
						</navigator>
						<view class="example-body">
						  <uni-number-box :index="index" :value="list.loseList[index].quantity" :disabled="true"/>
						</view>
					</view>
					<view class="flex-item cancel_btn">
						<view class="deletGood" @click="delectGoods" v-bind:id="item.id">删除</view>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	import priceSlice from './price-slice';
	import uniNumberBox from '@/components/uni-number-box';
	import {deletCart} from '@/common/cart.js';
	export default {
		props:['list','allSelecdPlice'],
		components: {
			priceSlice,
			uniNumberBox
		},
		data(){
			return {
				priceValue:0,
				goodsItem:{
					goodsList:[],
				}
			}
		},
		watch: {
			priceValue(newVal, oldVal) {
				this.$emit('priceValue', newVal, this.goodsItem)
			},
			
		},
		 methods: {
			 change(value,index) {
			 	this.list.cartList[index].quantity=value;
				this.$emit('updataList', this.list.cartList);
			 	this.goodsItem.goodsList=[];
			 	this.priceValue=0;
			 	if(this.list.cartList[index].isChecked){
			 		for(let n=0;n<this.list.cartList.length;n++){
			 			if(this.list.cartList[n].isChecked){
			 				this.goodsItem.goodsList.push({
			 				goodsId:this.list.cartList[n].goodsId,
			 				skuId:this.list.cartList[n].skuId,
			 				quantity:this.list.cartList[n].quantity,
			 			});
			 			this.priceValue+=this.list.cartList[n].priceSale*this.list.cartList[n].quantity;
			 			}	
			 		}
			 	}					
			 },
				radioChange: function(evt) {
					let temp=this.list.cartList;
					this.goodsItem.goodsList=[];
					this.priceValue=0;
					if(this.list.cartList[evt].isChecked){
						this.list.cartList[evt].isChecked=false;
						temp[evt].isChecked=false;
					}else{
						this.list.cartList[evt].isChecked=true;
						temp[evt].isChecked=true;
					}
					for(let n=0;n<this.list.cartList.length;n++){
						if(this.list.cartList[n].isChecked){
							this.goodsItem.goodsList.push({
							goodsId:this.list.cartList[n].goodsId,
							skuId:this.list.cartList[n].skuId,
							quantity:this.list.cartList[n].quantity,
						});
						//this.$set(this.list.cartList, n, temp[n]);
						this.priceValue+=this.list.cartList[n].priceSale*this.list.cartList[n].quantity;
						}	
					}
					this.$emit('updataList', this.list.cartList);
					this.$mp.component.setData({
					      ['this.list']:this.list
					    })
					//console.log(this.goodsItem.goodsList);
		        },
				delectGoods(e){
					this.$if0(deletCart,e.target.id).then(res => {
						//console.log(res);
						uni.showToast({
							title:"删除成功！",
							duration: 2000,
							success: function () {
								console.log(uni.$emit);
								uni.$emit("refreshed");
							}
						});
					})
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
<style>
	.orders_item{
		background-color: #FFFFFF;
		width: 96%;
		padding: 0 2%;
		margin-bottom: 20rpx;
	}
.lose_item{
	background-color: #DDDDDD;
}
.lose_title{
	text-align: center;
	padding: 20rpx 0 40rpx;
	font-size: 32rpx;
	color: #666666;
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
.goods_radio{
	width: 8%;
	height: 25vw;
	line-height: 25vw;
	float: left;
}
.goods_radio label checkbox{
	transform:scale(0.6);
	vertical-align: middle;
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
	width: 50%;
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
.goods_info  .example-body{
	position: absolute;
	bottom: -2rpx;
	right: -45rpx;
}
.cancel_btn{
	width: 8%;
	float: left;
}
.deletGood{
	color: #666666;
	font-size: 26rpx;
}
</style>