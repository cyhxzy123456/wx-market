//订单列表

import $http from "./net.js"

export function getCartLists(pageIndex, pageSize) {//分页列表
	return $http({
		url: '/api/userCart/Index',
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
//删除
export function deletCart(goodId) {
	return $http({
		url: '/api/userCart/del',
		method: 'POST',
		data:{id:goodId}
	},true).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//获取赚钱攻略文章
export function getAgreeMent(articalData) {
	return $http({
		url: '/api/ArticleShows/GetAgreeMent',
		method: 'POST',
		data:articalData
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}