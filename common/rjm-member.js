//个人中心相关

import $http from "./net.js"

//获取分享奖金概览
export function getUserInfo(){
	return $http({
		url:'/api/UserAssets/UserInfo',
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//获取积分详情
export function getIntegralInfo(){
	return $http({
		url:'/api/userIntegral/getInfo',
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//获取分享奖金概览
export function getuserBonusInfo(){
	return $http({
		url:'/api/userBonus/getInfo',
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//订单数统计
export function getOrderCount(){
	return $http({
		url:'/api/order/GetOrderCount',
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//修改登录密码
export function updateLoginPwd(oldPassword,newPassword){
	return $http({
		url:'/api/UserAssets/UpdatePassword',
		method:'PUT',
		data:{
			"oldPassword": oldPassword,
			"newPassword": newPassword
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}