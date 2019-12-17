<template>
	<view class="content">
			<view class="border">
				<view class="title">{{articalList.title ? articalList.title : ''}}</view>
				<view class="padd">
					<rich-text :nodes="articalList.content"></rich-text>
				</view>
			</view>
	</view>
</template>


<script>
	import {getAgreeMent} from '@/common/cart.js';
	export default {
		data() {
			return {
				articalList:"",
				articalData:{
					"callIndex": "hdgz",
					"accountId": 0,
					"userId": 0,
					"productListId": 0,
					"keyValues": ""
				}
			}
		},
		onLoad() {

			this.getArticalList();
		},
		methods: {
			getArticalList(){//获取购物车列表
				this.$if0(getAgreeMent ,this.articalData).then(res => {
					//console.log(res);
					console.log(res);
					this.articalList=res.Data;
				}).catch(err=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (err) {

						}
					});

				})
			},
		}
	}
</script>

<style lang="scss" scoped>

.content{
	.border{
		border:1rpx solid #ccc;
		font-size: 28rpx;
		.title{
			padding: 0 30rpx;
			border-bottom: 1rpx solid #ccc;
			font-size: 36rpx;
			font-weight: border;
			color:rgb(107, 211, 3);
			text-align: center;
		}
		.padd{
			padding: 20rpx;
		}
	}
}
</style>
