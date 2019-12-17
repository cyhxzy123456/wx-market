<template>
	<view >
		<reward-list :txt="text" :list="list" :money="bonusCount"></reward-list>
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
				serviceId:'',
				text:'累计奖金',
				list:[],
				bonusCount:0,
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				pageIndex:1,
				pageSize:10,
				showMore:true
			}
		},
		methods: {
			info(){
				this.$if0(getRewardInfo,this.serviceId).then(res => {
					console.log(res.Data.bonusCount)
					this.bonusCount=res.Data.bonusCount
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
						value: 0 ,
						whereType:3
					}]
				
				if(this.serviceId){
					parameter.push({
						key:'serviceId',
						value: this.serviceId ,
						whereType:1
					})
					parameter.push({
						key:'bonusFrom',
						value: 3 ,
						whereType:3
					})
				}
				this.$if0(getRewardList,this.pageIndex,this.pageSize,parameter).then(res => {
					if(res.Data.Data.length > 0){
						this.loading = false;
						this.pageIndex++;
						res.Data.Data.forEach((val)=>{
							if(val.bonusValue>0){
								this.list.push(val)
							}
						})
						if(res.Data.Data.length < 10){
							this.showMore = false;
						}
					}else{
						console.log(111)
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
		onLoad(options){
			// console.log(options.serviceId)
			this.serviceId = Number(options.serviceId)
			this.hisList()
			this.info()
		}
	}
</script>

<style>

</style>
