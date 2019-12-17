//商品相关

import $http from "./net.js"


export function getGoods(pageIndex, pageSize) {
	return $http({
		url: '/api/goods/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			//  "Sorts": [
			// {
			//   "Key": "string",
			//   "Sort": 0
			// }
			//  ],
			"Conditions": [{
				"Conditions": [
					{
					  "Key": "status",
					  "Value": 0,
					  "WhereType": 1
					}
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

//超值商品
export function getCheapGoods(pageIndex, pageSize) {
	return $http({
		url: '/api/goods/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			 "Sorts": [{
				"Key": "sortId ",
				"Sort": 0
			}],
			"Conditions": [{
				"Conditions": [
					{
					  "Key": "recommend",
					  "Value": 4,
					  "WhereType": 1
					},
					{
					  "Key": "status",
					  "Value": 0,
					  "WhereType": 1
					}
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

//热销商品
export function getHotGoods(pageIndex, pageSize) {
	return $http({
		url: '/api/goods/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			 "Sorts": [{
				"Key": "sortId ",
				"Sort": 0
			}],
			"Conditions": [{
				"Conditions": [
					{
					  "Key": "recommend",
					  "Value": 1,
					  "WhereType": 1
					},
					{
					  "Key": "status",
					  "Value": 0,
					  "WhereType": 1
					}
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

//置顶商品
export function getTopGoods(pageIndex, pageSize) {
	return $http({
		url: '/api/goods/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			 "Sorts": [{
				"Key": "sortId ",
				"Sort": 0
			}],
			"Conditions": [{
				"Conditions": [
					{
					  "Key": "recommend",
					  "Value": 3,
					  "WhereType": 1
					},
					{
					  "Key": "status",
					  "Value": 0,
					  "WhereType": 1
					}
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

//推荐商品
export function getGoodsYou(pageIndex, pageSize) {
	return $http({
		url: '/api/goods/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			"Sorts": [{
				"Key": "sortId ",
				"Sort": 0
			}],
			"Conditions": [{
				"Conditions": [
					{
					  "Key": "recommend",
					  "Value": 2,
					  "WhereType": 1
					},
					{
					  "Key": "status",
					  "Value": 0,
					  "WhereType": 1
					}
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

//获取全部商品分类
export function getCategory() {
	return $http({
		url: '/api/ArticleShows/getCategoryGoods',
		method: 'POST',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//根据分类获取商品
//
export function getGoodsByCategory(pageIndex, pageSize, category, sort) {
	let sortArr = [];
	let conditions = [];
	if(category) conditions.push(
		{
			"Key": "categoryName",
			"Value": category,
			"WhereType": 1
		},
		{
			"Key": "status",
			"Value": 0,
			"WhereType": 1
		}
	)
	if(sort){
		sortArr = sort;
	}
	return $http({
		url: '/api/goods/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			"Sorts": sortArr,
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

//根据关键字搜索商品
export function searchGoods(pageIndex, pageSize, key, sort){
	let sortArr = [];
	let conditions = [];
	if(key) conditions.push(
		{
			"Key": "title",
			"Value": key,
			"WhereType": 0
		},
		{
			"Key": "status",
			"Value": 0,
			"WhereType": 1
		}
	)
	if(sort){
		sortArr = sort;
	}
	return $http({
		url: '/api/goods/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			"Sorts": sortArr,
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

//获取商品详情
export function goodsDetail(goodsId) {
	return $http({
		url: '/api/goods/GetGoodsById/' + goodsId,
		method: 'GET',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//获取商品评价
export function GetGoodsCommentById(goodsId , pageIndex , pageSize){
	return $http({
		url: '/api/goods/GetGoodsCommentById',
		method: 'POST',
		data: {
			"PageSize": pageSize || 2,
			"PageIndex": pageIndex || 1,
			"Sorts": [],
			"Conditions": [{
				"Conditions": [
					{
					  "Key": "goodsId",
					  "Value": goodsId,
					  "WhereType": 1
					}
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

//购物车商品数量
export function userCartNum(){
	return $http({
		url: '/api/userCart/GetOrderTobePay',
		method: 'GET',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//加入购物车
export function addUserCart(data) {
	return $http({
		url: '/api/userCart/Add',
		method: 'POST',
		data:{
			"id": 0,
			"userId": data.userId,
			"goodsId": data.goodsId,
			"skuId": data.skuId,
			"quantity": data.quantity,
			"timeAdd": new Date(),
			"goodsTitle": data.goodsTitle,
			"goodsLogo": data.goodsLogo,
			"skuInfo": data.sku,
			"userName": data.userName,
			"agentsId": data.agentsId,
			"agentsName": data.agentsName,
			"staffName": data.staffName
		}
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//收藏商品
export function addCollect(data){
	return $http({
		url: '/api/userCollect/Add',
		method: 'POST',
		data:{
			"id": 0,
			"userId": data.userId,
			"goodsId": data.goodsId,
			// "skuId": data.skuId,
			"timeAdd": new Date(),
			"goodsTitle": data.goodsTitle,
			"goodsLogo": data.goodsLogo,
			"skuInfo": data.sku,
			"userName": data.userName,
			"agentsId": data.agentsId,
			"agentsName": data.agentsName,
			"staffName": data.staffName
		}
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//取消商品收藏
export function delCollect(id){
	return $http({
		url: '/api/userCollect/del?goodsId=' + id,
		method: 'POST',
		data:{
			
		}
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//获取商品收藏状态
export function isCollect(id){
	return $http({
		url: '/api/userCollect/isCollect?goodsId=' + id,
		method: 'GET',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//获取单个商品好评率
export function CommentPraise(goodsId){
	return $http({
		url: '/api/goods/GetGoodsCommentPraise?goodsId=' + goodsId,
		method: 'POST',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//获取奖品记录
export function GetBonusList(pageIndex , pageSize){
	return $http({
		url: '/api/goods/GetBonusList',
		method: 'POST',
		data: {
			"PageSize": pageSize || 30,
			"PageIndex": pageIndex || 1,
			"Sorts": [{
				"Key": "timeAdd",
      	"Sort": 1
			}],
			"Conditions": [{
				"Conditions": [
					{
					  "Key": "bonusFrom",
					  "Value": '1,2,7',
					  "WhereType": 2
					}
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
