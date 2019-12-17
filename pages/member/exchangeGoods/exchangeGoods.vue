<template>
	<view class="content">
		<view style="font-size: 32rpx;color: #666666;padding-top: 30rpx;">如需换货，请联系客服：{{serverTel}}</view>
		<view style="font-size: 32rpx;color: #666666;padding-top: 30rpx;">暂时不支持退货换货</view>
	</view>
</template>

<script>
	import {getSiteInfo} from "@/common/site.js";
	export default {
		data() {
			return {
				serverTel:""
			}
		},
		onShow(){
			getSiteInfo().then(res => {
				//console.log(res);
				this.serverTel=res.tel;
			}).catch(err => {})
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
