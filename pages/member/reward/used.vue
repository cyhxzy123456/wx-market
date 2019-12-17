<template>
	<view >
		<reward-list :txt="text" :list="list" :money="bonusUse"></reward-list>
		<i-load-more :tip="loadTip" @tap="hisList" :loading="loading" v-if="showMore"/>
	</view>

</template>

<script>
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import rewardList from '@/components/reward-list'
	import {getRewardList} from '@/common/reward.js'
	import {getRewardInfo} from '@/common/reward.js'
	export default {
		components:{rewardList,iLoadMore},
		data() {
			return {
				text:'累计使用',
				list:[],
				bonusUse:'',
				pageIndex:1,
				pageSize:10,
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				showMore:true
			}
		},
		methods: {
			info(){
				this.$if0(getRewardInfo).then(res => {
					this.bonusUse=Math.abs(res.Data.bonusUse) 
					if(this.bonusUse==''||this.bonusUse==0){
						this.bonusUse='0'
					}
				})
			},
			//记录
			hisList(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				let parameter = [{
					key:'bonusValue',
					value:0,
					whereType:3
				}]
				this.$if0(getRewardList,this.pageIndex,this.pageSize,parameter).then(res => {
					if(res.Data.Data.length > 0){
						this.loading = false;
						this.pageIndex++;
						this.list = this.list.concat(res.Data.Data)
						// res.Data.Data.forEach((val)=>{
						// 	if(val.bonusValue<0){
						// 		this.list.push(val)
						// 	}
						// })
						if(res.Data.Data.length < 10){
							this.showMore = false;
						}
					}else{
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}

				})
			},
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
			this.hisList()
			this.info()
		}
	}
</script>

<style>

</style>
