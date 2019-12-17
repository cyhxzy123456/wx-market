<template>
	<view >
		<reward-list :txt="text" :list="list" :money="yesterdayBonusCount"></reward-list>
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
				text:'昨日获得分享金',
				list:[],
				yesterdayBonusCount:0,
				pageIndex:1,
				pageSize:10,
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				showMore:true
			}
		},
		methods: {
			 getDay(num, str) {
			        var today = new Date();
			        var nowTime = today.getTime();
			        var ms = 24*3600*1000*num;
			        today.setTime(parseInt(nowTime + ms));
			        var oYear = today.getFullYear();
			        var oMoth = (today.getMonth() + 1).toString();
			        if (oMoth.length <= 1) oMoth = '0' + oMoth;
			        var oDay = today.getDate().toString();
			        if (oDay.length <= 1) oDay = '0' + oDay;
			        return oYear + str + oMoth + str + oDay+' '+'00:00:00';
			    },

			//获取当前年月日时间
			getTimeNow() {
				let date = new Date();
				let seperator1 = "-";
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
				let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
				let seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				let currentdate = year + seperator1 + month + seperator1 + strDate + " " +hours+":"+minutes+":"+seconds;
				return currentdate;
			},
			//日期相差天数
			getDaysBetween(dateString1,dateString2){

				console.log(dateString1,dateString2)
				let days=(dateString1 - dateString2)/(1*24*60*60*1000);
				return  days;
			},
			info(){
				this.$if0(getRewardInfo).then(res => {
					this.yesterdayBonusCount=Math.abs(res.Data.yesterdayBonusCount) 
					/*if(this.yesterdayBonusCount==0){
						this.yesterdayBonusCount='0'
					}*/
				})
			},
			//记录
			hisList(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				let dateNow=this.getDay(0, '-')
				let yestertaday = this.getDay(-1, '-')
				let parameter = [{
					key:'timeAdd',
					value:yestertaday,
					whereType:9
				},{
					key:'timeAdd',
					value:dateNow,
					whereType:10
				},{
					key:'bonusValue',
					value:0,
					whereType:5
				}]
				this.$if0(getRewardList,this.pageIndex,this.pageSize,parameter).then(res => {
					if(res.Data.Data.length > 0){
						this.loading = false;
						this.pageIndex++;
						this.list = this.list.concat(res.Data.Data)
						// res.Data.Data.forEach((val)=>{
						// 	if(this.getDaysBetween(val.timeAdd,dateNow)<=1&&val.bonusValue>0){
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
