//积分数据
import $http from "./net.js"

//积分概览
export function getCreditInfo(integralFrom) {
	return $http({
		url: '/api/userIntegral/getInfo',
		method: 'GET',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
//积分列表
export function getCreditList(pageIndex,pageSize,value) {
	let conditions = []
	if(value==1){
	conditions =[
			// {
			//   "Key": "integralValue",
			//   "Value": 0,
			//   "WhereType": 5
			// },
			{
			  "Key": "integralFrom",
			  "Value": '1,2,3,8,9',
			  "WhereType": 2
			}
		]
	}else{
		conditions =[
				// {
				//   "Key": "integralValue",
				//   "Value": 0,
				//   "WhereType": 3
				// },
				{
				  "Key": "integralFrom",
				  "Value": '4,5,6,7,10,11',
				  "WhereType": 2
				}
			]
	}
	return $http({
		url: '/api/userIntegral/Index',
		method: 'POST',
		data: {
			"PageSize": pageSize || 10,
			"PageIndex": pageIndex || 1,
			"Conditions": [{
				"Conditions": conditions,
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

//获取单个记录信息
export function getCreditDetail(id) {
	return $http({
		url: '/api/userIntegral/GetModelById?'+id,
		method: 'GET',
	}).then(res => {
		return res.data
	}).catch(err => {
		console.log('err', err);
		return err;
	});
}
