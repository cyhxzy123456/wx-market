<template>
	<view class="content">
		<view class="input_wrap" @tap="toSearch">
			<image src="/static/ico/ico-search.png" mode="aspectFit"></image>
			<input type="text" value="" disabled :placeholder="searchTip" />
		</view>
		<!-- <text clas s="toSearch flex_a">搜索</text> -->
		<i-tabs scroll="true" color="#ff6000" v-model="category" @change="selectCategory">
			<i-tab v-for="c in categoryList1" :item-key="c.title" :title="c.title" :key="c.id"></i-tab>
		</i-tabs>
		<view class="tabs flex_row">
			<view @tap="selectSort(0)" :class="{ tab_active:sortKey == 0}" class="tab flex1 txt_c" >
				综合
			</view>
			<view :class="{ tab_active:sortKey == 1}" class="tab flex1 txt_c">
					<text @tap="selectSort(1)">价格</text>
				<view @tap="selectSortW" class="sort_ar"  :class="{tab_sort:sortW == 1,tab_sortr:sortW == 0}">
				</view>
			</view>
			<view @tap="selectSort(2)" :class="{ tab_active:sortKey == 2}" class="tab flex1 txt_c">
				销量
			</view>
		</view>
		<goods-sq :list="goodsList"></goods-sq>
		<i-load-more :tip="loadTip" @tap="getGoodsList" :loading="loading" />
	</view>
</template>

<script>
	import iTabs from 'iview-mpvue/dist/components/tabs/tabs';
	import iTab from 'iview-mpvue/dist/components/tab/tab';
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import {goodsSq} from "@/components/goods-sq";
	import {getGoods , getCategory , getGoodsByCategory} from '@/common/goods.js';
	export default {
		data() {
			return {
				searchTip: '搜索',
				category:'',
				categoryList:[],
				sortKey:0,
				goodsList:[],
				pageIndex:1,
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				sortOpt:'',
				sortW:0,
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onShow() {
			this.$if0(getCategory).then(res => {
				if(res.Data.Data.length > 0){
					this.categoryList = res.Data.Data;
					this.category = res.Data.Data[0].title
				}
			})
			this.sortOpt = [{
				"Key": "sortId ",
				"Sort": 0
			}]
			this.getGoodsList(true);
		},
		computed:{
			list(){
				return this.categoryList;
			},
			categoryList1(){
				let tem = [];
				this.categoryList.forEach(ele => {
					if(ele.isLock == 0){
						tem.push(ele);
					}
				});
				return tem;
			}
		},
		methods: {
			selectSortW(){
				this.sortW = Math.abs(this.sortW - 1);
				this.selectSort(1);
			},
			toSearch(){
				uni.navigateTo({
					url:'/pages/goods/search/search'
				})
			},
			getGoodsList(reset){//获取商品
				let category;
				let _this = this;
				let sortOpt = this.sortOpt;
				if(reset){
					_this.goodsList = [];
					_this.pageIndex = 1;
					_this.hasMore = true;
					_this.loadTip = '查看更多'
				}
				
				if(this.categoryList[0] && this.category != this.categoryList[0].title){
					category = this.category;
				}
				uni.showLoading({
					title:'',
					mask:true,
				})
				this.$if0(getGoodsByCategory , this.pageIndex , 20 , category , sortOpt).then(res => {
					uni.hideLoading();
					if(reset){
						_this.goodsList = [];
						_this.pageIndex = 1;
						_this.hasMore = true;
						_this.loadTip = '查看更多'
					}
					if(res.Data.Data.length + this.goodsList.length <= res.Data.PageCount){
						this.loading = false;
						this.pageIndex++;
						this.goodsList = this.goodsList.concat(res.Data.Data);
					}else{
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
					if(res.Data.Data.length < 20){
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
					if(res.Data.Data.length + this.goodsList.length == res.Data.PageCount){
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
				})
			},
			selectCategory(e){
				console.log('已选',this.category)
				this.getGoodsList(true);
			},
			selectSort(i){
				this.sortKey = i;
				let sortOpt = [];
				if(i == 0){
					sortOpt.push({
						"Key": "sortId ",
						"Sort": 0
					});
					this.sortOpt = sortOpt;
					this.getGoodsList(true );
				}else if(i == 1){
					sortOpt.push({
						"Key": "priceSale",
						"Sort": this.sortW
					})
					this.sortOpt = sortOpt;
					this.getGoodsList(true);
				}else if(i == 2){
					sortOpt.push({
						"Key": "saleCount",
						"Sort": 1                       //降序
					})
					this.sortOpt = sortOpt;
					this.getGoodsList(true);
				}
			}
		},
		components: {
			'i-tabs': iTabs,
			'i-tab': iTab,
			goodsSq,
			iLoadMore,
		}
	}
</script>

<style lang="scss">
		
	.i-tabs-tab{
		flex: 0 0 auto;
	}
	.i-tabs-tab-title-current {
	color: black;
	
	}

	.tabs{
		margin-bottom: 20rpx;
		border-bottom: 1rpx solid #F7F7F7;
		.tab{
			height: 40rpx;
			line-height: 40rpx;
			margin-top: 20rpx;
			font-size: 30rpx;
			color: #333;
			padding-bottom: 10rpx;

		}
		.tab_active{
			color: #ff6000;
			// border-bottom: 4rpx solid #ff6000;
		}
		.sort_ar{
			display: inline-block;
			width: 20rpx;
			height: 40rpx;
			margin-left: 10rpx;
			vertical-align: middle;
			background-position: center;
			background-repeat: no-repeat;
			background-size: 100%;
		}
		.tab_sort{
			background-image: url(~@/static/ico/ico-sort.png);
		}
		.tab_sortr{
			background-image: url(~@/static/ico/ico-sortR.png);
		}
	}
	.input_wrap{
		display: inline-block;
		width: 100%;
		height: 78rpx;
		margin-top: 20rpx;
		padding: 10rpx 10rpx;
		box-sizing: border-box;
		border: 1rpx solid #ccc;
		border-radius: 20rpx;
		image{
			width: 34rpx;
			height: 34rpx;
			line-height: 58rpx;
			margin-right: 20rpx;
			vertical-align: middle;
		}
		
		input{
			display: inline-block;
			width: calc(100% - 78rpx);
			height: 58rpx;
			line-height: 58rpx;
			vertical-align: middle;
			font-size: 28rpx;
		}
	}
	.toSearch{
		height: 78rpx;
		line-height: 78rpx;
		font-size: 36rpx;
		color: #333;
	}
</style>
