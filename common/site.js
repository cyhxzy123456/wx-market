import $http from "./net.js"

export function getSiteInfo(){
	return $http({
		url:'/api/WebSiteInfo/Index',
		method:'GET',
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//提现配置
export function getWebCashInfo(){
	return $http({
		url:'/api/WebSiteInfo/WebCashInfo',
		method:'GET',
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取网站配置开关信息
export function getWebSiteConfig(){
	return $http({
		url:'/api/WebSiteInfo/WebSiteConfig',
		method:'GET',
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}