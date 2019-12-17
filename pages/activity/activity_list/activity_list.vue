<template>
	<view class="page">
		<view class="list" @click="tonav(act.callIndex)" v-for="act in list" :key="act.id">
			<image :src="act.imgUrl" mode="widthFix"></image>
		</view>
		<view class="noMore" v-if="list.length <= 0">暂无数据</view>
	</view>
</template>

<script>
import {GetCategoryChildren} from '@/common/ArticleShows.js';
	export default {
		data() {
			return {
				list:[],
			};
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
		},
		onShow(){
			this.$if0(GetCategoryChildren ,'HDHB').then(
				res => {
					this.list = res.Data;
				}
			).catch(err => {
				console.log(err);
				this.$errToast(err);
			})
		},
		methods:{
			tonav(f){
				switch(f){
					case 'zpcj':
						uni.navigateTo({
							url:"/pages/activity/luck/luck",
						})
						break;
					case 'fxhy':
						uni.navigateTo({
							url:"/pages/ADself/ADself",
						})
						break;
				}
			},
		}
	}
</script>

<style lang="scss">
.noMore{
	font-size: 28rpx;
	text-align: center;
}
.list{
	margin: 10rpx 0;
	image{
		width: 100%;
	}
}
</style>
