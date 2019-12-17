<template>
	<view class="content">
		<view class="input_wrap">
			<image src="/static/ico/ico-search.png" mode="aspectFit"></image>
			<input type="text" value="" @focus="hotChange" @input="hotChange" confirm-type="search" :placeholder="searchTip" v-model="searchKey" @confirm="search" />
		</view>
		<!-- <text class="toSearch flex_a" @tap="search">搜索</text> -->
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
		<i-load-more v-if="goodsList.length > 0" :tip="loadTip" @tap="getGoodsList" :loading="loading" />
		<view class="no" v-if="goodsList.length <= 0">
			<image src="/static/ico/ico-noGoods.png" mode="scaleToFill"></image>
			<view class="tip_info">没有找到相关的商品信息</view>
			<view class="tip_info">请换一个关键词试试吧</view>
		</view>
		<view class="hot" v-if="showhot" @touchmove.stop.prevent="">
			<view class="close" @click="clearHis" v-if="historyList.length">
				×
			</view>
			<view class="title" v-if="historyList.length">
				历史搜索
			</view>
			<view class="flex_row item" v-if="historyList.length">
				<view class="flex_a" @click="searchEasy(h)" v-for="h in historyList" :key="h">
					{{h}}
				</view>
			</view>
			<view class="title" v-if="hotList.length">
				他们都在搜
			</view>
			<view class="flex_row item" v-if="hotList.length">
				<view class="flex_a" @click="searchEasy(h.title)" v-for="h in hotList" :key="h.id">
					{{h.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import iTabs from 'iview-mpvue/dist/components/tabs/tabs';
	import iTab from 'iview-mpvue/dist/components/tab/tab';
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import {goodsSq} from "@/components/goods-sq";
	import {getGoods , getCategory , searchGoods} from '@/common/goods.js';
	import {searchHotKey} from "@/common/ArticleShows.js"
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
				searchKey:'',
				sortW:0,
				hotList:[],
				historyList:[],
				showhot:true,
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad() {
			this.$if0(searchHotKey).then(res => {
				if(res.Data.length > 0){
					this.hotList = res.Data;
					// this.searchTip = res.Data[0].title;
				}
			}).catch(err => {console.log(err)})
			let hisStr = uni.getStorageSync('searchHistory');
			if(hisStr != '' && !(/^\s+$/.test(hisStr) ) )this.historyList = hisStr.split('|');
		},
		computed:{
			list(){
				return this.categoryList;
			}
		},
		methods: {
			hotChange(e){
				if(this.searchKey == ''){
					this.openHot();
				}
			},
			searchEasy(e){
				this.searchKey = e;
				this.search();
			},
			openHot(){
				this.showhot = true;
			},
			clearHis(){
				let _this = this;
				uni.showModal({
						title: '提示',
						content: '确定要删除历史记录吗',
						success: function (res) {
								if (res.confirm) {
										console.log('用户点击确定');
										uni.removeStorageSync('searchHistory');
										_this.historyList = [];
								} else if (res.cancel) {
										console.log('用户点击取消');
								}
						}
				});
				
			},
			closeHot(){
				this.showhot = false;
			},
			selectSortW(){
				this.sortW = Math.abs(this.sortW - 1);
				this.selectSort(1);
			},
			setHistoryKey(k){
				let reg = /^\s+$/
				if(reg.test(k) || k == ''){
					return;
				}
				let f = false;
				for(let i = 0 ; i < this.historyList.length ; i++){
					if(this.historyList[i] == k){
						f = true;
						this.historyList.splice(i , 1);
						this.historyList.unshift(k);
						if(this.historyList.length > 10){
							this.historyList = this.historyList.slice(0);
						}
						uni.setStorageSync('searchHistory', this.historyList.join('|'));
					}
				}
				if(f){
					return;
				}else{
					this.historyList.unshift(k);
					if(this.historyList.length > 10){
						this.historyList = this.historyList.slice(0);
					}
					uni.setStorageSync('searchHistory', this.historyList.join('|'));
				}
			},
			search(){
				let v = '';
				// if(this.searchKey == ''){
					// 	v = this.searchTip;
				// }else{
					// 	v = this.searchKey;
				// }
				v = this.searchKey;
				if(v == ''){
					this.$toast('请先输入搜索内容');
					return;
				}
				this.closeHot();
				this.setHistoryKey(v);
				this.getGoodsList(true , v)
			},
			getGoodsList(reset , key){//获取商品
				// let category;
				let _this = this;
				let sortOpt = this.sortOpt;
				if(reset){
					_this.goodsList = [];
					_this.pageIndex = 1;
					_this.hasMore = true;
					_this.loadTip = '查看更多'
				}
				this.$if0(searchGoods , this.pageIndex , 20 , key , sortOpt).then(res => {
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
					console.log(err);
				})
			},
			selectCategory(e){
				console.log('已选',this.category)
				this.getGoodsList(true , );
			},
			selectSort(i){
				console.log(i)
				let v = '';
				if(this.searchKey == ''){
					v = this.searchTip;
				}else{
					v = this.searchKey;
				}
				this.sortKey = i;
				let sortOpt = [];
				
				if(i == 0){
					sortOpt.push({
						"Key": "sortId ",
						"Sort": 0
					});
					this.sortOpt = sortOpt;
					this.getGoodsList(true , v);
				}else if(i == 1){
					sortOpt.push({
						"Key": "priceSale",
						"Sort": this.sortW                       //升序
					})
					this.sortOpt = sortOpt;
					this.getGoodsList(true , v);
				}else if(i == 2){
					sortOpt.push({
						"Key": "saleCount",
						"Sort": 1                       //降序
					})
					this.sortOpt = sortOpt;
					this.getGoodsList(true , v);
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
	.tabs{
		margin-bottom: 20rpx;
		border-bottom: 1rpx solid #ccc;
		.tab{
			height: 50rpx;
			line-height: 50rpx;
			margin-top: 20rpx;
			font-size: 36rpx;
			color: #333;
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
	.no{
		width: 100%;
		image{
			display: block;
			width: 174rpx;
			height: 174rpx;
			margin: 60rpx auto;
		}
		.tip_info{
			height: 50rpx;
			line-height: 50rpx;
			font-size: 34rpx;
			color: #666;
			text-align: center;
		}
	}
	.tab_active{
		border-bottom: 4rpx solid #ff6000;
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
			margin-right: 20rpx;
			line-height: 58rpx;
			vertical-align: middle;
		}
		
		input{
			display: inline-block;
			width: calc(100% - 78rpx);
			height: 58rpx;
			line-height: 58rpx;
			vertical-align: top;
			font-size: 28rpx;
		}
	}
	.toSearch{
		height: 78rpx;
		line-height: 78rpx;
		font-size: 36rpx;
		color: #333;
	}
	.hot{
		position: absolute;
		top: 98rpx;
		width: 710rpx;
		height: 100%;
		box-sizing: border-box;
		background-color: #fff;
		.close{
			position: absolute;
			right: 0;
			top:0;
			color: #333;
		}
		.title{
			font-size: 30rpx;
			line-height: 50rpx;
			color: #333;
		}
		.item{
			font-size: 28rpx;
			justify-content: flex-start;
			flex-flow:wrap;
			view{
				margin: 20rpx;
				padding: 10rpx;
				line-height: 26rpx;
				border-radius: 10rpx;
				color: #999;
				background-color: #eee;
			}
		}
	}

</style>
