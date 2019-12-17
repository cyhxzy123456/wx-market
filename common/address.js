//地址管理

import $http from "./net.js"

//收货地址分页列表
export function getAddressList(pageIndex, pageSize) {//分页列表
	return $http({
		url: '/api/userReceipt/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			 "Sorts": [
			 ],
			"Conditions": [{
				"Conditions": [
					// {
					//   "Key": "string",
					//   "Value": {},
					//   "WhereType": 0
					// }
				],
				"ConditionType": "and"
			}]
		},
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}
//获取默认地址信息
export function getDefaultAddr(){
	return $http({
		url:'/api/userReceipt/GetMainModel',
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//根据id获取地址信息
export function getAddressInfoById(id){
	return $http({
		url:'/api/userReceipt/GetModelById/' + id,
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//添加地址
export function addAddress(consignee,phoneNumber,postCode,area,address,sortId) {
	return $http({
		url: '/api/userReceipt/Add',
		method: 'POST',
		data: {
			"id": 0,
			"userId": 0,
			"consignee": consignee,
			"phoneNumber": phoneNumber,
			"phoneEncryp": "",
			"postCode": postCode,
			"area": area,
			"address": address,
			"remark": "",
			"sortId": sortId,
			"timeAdd": new Date(),
			"timeUpdate": new Date(),
			"userName": "",
			"agentsId": 0,
			"agentsName": "",
			"staffName": ""
		},
	}).then(res => {
		return res.data
	}).catch(err => {
		return err;
	});
}
//修改地址
export function updateAddress(id,consignee,phoneNumber,postCode,area,address,sortId) {
	return $http({
		url: '/api/userReceipt/Update',
		method: 'POST',
		data: {
			"id": id,
			"userId": 0,
			"consignee": consignee,
			"phoneNumber": phoneNumber,
			"phoneEncryp": "",
			"postCode": postCode,
			"area": area,
			"address": address,
			"remark": "",
			"sortId": sortId,
			"timeAdd": new Date(),
			"timeUpdate": new Date(),
			"userName": "",
			"agentsId": 0,
			"agentsName": "",
			"staffName": ""
		},
	}).then(res => {
		return res.data
	}).catch(err => {
		return err;
	});
}
//根据id删除地址
export function delAddressInfoById(id){
	return $http({
		url:'/api/userReceipt/del?id='+id,
		method:'POST'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//根据id设置默认地址
export function setMainAddressById(id){
	return $http({
		url:'/api/userReceipt/SetMain?id='+id,
		method:'POST'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}