//个人中心相关

import $http from "./net.js"
import {fileHost} from "./net.js"

//协议
export function getProtocol(callIndex,accountId,userId,productListId,day_rate,borrowmoney,benjin,total_money,warnmoney,openLineMoney,gdmoney) {
	return $http({
		url:'/api/ArticleShows/GetAgreeMent',
		method:'POST',
		data:{
			"callIndex": callIndex,
			"accountId": accountId,
			"userId": userId,
			"productListId":productListId,
			"keyValues": {
				"{day_rate}": day_rate,
				"{borrowmoney}": borrowmoney,
				"{benjin}": benjin,
				"{total_money}":total_money,
				"{warnmoney}": warnmoney,
				"{openLineMoney}":openLineMoney,
				"{gdmoney}":gdmoney,
				/* "Total_Rate": "string",
                 "GEM_Rate": "string",*/
			}
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//微信快捷登录
export function wxLogin(code , Promote){
	Promote = Promote ? Promote : getApp().globalData.fromPromote;
	if(!Promote){
		Promote = '';
	}
	return $http({
		url:'/api/wxOpen/OnLogin',
		method:'POST',
		data:{
			code:code,
			recommend:Promote,

		}
	},true).then(res => {
		return res.data;
	}).catch(err => {console.log('err',err); return err;});
}

//微信解密电话号码
export function DecryptPhoneNumber(data){
	return $http({
		url:'/api/wxOpen/DecryptPhoneNumber',
		method:'GET',
		data:{
			sessionId:data.sessionId,
			encryptedData:data.encryptedData,
			iv:data.iv
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//微信用户信息信息解密
export function DecodeEncryptedData(data){
	return $http({
		url:'/api/wxOpen/DecodeEncryptedData',
		method:'POST',
		data:{
			type:'USERINFO',
			sessionId:data.sessionId,
			encryptedData:data.encryptedData,
			iv:data.iv
		}
	}, true).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//提交微信获取的昵称等信息
export function DecryptNickName(data){
	return $http({
		url:'/api/wxOpen/DecryptNickName',
		method:'POST',
		data:{
			sessionId:data.sessionId,
			nickName:data.nickName,
			avatarUrl:data.avatarUrl,
			gender:data.gender,
			country:data.country,
			province:data.province,
			city:data.city
		}
	} , true).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取用户信息
export function getUserInfo(){
	return $http({
		url:'/api/UserAssets/UserInfo',
		method:'GET',
		data:{
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取推信息
export function getPromote(){
	return $http({
		url:'/api/UserAssets/Promote?recommendRouter=ref?Promote=',
		method:'GET',
		data:{
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取推广的下级
export function GetLowerLevel(PageIndex,PageSize) {
	return $http({
		url:'/api/UserAssets/GetLowerLevel',
		method:'POST',
		data:{
			"PageSize": PageSize,
			"PageIndex": PageIndex,
			"Sorts": [
				// {
				// 	"Key": "string",
				// 	"Sort": 0
				// }
			],
			"Conditions": [
				{
					"Conditions": [
						// {
						// 	"Key": "string",
						// 	"Value": {},
						// 	"WhereType": 0
						// }
					],
					"ConditionType": "and"
				}
			]
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//微信支付
export function wx_pay(orderNo){
	return $http({
		url:'/api/wxOpen/GetPrepayid?orderNo=' + orderNo,
		method:'GET',
		data:{
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//图片上传
export function upload(path){
	return new Promise((resolve , reject) => {
		uni.uploadFile({
			url: fileHost + '/api/fileUpload/uploadByWx', 
			header:{
				"Authorization":'"Bearer ' + uni.getStorageSync('access_token')
			},
			filePath: path,
			name: 'imgFile',
			formData: {
			},
			success: (uploadFileRes) => {
				resolve(uploadFileRes.data);
			},
			fail(err){
				reject(err);
			}
		});
	})
}

//加盟申请
export function JoinAccounts(data){
	return $http({
		url:'/api/AccountApply/JoinAccounts',
		method:'POST',
		data:{
			"id": 0,
			"userId": data.userId,
			"phoneNumber": data.phoneNumber,
			"password": "",
			"name": data.name,
			"company": '',
			"sex": "0",
			"address": "",
			"idCard": "",
			"timeAdd": "2019-11-2",
			"timeUpdate": "2019-11-2",
			"content": data.content,
			"remark": "",
			"status": 0,
			"idCardPositiveUrl": data.per_img1,
			"idCardBackUrl": data.per_img2,
			"idCardHoldUrl": data.per_img3,
			"typeId": data.typeId,
			"licenseUrl": data.com_img,
			"verifyCode": data.verifyCode,
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取加盟数据
export function getJoin(){
	return $http({
		url:'/api/AccountApply/getApplyInfo',
		method:'GET',
		data:{
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//分享注册人数
export function getshareNum(){
	return $http({
		url:'/api/UserAssets/Index',
		method:'GET',
		data:{
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取是否提示加盟审核失败
export function getApplyTips(s){
	let url = '';
	if(s && s == 2){
		url = '/api/AccountApply/getApplyTips?status=2'
	}else{
		url = '/api/AccountApply/getApplyTips'
	}
	return $http({
		url:url,
		method:'GET',
		data:{
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取抽奖次数
export function getLuckNum(PageIndex,PageSize) {
	return $http({
		url:'/api/luck/IndexFrom',
		method:'POST',
		data:{
			"PageSize": PageSize || 10,
			"PageIndex": PageIndex || 1,
			"Sorts": [
				// {
				// 	"Key": "string",
				// 	"Sort": 0
				// }
			],
			"Conditions": [
				{
					"Conditions": [
						{
							"Key": "status",
							"Value": 0,
							"WhereType": 1
						}
					],
					"ConditionType": "and"
				}
			]
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取中奖记录
export function getLuckList(PageIndex,PageSize) {
	return $http({
		url:'/api/luck/IndexFrom',
		method:'POST',
		data:{
			"PageSize": PageSize || 10,
			"PageIndex": PageIndex || 1,
			"Sorts": [
				// {
				// 	"Key": "string",
				// 	"Sort": 0
				// }
			],
			"Conditions": [
				{
					"Conditions": [
						{
							"Key": "status",
							"Value": 1,
							"WhereType": 1
						},
						{
							"Key": "isPrize",
							"Value": 1,
							"WhereType": 1
						}
					],
					"ConditionType": "and"
				}
			]
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//抽奖
export function getLuckRes() {
	return $http({
		url:'/api/luck/Draw',
		method:'POST',
		data:{
			
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}

//获取抽奖信息
export function getLuckPrize() {
	return $http({
		url:'/api/luck/GetLuckPrize',
		method:'GET',
		data:{
			
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}