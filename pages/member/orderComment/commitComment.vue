<template>
	<view class="commitComm_main">
		<view class="uni-flex uni-row order_goods_info" v-for="item in detailById" :key="item.id">
			<view class="flex-item order_goods_img">
				<image :src="item.logo" mode=""></image>
			</view>
			<view class="flex-item goods_info">
				<p class="goods_title">{{item.goodsTitle}}</p>
				<text class="goods_intr">{{item.skuInfo|sku}}</text>

			</view>
		</view>
		<view class="rate">
			<view class="fl">商品评分（请选择星级）</view>
			<view class="fr">
				<iRate @change="onChangeRate" :value="publishData.score">
				</iRate>
			</view>
		</view>
		<!--<view  class="comment_txt">
            <textarea placeholder="宝贝是否满足了你的期待？说说你的使用心得分 享给其它想风买的朋友吧。" v-model="comment" auto-height="true" />
        </view>-->

		<view class=" comment_txt">
			<textarea placeholder="宝贝是否满足了你的期待？说说你的使用心得分享给其他想购买的朋友吧。"  :show-confirm-bar='false'   @input = "descInput" maxlength="100" v-model="publishData.content" />
			<view class="num">{{remnant}}/100</view>
		</view>
        <button v-on:click="addOrderComment" class="btn-save">提交</button>
    </view>
</template>

<script>
    import iRate from 'iview-mpvue/dist/components/rate/rate'
    import {addOrderComment} from "@/common/rjm-comment.js"
    export default {
        name: "commitComment",
        data(){
            return {
                content:'',
				remnant:0,
				sku:'',
				skuObj:'',
				detailById:[],
                publishData:{
					score: 0,
					scoreDesc: 0,
					scoreService: 0,
					scoreExpress: 0,
					content: '',
					}
            }
        },
        components:{
            iRate
        },
        onShareAppMessage(res) {
			return this.$share();
		},
        onLoad(option){
			console.log(JSON.parse(option.info));
            let goodsInfo=JSON.parse(option.info);
            if(goodsInfo){
				if(goodsInfo instanceof Array){
					 this.detailById=goodsInfo;
				}else{
					this.detailById.push(goodsInfo);
				}
				// for(let m=0;m<this.detailById.length;m++){
				// 	this.sku = JSON.parse(goodsInfo[m].skuInfo);
				// 	for(let key in this.sku){
				// 		this.skuObj=key + ':' + this.sku[key];
				// 	}
				// }
            }
        },
        methods:{
            onChangeRate(e){
				this.publishData.score = e.index;
				this.publishData.scoreDesc= e.index;
				this.publishData.scoreService= e.index;
				this.publishData.scoreExpress= e.index;
            },
			descInput(e){
				//console.log(e)
				this.remnant = e.detail.value.length
			 },
            addOrderComment(){
                if(this.publishData.score==0){
                    uni.showModal({
                        title: '提示',
                        content: "请选择星级！",
                        showCancel:false,
                        success: function (res) {

                        }
                    });
                    return;
                }
                if(this.publishData.content==''){
                    uni.showModal({
                        title: '提示',
                        content: "请填写商品评价！",
                        showCancel:false,
                        success: function (res) {

                        }
                    });
                    return;
                }
				if(this.publishData.content.length>100){
				    uni.showModal({
				        title: '提示',
				        content: "填写内容不能超过100个字符！",
				        showCancel:false,
				        success: function (res) {
				
				        }
				    });
				    return;
				}
                this.$if0(addOrderComment,Object.assign(this.detailById[0], this.publishData)).then(res => {
                    uni.showModal({
                        title: '提示',
                        content: "发布成功！",
                        showCancel:false,
                        success: function (res) {
							uni.$emit("refreshed");
                            uni.redirectTo({
                                url: "/pages/member/orderComment/orderComment?status=true"
                            });
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
        },
		filters:{
			sku:function(data){
				let skuData=JSON.parse(data);
				for(let key in skuData){
					return key + ':' + skuData[key];
				}
			}
		}
    }
</script>

<style scoped>
    .commitComm_main{padding:30rpx;
        font-size: 28rpx;}
    .order_goods_info{height: 160rpx;
        padding: 20rpx 0;}
    .order_goods_img{
        width: 20%;
        height: 20vw;
        border: 1px solid #007AFF;
        float: left;
    }
    .order_goods_img  image{
        width: 100%;
        height: 100%;
    }
    .goods_info{
        width: 60%;
        padding: 0 30rpx;
        float: left;
        height: 100%;
        position: relative;
    }
    .goods_info .goods_title{
        font-size: 26rpx;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .goods_info .goods_intr{
        font-size: 20rpx;
        color: #666;
    }
    .rate{
        padding:20rpx;
        line-height: 40rpx;
        overflow: hidden;
        border: 1rpx solid #dddddd;
        -webkit-border-radius: 30 rpx;
        -moz-border-radius: 30 rpx;
        border-radius:30 rpx;}
    .comment_txt{
		position: relative;
        margin-top:20rpx;
        width: 99%;
        padding:20rpx 0;
        border: 1rpx solid #dddddd;
        -webkit-border-radius: 30 rpx;
        -moz-border-radius: 30 rpx;
        border-radius: 30 rpx;
        text-indent: 40rpx;
        line-height: 60rpx;
    }
    .comment_txt textarea{width:90%;margin:0 auto;}
	.comment_txt .num{
		position: absolute;
		right: 20rpx;
		bottom: -5rpx;
	}
    .btn-save{position:fixed;bottom:60rpx;width:70%;left:15%;background-color:#ff6000;color:#fff;}
</style>
