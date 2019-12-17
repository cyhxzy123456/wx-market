<template>
	<view class="g-invite" @longpress="loangTap">
		<image :src="bgImg" mode="widthFix" class="invite-img"></image>
		<view class="invite-msg">
			<image v-if="inviteMsg.qrImg" :src="inviteMsg.qrImg"  class="qr-img" mode="aspectFit"></image><br>
			<text>推荐码:{{inviteMsg.introduceCode}}</text><br>
			<text>TA赚我也赚，扫码开启赚钱模式</text>
		</view>
	</view>
</template>

<script>
	import {  getPromote} from "common/member.js"
export default {
		data() {
			return {
				inviteMsg:{
					
				},
				bgImg:'',

			}
		},
		components: {
		},
		onLoad(){},
		onShow(){
			this.bgImg = this.$fmtSrc('/static/personCenter/invite-banner.jpg');
			this.$if0(getPromote).then(res => {
				this.inviteMsg = res.Data
			})
		},
		methods: {
			toSave(){
				let _this = this;
				uni.showLoading({
					title:'',
					mask:true,
				})
				uni.downloadFile({
					url: _this.inviteMsg.qrImgMax, 
					success: (res1) => {
						uni.hideLoading();
						if (res1.statusCode === 200) {
							uni.showLoading({
								title:'',
								mask:true,
							})
							uni.saveImageToPhotosAlbum({
								filePath: res1.tempFilePath,
								success: function (res2) {
									console.log(res2)
									uni.hideLoading();
									_this.$successToast('保存成功');
								},
								fail:function(err){
									console.log('保存失败' , err)
								}
							});
						}else{
							console.log('status!=200',res1);
						}
					},
					fail:function(err){
						uni.hideLoading();
						console.log('文件下载失败',err);
						_this.$Toast('文件下载失败');
					}
				});
			},
			loangTap(){
				let _this = this;
				console.log('长按');
				uni.showModal({
					title: '提示',
					content: '保存到本地',
					success: function (res) {
							if (res.confirm) {
								uni.authorize({
									scope: 'scope.writePhotosAlbum',
									success() {
										_this.toSave();
									},
									fail(err){
										console.log('无授权',err)
										uni.getSetting({
											success(res) {
												if (!res.authSetting['scope.writePhotosAlbum']) {
													uni.showModal({
														title: '提示',
														content: '需要您授权操作相册的权限',
														success: function (res) {
															if(res.confirm){
																uni.openSetting({
																	success(res) {
																		console.log(res.authSetting)
																	},
																	fail(err){
																		console.log('555',err)
																	},
																	complete(com){
																		if(com.authSetting && com.authSetting['scope.writePhotosAlbum']){
																			//保存文件
																			_this.toSave();
																		}
																	}
																});
															} else if (res.cancel) {
																console.log('用户点击取消');
															}
														}
													})
												}
											}
										})
									}
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
					}
				});
				
			}
			}
		
	}
</script>

<style>
	/* page{
		height: 100%;
	} */
	.g-invite{
		width: 100%;
		height: 100%;
		position: relative;
	}
	.invite-img{
		width: 100%;
		/* height: 100%; */
	}
	.invite-msg{
		position: absolute;
		top: 48.9%;
		text-align: center;
		width: 100%;
		height: 590rpx;

	}
	.qr-img{
		height: 460rpx;
		/* height: 415rpx; */
	}
	
</style>
