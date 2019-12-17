<template>
    <view class="bg-grey">
        <view class="msg-list">
            <view class="msg-tit">{{msgData.title}}</view>
            <view class="author bottom-line">{{msgData.timeAdd}}</view>
            <view class="msg-txt"><rich-text :nodes="msgData.content"></rich-text></view>
        </view>
    </view>
</template>

<script>
    import {getArticleById} from "@/common/message.js"
    export default {
        data() {
            return {
                id:'',
                msgData:{}
            }
        },
        components: {
        },
        onShareAppMessage(res) {
			return this.$share();
		},
        onLoad(option){
            if(option.id){
                this.id=option.id;
                this.getArticleById();
            }else{
                uni.showModal({
                    title: '提示',
                    content: '无此数据！',
                    showCancel:false,
                    success: function (res) {

                    }
                });
            }
        },
        methods:{
            getArticleById(){
                this.$if0(getArticleById,this.id).then(res => {
                    this.msgData=res.Data;
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
    .bg-grey{background: #eeeeee;}
    .bottom-line{border-bottom:1rpx solid #dddddd;}
    .msg-list{padding:20rpx 20rpx 0;line-height:1.75;margin-top: 20rpx;
        background: #ffffff;}
    .msg-list .msg-tit{font-size: 26rpx;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;}
    .msg-list .msg-txt{font-size:28rpx;overflow: hidden;}
    .msg-list .author{font-size:26rpx;color:#666666;
        padding-bottom: 10rpx;}
</style>