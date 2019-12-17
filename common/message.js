//消息相关

import $http from "./net.js"


//根据callIndex获取文章分类的数据
export function getCategroyByCallIndex(pageSize,pageIndex,callIndex,accountId){
	return $http({
		url:'/api/ArticleShows/Index?callIndex='+callIndex+'&accountId='+accountId,
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//根据callIndex获取消息列表分页
export function getArticleByCallIndex(pageSize,pageIndex,callIndex){
	return $http({
		url:'/api/ArticleShows/GetArticleByCallIndex',
		method:'POST',
		data:{
			"PageSize": pageSize,
			"PageIndex": pageIndex,
			"Sorts": [],
			"Conditions": [
				{
					"Conditions": [
						{
							"Key": "callIndex",
							"Value": callIndex,
							"WhereType": 0
						}
					],
					"ConditionType": "add"
				}
			]
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//根据id获取文章发布数据
export function getArticleById(id){
	return $http({
		url:'/api/ArticleShows/GetArticleById/'+id,
		method:'GET'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}