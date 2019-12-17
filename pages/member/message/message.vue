<template>
	<view>
		<view v-if="messageList.length==0" class="noData">
			暂无消息
		</view>
		<view v-else>
			<messageList :list="messageList"></messageList>
			<i-load-more :tip="loadTip" @tap="getArticleByCallIndex" :loading="loading" v-if="isShow" />
		</view>

	</view>
</template>

<script>
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import {messageList} from "@/components/message-list.vue"
	import {getArticleByCallIndex} from "@/common/message.js"
	export default {
		data() {
			return {
				accountId:0,//合作商id
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				messageList:[],
				pageIndex:1,
				pageSize:10,
				pageCount:0,
				isShow:true,
			}
		},
		components: {
			'i-load-more': iLoadMore,
			messageList
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
			this.getArticleByCallIndex();
		},
		methods:{
			getArticleByCallIndex(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				this.$if0(getArticleByCallIndex,this.pageSize,this.pageIndex,'notice').then(res => {
					this.loading = false;
					if(res.Data.Data.length>0){
						this.messageList = this.messageList.concat(res.Data.Data);
						this.isShow=this.pageIndex*this.pageSize<res.Data.PageCount;
						this.pageIndex++;
					}else {
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}
				}).catch(err=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (res) {
							
						}
					});
				})
			}
		}
	}
</script>

<style>
	.noData{text-align: center;color:#666666;font-size: 28rpx;}
</style>
