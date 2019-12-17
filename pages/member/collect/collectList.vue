<template>
	<view>
		<view class="noData" v-if="collectList.length==0">
			<image src="../../../static/personcenter/icon-noData.png" mode="widthFix"></image>
			<view class="txt">
				当前没有收藏 <br>快去逛逛收藏商品吧
			</view>
		</view>
		<view v-else>
			<collectGood :list="collectList"></collectGood>
			<i-load-more :tip="loadTip" @tap="getCollectList" :loading="loading" v-if="isShow" />
		</view>
	</view>
</template>

<script>
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import collectGood from "@/components/collect-goods.vue"
	import {getCollectList} from "@/common/collect.js"
	export default {
		data() {
			return {
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				collectList:[],
				pageIndex:1,
				pageSize:10,
				pageCount:0,
				isShow:true,
			}
		},
		components: {
		'i-load-more': iLoadMore,
		collectGood
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
			this.getCollectList();
		},
		methods:{
			getCollectList(){
				//console.log("res")
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				this.$if0(getCollectList,this.pageSize,this.pageIndex).then(res => {
					this.loading = false;
					if(res.Data.Data.length>0){
						this.collectList = this.collectList.concat(res.Data.Data);
						this.isShow=this.pageIndex*this.pageSize<res.Data.PageCount;
						this.pageIndex++;
					}else {
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}
				}).catch(err=>{
					uni.showModal({
						title: '提示',
						content: res.Message,
						showCancel:false,
						success: function (res) {
							
						}
					});
				})
			}
		}
	}
</script>

<style scoped>
	.noData{text-align: center;padding:176rpx 0;}
	.noData image{width: 160rpx;}
	.noData .txt{padding-top:20rpx;font-size: 28rpx;color:#666666;}
</style>
