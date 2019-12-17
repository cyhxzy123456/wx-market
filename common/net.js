import log from "@/common/log.js"
import { getPromote} from "common/member.js"

let status = {
	isRefreshing : false,
	requestArr:[],
	redirectNum:0            //401数量
}

export let host = 'https://storeapi.qianniusoft.com';
export let fileHost = 'https://storefile.qianniusoft.com';

function setHost(opt){
	// let host = 'https://storeapi.qianniusoft.com';
	// let host = 'https://storeapi.aads6.cn';
	let reg = /^http:\/\/.+/i;
	let reg1 = /^https:\/\/.+/i;
	let reg2 = /^\/.*/i;
	let f = reg.test(opt.url);
	let f1 = reg1.test(opt.url);
	let f2 = reg2.test(opt.url);
	if(f2){//以/开头的路径前加域名
		opt.url = host + opt.url;
	}else if(!(f || f1)){//不是http或https开头的抛出错误
		throw new Error('域名需以http或https开头');
	}
}

function toRefresh_token(last){
	let opt = {
		url:'/api/Values/refresh_token/' + last,
		method: 'PUT',
	}
	setHost(opt);
	return new Promise((resolve , reject) => {
		uni.request({
			url: opt.url,
			method: opt.method,
			header:opt.header,
			data: opt.data,
			success:(res) => {
				status.isRefreshing = false;
				if (res.data.Result == 0){
					try {
						let overTime = new Date().getTime() + res.data.Data.expires_in * 600;
						let app = getApp();
						let gd;
						let tk;
						if(app){
							gd = app.globalData;
						}
						if(gd){
							tk = gd._token;
							tk.access_token = res.data.Data.access_token;
							tk.refresh_token = res.data.Data.refresh_token;
							tk.overTime = overTime;
						}
						uni.setStorageSync('access_token', res.data.Data.access_token);
						uni.setStorageSync('refresh_token', res.data.Data.refresh_token);
						uni.setStorageSync('overTime', overTime);
					} catch (error) {
						console.log(error);
						log.warn('刷新token储存storage错误err：' , error);
					}
					if(!uni.getStorageSync('Promote')){
						setTimeout(() => {
							getPromote().then(res => {
								uni.setStorageSync('Promote', res.Data.introduceCode);
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
						},300)
					}
					resolve(res.data.Data.access_token);
				}else{//登录失效只需要移除token后续不在进行刷新尝试
					let app = getApp();
					let gd;
					let tk;
					if(app){
						gd = app.globalData;
					}
					if(gd){
						tk = gd._token;
						tk.access_token ='';
						tk.refresh_token = '';
						tk.overTime = '';
						tk.msgKey = ''
					}
					uni.removeStorageSync('msgKey');
					uni.removeStorageSync('access_token');
					uni.removeStorageSync('refresh_token');
					uni.removeStorageSync('overTime');
					// uni.removeStorageSync('Promote');
					// // uni.removeStorageSync('fromPromote');
					// uni.redirectTo({
					// 	url: '/pages/member/login/login',
					// });
				}
			},
			fail: (err) => {//刷新请求失败移除正在刷新状态等待下次刷新
				status.isRefreshing = false;
				console.log('token刷新失败',err);
				// uni.removeStorageSync('msgKey');
				// uni.removeStorageSync('access_token');
				// uni.removeStorageSync('refresh_token');
				// uni.removeStorageSync('overTime');
				// uni.removeStorageSync('Promote');
				// // uni.removeStorageSync('fromPromote');
				// uni.redirectTo({
				// 	url: '/pages/member/login/login',
				// });
			},
			complete: ()=>{
				//刷新后执行积压的请求
				status.isRefreshing = false;
				let app = getApp();
				let gd;
				let tk;
				if(app){
					gd = app.globalData;
				}
				if(gd){
					tk = gd._token;
				}
				if(tk){
					tk = tk.access_token;
				}
				let newToken = uni.getStorageSync('access_token') || tk;
				while(status.requestArr.length > 0){
					let temP = status.requestArr[0];
					temP.opt.header.Authorization = "Bearer " + newToken;
					temP.resolve(temP.opt);
					status.requestArr.shift();
				}
			}
		})
	}).catch(err => {console.log('刷新token错误2',err)})
}

function f2p(data){
	let prm = '?';
	for (let k in data) {
		if(data)prm = prm + k + '=' + data[k] + '&'
	}
	prm = prm.slice(0 , prm.length - 1);
	return prm;
}

function beforReq(opt ,isParam){//请求前钩子
	setHost(opt);
	if(isParam){
		let prm = f2p(opt.data);
		opt.url = opt.url + prm;
		opt.data = {};
	}
	let gd;
	let tk;
	let access_token;
	let refresh_token
	let overTime;
	let now = new Date().getTime();
	try {
		if(getApp()){
			gd = getApp().globalData;
		}
		if(gd)tk = gd._token;
		access_token = uni.getStorageSync('access_token');
		refresh_token = uni.getStorageSync('refresh_token');
		overTime = uni.getStorageSync('overTime');
	} catch (tErr) {
		console.log('读取storage错误:', tErr);
		log.warn('warn:读取storage错误:', tErr);
	}
	if(tk){//用备份token容错
		access_token = access_token || tk.access_token;
		refresh_token = refresh_token || tk.refresh_token;
		overTime = overTime || tk.overTime;
	}
	opt.header = {};
	let P = new Promise((resolve1 , reject) => {
		if(access_token && !opt.header.Authorization){//token存在则加入header
		
			if(overTime && (now < overTime)){//未过期
				opt.header.Authorization = "Bearer " + access_token;
				resolve1(opt);
			}else{//过期
				if (!status.isRefreshing){//无刷新请求
					status.isRefreshing = true;
					toRefresh_token(refresh_token).then(tem_token => {
						opt.header.Authorization = "Bearer " + tem_token;
						resolve1(opt);
					})
				}else{//刷新中
					status.requestArr.push({
						resolve:resolve1,
						opt:opt
					});
				}
			}
		}else{
			resolve1(opt);
		}
	}).catch(err => {console.log('刷新token错误1',err)})
	return P;
}

function beforRes(res , opt){//响应前钩子；拦截401响应
	if(res.statusCode == 401){
		// try {
		// 	log.warn('warn:401res：' + opt.url);
		// } catch (error) {
			
		// }
		
		status.redirectNum++;
		if(status.redirectNum <= 1){
			let app = getApp();
			let gd;
			let tk;
			if(app){
				gd = app.globalData;
			}
			if(gd){
				tk = gd._token;
				tk.access_token ='';
				tk.refresh_token = '';
				tk.overTime = '';
				tk.msgKey = ''
			}
			uni.removeStorageSync('msgKey');
			uni.removeStorageSync('access_token');
			uni.removeStorageSync('refresh_token');
			uni.removeStorageSync('overTime');
			uni.removeStorageSync('Promote');
			// uni.removeStorageSync('fromPromote');
			uni.redirectTo({
				url: '/pages/member/login/login',
				success: () => {
					status.redirectNum--;
				}
			});
		}else{
			status.redirectNum--;
		}
		return Promise.resolve(res);
	}else{
		if(res.statusCode != 200){
			try {
				log.warn('warn:非200响应res:', res , 'opt' ,opt);
			} catch (err) {
				
			}
		}else if(/api\/wxOpen\/OnLogin/.test(opt.url) && !(res.data.Data && res.data.Data.access_token)){
			log.warn('warn:登录res:', res , 'opt' ,opt);
		}
		return Promise.resolve(res);
	}
}

export default function $http(opt ,isParam){
	
	return beforReq(opt, isParam).then(opt1 => {
		return new Promise((resolve , reject) => {
			uni.request({
				url: opt1.url,
				method: opt1.method,
				header:opt1.header,
				data: opt1.data,
				success: res => {
					beforRes(res , opt1).then(res1 => {
						resolve(res1);
					})
				},
				fail: (err) => {console.log('httperr',err)},
				complete: opt1.complete
			});
		})
	})
}