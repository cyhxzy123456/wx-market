<template>
<view class="page">
	<!-- 我的分销 -->
	<view class="line" v-if="status == 1 || status == 3"></view>
	<view class="content" v-if="status == 1 || status == 3">
		<view class="title_has">
			您已获得分销权限
		</view>
		<view class="tip_has">
			请用以下账号进行登陆操作有疑问请联系客服。
		</view>
		<view class="has_info">
			登录链接:<text selectable>{{myJoin.managerUrl ? myJoin.managerUrl : ''}}</text>
		</view>
		<view class="has_info">
			登录账号:<text selectable>{{myJoin.phoneNumber}}</text>
		</view>
		<view class="has_info">
			登录密码:<text selectable>{{myJoin.password}}</text>
		</view>
	</view>
	<!-- 已提交分销申请 -->
	<view class="line" v-if="status == 0 || (status == 2 && need_tip <= 0) || status == 4"></view>
	<view class="content btn_wrap" v-if="status == 0 || (status == 2 && need_tip) || status == 4">
		<image class="waite_ico" src="/static/ico/ico-waite.png" mode="scaleToFill"></image>
		<view class="waite" v-if="status == 0">
			您已经成功提交分销申请，请耐心等待审核
		</view>
		<view class="waite" v-if="status == 2">
			您提交的分销申请资料未审核通过，请重新填写
		</view>
		<view class="waite" v-if="status == 4">
			您提交的分销申请资料未审核通过，禁止再次提交，有疑问请联系平台客服
		</view>
		<button class="toWrite" @click="toWrite" size="mini" v-if="status == 2">
			去填写
		</button>
	</view>
	<!-- 分销申请填写 -->
	<view class="content" v-if="status == -1 || (status == 2 && need_tip == 0)" @click="closeCk(-1)">
		<view class="base_info">
			基本信息
		</view>
		<view class="input_wrap" >
			<view class="chick_value" :class="{gry:typeId == -1}" @click.stop="showCk">
				{{typeId > -1 ? ( typeId == 0 ? '个人' : '企业' ) : '请选择主体类型'}}
			</view>
			<view class="chick_wrap" v-if="show_ck" @tap.stop="">
				<view class="chick_item" @click="closeCk(1)">
					企业
				</view>
				<view class="chick_item" @click="closeCk(0)">
					个人
				</view>
			</view>
		</view>
		<view class="input_wrap">
			<input type="text" placeholder="请输入姓名" @input="nameChange"/>
		</view>
		<view class="input_wrap">
			<input type="number" placeholder="请输入联系电话" @input="telChange"/>
		</view>
		<view class="input_wrap">
			<picker mode="selector" :range="man_range" @change="ch">
				<view class="picker_cont" :class="{gry:range_i == -1}">{{range_i < 0 ? '请选择经营类别' : man_range[range_i]}}</view>
			</picker>
		</view>
		<view class="input_wrap">
			<image :src="codeUrl" class="verifyCode" alt="验证码" title="点击切换验证码" @click="toggleVerifyCode()"></image>
			<input type="number" class="verifyCode_input" placeholder="请输入验证码" @input="codeChange"/>
		</view>
		<view class="photo_upload">
			
			<view class="com" v-if="typeId == 1">
				<view class="title">
					营业执照
				</view>
				<view class="pics">
					<view class="pic" :class="{pic_a:com_img}">
						<view class="del_img" v-if="com_img" @click="delImg('com_img')">×</view>
						<view class="tip" v-if="!com_img" @click="addImg('com_img')">
							<image class="camera" src="/static/ico/ico-camera.png"  mode="scaleToFill"></image>
							<view class="tip_c">上传照片</view>
						</view>
						<image v-if="com_img" :src="com_img" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="com"  v-if="typeId == 0">
				<view class="title">
					身份信息（已做加密处理）
				</view>
				<view class="pics">
					<view class="pic" :class="{pic_a:per_img1}">
						<view class="del_img" v-if="per_img1" @click="delImg('per_img1')">×</view>
						<view class="tip" v-if="!per_img1" @click="addImg('per_img1')">
							<image class="camera" src="/static/ico/ico-camera.png"  mode="scaleToFill"></image>
							<view class="tip_c">上传身份证正面</view>
						</view>
						<image v-if="per_img1" :src="per_img1" mode="widthFix"></image>
					</view>
					<view class="pic" :class="{pic_a:per_img2}">
						<view class="del_img" v-if="per_img2" @click="delImg('per_img2')">×</view>
						<view class="tip" v-if="!per_img2" @click="addImg('per_img2')">
							<image class="camera" src="/static/ico/ico-camera.png"  mode="scaleToFill"></image>
							<view class="tip_c">上传身份证背面</view>
						</view>
						<image v-if="per_img2" :src="per_img2" mode="widthFix"></image>
					</view>
					<view class="pic" :class="{pic_a:per_img3}">
						<view class="del_img" v-if="per_img3" @click="delImg('per_img3')">×</view>
						<view class="tip" v-if="!per_img3" @click="addImg('per_img3')">
							<image class="camera" src="/static/ico/ico-camera.png"  mode="scaleToFill"></image>
							<view class="tip_c">上传手持身份证照片</view>
						</view>
						<image v-if="per_img3" :src="per_img3" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		
			<view class="agree"><view class="ck_btn" :class="{bg_gry:!ck_status}" @click="ck_chang"></view>我阅读并同意<navigator class="protocol" url="/pages/member/protocol/protocol?callIndex=fxsq">《分销申请协议》</navigator></view>
			<button type="primary" class="sub_btn" @click="sub">提交</button>
			<!-- ck_btn是否选中样式、上传图片loading、提交按钮下方空隙、表单校验、接口400 -->
	</view>
</view>
</template>

<script>
	import {upload , getUserInfo , JoinAccounts , getJoin , getApplyTips} from '@/common/member.js';
	import {host} from '@/common/net.js'
	export default {
		data() {
			return {
				man_range:[ '精品服饰','美妆护肤','家居日用','箱包皮具','办公用品','健康养生','其他' ],
				range_i:-1,
				com_img:'',
				per_img1:'',
				per_img2:'',
				per_img3:'',
				typeId:-1,
				show_ck:false,
				userId:-1,
				name:'',
				tel:'',
				codeUrl:'',
				verifyCode:'',
				ck_status:false,
				status:-2,						//-2等待数据初始化、-1数据初始化完成、0待审核、1审核通过、2审核失败、3通过并禁止提交、4失败并禁止提交
				myJoin:'',
				need_tip:-1,
			}
		},
		onShareAppMessage(res) {
			return this.$share();
		},
		onShow(){
			getApplyTips().then(res => {
				console.log('tips',res);
				if(res.Result == 0){
					this.need_tip = 1;
				}else{
					this.need_tip = 0;
				}
			}).catch(err => {
				console.log(err);
			})
			this.$if0(getJoin).then(res => {
				console.log(res);
				if(!res.Data){
					this.status = -1;
					uni.setNavigationBarTitle({title:'分销申请'})
				}else{
					uni.setNavigationBarTitle({title:'我的分销'})
					this.status = res.Data.status;
					this.myJoin = res.Data;
				}
			}).catch(err => {
				// this.$errToast(err);
				if(err.Result == 1){
					this.status = -1;
					uni.setNavigationBarTitle({title:'分销申请'})
				}
			});
			getUserInfo().then(res => {
				this.userId = res.id;
			}).catch(err => {
				this.$errToast(err);
			});
		},
		onLoad(){
			this.toggleVerifyCode();
		},
		methods: {
			toWrite(){
				uni.showLoading({
					title:'',
					mask:true,
				})
				getApplyTips(2).then(res => {
					uni.hideLoading();
					console.log('tips',res);
					if(res.Result == 0){
						this.need_tip = 0;//标记后再填写
					}else{
						this.need_tip = 0;//标记后再填写
					}
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
					this.$errToast(err);
				})
			},
			delImg(i){
				this[i] = '';
			},
			toggleVerifyCode:function() {
				this.codeUrl = host + '/api/verifyCode/getCode?' + new Date()
			},
			sub(){
				let reg = /^\s$/
				if(this.typeId == -1){
					this.$toast('请选择主体类型');
					return;
				}
				if(this.name == '' || reg.test(this.name)){
					this.$toast('请输入姓名');
					return;
				}
				if(this.tel == '' || reg.test(this.tel)){
					this.$toast('请输入联系电话');
					return;
				}
				if(this.range_i == -1){
					this.$toast('请选择经营类别');
					return;
				}
				if(this.verifyCode == '' || reg.test(this.verifyCode)){
					this.$toast('请输入验证码');
					return;
				}
				if(this.typeId == 0){//个人
					if(this.per_img1 == ''){
						this.$toast('请上传身份证正面');
						return;
					}
					if(this.per_img2 == ''){
						this.$toast('请上传身份证背面');
						return;
					}
					if(this.per_img3 == ''){
						this.$toast('请上传手持身份证照片');
						return;
					}
					this.com_img = '';
				}else if(this.typeId == 1){//企业
					if(this.com_img == ''){
						this.$toast('请上传营业执照');
						return;
					}
					this.per_img1 = '';
					this.per_img2 = '';
					this.per_img3 = '';
				}
				if(!this.ck_status){
					this.$toast('请仔细阅读分销申请协议并选择是否同意');
					return;
				}
				uni.showLoading({
					title:'',
					mask:true,
				});
				this.$if0(JoinAccounts ,{
					userId:this.userId,
					phoneNumber:this.tel,
					name:this.name,
					per_img1:this.per_img1,
					per_img2:this.per_img2,
					per_img3:this.per_img3,
					com_img:this.com_img,
					typeId:this.typeId,
					content:this.man_range[this.range_i],
					verifyCode:this.verifyCode,
				}).then(res => {
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: '你已经成功提交分销申请，请耐心等待审核',
						showCancel:false,
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
								uni.redirectTo({
									url: '/pages/member/business/business'
								});
							}
						}
					});
				}).catch(err => {
					uni.hideLoading();
					console.log(err)
					this.$errToast(err);
				})
			},
			codeChange(e){
				this.verifyCode = e.detail.value;
			},
			ck_chang(){
				this.ck_status = !this.ck_status
			},
			ch(e){
				console.log(e)
				this.range_i = e.detail.value;
			},
			nameChange(e){
				this.name = e.detail.value;
			},
			telChange(e){
				this.tel = e.detail.value;
			},
			showCk(){
				this.show_ck = true;
			},
			closeCk(v){
				if(v != -1)this.typeId = +v;
				this.show_ck = false;
			},
			addImg(i){
				let _this = this;
				uni.chooseImage({
					sizeType:'original',
					count:1,
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading({
							title:'',
							mask:true,
						});
						upload(tempFilePaths[0]).then(res => {
							uni.hideLoading();
							res = decodeURI(res);
							res = JSON.parse(res);
							if(res.Result == 0){
								console.log(res);
								_this[i] = res.Data.AbsoultefilePath;
							}else{
								_this.$errToast(res);
							}
						}).catch(err => {
							uni.hideLoading();
							console.log('err',err);
						})
					},
					fail(err){
						console.log(err);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	min-height: 100vh;
}
.btn_wrap{
	text-align: center;
}
.title_has{
	margin: 30rpx 0 15rpx;
	font-size: 34rpx;
}
.tip_has{
	margin: 15rpx 0;
	font-size: 32rpx;
}
.has_info{
	margin: 8rpx 0;
	font-size: 32rpx;
}
.waite_ico{
	display: block;
	width: 164rpx;
	height: 181rpx;
	margin: 80rpx auto 50rpx;
}
.waite{
	font-size: 32rpx;
	color: #666;
	text-align: center;
}
.toWrite{
	margin-top: 20rpx;
	background-color: #ff6000;
	color: #fff;
}
.base_info,
.title{
	margin: 20rpx 0;
	font-size: 32rpx;
}
.input_wrap{
	width: 708rpx;
	height: 68rpx;
	position: relative;
	margin: 10rpx 0;
	padding: 0 20rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	border: 1px solid #eee;
	font-size: 32rpx;
	.gry{
		color: #666;
	}
	.chick_value{
		height: 68rpx;
		line-height: 68rpx;
	}
	.chick_wrap{
		width: 708rpx;
		position: absolute;
		top: 68rpx;
		left: 0;
		padding: 0 20rpx;
		box-sizing: border-box;
		background-color: #eee;
		z-index: 99;
		.chick_item{
			width: 100%;
			height: 68rpx;
			line-height: 68rpx;
			color: #333;
			border-bottom: 1rpx solid #ccc;
		}
		.chick_item:last-child{
			border: none;
		}
	}
	.picker_cont{
		height: 68rpx;
		line-height: 68rpx;
	}
	input{
		height: 68rpx;
	}
	.verifyCode{
		height: 64rpx;
		width: 300rpx;
		position: absolute;
		right: 0;
	}
	.verifyCode_input{
		width: 408rpx;
	}
}
.photo_upload{
	.com{
		.pics{
			// justify-content: space-around;
			// flex-wrap:wrap;
			.pic{
				display: inline-block;
				width: 300rpx;
				height: 300rpx;
				margin: 24rpx;
				position: relative;
				border: 1rpx solid #eee;
				border-radius: 10rpx;
				vertical-align: top;
				overflow: hidden;
				text-align: center;
				color: #333;
				image{
					width: 100%;
					height: 100%;
				}
				.tip{
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 100%;
					height: 126rpx;
					.camera{
						width: 86rpx;
						height: 70rpx;
					}
					.tip_c{
						font-size: 28rpx;
					}
				}
				.del_img{
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					position: absolute;
					right: 0;
					top: 0;
					border-radius: 10rpx;
					font-size: 30rpx;
					background-color: rgba(0,0,0,.5);
					color: #fff;
				}
			}
			.pic_a{
				height: auto;
				line-height: 0;
				image{
					height: auto;
				}
			}
		}
	}
}
.agree{
	height: 40rpx;
	margin-top: 70rpx;
	line-height: 40rpx;
	font-size: 32rpx;
}
.ck_btn{
	display: inline-block;
	width: 18rpx;
	height: 18rpx;
	margin-right: 10rpx;
	// transform: translateY(3rpx);
	border-radius: 50%;
	border: 9rpx solid #fff;
	box-shadow: 0 0 0rpx 2rpx #aaa;
	background-color: #ff6000;
	vertical-align: middle;

}
.ck_btn.bg_gry{
	background-color: #ccc;
}
.protocol{
	display: inline;
	color: #ff6000;
}
.sub_btn{
	width: 600rpx;
	height: 70rpx;
	margin-top: 40rpx;
	line-height: 70rpx;
	background-color: #ff6000;
	color: #fff;
	font-size: 36rpx;
}
</style>

