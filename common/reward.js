//奖金信息
import $http from "./net.js"
//奖金概览
export function getRewardInfo(serviceId) {
	if(serviceId){
		var url = '/api/userBonus/getInfo?serviceId='+serviceId+'&bonusFrom=1,2'
		
	}else{
		var url = '/api/userBonus/getInfo'
	}
	return $http({
		url: url,
		method: 'GET'
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//奖金分页列表
export function getRewardList(pageIndex,pageSize,parameters) {
	
	return $http({
		url: '/api/userBonus/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			"Conditions": [{
				"Conditions":parameters,
				"ConditionType": "and"
			}]
		},
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//对子分页列表
export function getCouPle(pageIndex,pageSize) {
	return $http({
		url: '/api/userPairs/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			"Conditions": [{
				"ConditionType": "and"
			}]
		},
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}

//未匹配对子
export function getNoCouPle(pageIndex,pageSize) {
	return $http({
		url: '/api/userPairs/IndexGoods',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			"Conditions": [{
				"ConditionType": "and"
			}]
		},
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
