<template>
	<view class="address-content mt20">
		<view v-if="isShowDom">
			<view class="no-address" v-if="addressList.length ==0">你还未添加收货地址，请添加</view>
			<view v-else>
				<addressItem :list="addressList" :isOrderDo="isOrderDo"></addressItem>
			</view>
		</view>
		<navigator url="/pages/member/addressMange/addAddress" class="btn-link">
			<view class="blank-null"></view>
			<button class="btn-add"> 添加地址 </button>
		</navigator>
		
	</view>
</template>

<script>
	import addressItem from "@/components/address-list.vue";
	import {getAddressList,getDefaultAddr} from "@/common/address.js"
	export default {
		data() {
			return {
				id:'',
				isShowDom:false,
				isOrderDo:false,
				addressList:[]
			}
		},
	    components: {
			addressItem
			},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(option){
			if(option.orderDo){
				this.isOrderDo=true;
			}
		},
		onShow(){
			this.getAddressList();
			this.getDefaultAddr();
		},
		methods:{
			getAddressList(){
				this.$if0(getAddressList,1,1000).then(res => {
					this.isShowDom=true;
					this.addressList=res.Data.Data;
				}).catch(err=>{
					this.isShowDom=false;
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (res) {
							
						}
					});
				})
			},
			getDefaultAddr(){
				this.$if0(getDefaultAddr).then(res => {
					/* this.addressList=res.Data.Data;
					this.pageCount=res.Data.PageCount; */
				}).catch(err=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (res) {
							
						}
					});
				})
			}
		}
	}
</script>

<style scoped>
	.address-content{font-size: 28rpx;padding-bottom:240rpx;}
	.address-content .no-address{text-align: center;}
	.address-content .btn-add{position:fixed;bottom:60rpx;width:70%;left:15%;background-color:#ff6000;color:#fff;}
	.blank-null{
		height: 200rpx;
		background-color: #fff;
		position: fixed;
		width: 100%;
		display: block;
		left: 0;
		bottom: 0;
	}
	.btn-link{}
</style>
