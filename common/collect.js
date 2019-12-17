//收藏商品相关

import $http from "./net.js"

//获取收藏商品列表分页
export function getCollectList(pageSize,pageIndex){
	return $http({
		url:'/api/userCollect/Index',
		method:'POST',
		data:{
		 "PageSize": pageSize || 10,
		 "PageIndex": pageIndex || 1,
		  "Sorts": [
		  ],
		 "Conditions": [{
		 	"Conditions": [],
		 	"ConditionType": "and"
		 }]
		}
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//根据id删除收藏商品
export function delCollect(id){
	return $http({
		url:'/api/userCollect/del?goodsId='+id,
		method:'POST'
	}).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}