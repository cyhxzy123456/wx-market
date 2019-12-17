//订单列表

import $http from "./net.js"

export function getOrders(pageIndex, pageSize,orderStatus) {//获取订单数据列表
	let conditions = [];
	//console.log(orderStatus)
	if(orderStatus!=10) conditions.push({
		"Key": "status",
		"Value": orderStatus,
		"WhereType": 1
	})
	return $http({
		url: '/api/order/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			 "Sorts": [
			 ],
			"Conditions": [{
				"Conditions": conditions,
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

export function sumbitOrdersInfo(orderArr) {//获取订单数据列表
	return $http({
		url: '/api/order/Confirmed',
		method: 'POST',
		data: orderArr,
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}

//获取订单详数据
export function getOrderDetlle(orderId) {
	return $http({
		url: '/api/order/GetOrderById/'+orderId,
		method: 'GET'
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//获取物流详情数据
export function getLogisticsDetlle(LogisticsId,goodsId) {
	return $http({
		url: '/api/order/GetOrderExpressById/'+LogisticsId+'/'+goodsId+'',
		method: 'GET'
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//我要催单
export function needReminder(LogisticsId) {
	return $http({
		url: '/api/order/Reminder/'+LogisticsId,
		method: 'POST'
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//取消订单
export function cancelOrderBtn(orderId) {
	return $http({
		url: '/api/order/Cancel/'+orderId,
		method: 'POST'
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//删除订单
export function delectOrderBtn(orderId) {
	return $http({
		url: '/api/order/Delete/'+orderId,
		method: 'POST'
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//下单
export function addOrderDo(orderArr) {
	return $http({
		url: '/api/order/Add',
		method: 'POST',
		data:orderArr
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//确认收货
export function ConfirmReceipt(orderId,goodsId) {
	return $http({
		url: '/api/order/ConfirmReceipt/'+orderId+'/'+goodsId,
		method: 'POST'
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}