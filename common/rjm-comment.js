//订单评价相关

import $http from "./net.js"

//获取订单已评价列表
export function getOrderComment(pageIndex,pageSize){
    return $http({
        url:'/api/orderComment/Index',
        method:'POST',
        data:{
            "PageSize":pageSize||10,
            "PageIndex": pageIndex||1,
            "Sorts": [],
            "Conditions": [
                {
                    "Conditions": [],
                    "ConditionType": "and"
                }
            ]
        }
    }).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//获取订单待评价列表
export function getWaitComment(pageIndex,pageSize){
    return $http({
        url:'/api/order/IndexWaitCommnet',
        method:'POST',
        data:{
            "PageSize":pageSize||10,
            "PageIndex": pageIndex||1,
            "Sorts": [],
            "Conditions": [
                {
                    "Conditions": [],
                    "ConditionType": "and"
                }
            ]
        }
    }).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}
//发布订单评价
export function addOrderComment(submitData){
    return $http({
        url:'/api/orderComment/Add/',
        method:'POST',
        data:submitData
    }).then(res => {return res.data}).catch(err => {console.log('err',err); return err;});
}