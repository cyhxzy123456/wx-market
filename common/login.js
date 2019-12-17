import $http from "./net.js"


export function getSendCode(phone,imgCode) {//短信验证码
	return $http({
		url: '/api/Values/sendcode?phone='+phone+'&verifyCode='+imgCode+'&callIndex=""&agentsId=0&phoneValidate=0',
		method: 'POST'
		// header:{
		// 	"content-type":'application/x-www-form-urlencoded',
		// },
		// data:{
		// 		"phone":phone,
		// 		"verifyCode": "",
		// 		"callIndex": "",
		// 		"agentsId": 0,
		// 		"phoneValidate":0
		// 	}
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}
export function Login(phone,pwd,imgCode,phoneconde) {//分页列表
	return $http({
		url: '/api/Values/login',
		method: 'POST',
		data:{
			"phoneNumber": phone,
			"passWord": pwd,
			"verifyCode": imgCode,
			"smsCode": phoneconde,
			"regType":0
			}
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}
//注册
export function reg(phone,pwd,code_img,code_phone,nickName,recommend) {
	return $http({
		url: '/api/Values/register',
		method: 'POST',
		data:{
			"phoneNumber":phone,
			"passWord": pwd,
			"verifyCode": code_img,
			"smsCode": code_phone,
			"nickName": nickName,
			"recommend": recommend
		}
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}


//短信验证登陆
export function LoginBySms(phone,imgCode,phoneconde) {//分页列表
	return $http({
		url: '/api/Values/loginBySms',
		method: 'POST',
		data:{
			"phoneNumber": phone,
			"verifyCode": imgCode,
			"smsCode": phoneconde,
		}
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}
export function ForgetLoginPwd(Password,ConfirmPassword,phoneNumber,SmsCode,ImgCode) {//分页列表
	return $http({
		url: '/api/UserAssets/ForgetPassword',
		method: 'PUT',
		data:{
			"Password": Password,
			"ConfirmPassword": ConfirmPassword,
			"phoneNumber": phoneNumber,
			"SmsCode": SmsCode,
			"ImgCode":ImgCode
		}
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}
