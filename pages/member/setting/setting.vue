<template>
    <view>
        <view class="cell-lists content">
            <view class="item"><text class="fl photo-tit">头像</text><view class="fr photo-img"><open-data type="userAvatarUrl"></open-data></view></view>
            <view class="item"><text class="fl">昵称</text><view class="fr"><open-data type="userNickName"></open-data></view></view>
            <navigator url="/pages/member/login/updateLoginPwd" class=""><view class="item"><span class="fl">修改登录密码</span><span class="fr">></span></view></navigator>
        </view>
        <button v-on:click="loginOut" class="btn-save">退出登录</button>
        <!--<uniList>
            <uniListItem title="头像" showArrow="true"></uniListItem>
            <navigator url="'/pages/member/setting/setNickName">
                <uniListItem title="昵称" showArrow="true"></uniListItem>
            </navigator>
            <navigator url="'/pages/member/setting/updateLoginPwd">
                <uniListItem title="修改登录密码" showArrow="true"></uniListItem>
            </navigator>
        </uniList>-->
    </view>
    
</template>

<script>
    export default {
        name: "setting",
        data() {
            return {
            }
        },
        components: {
        },
        onShareAppMessage(res) {
			return this.$share();
		},
        onLoad(){

        },
        methods:{
            loginOut(){
                let that = this;
                uni.showModal({
                    title: '提示',
                    content: "确认退出登录？",
                    success: function (res) {
                        if (res.confirm) {
                            that.$logOut();
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });

            }
        }
    }
</script>

<style scoped>
    .cell-lists{font-size:28rpx;border-bottom:1rpx solid #eeeeee;}
    .cell-lists .item{padding:30rpx 0;overflow: hidden;width:100%;border-top:1rpx solid #eeeeee;}
    .cell-lists .item .fl{color:#333;}
    .cell-lists .item .fr{color:#666;}
    .photo-tit{
        line-height: 40rpx;}
    .photo-img{
        width: 80rpx;
    }
    .btn-save{position:fixed;bottom:60rpx;width:70%;left:15%;background-color:#ff6000;color:#fff;}
</style>