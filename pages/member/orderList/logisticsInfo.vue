<template>
	<view class="content">
		<view class="logistics_info" v-if="logisticsInfo.itemCode">
			<view class="info_left">
				<view>快递单号：{{logisticsInfo.itemCode}}</view>
				<view style="margin: 20rpx 0;">配送企业：{{logisticsInfo.name}}</view>
				<view v-if="logisticsInfo.comTel">联系电话：{{logisticsInfo.comTel}}</view>
			</view>
			<view class="info_right">
				<button class="reminder_btn"  @click="reminderBtn">我要催单</button>
			</view>
		</view>
		<view class="logistics_pross">
			<view class="progress_top">
				<view class="example-body">
				  <uni-steps :options="list1" :active="active" />
				</view>
				<view class="city_info">
					<text class="beginCity">{{logisticsInfo.postCity}}</text>
					<text class="endCity">{{logisticsInfo.receiverCity}}</text>
				</view>
			</view>
			<view class="progress_bottom">
				<view class="detail_title">物流详情</view>
				<view class="example-body" v-if="list2.length>0">
				  <uni-steps :options="list2" :active="active1" direction="column" />
				</view>
				<view v-else class="example-body" style="font-size: 26rpx; padding: 20rpx 0;">暂无物流详情数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSteps from '@/components/uni-steps'
	import {getLogisticsDetlle,needReminder} from '@/common/order.js';
	export default {
		data() {
			return {
				logisticsId:'',
				goodId:'',
				logisticsInfo:{},
				active: -1,
				active1:0,
				list1: [{
				  title: '已发货'
				}, {
				  title: '运输中'
				}, {
				  title: '派件中'
				}, {
				  title: '已签收'
				}],
				list2: []
			}
		},
		onLoad(opt) {
			console.log(opt);
			this.logisticsId=opt.id;
			this.goodId=opt.goodsId;
			this.getLogisticsList();
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		computed:{
		},
		methods: {
			// change() {
			//   if (this.active < this.list1.length - 1) {
			//     this.active += 1
			//   } else {
			//     this.active = 0
			//   }
			// },
			reminderBtn(){
				this.$if0(needReminder,this.logisticsId).then(res => {
					console.log(res);
					uni.showToast({
						title:"催单成功！",
						duration: 2000
					});
				})
			},
			getLogisticsList(){//获取物流列表
				this.$if0(getLogisticsDetlle,this.logisticsId,this.goodId).then(res => {
					//console.log(res.Data);
					this.logisticsInfo = res.Data;
					if(res.Data.statusDetail){
						let statusDetail= JSON.parse(res.Data.statusDetail.replace(/remark/g,"title"));
						this.list2= statusDetail.result.list.reverse();
					}
					if(res.Data.status==1){
						this.active=0;
					}else{
						this.active=res.Data.status-2;
					}
					
				})
			}
		},
		components: {
			uniSteps
		}
	}
</script>

<style>
.content{
	width:100%;
	padding: 0;
}
.logistics_info{
	width: 95%;
	background-color: #EEEEEE;
	overflow: hidden;
	padding:20rpx;
}
.logistics_info .info_left{
	width: 76%;
	float: left;
}
.logistics_info .info_left view{
	color: #666666;
	font-size: 32rpx;
}
.logistics_info .info_right .reminder_btn{
	width: 22%;
	height: 55rpx;
	line-height: 55rpx;
	border-radius: 5rpx;
	text-align: center;
	float: right;
	color: #666666;
	font-size: 26rpx;
	padding: 0;
	background-color: #EEEEEE;
}
.progress_top{
	width: 95%;
	margin-left: 20rpx;
	padding-bottom: 35rpx;
	position: relative;
	border-bottom: 1px solid #dddddd;
}
.logistics_pross .uni-steps-item-title{
	font-size: 32rpx;
}
.city_info{
	width: 95%;
	padding: 0 20rpx;
	position: absolute;
	top:100rpx;
}
.city_info text{
	color: #666666;
	font-size: 32rpx;
}
.city_info .endCity{
	float:right;
	padding-top: 8rpx;
}
.progress_bottom{
	margin-top: 40rpx;
	width: 95%;
	margin-left: 20rpx;
}
.progress_bottom .detail_title{
	color: #333333;
	font-size: 32rpx;
}
</style>