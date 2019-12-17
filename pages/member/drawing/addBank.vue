<template>
	<view class="content drawing">
		<view class=item>
			<text>开户人姓名</text>
			<input type="text" placeholder="请输入开户人姓名" v-model="name">
		</view>
		<view class=item>
			<text>开户银行</text>
			<view class="bank" >
				<view class="nowTxt" @click="selectToggle">{{nowBank}}{{nowCard}}</view>
				<view class="bank-list" v-show="selectShow">
					<text @click="select(item.title)" v-for="(item ,index) in bankList" :key="index">{{item.title}}</text>
				</view>
			</view>
		</view>
		<view class=item>
			<text>开户地址</text>
			<view class="city">
				<cityPicker :area="area" @city="cityWord" class="flex1"></cityPicker>
			</view>
		</view>
		<view class=item>
			<text>开户支行</text>
			<input type="text" placeholder="请输入开户支行" v-model="subbranch">
		</view>
		<view class=item>
			<text>银行卡号</text>
			<input type="text" placeholder="请输入银行卡号" v-model="bankCode1">
		</view>
		<view class=item>
			<text>确认银行卡号</text>
			<input type="text" placeholder="再输入银行卡号" v-model="bankCode2">
		</view>
		<view class=item>
			<text>手机号码</text>
			<input type="text" placeholder="请输入手机号码" v-model="mobile">
		</view>
		<view class=item>
			<text>图形验证码</text>
			<input type="text" placeholder="请输入图形验证码" v-model="code">
			<view class="img-code">
				<ImgVCode ref="imgCode"></ImgVCode>
			</view>
		</view>
		<view class=item>
			<text>手机验证码</text>
			<input type="text" placeholder="请输入手机验证码" v-model="phoneCode">
			<view class="phone-code">
				<regPhoneCode :code_img="code" :callIndex="verifyCode" :mobile="mobile" :phoneValidate="0"></regPhoneCode>
			</view>
		</view>
		<button @click="addBank" :disabled="disabled">立即绑定</button>
	</view>
</template>

<script>
	import {addBank} from '@/common/drawing.js'
	import {getBank} from '@/common/drawing.js'
	import {JudgeSmsCode} from '@/common/drawing.js'
	import regPhoneCode from '@/components/regPhoneCode.vue'
	import ImgVCode from '@/components/ImgVCode.vue'
	import cityPicker from '@/components/city-picker.vue'
	export default {
		components:{ImgVCode,cityPicker,regPhoneCode},
		data() {
			return {
				disabled:false,
				name:'',
				subbranch:'',//支行
				bankCode1:'',
				bankCode2:'',
				mobile:'',
				code:'',//图形验证码
				phoneCode:'',//手机验证码
				bankList:[],
				selectShow:false,//下拉显示
				nowText:'请选择银行',
				area:'选择所在省份、城市、区县',
				nowBank:'请选择银行',
				nowCard:'',
				verifyCode:"verifyCode"
			}
		},
		methods: {
			//校验
			justify(){
				this.$if0(JudgeSmsCode,this.mobile,this.smsCode).then(res => {
					if(res.Resule==0){
						this.commit()
					}
				}).catch((err)=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
					});
				})
			},
			cityWord(val){
				this.area=val;
			},
			select(tit){
				this.nowBank=tit
				// this.nowCard=tit
				this.selectShow=false
			},
			selectToggle(){
				this.selectShow=!this.selectShow
			},
			bank(){
				this.$if0(getBank).then(res => {
					this.bankList=res.Data
				})
			},
			addBank(){
				if(this.name==''){
					uni.showModal({
						title: '提示',
						content: '请输入开户人姓名',
						showCancel:false,
					});
					return
				}
				if(this.nowBank=='请选择银行'){
					uni.showModal({
						title: '提示',
						content: '请选择银行',
						showCancel:false,
					});
					return
				}
				if(this.area=='选择所在省份、城市、区县'){
					uni.showModal({
						title: '提示',
						content: '请选择开户地址',
						showCancel:false,
					});
					return
				}
				if(this.subbranch==''){
					uni.showModal({
						title: '提示',
						content: '请输入开户支行',
						showCancel:false,
					});
					return
				}
				if(this.bankCode1==''){
					uni.showModal({
						title: '提示',
						content: '请输入银行卡号',
						showCancel:false,
					});
					return
				}
				if(this.bankCode2==''){
					uni.showModal({
						title: '提示',
						content: '请再次输入银行卡号',
						showCancel:false,
					});
					return
				}
				if(this.bankCode2!==this.bankCode1){
					uni.showModal({
						title: '提示',
						content: '两次输入银行卡号不一致',
						showCancel:false,
					});
					return
				}
				if(this.mobile==''){
					uni.showModal({
						title: '提示',
						content: '请输入手机号码',
						showCancel:false,
					});
					return
				}
				if(this.phoneCode==''){
					uni.showModal({
						title: '提示',
						content: '请输入手机验证码',
						showCancel:false,
					});
					return
				}
				 this.commit()
			},
			commit(){
				this.disabled = true
				this.$if0(addBank,this.nowBank,this.area,this.subbranch,this.bankCode1,this.mobile,this.code,this.phoneCode).then(res => {
				uni.navigateTo({
					url:'/pages/member/drawing/drawing'
				})
				this.disabled = false
				}).catch((err)=>{
					uni.showModal({
						title: '提示',
						content:err.Message,
						showCancel:false,
					});
					this.disabled = false
					this.$refs.imgCode.toggleVerifyCode()
				})
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
			this.bank()
		}
	}
</script>

<style scoped>
	.img-code{position: absolute;right: 10rpx;top: 0rpx;z-index: 3;}
	.phone-code{z-index: 99;position: absolute;top:0;right:0}
	.item{margin-top:35rpx;font-size: 30rpx;position: relative}
	.item text{font-size: 30rpx;line-height: 60rpx;text-align: right;}
	.item input{line-height: 70rpx;height:70rpx;width:500rpx;border:1px solid #eee;padding:0 20rpx;font-size: 26rpx;float:right;box-sizing: border-box}
	.item select{line-height: 70rpx;width:500rpx;border:1px solid #eee;padding:0 20rpx;font-size: 26rpx;float:right}
	button{background: #FF6100;color:#fff;height: 80rpx;line-height: 80rpx;border-radius: 10rpx;margin-top:100rpx;width:540rpx}
	.bank text{display: block;text-align: left;background: #fff;color:#666;font-size: 26rpx;}
	.bank{position: relative;width: 500rpx;height: 70rpx;display: inline-block;float: right;z-index: 999;}
	.bank .bank-list{position: absolute;top:70rpx;background: #fff}
	.nowTxt{font-size: 26rpx;width:500rpx;height:70rpx;border:1px solid #eee;line-height: 70rpx;padding-left: 25rpx;box-sizing: border-box;color:#666}
	.city{width:70%;display: inline-block;font-size: 26rpx;float:right;line-height: 70rpx;color:#666}
</style>
