<template>
	<view>
		<view class="address_item flex_row" v-for="item in list" :key="item.id">
			<view class="address content">
				<view class="address-info " v-on:click="goOrder(JSON.stringify(item))">
					<view class="fl">
						<view>{{item.address|addressDetail(item.area)}}</view>
						<text>{{item.consignee}}&nbsp;{{item.phoneNumber}}</text>
					</view>
					<view class="fr label-default" v-if="item.sortId==0">默认</view>
				</view>
				<view class="address-opt" @tap.stop="">
					<view class="fl">
						<text class="circle" :class="{'active':item.sortId==0}"  @click="setMainAddressById(item.id)"></text>设为默认地址
					</view>
					<view class="fr">
						<view class="btns btn-del" v-on:click="delAddress(item.id)"><image src="../static/personcenter/icon-del.png" mode="widthFix"></image>删除</view>
						<view class="btns btn-edit"><navigator :url="'/pages/member/addressMange/addAddress?id='+item.id"><image src="../static/personcenter/icon-edit.png" mode="widthFix"></image>编辑</navigator></view>

					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {delAddressInfoById,setMainAddressById} from "@/common/address.js"
    export default {
		data() {
			return {
				id:'',
				current:''
			}
		},
		props:['list','isOrderDo'],
		methods:{
			goOrder(info){
				//console.log(info);
				// if(this.isOrderDo){
					let app = getApp();
					app.globalData.addressInfo=info;
					app.globalData.orderDo=true;
					uni.redirectTo({
						url:'/pages/member/orderList/confirmOrder'
					})
				// }
			},
			radioChange: function(evt) {
			   if (this.id === evt.target.value) {
			       this.current = this.id;
			   }
			},
			delAddress(id){
				this.$if0(delAddressInfoById,id).then(res => {
					uni.showModal({
						title: '提示',
						content: '删除成功！',
						showCancel:false,
						success: function (res) {
							uni.redirectTo({
								url: '/pages/member/addressMange/addressList'
							});
						}
					});
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
			setMainAddressById(id){
				this.$if0(setMainAddressById,id).then(res => {
					uni.showModal({
						title: '提示',
						content: '设置默认收货地址成功！',
						showCancel:false,
						success: function (res) {
							uni.redirectTo({
								url: '/pages/member/addressMange/addressList'
							});
						}
					});
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
		},
    	filters:{
			addressDetail:function(data,area){
				if(data.indexOf("省") == -1||data.indexOf("市") == -1||data.indexOf("区") == -1){
					return area.replace(/,/g,"")+data;
				}else {
					return data;
				}
			}
		}
	}
</script>

<style scoped>
	.address_item .address{border-bottom: 1rpx solid #eeeeee;width:100%}
	.address-info{overflow: hidden;padding:20rpx 0;border-bottom: 1rpx solid #eeeeee;line-height: 1.75;}
	.address-info .fl{width:70%;}
	.address-info .fr{width:30%;}
	.address_item .label-default{width:140rpx;height:40rpx;line-height: 40rpx;border:1rpx solid #ff6000;color:#ff6000;border-radius: 10rpx;text-align: center;}
	.address-opt{padding:30rpx 0;overflow: hidden;}
	.address-opt .fl text{}
	.address-opt .fl .circle{display: inline-block;width:30rpx;height:30rpx;border-radius: 50%;border:1px solid #ff6000;color:#fff;vertical-align: middle;margin:20rpx;}
	.address-opt .fl .circle.active{background:url(../static/ico/ico-dui.png);background-color:#ff6000;background-size: 100% auto;}
	.address-opt .fr{line-height: 50rpx;}
	.address-opt .fr image{width:40rpx;vertical-align: middle;}
	.address-opt .fr .btns{float: right;line-height: 50rpx;}
	.address-opt .fr .btns+.btns{margin-right: 20rpx;}
</style>
