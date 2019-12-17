<template>
    <view class="comment-main content">
        <view class="tabs flex_row">
            <view @tap="selectSort(0)" :class="{ tab_active:sortKey == 0}" class="tab flex1 txt_c" >
                <view class="item">待评价</view>
            </view>
            <view @tap="selectSort(1)"  :class="{ tab_active:sortKey == 1}" class="tab flex1 txt_c">
                <view class="item">已评价</view>
            </view>
        </view>
        <view v-show="sortKey==0">
            <commentGood :faBuComment="faBuComment" :list="waitCommentList"></commentGood>
            <i-load-more :tip="waitLoadTip" @tap="getWaitComment" :loading="waitLoading" v-if="isShowWaitComment" />
        </view>
        <view v-show="sortKey==1">
            <commentGood :showComment="showComment" :list="commentList"></commentGood>
            <i-load-more :tip="loadTip" @tap="getOrderComment" :loading="loading" v-if="isShowComment" />
        </view>
    </view>
</template>

<script>
    import iLoadMore from 'iview-mpvue/dist/components/load-more/load-more'
    import commentGood from "@/components/order-comment.vue"
    import {getOrderComment,getWaitComment} from "@/common/rjm-comment.js"
    export default {
        name: "orderComment",
        data(){
            return {
                isShowWaitComment:true,
                isShowComment:true,
				faBuComment:true,//待评价
				showComment:true,//已经评价
                waitLoading:false,
                waitLoadTip:'查看更多',
                waitHasMore:true,
                loading:false,
                loadTip:'查看更多',
                hasMore:true,
                sortKey:0,
                pageIndex:1,
                waitPageIndex:1,
                pageSize:10,
                waitCommentList:[],
                commentList:[]
            }
        },
        components: {
            'i-load-more': iLoadMore,
            commentGood
        },
        onShareAppMessage(res) {
			return this.$share();
		},
        onLoad(opt){
			//console.log(opt)
			if(opt.status){
				this.faBuComment=true;
			}
            this.getOrderComment();
            this.getWaitComment();
        },
        methods:{
            selectSort(i){
                this.sortKey=i;
            },
            getOrderComment(){
                if(!this.hasMore){
                    return;
                }
                this.loading = true;
                this.$if0(getOrderComment,this.pageIndex,this.pageSize).then(res => {
                    this.loading = false;
                    if(res.Data.Data.length>0){
                        this.commentList = this.commentList.concat(res.Data.Data);
                        this.isShowComment=this.pageIndex*this.pageSize<res.Data.PageCount;
                        this.pageIndex++;
                    }else {
                        this.hasMore = false;
                        this.loadTip = '暂无数据'
                    }
                }).catch(err=>{
                    uni.showModal({
                        title: '提示',
                        content: err.Message,
                        showCancel:false,
                        success: function (res) {

                        }
                    });
                })
            },
            getWaitComment(){
                if(!this.waitHasMore){
                    return;
                }
                this.waitLoading = true;
                this.$if0(getWaitComment,this.waitPageIndex,this.pageSize).then(res => {
                    this.waitLoading = false;
                    if(res.Data.Data.length>0){
                        this.waitCommentList = this.waitCommentList.concat(res.Data.Data);
                        this.isShowWaitComment=this.waitPageIndex*this.pageSize<res.Data.PageCount;
                        this.waitPageIndex++;
                    }else {
                        this.waitHasMore = false;
                        this.waitLoadTip = '暂无数据'
                    }
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
    .comment-main{font-size: 28rpx;}
    .tabs{
        border-bottom: 1rpx solid #eeeeee;
    }
    .tab{text-align: center;
        line-height: 50rpx;}
    .tab .item{width:50%;margin:0 auto;}
    .tab_active .item{
        padding:20rpx 0;
        line-height: 50rpx;
        color:#FF6000;
        border-bottom:1rpx solid #ff5934;
    }
</style>