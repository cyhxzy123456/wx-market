<template>
	<view class="content drawing">
		<view class=total>
			<text>可提现额度</text>
			<text class=fr>{{bonusBalance}}</text>
		</view>
		<view class=put>
			<input class="money" type="text" placeholder="请输入提现金额" v-model="money">
			<text class="commit" @click="drawingCommit">提现</text>
		</view>
		<view class=card>
			<view class=no-card v-show="bankList==null">
				<!-- <text>+</text> -->
				<navigator url="/pages/member/drawing/addBank">您还未绑定银行卡 请点击进行绑定</navigator>
			</view>
			<view class=have-card v-show="bankList!=null">
				<text>{{bankList.bankName}}</text>
				<text>{{bankList.bankCard}}</text>
			</view>
		</view>
		<view v-show="showCode" class="codeShadow">
			<view class="code-box">
				<text class="close" @click="showCode=false">×</text>
				<text>注册手机号：{{regPhone}}</text>
				<view class="code">
					<input type="text" placeholder="请输入图形验证码" v-model="code">
					<ImgVCode class='img-code' ref='imgCode'></ImgVCode>
				</view>
				<view class="code">
					<input type="text" placeholder="请输入验证码" v-model="smsCode">
					<PhoneCode :callIndex="verifyCode" :code_img="code" class='phone-code' ref='phoneCode'></PhoneCode>
				</view>
				<button @click="commit" class="commitBtn" :disabled="disabled">确定</button>
			</view>
		</view>
		<view class=rule>
			<text class=tit>提现规则：</text>
			<view v-html="tip"></view>
			<!-- <text>1、提现时间为工作日9:00—17:00;
			2、每推荐2位下级会员获得一次提现权限；</text>
			<text>3、提现金额必须为100元的整数倍；</text>
			<text>4、提现时需扣取提现金额的8%手续费；</text> -->

		</view>
	</view>
</template>

<script>
	import {VerifyCode} from '@/common/drawing.js'//校验验证码
	import {getUserBank} from '@/common/drawing.js'
	import {drawing} from '@/common/drawing.js'
	import {getRewardInfo} from '@/common/reward.js'
	import {getCouPle} from '@/common/reward.js'
	import {getIntegralInfo} from '@/common/rjm-member.js'
	import {getUserInfo} from '@/common/member.js'
	import phoneCode from '@/components/phoneCode.vue'
	import ImgVCode from '@/components/ImgVCode.vue'
	import {getWebCashInfo} from '@/common/site.js'

	//getUserBank
	export default {
		components:{phoneCode,ImgVCode},
		data() {
			return {
				disabled:false,
				tip:'',
			 bankList:'',
			 money:'',
			 password:'',
			 bonusBalance:0,//奖金总金额
			integralBalance:'',//积分总金额
			 coupleList:[],
				code:'',
				smsCode:'',
				showCode:false,
				regPhone:''
			}
		},
		methods: {
			//个人信息
			userInfo(){
				getUserInfo().then(res => {
					this.regPhone=res.phoneNumber;
				})
			},
			//校验
			justify(){
				this.$if0(VerifyCode,this.smsCode).then(res => {
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
			//配对的列表
			init(){
				this.$if0(getCouPle,this.pageIndex,this.pageSize).then(res => {
					this.coupleList=res.Data.Data
				})
				this.$if0(getIntegralInfo).then(res => {
					this.integralBalance=res.Data.integralBalance
				})
				this.$if0(getRewardInfo).then(res => {
					this.bonusBalance=res.Data.bonusBalance
				})
				
			},

			bank(){
				this.$if0(getUserBank).then(res => {
						this.bankList=res.Data
				})
			},
			drawingCommit(){
				if(this.bankList==''||this.bankList==null){
					uni.showModal({
						title: '提示',
						content: '请先绑定银行卡',
						showCancel:false,
					});
					return
				}
				if(this.money==''){
					uni.showModal({
						title: '提示',
						content: '请输入提现金额',
						showCancel:false,
					});
					return
				}
				if(this.money==0||this.money%10!=0){
					uni.showModal({
						title: '提示',
						content: '提现额度须为10的整倍数',
						showCancel:false,
					});
					return
				}
				if(this.money>this.bonusBalance){
					uni.showModal({
						title: '提示',
						content: '分享奖金不足，无法提现',
						showCancel:false,
					});
					return
				}
				
				// if(this.integralBalance-this.money<0){
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '消费积分不足，无法提现',
				// 		showCancel:false,
				// 	});
				// 	return
				// }
				// if(this.coupleList.length==0){
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '每提现一次需要推荐两位用户购物',
				// 		showCancel:false,
				// 	});
				// 	return
				// }
				this.code = ''
				this.smsCode = ''
				this.$refs.imgCode.toggleVerifyCode()
				this.showCode=true

			},
			commit(){
				if(this.smsCode==''){
					uni.showModal({
						title: '提示',
						content: '请输入短信验证码',
						showCancel:false,
					});
					return
				}
				this.disabled = true
				this.$if0(drawing,this.money,this.bankList.bankName,this.password,this.smsCode).then(res => {
					this.showCode=false
					uni.showModal({
						title: '提示',
						content: res.Message,
						showCancel:false,
					});
					this.disabled = false
					this.money = ''
					this.init()
				}).catch((err)=>{
					uni.showModal({
						title: '提示',
						content: err.Message,
						showCancel:false,
					});
					this.disabled = false
				})
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onLoad(){
			this.bank()
		this.init()
			this.userInfo()
			getWebCashInfo().then(res => {
				this.tip = res.expound

			}).catch((e) => {
				console.log({'err':e})
			})
		}
	}
</script>

<style scoped>
.code-box{position: relative}
.close{text-align: right;color:#000;position: absolute;top:0rpx;right:25rpx;padding-bottom: 20rpx;z-index: 999}
.codeShadow{position: fixed;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,0.5)}
.code-box{background: #fff;border-radius: 20rpx;margin-top: 50%;padding:100rpx 50rpx;width:600rpx;position: absolute;left:50%;margin-left:-300rpx;box-sizing: border-box}
.money{float: left}
.drawing text{font-size: 32rpx;}
.fr{float:right}
.total{line-height: 90rpx;border-bottom: 1px solid #eee;margin-bottom: 40rpx;}
input{height:68rpx;line-height: 68rpx;padding:0 20rpx;border:1px solid #eee;border-radius: 10rpx;width:80%;font-size: 32rpx;display: inline-block;}
.put{margin-bottom: 40rpx;}
.drawing{line-height: 60rpx;}
.card{height: 240rpx;background: #ee5b00;color:#fff;border-radius: 10rpx;padding:80rpx 0;box-sizing: border-box;text-align: center;margin-bottom: 40rpx;}
.card text{display: block;}
.rule {line-height: 60rpx;display: block;font-size: 26rpx;}
.rule .tit{line-height: 70rpx;font-size: 32rpx;text-indent: 0;}
.put{overflow: hidden}
.commit{line-height: 68rpx;font-size: 36rpx;float:right}
.code{position: relative}
.code input{width:40%;font-size: 26rpx;}
.commitBtn{text-align: center;display: block;width:100%;background: #EE5B00;margin-top: 20rpx;color: white;}
.img-code{
	position: absolute;
	left: 270rpx;
}
.phone-code{position: absolute;left: 270rpx;}
</style>
