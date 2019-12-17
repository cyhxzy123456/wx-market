<script>
	// import {_request} from "/common/net.js"
	import {wxLogin , getPromote} from "common/member.js"
	import {getSiteInfo} from "@/common/site.js"
	import log from "@/common/log.js"
	export default {
		onLaunch: function(opt) {
		},
		onShow: function(opt) {
			try {
				uni.removeStorageSync('fromPromote');
			} catch (error) {
				console.log(error);
			}
			getSiteInfo().then(res => {
				getApp().globalData.siteInfo = res;
			}).catch(err => {
				console.log('err',err)
			})
			
			// #ifdef  MP-WEIXIN
			if(opt.scene == 1008 || opt.scene == 1007 || opt.scene == 1044){
				if(!opt.query.Promote){
					log.warn('warn:' + opt.scene + opt.query.Promote);
				}
			}
			let Promote;
			if(opt.scene == 1011 || opt.scene == 1012 || opt.scene == 1013){
				let temp = decodeURIComponent(opt.query.q);
				temp = temp.match(/Promote=\w+$/g);
				if(temp && temp.length > 0){
					temp = temp[0];
					temp = temp.split('=')[1];
					uni.setStorageSync('fromPromote', temp);
					Promote = temp;
				}
				log.info('info:接收到的邀请码' + Promote + '场景：' + opt.scene + 'opt:' + JSON.stringify(opt));
			}
			if(opt.query.Promote){
				let gData = this.$scope.globalData;
				gData.fromPromote = opt.query.Promote;
				uni.setStorageSync('fromPromote', opt.query.Promote);
				Promote = opt.query.Promote;
			}
			let atk = uni.getStorageSync('access_token');
			if(!atk){
				log.info('info:接收到的邀请码' + Promote + '场景：' + opt.scene + 'query:' + JSON.stringify(opt.query));
				this.$wxLogin(() => {},Promote);
			}else{
				let overTime = uni.getStorageSync('overTime');
				let now = new Date().getTime();
				if(overTime && (now < overTime)){//token未过期获取推广码
					getPromote().then(res => {
						if(res.Result == 0){
							let app = getApp();
							let gData = app.globalData;
							gData.Promote = res.Data.introduceCode;
							uni.setStorageSync('Promote', res.Data.introduceCode);
						}
					}).catch(err => {
						console.log(err);
						if(err.Result == 1){
							uni.showToast({
								title: err.Message,
								icon:'none',
								duration: 2000
							});
						}
					})
				}
			}
			uni.showShareMenu({
				withShareTicket:true
			})
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			_token:{//备份token防止storage错误
				msgKey:'',
				access_token:'',
				refresh_token:'',
				overTime:'',
			}
		}
	}
</script>

<style>
	/*iview-mpvue公共css */
	.i-tabs-tab-scroll{
		width: auto !important;
		padding: 0 10rpx;
	}
	/*每个页面公共css */
	.content{
		padding: 0 20rpx;
	}
	.flex_col{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.flex_row{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.flex1{
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
	}
	.flex_a{
		flex: none;
	}
	.tet_f{
		text-align: left;
	}
	.txt_r{
		text-align: right;
	}
	.txt_c{
		text-align: center;
	}
	.fr{
		float: right;
	}
	.iblk{
		display: inline-block;
	}
	.line{
		width: 100%;
		height: 20rpx;
		background-color: #eee;
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	
	i-load-more{
		/* display: block; */
		width: 100%;
		font-size: 26rpx;
	}
	.mt10{margin-top:20rpx;}
	.mt15{margin-top:30rpx;}
	.mt20{margin-top:40rpx;}
	.pt10{padding-top:20rpx;}
	.pt15{padding-top:30rpx;}
	.pt20{padding-top:40rpx;}
	.fl{float:left;}
	.fr{float:right;}
	.navigator-hover {
	background-color: white ;
	opacity: 1;

	}

</style>
