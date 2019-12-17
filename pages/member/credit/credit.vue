<template>
	<view class="credit">
		<view class="banner-box">
			<img src="../../../static/credit/banner.png" alt="" class="banner">
			<text class="banner-txt">当前消费积分{{integralBalance}}</text>
		</view>
		<view >
			<view class="number">
				<view class="left item">
					<text>累计积分 </text>
					<text>{{integralCount}}</text>
				</view>
				<view class="right item">
					<text>累计使用 </text>
					<text>{{integralUse}}</text>
				</view>
			</view>
			<view class="line"></view>
			<view class="list content">
				<view class="nav">
					<text @click="change(item.value)" v-for="(item,index) in nav" :class="{active:item.value==valueNow}" :key="index">{{item.txt}}</text>
				</view>
				<view clalss=nav-list v-show="valueNow==1">
					<view class=list-item v-for="(item,index) in getList" :key="index">
						<view class=list-l>
							<text class=tit>{{item.integralFromName}}</text>
							<text class=time>{{item.timeAdd}}</text>
						</view>
						<view class=list-r>+ {{item.integralValue}}</view>
					</view>
					<i-load-more :tip="loadTip" @tap="list" :loading="loading" v-if="hasMore"/>
				</view>
				<view clalss=nav-list v-show="valueNow==2">
					<view class=list-item v-for="(item,index) in useList" :key="index">
						<view class=list-l>
							<text class=tit>{{item.integralFromName}}</text>
							<text class=time>{{item.timeAdd}}</text>
						</view>
						<view class=list-r> {{item.integralValue}}</view>
					</view>
					<i-load-more :tip="loadTip" @tap="list" :loading="loading" v-if="hasMore"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import {getCreditInfo} from '@/common/credit.js'
	import {getCreditList} from '@/common/credit.js'
	import {getCreditDetail} from '@/common/credit.js'
	export default {
		components:{iLoadMore},
		data() {
			return {
				pageIndex:1,
				pageSize:10,
				id:'',
				integralCount:0,
				integralUse:0,
				integralBalance:0,
				getList:[],
				useList:[],
				valueNow:1,
				nav:[{value:1,txt:'积分获得记录'},{value:2,txt:'积分使用记录'}],
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
			}
		},
		methods: {
			info(){
				this.$if0(getCreditInfo,'1,2,8,9').then(res => {
					this.integralCount=res.Data.integralCount
					this.integralBalance=res.Data.integralBalance
				})
				this.$if0(getCreditInfo,'3,4,6,7,10,11').then(res => {
					this.integralUse=Math.abs(res.Data.integralUse)
				})
			},
			list(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				this.$if0(getCreditList,this.pageIndex,this.pageSize,this.valueNow).then(res => {
					if(res.Data.Data.length > 0){
						console.log(this.valueNow)
						if(this.valueNow==1){
							this.getList =this.getList.concat(res.Data.Data)
							
						}else{
							this.useList =this.useList.concat(res.Data.Data)
						}
						this.loading = false;
						this.pageIndex++;
						
							this.hasMore = (this.pageIndex-1)*this.pageSize<res.Data.PageCount;
						
					}else{
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '暂无数据'
					}
				})
			},
			detail(){
				this.$if0(getCreditDetail,this.id).then(res => {
					console.log(res)
				})
			},
			change(val){
				this.hasMore = true
				this.pageIndex = 1
				this.getList = []
				this.useList = []
				this.valueNow=val
				this.list()
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
			this.info()
			this.list()
		}
	}
</script>

<style scoped>
.banner-box{position: relative}
.banner-txt{font-size: 50rpx;color:#fff;position: absolute;bottom: 125rpx;left:20rpx}
.line{height:20rpx;background: #eee;}
.banner{
	height: 300rpx;width:100%
	}
 .number{
	display: flex;justify-content:space-between;padding:30rpx;margin-bottom: 20rpx;background: #fff;
}
.item{
	padding:18rpx 0 18rpx 130rpx;font-size: 32rpx;width:262rpx;
}
.number .item text{display: block}
.left{
	background: url('../../../static/credit/fen1.png') no-repeat left center;
	background-size: 110rpx;
	}
.right{
	background: url('../../../static/credit/fen2.png') no-repeat left center;
	background-size: 110rpx;
	}
.list{font-size: 30rpx;}
.list .nav{display: flex;justify-content: space-around;border-bottom: 1px solid #eee;}
.list .nav text{line-height: 85rpx;font-size: 36rpx;}
.list .nav text.active{border-bottom:1px solid #fe7257}
.list-item{display: flex;justify-content: space-between;padding:32rpx 0;border-bottom: 1px solid #eee;}
.list-l text{display: block;}
.tit{padding-bottom: 26rpx;}
.time{font-size: 25rpx;}
</style>
