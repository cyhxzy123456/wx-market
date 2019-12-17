<template>
	<view class="content address-main">
		<view class="flex_row select-area">
			<text class="title">姓名</text>
			<input type="text" placeholder="输入收货人姓名" v-model="consignee" class="flex1" />
		</view>
		<view class="flex_row select-area">
			<text class="title">手机号码</text>
			<input type="text" placeholder="请输入手机号码" v-model="phoneNumber" class="flex1" />
		</view>
		<view class="flex_row select-area">
			<text class="title">邮政编码</text>
			<input type="text" placeholder="输入邮政编码" v-model="postCode" class="flex1" />
		</view>
		<view class="flex_row select-area">
			<text class="title">所在区域</text>
			<cityPicker :area="area" @city="cityWord" class="flex1"></cityPicker>
		</view>
		<view class="flex_row select-area">
			<text class="title">详细地址</text>
			<textarea placeholder="街道、楼牌号等详细信息" v-model="address" :show-confirm-bar='false' maxlength="50" class="flex1 textarea-txt" />
		</view>
		<view class="flex_row select-area">
			<text class="title">设为默认地址</text>
			<view class="flex1 btn-switch" ><switch :checked="sortId" @change="switch1Change"/></view>

		</view>
		<button v-on:click="addAddress" class="btn-save">保存</button>
	</view>

</template>

<script>
	import iInput from 'iview-mpvue/dist/components/input/input'
	import iButton from 'iview-mpvue/dist/components/button/button';
	import {cityPicker} from "@/components/city-picker.vue";
	import {addAddress,updateAddress,getAddressInfoById} from "@/common/address.js"
    export default {
		data() {
			return {
				consignee:'',
				phoneNumber:'',
				postCode:'',
				address:'',
				area:'',
				sortId:false,
				isDefault:false
			}
		},
		components: {
			'i-input': iInput,
			'i-button': iButton,
			cityPicker
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(option){
			if(option.id){
				this.id=option.id;
				this.getAddressInfoById(this.id);
			}
		},
		methods:{
			switch1Change(e){
				this.sortId=e.detail.value;
			},
			cityWord(val){
				this.area=val;
			},
			getAddressInfoById(){
				this.$if0(getAddressInfoById,this.id).then(res => {
					console.log("res",res);
					this.consignee=res.Data.consignee;
					this.phoneNumber=res.Data.phoneNumber;
					this.postCode=res.Data.postCode;
					this.area=res.Data.area;
					this.address=res.Data.address;
					this.sortId=res.Data.sortId==0?true:false;
				}).catch(err=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (res) {
							
						}
					});
				})
			},
			addAddress(){
				this.isDefault =this.sortId?0:1;
				if(this.id){
					this.updateAddress();
					return;
				}
				if(this.consignee==""){
					uni.showModal({
						title: '提示',
						content: '收货人姓名不能为空',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				if(this.phoneNumber==""){
					uni.showModal({
						title: '提示',
						content: '手机号码不能为空',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				if(this.phoneNumber.length!=11||this.phoneNumber.substring(0,1)!=1||this.phoneNumber.substring(1,2)<3){
					uni.showModal({
						title: '提示',
						content: '手机号码格式不正确',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return
				  }
				if(this.area==""){
					uni.showModal({
						title: '提示',
						content: '请选择所在省份、省市、区县',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				if(this.address==""){
					uni.showModal({
						title: '提示',
						content: '详细地址不能为空',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				uni.showLoading({
					title: '提交中',
					mask:true
				});
				this.$if0(addAddress,this.consignee,this.phoneNumber,this.postCode,this.area,this.address,this.isDefault).then(res => {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: res.Message,
						showCancel:false,
						success: function () {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				}).catch(err=>{
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
						success: function (res) {
							
						}
					});
				})
			},
			updateAddress(){
				if(this.consignee==""){
					uni.showModal({
						title: '提示',
						content: '收货人姓名不能为空',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				if(this.phoneNumber==""){
					uni.showModal({
						title: '提示',
						content: '手机号码不能为空',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				if(this.phoneNumber.length!=11||this.phoneNumber.substring(0,1)!=1||this.phoneNumber.substring(1,2)<3){
					uni.showModal({
						title: '提示',
						content: '手机号码格式不正确',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return
				  }
				if(this.area==""){
					uni.showModal({
						title: '提示',
						content: '请选择所在省份、省市、区县',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				if(this.address==""){
					uni.showModal({
						title: '提示',
						content: '详细地址不能为空',
						showCancel:false,
						success: function (res) {
							
						}
					});
					return;
				}
				uni.showLoading({
					title: '提交中',
					mask:true
				});
				this.$if0(updateAddress,this.id,this.consignee,this.phoneNumber,this.postCode,this.area,this.address,this.isDefault).then(res => {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: "修改成功！",
						showCancel:false,
						success: function (res) {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				}).catch(err=>{
					uni.hideLoading();
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

<style>
	.address-main{padding-bottom:200rpx;}
	.i-cell{border-bottom:1px solid #eeeeee;padding:24rpx 0;}
	.btn-save{position:fixed;bottom:60rpx;width:70%;left:15%;background-color:#ff6000;color:#fff;}
	.select-area{
		font-size: 28rpx;color:#495060;border-bottom: 1px solid #eeeeee;position: relative;
		height: 70rpx;
		line-height: 70rpx;
		padding: 20rpx 0;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		background: #fff;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		overflow: hidden;
	}
	.select-area .title{min-width: 130rpx;padding-right: 20rpx;}
	.select-area .textarea-txt{height: 70rpx;font-size: 26rpx;line-height: 30rpx;margin-top: 38rpx;}
	.select-area .btn-switch{text-align: right;}
</style>
