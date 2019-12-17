<template>
	<view class="content">
		<goods-row :list="list"></goods-row>
		<i-load-more :tip="loadTip" @tap="getList" :loading="loading" />
	</view>
</template>

<script>
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import goodsRow from '@/components/goods-row';
	import {getGoods , getCheapGoods , getGoodsYou , getHotGoods , getTopGoods} from "@/common/goods.js"
	export default {
		data() {
			return {
				list:[],
				pageIndex:1,
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				type:0,
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(opt) {
			// this.$if0(getCheapGoods).then(res => {
			// 	this.list = res.Data.Data;
			// }).catch(err => {console.log(err)})
			console.log(opt)
			this.type = opt.type;
			this.hasMore = true;
			this.pageIndex = 1;
			this.list = [];
			this.loadTip = '查看更多'
			this.getList();
		},
		methods: {
			getList(){
				let _this = this;
				if(!this.hasMore){
					return;
				}
				let getFun;
				if(_this.type == 1){
					getFun = getTopGoods;
				}
				if(_this.type == 2){
					getFun = getHotGoods;
				}
				if(_this.type == 3){
					getFun = getCheapGoods;
				}
				this.loading = true;
				this.$if0(getFun , this.pageIndex , 10).then(res => {
					if(res.Data.Data.length > 0){
						this.loading = false;
						this.pageIndex++;
						this.list = this.list.concat(res.Data.Data);
					}else{
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}
					if(_this.list.length >= res.Data.PageCount){
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}
				}).catch(err => {console.log(err)})
			},
		},
		components:{
			goodsRow,
			iLoadMore
		}
	}
</script>

<style>
page{
	background-color: #eee;
}

</style>
