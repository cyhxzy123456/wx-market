<template>
    <view v-html="content" class="about-content">
关于我们
    </view>
</template>

<script>
    import {GetArticleByCallIndex} from '@/common/ArticleShows.js'
    export default {
        name: "about",
		data(){
			return{
				content:""
			}
		},
        onShareAppMessage(res) {
			return this.$share();
        },
        onLoad(){
            GetArticleByCallIndex('aboutus').then(res => {
                console.log(res);
				this.content = res.Data.Data[0].content
            })
        }
    }
</script>

<style scoped>
.about-content{
padding: 20rpx 40rpx;

}
</style>