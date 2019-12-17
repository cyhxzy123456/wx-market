<template>
	<view class="credit">
		<view class="banner-box">
			<image src="../../../static/credit/banner.png" alt="" class="banner"></image>
			<text class="banner-txt">分享人数总计{{count}}</text>
		</view>
			
			<view class="line"></view>
			<view class="list content">
				<view clalss=nav-list >
					<view class=list-item v-for="(item,index) in recommend_list" :key="index">
						<view class=list-l>
							<text class=tit>分享给{{item.nickName}}注册成功</text>
							<text class=time>{{item.regDate}}</text>
						</view>
						<view class=list-r>+ 1</view>
					</view>
					<i-load-more :tip="loadTip" @tap="list" :loading="loading" v-if="hasMore"/>
				</view>
			</view>
	</view>
</template>

<script>
	import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
	import {getCreditInfo} from '@/common/credit.js'
	import {getCreditList} from '@/common/credit.js'
	import {getCreditDetail} from '@/common/credit.js'
	import {GetLowerLevel} from '@/common/member.js'
	export default {
		components:{iLoadMore},
		data() {
			return {
				pageIndex:1,
				pageSize:20,
				id:'',
				loading:false,
				loadTip:'查看更多',
				hasMore:true,
				recommend_list:[],
				count:0,
			}
		},
		methods: {
			
			list(){
				if(!this.hasMore){
					return;
				}
				this.loading = true;
				this.$if0(GetLowerLevel,this.pageIndex,this.pageSize).then(res => {
					if(res.Data.Data.length > 0){
						this.pageIndex++;
						this.recommend_list = this.recommend_list.concat(res.Data.Data);
						this.count = res.Data.PageCount;
					}else{
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
					if(this.recommend_list.length >= res.Data.PageCount){
						this.loading = false;
						this.hasMore = false;
						this.loadTip = '没有更多了'
					}
				}).catch(err => {
					this.$errToast(err);
				})
			},
		
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onShow(){
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
