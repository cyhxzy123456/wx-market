import Vue from 'vue'
import App from './App'

//iview-mpvue
import 'iview-mpvue/dist/components/tabs/style/css';
import 'iview-mpvue/dist/components/tab/style/css';
import 'iview-mpvue/dist/components/cell/style/css'
import 'iview-mpvue/dist/components/cell-group/style/css'
import 'iview-mpvue/dist/components/input/style/css'
import 'iview-mpvue/dist/components/row/style/css'
import 'iview-mpvue/dist/components/col/style/css'
import 'iview-mpvue/dist/components/radio-group/style/css'
import 'iview-mpvue/dist/components/load-more/style/css'
import 'iview-mpvue/dist/components/rate/style/css'
//iview-mpvue********end

import {wxLogin , getPromote} from "common/member.js"
import log from "@/common/log.js"
import {fileHost} from "@/common/net.js"

Vue.config.productionTip = false

// $if0(api , ...arg).then(...).catch(...)
// 判断res.Result === 0在then中获取返回数据，不为0在catch中获取数据
// api:请求接口并返回promise的函数
// ...arg:api所需参数
Vue.prototype.$if0 = (api , ...arg) => {
	if(api) return api(...arg).then(res => {
		if(res.Result === 0){
			return res;
		}else{
			return Promise.reject(res);
		}
	}).catch(err => {
		return Promise.reject(err);
	})
}

//请求失败提示
Vue.prototype.$errToast = (err) => {
	if(err.Result == 1){
		uni.showToast({
			title: err.Message,
			icon:'none',
			duration: 2000
		});
	}
}

//success提示
Vue.prototype.$successToast = (title) => {
	uni.showToast({
		title: title,
		icon:'success',
		duration: 2000
	});
}

//无ico提示
Vue.prototype.$toast = (title) => {
	uni.showToast({
		title: title,
		icon:'none',
		duration: 2000
	});
}

//设置域名前缀
Vue.prototype.$fmtSrc = (src) => {
	let reg = /^https/;
	if(reg.test(src)){
		return src;
	}else{
		return fileHost + src;
	}
}

//分享路径及推广码设置
Vue.prototype.$share = () => {
	let gData = getApp().globalData;
	let Promote = uni.getStorageSync('Promote') || gData.Promote;
	if(Promote){
		return {
			path: '/pages/index/index?Promote=' + Promote
		}
	}else{
		return {
			path: '/pages/index/index'
		}
	}
}

//退出登录
Vue.prototype.$logOut = () => {
	let gd = getApp().globalData;
	let tk = gd._token;
	tk.msgKey = '';
	tk.access_token = '';
	tk.refresh_token = '';
	tk.overTime = '';
	uni.removeStorageSync('msgKey');
	uni.removeStorageSync('access_token');
	uni.removeStorageSync('refresh_token');
	uni.removeStorageSync('overTime');
	uni.removeStorageSync('Promote');
	// uni.removeStorageSync('fromPromote');
	uni.navigateTo({
		url: '/pages/member/login/login'
	})
}

//获取sessionKey
Vue.prototype.$getMsgKey = () => {
	try {
		let app = getApp();
		let gd;
		let tk;
		let msgKey;
		if(app){
			gd = app.globalData;
		}
		if(gd){
			tk = gd._token;
			msgKey = tk.msgKey
		}
		msgKey = msgKey || uni.getStorageSync('msgKey');
		return msgKey;
	} catch (error) {
		console.log(error);
		return '';
	}
}

//

// #ifdef  MP-WEIXIN
Vue.prototype.$wxLogin = (cb , Promote ) => {
	uni.login({
		provider: '',
		success: res1 => {
			wxLogin(res1.code , Promote ).then(res => {
				console.log('wxlogs',res);
				if(res.Result == 0){
					let gd;
					if(getApp()) gd = getApp().globalData;
					// getApp().globalData.msgKey = res.Message;
					if(gd)gd._token.msgKey = res.Message;
					try {
						let tk;
						if(gd)tk = gd._token;
						tk.msgKey = res.Message;
						uni.setStorageSync('msgKey', res.Message);
					} catch (error) {
						console.log();
					}
					if(res.Data && res.Data.access_token){
						try {
							let overTime = new Date().getTime() + res.Data.expires_in * 600;
							let tk;
							if(gd) {
								tk = gd._token;
								tk.access_token = res.Data.access_token;
								tk.refresh_token = res.Data.refresh_token;
								tk.overTime = overTime;
							}
							uni.setStorageSync('refresh_token', res.Data.refresh_token);
							uni.setStorageSync('access_token', res.Data.access_token);
							uni.setStorageSync('overTime', overTime);
						} catch (terr) {
							console.log('$wxLogin储存storage错误err：' , terr);
							log.warn('$wxLogin储存storage错误err：' , terr);
						}
						setTimeout(() => {
							getPromote().then(res => {
								if(res.Result == 0){
									let app = getApp();
									let gData = app.globalData;
									gData.Promote = res.Data.introduceCode;
									uni.setStorageSync('Promote', res.Data.introduceCode);
								}else{
									log.warn('快捷登录获取推广码非0' , res);
								}
							}).catch(err => {
								console.log(err);
								log.warn('快捷登录获取推广码catch' , err);
								if(err.Result == 1 && err.Message){
									uni.showToast({
										title: err.Message,
										icon:'none',
										duration: 2000
									});
								}
							})
						},300)
					}else{
						log.warn('快捷登录api返回异常res:' , res)
					}
					if(res.Remarks && res.Remarks.length == 11){
						cb(true);
					}else{
						cb(false);
					}
				}else{
					uni.hideLoading();
					log.warn('微信快捷登录api非0' , res);
					if(res.Message) uni.showToast({
						title: res.Message,
						icon:'none',
						duration: 2000
					});
				}
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: '登录失败',
					icon:'none',
					duration: 2000
				});
				console.log('logcatch',err)
				log.warn('微信快捷登录api进入catch' , err);
			})
		},
		fail: (err) => {
			uni.hideLoading();
			log.warn('微信登录本地fail' , err);
		},
		complete: () => {}
	});
}
// #endif

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
