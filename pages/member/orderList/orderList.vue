<template>
	<view class="content">
		<view class="tabs flex_row">
			<view @tap="selectStatus(10)" :class="{ tab_active:statusKey == 10}"  class="tab flex1" >
				全部
			</view>
			<view @tap="selectStatus(0)"  :class="{ tab_active:statusKey == 0}" class="tab flex1">
				待付款
			</view>
			<view @tap="selectStatus(1)" :class="{ tab_active:statusKey == 1}" class="tab flex1">
				待发货
			</view>
			<view @tap="selectStatus(2)" :class="{ tab_active:statusKey == 2}" class="tab flex1">
				待收货
			</view>
			<view @tap="selectStatus(3)" :class="{ tab_active:statusKey == 3}" class="tab flex1">
				已完成
			</view>
		</view>
		<view v-if="orderList.length == 0" style="text-align: center;padding:20vh 0;">暂无相关订单信息</view>
		<order-list v-else :list="orderList" :orderStatus='statusKey' @refreshed="refreshed"></order-list>
		<i-load-more v-if="isShow" :tip="loadTip" @tap="getOrderList" :loading="loading" />
		
	</view>
</template>

<script>
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import {orderList} from "@/components/order-list";
	import {getOrders} from '@/common/order.js';
	export default {
		data() {
			return {
				status:'',
				statusKey:10,
				pageIndex:1,
				pageCount:0,
				isShow:false,
				orderList:[],
				loading:false,
				loadTip:'查看更多',
				hasMore:true
			}
		},
		onLoad(opt) {
			if(JSON.stringify(opt) == "{}"){
				this.statusKey=10;
			}else{
				this.statusKey=opt.status;
			}
			this.getOrderList();
			uni.$on('refreshed',this.refreshed);
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		computed:{
		},
		methods: {//获取订单列表
			getOrderList(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				this.$if0(getOrders , this.pageIndex, 10,this.statusKey).then(res => {
					console.log(res);
					this.pageCount=res.Data.PageCount;
					this.isShow=this.pageIndex*10<res.Data.PageCount;
					if(res.Data.Data.length > 0){
						this.loading = false;
						this.pageIndex++;
						
						//this.orderList = res.Data.Data;
						this.orderList = this.orderList.concat(res.Data.Data);
					}else{
						this.loading = false;
						this.hasMore = false;
						//this.loadTip = '暂无数据'
					}
					
				})
			},
			refreshed(e){
				//console.log(1,e)
				this.pageIndex=1;
				this.hasMore=true;
				this.orderList=[];
				this.getOrderList();
			},
			selectStatus(i){
				this.statusKey = i;
				this.pageIndex=1;
				this.hasMore=true;
				this.orderList=[];
				this.getOrderList();
				
				// let sortOpt = [];
				// if(i == 0){
				// 	this.getOrderList();
				// }else if(i == 1){
				// 	sortOpt.push({
				// 		"Key": "priceSale",
				// 		"Sort": 0                       //升序
				// 	})
				// 	this.getOrderList(sortOpt);
				// }else if(i == 2){
				// 	sortOpt.push({
				// 		"Key": "integralSale",
				// 		"Sort": 1                       //降序
				// 	})
				// 	this.getOrderList(sortOpt);
				// }
			}
		},
		components: {
			orderList,
			iLoadMore
		}
	}
</script>

<style>
	page{
		padding-bottom: 20rpx;
		background-color: #EEEEEE;
	}
.content{
	width: 100%;
	padding: 20rpx 0 0;
}
.content .tabs{
	background-color: #FFFFFF;
	height: 85rpx;
	line-height: 85rpx;
	width: 94%;
	padding: 0 3%;
	border-bottom: 1px solid #DDDDDD;
	text-align: center;
}
.tab_active{
	/* border-bottom: 2rpx solid #19BE6B; */
	color: #ff6000;
}
</style>