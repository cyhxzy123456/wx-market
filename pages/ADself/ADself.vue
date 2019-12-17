<template>
	<view>
		<image class="ADself" :src="img" mode="widthFix"></image>
	</view>
</template>

<script>
import {GetClassBycallIndex} from '@/common/ArticleShows.js'
	export default {
		data() {
			return {
				img:''
			}
		},
		methods: {
			
		},
		onLoad(){
			this.$if0(GetClassBycallIndex , 'HDHB').then(res => {
				if(res.Data && res.Data.imgUrl)this.img = res.Data.imgUrl;
			})
		}
	}
</script>

<style>
.ADself{
	width: 100%;
}
</style>
