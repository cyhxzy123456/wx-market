<template>
    <view class="content protocol">
        <view class="title">{{title}}</view>
        <rich-text :nodes="content"></rich-text>
    </view>
</template>

<script>
    import {getProtocol} from "@/common/member.js"
    export default {
        name: "protocol",
        data(){
            return {
                callIndex:"",
                title:'',
                content:'暂无此协议'
            }
        },
        onShow(){

        },
        onLoad(option){
            if(option.callIndex){
                this.callIndex=option.callIndex;
                this.getProtocol();
            }
        },
        methods:{
            getProtocol(){
                this.$if0(getProtocol,this.callIndex).then(res => {
                    this.title=res.Data.title;
                    this.content=res.Data.content;
                }).catch(err=>{
                    uni.showModal({
                        title: '提示',
                        content: err.Message,
                        showCancel:false,
                        success: function (res) {

                        }
                    });
                })
            }
        }
    }
</script>

<style scoped>
    .protocol{
        font-size: 28rpx;}
.title{
    line-height: 95rpx;border-bottom:1rpx solid #eeeeee;text-align:left;}
</style>