<template>
    <view class="content">
        <view class="flex_row select-area">
            <input type="password" placeholder="请输入旧密码" v-model="oldPwd" class="flex1" />
        </view>
        <view class="flex_row select-area">
            <input type="password" placeholder="输入新密码(8~16位字母+数字)" v-model="pwd" class="flex1" />
        </view>
        <view class="flex_row select-area">
            <input type="password" placeholder=" 再次输入新密码(8~16位字母+数字)" v-model="pwd2" class="flex1" />
        </view>
        <button v-on:click="updateLoginPwd" class="btn-save">保存</button>
    </view>
</template>

<script>
    import {updateLoginPwd} from "@/common/rjm-member.js"
    export default {
        name: "updateLoginPwd",
        data(){
            return {
                oldPwd:'',
                pwd:'',
                pwd2:''
            }
        },
        onShareAppMessage(res) {
			return this.$share();
		},
        onLoad(){},
        methods:{
            updateLoginPwd(){
                var that = this;
                if(this.oldPwd == ""){
                    uni.showModal({
                        title: '提示',
                        content: "旧密码不能为空！",
                        showCancel:false,
                        success: function (res) {

                        }
                    });
                    return;
                }
                if(this.pwd == ""){
                    uni.showModal({
                        title: '提示',
                        content: "新密码不能为空！",
                        showCancel:false,
                        success: function (res) {

                        }
                    });
                    return;
                }
                if(this.pwd !== this.pwd2){
                    uni.showModal({
                        title: '提示',
                        content: "两次密码输入不一致！",
                        showCancel:false,
                        success: function (res) {

                        }
                    });
                    return;
                }
                this.$if0(updateLoginPwd,this.oldPwd,this.pwd).then(res => {

                    uni.showModal({
                        title: '提示',
                        content: "登录密码修改成功！",
                        showCancel:false,
                        success: function (res) {
                            that.$logOut();
                        }
                    });
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
    .btn-save{position:fixed;bottom:60rpx;width:70%;left:15%;background-color:#ff6000;color:#fff;}
    .select-area{
        font-size: 28rpx;color:#495060;border-bottom: 1px solid #eeeeee;position: relative;
        padding: 34rpx 0;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        background: #fff;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        line-height: 1.4;
        overflow: hidden;
    }
</style>