//文章数据

import $http from "./net.js"

//首页轮播图
export function adListIndex() {
	return $http({
		url: '/api/ArticleShows/GetadBycallIndex?callIndex=2',
		method: 'GET',
		data: {

		},
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}

//热门搜索
export function searchHotKey() {
	return $http({
		url: '/api/ArticleShows/GetCategoryChildren?callIndex=hotkey&accountId=0',
		method: 'GET',
		data: {

		},
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}

//根据id获取文章数据
export function GetArticleById(id) {
	return $http({
		url: '/api/ArticleShows/GetArticleById/' + id,
		method: 'GET',
		data: {

		},
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}

//根据callIndex获取文章发布数据
export function GetArticleByCallIndex(callindex) {
	return $http({
		url: '/api/ArticleShows/GetArticleByCallIndex',
		method: 'POST',
		data: {
			"PageSize": 10,
			"PageIndex": 1,
			"Sorts": [

			],
			"Conditions": [{
				"Conditions": [{
					"Key": "callIndex",
					"Value": callindex,
					"WhereType": 1
				}],
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

//根据callindex获取类别信息
export function GetClassBycallIndex(callindex) {
	return $http({
		url: '/api/ArticleShows/Index?callIndex=' + callindex,
		method: 'GET',
		data: {

		},
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}

//根据callIndex获取下级
export function GetCategoryChildren(callindex) {
	return $http({
		url: '/api/ArticleShows/GetCategoryChildren?callIndex=' + callindex,
		method: 'GET',
		data: {

		},
	}).then(res => {
		return res.data;
	}).catch(err => {
		console.log('err', err);
		return err;
	})
}
