<template>
    <view class="pay-ok-main" v-cloak>
        <view  v-if="detailPay.status==1">
            <view class="icons ico-right"></view>
            <view class="tips" v-if="detailPay.moneyPayReal>0">订单支付成功</view>
            <view class="tips" v-if="detailPay.moneyPayReal==0">下单成功 <view class="pay-zero">已抵扣应付商品金额，无需进行支付，请等待发货</view></view>
            <view class="pay-type" v-if="detailPay.moneyPayReal>0">
                <view class="item"><text class="title">支付方式</text><text class="txt">{{detailPay.payFromName}}</text></view>
                <view class="item"><text class="title">支付金额</text><text class="txt">¥{{detailPay.moneyPayReal}}</text></view>
            </view>
            <view class="flex_row">
                <button class="btns btn-query" size="mini" @click="goLink('/pages/member/orderList/orderList')">查看订单</button>
                <button class="btns btn-goods" size="mini" @click="goTab('/pages/goods/goodsByCategory/goodsByCategory')">随便逛逛</button>
            </view>
        </view>
        <view  v-show="showIntegral" class="mask_bg" @tap="hideIntegral" @touchmove.stop.prevent="">
            <view class="integral"  @tap.stop="">
                <view>您获得{{detailPay.integralSale}}积分</view>
                <view class="btn-cancel">
                    <button class="btn-ok" size="mini" @tap="hideIntegral">确定</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {getOrderDetlle} from "@/common/order.js"
    export default {
        name: "payOk",
        data(){
            return {
                time:2,
                timer:null,
                showIntegral:false,
                orderId:'',
                detailPay:{},
                integralSale:0,
                payMoney:0,
                payFromName:""
            }
        },
        onLoad(opt){
            console.log("payOk opt",opt)
            if(opt.orderId){
                this.orderId=opt.orderId;
                this.getOrderById();
            }
        },
        methods:{
            goLink(url){
                uni.redirectTo({
                    url:url
                })
            },
            goTab(url){
                uni.switchTab({
                    url: url
                });
            },
            hideIntegral(){
                this.showIntegral=false;
            },
            getOrderById(){
                let that = this;
                this.$if0(getOrderDetlle , this.orderId).then(res => {
                    this.detailPay=res.Data;
                   this.integralSale=res.Data.integralSale;
                   this.payMoney=res.Data.moneyPayReal;
                   this.payFromName =res.Data.payFromName;
                   if(this.integralSale==0){
                       this.showIntegral=false;
                   }else {
                       this.showIntegral=true;
                       that.timer=setInterval(function () {
                           that.time--;
                           if(that.time==0){
                               that.showIntegral=false;
                               clearInterval(that.timer);
                               return;
                           }
                       },1000)
                   }
                }).catch(err => {
                    console.log(err);
                    this.$errToast(err);
                })
            }
        }

    }
</script>

<style scoped>
    [v-cloak]{
        display: none;
    }
    .pay-ok-main{text-align:center;padding:40rpx 0rpx;}
    .pay-ok-main .icons{width:120rpx;height: 120rpx;margin:0 auto;}
    .pay-ok-main .icons.ico-right{background:url(../../../static/order/finishedIcon.png)no-repeat center;background-size:auto 100%;}
    .pay-ok-main .tips{text-align:center;padding:40rpx 0rpx;
        font-size: 32rpx;}
    .mask_bg{
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(0,0,0,0.6)
    }
    .mask_bg .integral{
        position: fixed;
        top: 40%;
        width: 80%;
        padding: 40rpx;
        border-radius: 15rpx;
        box-shadow: 0rpx 0rpx 50rpx #DDDDDD;
        box-sizing: border-box;
        background-color: #FFFFFF;
        text-align: center;
        left: 10%;
    }
    .mask_bg .integral .btn-cancel{padding-top:20rpx;}
    .pay-type{width: 400rpx;
		margin: 0 auto;
		text-aligin: left;
		font-size: 28rpx;
		padding-bottom: 40px;
		
		}
		.pay-type .item+.item{margin-top:20rpx;}
		.pay-type .item:first-child .title{background:url(../../../static/order/yinlian.png)no-repeat left;background-size: 40rpx auto;}
		.pay-type .item:last-child .title{background:url(../../../static/order/ico-pay.png)no-repeat left;background-size: 40rpx auto;}
    .pay-type .title{
        display: inline-block;min-width:150rpx;margin-right:20rpx;padding-left:60rpx;}
    .pay-type .txt{
        display: inline-block;min-width:160rpx;text-align: left;color:red;}
		.btns{width:280rpx;height:80rpx;line-height:80rpx;}
    .pay-zero{font-size:24rpx;padding-top:30rpx;}
    .btn-ok{background-color:#FF6000;color:#FFFFFF;}
</style>