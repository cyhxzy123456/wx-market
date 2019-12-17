//提现
import $http from "./net.js"

//根据callIndex获取他的下级银行
export function getBank() {
	return $http({
		url: '/api/UserBank/getchildrenbycallindex',
		method: 'GET',
		data:{
			callIndex:'bank'
		}
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//获取用户绑定的银行
export function getUserBank() {
	return $http({
		url: '/api/UserBank/getuserbank',
		method: 'GET',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

// 会员提现
export function drawing(cashMoney,cashBankName,cashPassword,smsCode) {
	return $http({
		url: '/api/UserCash/UserCash',
		method: 'POST',
		data:{
			"cashMoney": cashMoney,
			"cashBankName": cashBankName,
			"cashPassword": cashPassword,
			"smsCode": smsCode
		}
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//添加
export function addBank(bankName,bankAddress,bankBranch,bankCard,phoneNumber,verifyCode,smsCode) {
	return $http({
		url: '/api/UserBank/add',
		method: 'POST',
		data: {
			"bankName": bankName,
			"bankAddress": bankAddress,
			"bankBranch": bankBranch,
			"bankCard": bankCard,
			"phoneNumber": phoneNumber,
			// "verifyCode": verifyCode,
			"smsCode":smsCode
		},
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//不知道手机号
export function getRegCode(phone,verifyCode,callIndex,phoneValidate) {
	return $http({
		url: '/api/Values/sendcode?phone='+phone+"&verifyCode="+verifyCode+"&callIndex="+callIndex+"&phoneValidate="+phoneValidate,
		method: 'POST'
		/*data:{
			phone:phone,verifyCode:verifyCode,callIndex:callIndex,phoneValidate:phoneValidate
		}*/
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
export function JudgeSmsCode(phone,smsCode) {
	return $http({
		url: '/api/Values/JudgeSmsCode?phone='+phone+"&smsCode="+smsCode,
		method: 'POST',
		/*data:{
			phone:phone,smsCode:smsCode
		}*/
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//发到注册手机上
//发送登录后的验证码，包括提现密码的修改设置，登录密码的修改设置
export function getPhoneCode(callIndex,imgcode) {
	return $http({
		url: '/api/UserAssets/UpdatePwdSendCode/sendcode?callIndex='+callIndex+"&verifyCode="+imgcode,
		method: 'POST'
		/*data:{
			callIndex:callIndex,verifyCode:imgcode
		}*/
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

export function VerifyCode(smsCode) {
	return $http({
		url: '/api/UserAssets/JudgeSmsCode/JudgeSmsCode?smsCode='+smsCode,
		method: 'POST',
		/*data:{
			smsCode:smsCode
		}*/
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}


