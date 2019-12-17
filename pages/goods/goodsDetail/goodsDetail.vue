<template>
	<view class="page">
		<view class="status_bar">
		</view>
			<uni-nav-bar @click-left='nav_self' :left-icon="nav_ico"  title="商品详情"></uni-nav-bar>
		<view class="content no_data_wrap" v-if="detail && detail.id && detail.status != 0">
			<image class="no_data" src="/static/ico/ico-noGoods.png"></image>
			商品已经下架了...
		</view>
		<view v-if="detail && detail.status == 0">
			<view class="content">
				<view class="top_tabs flex_row">
					<view @click="tapScroll('goods')" :class="{active_color:posi1 == 'goods'}" class="top_tab flex_a">
						商品
					</view>
					<view @click="tapScroll('pj')" :class="{active_color:posi1 == 'pj'}"  class="top_tab flex_a">
						评价
					</view>
					<view @click="tapScroll('detail')" :class="{active_color:posi1 == 'detail'}"  class="top_tab flex_a">
						详情
					</view>
				</view>
			</view>
			<scroll-view scroll-y="true" :scroll-into-view="posi" class="scroll-Y" @scroll="scroll">
				<view class="content">
					<swiper id="goods" :indicator-dots="true" circular :autoplay="true" :interval="5000" :duration="1000">
						<swiper-item v-for="l in logoList" :key="l">
							<view class="swiper-item">
								<image class="ad_list" :src="l" mode="scaleToFill"></image>
							</view>
						</swiper-item>
					</swiper>
					<view class="goods_title" v-if="detail">
						{{detail.title ? detail.title : ''}}
					</view>
					<view class="goods_zhaiyao" v-if="detail">
						{{detail.zhaiyao ? detail.zhaiyao : ''}}
					</view>
					<view class="goods_price txt_c" v-if="detail">
						<!-- ￥{{detail.priceSale}} -->
						<price-slice :price="detail.priceSale"></price-slice>
					</view>
					<view class="gf_wrap border_top flex_row" v-if="detail.commissRef1 > 0 || detail.commissRef2 > 0">
						<view class="gf flex_a">
							分享赚钱
						</view>
						<!-- <text class="flex_a">新用户下单，准现金奖励</text> -->
						<view class="flex_a zqgl" url="/pages/index/activityRules/activityRules">分享奖金：<text v-if="detail.commissRef1 > 0">一级{{detail.commissRef1}}元</text><text v-if="detail.commissRef2 > 0">，二级{{detail.commissRef2}}元</text></view>
					</view>
					<view class="gf_wrap border_top flex_row">
						<view class="flex_a txt_point"><view class="ico_right"></view>包邮</view>
						<view class="flex_a txt_point"><view class="ico_right"></view>不支持退货</view>
						<view class="flex_a txt_point"><view class="ico_right"></view>正品保障</view>
						<view class="flex_a txt_point"><view class="ico_right"></view>商品配送</view>
					</view>
					<view class="gf_wrap border_top flex_row" v-if="contentKey" @click="toShowContent">
						<text class="title">
							商品信息
						</text>
						<text class="mid_info">
							{{contentKey}}
						</text>
						<text class="txt_r">></text>
					</view>
					<view class="gf_wrap border_top flex_row" @tap="toShowMask">
						<text class="title">
							选择规格数量
						</text>
						<!-- <text class="mid_info">
							kjdesweswesweswesweswhqa × 5000
						</text> -->
						<text class="mid_info">
							{{selectSku.skuId == -1 ? '请选择规格数量' : skuObj[selectSku.skuId].skuStr}}
						</text>
						<text class="txt_r">></text>
					</view>
					<view class="gf_wrap advans border_top flex_row" v-if="advantage.length > 0">
						<view class="title">商品优势</view>
						<view v-for="(a , i) in advantage" :key="a">{{(i + 1) + '、' + a}}</view>
					</view>

				</view>
				<view class="line">

				</view>
				<view class="content">
					<view class="gf_wrap border_top flex_row" id="pj">
						<view class="pj">
							宝贝评价<text v-if="pjCount > 0">({{pjCount}})</text>
						</view>
						<view class="pj_all" @tap="toComentAll">
							<text>好评率：{{pjCount > 0 ? haoPing + '%' : '100%'}}></text>
						</view>
					</view>
				</view>
				<view class="content">
					<view class="no_coment" v-if="pjCount <= 0">该商品暂无用户评价</view>
				</view>
				<view class="content">
					<view class="evaluateList" v-for="item in comment.Data" :key='item.id'>
						<view class="user_info">
							<view class="userLogo">
								<image :src="item.avator"></image>
							</view>
							<text>{{item.nickName ? item.nickName : ''}}</text>
						</view>
						<view class="user_evaluate">
							<view class="eva_con">{{item.content}}</view>
							<view class="example-body">
								<uni-rate :size="14" :value="item.score"/>
							</view>
							<text class="eva_time">{{item.timeAdd}}</text>
						</view>
					</view>
				</view>

				<view class="line" id="detail">

				</view>
				<view class="content">
					<view v-if="detail && detail.details" class="rt">
						<rich-text class="rt" :nodes="detail.details"></rich-text>

					</view>
				</view>
				<view class="padding_bottom">
				</view>
			</scroll-view>
		</view>
		<view v-if="showSkuContent" class="mask_bg" @tap="maskClose1" @touchmove.stop.prevent="preventD">
			<scroll-view v-if="showSkuContent" @tap.stop="" class="layer_info">
				<view class="flex_row table" v-for="c in contentInfo" :key="c.value">
					<view class="flex_a tab_d">
						{{c.key}}
					</view>
					<view class="flex_a tab_d1">
						{{c.value}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="showMask" class="mask_bg" @tap="maskClose" @touchmove.stop.prevent="preventD">
			<scroll-view scroll-y="true" class="layer_info" @tap.stop="">
				<view class="flex_a">
					<image :src="detail.logo" mode=""></image>
					<view class="blk_r">
						<view class="goods_name">
							{{detail.title}}
						</view>
						<view class="point">
							已选:{{selectSku.skuName}}
						</view>
						<view class="price">
							￥<text>{{skuObj[selectSku.skuId].priceSale}}</text>
							<!-- <view class="fr iblk">分享赚n元</view> -->
						</view>
					</view>
				</view>
				<view class="title">规格：</view>
				<view v-for="(s , i) in skuRenderArr" :key="i">
					<view class="sku_title">{{s.title}}</view>
					<view class="sku_list flex_row">
						<view class="sku_item flex_a" :class="{active:selectSkuArr[i] == ss}" @tap="tapSku1(i , s.title , ss)"  v-for="ss in s.info" :key="ss">{{ss}}</view>
					</view>
				</view>
				<!-- <view class="sku_list flex_row">
					<view class="sku_item flex_a" :class="{active:selectSku.skuId == s.id}" @tap="tapSku(s.id)"  v-for="s in sku1" :key="s.id">{{s.skuStr}}</view>
				</view> -->
				<view class="title">选择数量</view>
					<uni-number-box :value="selectSku.num" :gtEvent="true" :max="skuObj[selectSku.skuId].quantity || detail.quantity" @change="setNum"></uni-number-box>
					<view class="title">共计：<text>￥{{selectSku.needPay}}</text></view>
					<button type="primary" class="sub" @tap="sukSub">确定</button>
			</scroll-view>
		</view>

		<view class="bottom_padding"></view>
		<view class="bottom_buttons" v-if="detail && detail && detail.status == 0">
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
		
	</view>

</template>

<script>
	import {
		goodsDetail,
		addUserCart,
		addCollect,
		userCartNum,
		isCollect,
		delCollect,
		GetGoodsCommentById,
		CommentPraise,
	} from '@/common/goods.js';
	import { getUserInfo } from '@/common/member.js';
	import {sumbitOrdersInfo} from '@/common/order.js';

	import priceSlice from '@/components/price-slice';
	import uniRate from "@/components/uni-rate";
	import uniGoodsNav from '@/components/uni-goods-nav';
	import uniNumberBox from '@/components/uni-number-box';
	import uniNavBar from "@/components/uni-nav-bar.vue"

	export default {
		data() {
			return {
				id: '',
				nav_ico:'back',
				detail: {},
				sku: [],
				// skuAct: {},
				logoList: [],
				collect:false,
				comment:'',
				showSkuContent:false,
				showMask:false,
				fromCart:false,
				fromBuy:false,
				contentInfo:'',
				contentKey:'',
				advantage:[],
				skuRenderObj:{},
				skuRenderArr:[],
				selectSkuArr:[],
				scroll_top:{
					goods:10,
					pj:30,
					detail:30
				},
				selectSku:{
					skuName:'',
					num:1,
					needPay:0,
					skuId:-1,
				},
				selectSku1:{

				},
				posi:'goods',
				skuObj:'',
				haoPing:0,
				pjCount:0,
				options: [{
					icon: '/static/ico/ico-like.png',
					text: '收藏'
				}, {
					icon: '/static/ico/ico-kf.png',
					text: '客服',
					isKf:true
				}, {
					icon: '/static/ico/ico-usercart1.png',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff8214',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ee5b00',
						color: '#fff'
					}
				]
			}
		},
		computed:{
			posi1(){
				let str = 'goods'
				if(this.scroll_top.goods <= 27){
					str = 'goods'
				}
				if(this.scroll_top.pj <= 27){
					str = 'pj'
				}
				if(this.scroll_top.detail <= 27){
					str = 'detail'
				}
				return str;
			},
			sku1(){
				return this.sku.filter(ele => {
					if(ele.status == 0){
						return true;
					}else{
						return false;
					}
				})
			}
		},
		onShareAppMessage(res) {
			// return this.$share();
			let gData = getApp().globalData;
			let Promote = uni.getStorageSync('Promote') || gData.Promote;
			let opt = {};
			if(Promote){
				opt.path = '/pages/goods/goodsDetail/goodsDetail?id=' + this.id + '&Promote=' + Promote + '&needToHome=1';
			}else{
				opt.path = '/pages/goods/goodsDetail/goodsDetail?id=' + this.id + '&needToHome=1';
			}
			return opt;
		},
		onLoad(opt) {
			let _this = this;
			this.id = opt.id;
			if(opt.needToHome == 1 || getCurrentPages().length <= 1){
				this.nav_ico = 'home';
			}else{
				this.nav_ico = 'back';
			}
			let app = getApp();
			this.$if0(goodsDetail, opt.id).then(res => {
				res.Data.details = res.Data.details.replace(/width\s*:\s*[0-9]+px/g, 'width:100%');
				res.Data.details = res.Data.details.replace(/<([\/]?)(center)((:?\s*)(:?[^>]*)(:?\s*))>/g,'<$1div$3>');
				res.Data.details = res.Data.details.replace(/\<img/gi, '<img class="rich-img" style="width:100%" ');
				res.Data.details = res.Data.details.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig,'style="width:100%;height:auto;display: block;margin:auto"');
				res.Data.details = res.Data.details.replace(/\<p/gi, '<P class="rich-p" ');
				this.detail = res.Data;
				if (res.Data && res.Data.skuListJson) {
					let sku = res.Data.skuListJson;
					if (res.Data.logoList) {
						this.logoList = res.Data.logoList.split(',').slice(1);
					}
					this.sku = JSON.parse(sku);
					let renderSkuObj = {};
					for(let s in this.sku){
						this.sku[s].sku = JSON.parse(this.sku[s].sku);
						let str = '';
						for(let sk in this.sku[s].sku){

									if(renderSkuObj[sk]){
										renderSkuObj[sk][ this.sku[s].sku[sk] ] = this.sku[s].sku[sk];
									}else{
										renderSkuObj[sk] = {};
										renderSkuObj[sk][ this.sku[s].sku[sk] ] = this.sku[s].sku[sk];
									}
							str += this.sku[s].sku[sk] + '-';
						}
						this.sku[s].skuStr = str.slice(0 , str.length - 1);
					}
					for(let k in renderSkuObj){
						this.skuRenderArr.push({
							title:k,
							info:renderSkuObj[k]
						})
					}
					this.skuRenderObj = renderSkuObj;
					this.skuObj = {};
					this.sku.forEach(ele => {
						_this.skuObj[ele.id] = ele;
					});
					if(res.Data.advantage)this.advantage = res.Data.advantage.split(' ');
				}
				if(res.Data && res.Data.content){
					this.contentInfo = JSON.parse(res.Data.content);
					let temArr = [];
					for(let i = 0 ; i < this.contentInfo.length ; i++){
						if(i < 4){
							temArr.push(this.contentInfo[i].key);
						}else{
							break;
						}
					}
					this.contentKey = temArr.join('、');
				}
				if (uni.getStorageSync('access_token')){
					this.isCollect();
					this.GetGoodsCommentById();
				}
			})
			if (uni.getStorageSync('access_token')){
				this.userCartNum();
			}
			this.$if0(CommentPraise , this.id).then(res => {
				this.haoPing = res.Data.haoping;
				this.pjCount = res.Data.count;
			}).catch(err => {
				console.log(err);
			})
		},
		onShow(){
			let _this=this
			let app = getApp();
			if (uni.getStorageSync('access_token')) {
				getUserInfo().then(res => {
					app.globalData.getUserInfo = res;
				})
			}
			if(_this.detail && _this.detail && _this.detail.status == 0){
				var query = wx.createSelectorQuery()
				query.select('#goods').boundingClientRect(res => {
					_this.scroll_top.goods = res.top;
				}).exec()
				query.select('#pj').boundingClientRect(res => {
					_this.scroll_top.pj = res.top;
				}).exec()
				query.select('#detail').boundingClientRect(res => {
					_this.scroll_top.detail = res.top;
				}).exec()
			}
		},
		onReady(){

		},
		methods: {
			preventD(){return false;},
			nav_self(){
				if(this.nav_ico == 'back'){
					uni.navigateBack()
				}else{
					uni.switchTab({
						url:'/pages/index/index'
					})
				}
			},
			tapScroll(s){
				this.posi = s;
			},
			scroll(e){
				let _this = this;
				this.posi = '';
				var query = wx.createSelectorQuery()
				query.select('#goods').boundingClientRect(res => {
					_this.scroll_top.goods = res.top;
				}).exec()
				query.select('#pj').boundingClientRect(res => {
					_this.scroll_top.pj = res.top;
				}).exec()
				query.select('#detail').boundingClientRect(res => {
					_this.scroll_top.detail = res.top;
				}).exec()
			},
			toComentAll(){
				uni.navigateTo({
					url: '/pages/goods/userEvaluate/userEvaluate?id=' + this.detail.id
				})
			},
			toShowContent(){
				this.showSkuContent = true;
			},
			maskClose1(){
				this.showSkuContent = false;
			},
			sukSub(){
				if(this.fromBuy){
					this.toBuy();
				}else if(this.fromCart){
					this.addUserCart();
				}
				if(this.selectSku.skuId == -1){
					this.$toast('请选择规格');
				}else{
					this.maskClose();
				}
			},
			toBuy(){
				if(this.selectSku.skuId != -1){
					if(+this.selectSku.num > +this.skuObj[this.selectSku.skuId].quantity){
						this.$toast('商品数量没这么多啦');
						return;
					}
					if(this.skuObj && this.selectSku && this.detail.id){
						let app = getApp();
						// app.globalData.buyList = [
						// 	{
						// 		goodsId:this.detail.id,
						// 		title:this.detail.title,
						// 		logo:this.detail.logo,
						// 		zhaiyao:this.detail.zhaiyao,
						// 		price:this.skuObj[this.selectSku.skuId].priceSale,
						// 		num:this.selectSku.num,
						// 		skuId:this.selectSku.skuId,
						// 	}
						// ]
						let userInfo = app.globalData.getUserInfo;
						if(!userInfo || (userInfo && !userInfo.phoneNumber)){
							this.$logOut();
							return;
						}
						uni.showLoading({
							title:''
						})
						this.$if0(sumbitOrdersInfo,{
							goodsList:[{
								goodsId:this.detail.id,
								skuId:this.selectSku.skuId,
								quantity:this.selectSku.num,
							}]
						}).then(res => {
							uni.hideLoading()
							let app = getApp();
							app.globalData.addOrderData=res.Data;
							uni.navigateTo({
								url: '/pages/member/orderList/confirmOrder'
							});
						}).catch(err => {
							uni.hideLoading()
							console.log(err);
							this.$errToast(err);
						})
						// uni.navigateTo({url:'/pages/member/orderList/confirmOrder?fromGoodsDetail=true'});
					}
				}else{
					this.showMask = true;
					this.fromBuy = true;
				}
			},
			addUserCart() {
				if(this.selectSku.skuId != -1){
					let app = getApp();
					if (uni.getStorageSync('access_token')) {
						if (this.selectSku.skuId) {
							let userInfo = app.globalData.getUserInfo;
							if(!userInfo || (userInfo && !userInfo.phoneNumber)){
								this.$logOut();
								return;
							}
							uni.showLoading({
								title:''
							})
							if(+this.selectSku.num > +this.skuObj[this.selectSku.skuId].quantity){
								this.$toast('商品数量没这么多啦')
							}
							this.$if0(addUserCart , {
								"id": 0,
								"userId": userInfo.id,
								"goodsId": this.detail.id,
								"skuId": this.selectSku.skuId,
								"quantity": this.selectSku.num,
								"goodsTitle": this.detail.title,
								"goodsLogo": this.detail.logo,
								"sku": '',
								"userName": userInfo.userName ? userInfo.userName : userInfo.nickName,
								"agentsId": '0',
								"agentsName": '',
								"staffName": ''
							}).then(res => {
								uni.hideLoading();
								console.log('加购物车', res);
								this.userCartNum();
								this.$successToast('添加成功');
								this.maskClose()
							}).catch(err => {
								uni.hideLoading();
								console.log(err);
								this.$errToast(err);
							})
						} else {
							console.log('提示选择规格')
							this.$toast('提示选择规格');
						}
					} else {
						uni.navigateTo({
							url: '/pages/member/login/login'
						})
					}
				}else{
					this.showMask = true;
					this.fromCart = true;
				}

			},
			toShowMask(){
				this.showMask = true;
			},
			maskClose(){
				this.fromCart = false;
				this.fromBuy = false;
				this.showMask = false;
			},
			setNum(num){
				this.selectSku.num = num;
				// this.selectSku.skuName = num;
				if(this.selectSku.skuId != -1){
					this.selectSku.needPay = (num * this.skuObj[this.selectSku.skuId].priceSale).toFixed(2);
				}

			},

			//规格修改
			tapSku1(i , t , ss){
				let _this = this;
				this.selectSku1[i] = ss;
				this.selectSkuArr[i] = ss;
				let newSkuArr = [];
				// temRObj
				this.sku.forEach(ele => {//筛选符合已选条件的规格设置skuRenderArr
					if(_this.skuRenderArr[0]){
						newSkuArr[0] = _this.skuRenderArr[0];
					}
					if(ele.sku[t] == ss){
						if(_this.skuRenderArr.length > 0){
							for(let j = 1 ; j < _this.skuRenderArr.length ; j++){
								if(j <= i){//上级规格及自身
									newSkuArr[j] = _this.skuRenderArr[j];
								}else{
									if(!newSkuArr[j]){
										newSkuArr[j] = {
											title:_this.skuRenderArr[j].title,
											info:{}
										}
									}
									newSkuArr[j].info[ele.sku[_this.skuRenderArr[j].title]] = ele.sku[_this.skuRenderArr[j].title];
								}
							}
						}
					}
				})
				_this.skuRenderArr = newSkuArr;
				_this.selectSkuArr
				for(let k = i == 0 ? 1 : i ; k < _this.selectSkuArr.length ; k++){//筛选无效选择
					if(_this.skuRenderArr[k].info[_this.selectSkuArr[k]]){

					}else{
						_this.selectSkuArr[k] = '';
					}
				}
				//匹配skuid
				for(let l = 0 ; l < _this.skuRenderArr.length ; l++){
					if( !( _this.selectSkuArr[l] ) ){//无法匹配出skuId
						this.selectSku.skuId = -1;
						this.selectSku.skuName = '';
						this.selectSku.num = 1;
						this.selectSku.needPay = 0;
						return;
					}
				}
				for(let x = 0 ; x < _this.sku.length ; x++){
					let f = false;
					for(let n = 0 ; n < _this.selectSkuArr.length ; n++){
						if(_this.selectSkuArr[n] != _this.sku[x].sku[ _this.skuRenderArr[n].title ]){
							f = true;
							break;
						}
					}
					if(!f){//匹配到skuid
						console.log('pipei' , x)
						let tem_id = _this.sku[x].id;
						this.selectSku.skuId = tem_id;
						this.selectSku.skuName = this.skuObj[tem_id].skuStr;
						this.selectSku.num = 1;
						this.selectSku.needPay = (this.selectSku.num * this.skuObj[tem_id].priceSale).toFixed(2);
						break;
					}
				}
			},//规格选择修改


			tapSku(id){
				this.selectSku.skuId = id;
				this.selectSku.skuName = this.skuObj[id].skuStr;
				this.selectSku.num = 1;
				this.selectSku.needPay = (this.selectSku.num * this.skuObj[id].priceSale).toFixed(2);
			},
			GetGoodsCommentById(){
				this.$if0(GetGoodsCommentById,this.id).then(res => {
					console.log(res)
					this.comment = res.Data;
				}).catch(err => {
					this.$errToast(err);
				})
			},
			isCollect(f){//f:1已收藏2未收藏
				if(!f){
					isCollect(this.detail.id).then(res => {
						if(res.Result == 0){
							this.options[0].icon = '/static/ico/ico-like-act.png'
							this.collect = true;
						}else{
							this.options[0].icon = '/static/ico/ico-like.png'
							this.collect = false;
						}
					}).catch(err => {console.log(err)});
				}else if(f == 1){
					this.options[0].icon = '/static/ico/ico-like-act.png'
					this.collect = true;
				}else if(f == 2){
					this.options[0].icon = '/static/ico/ico-like.png'
					this.collect = false;
				}
			},
			userCartNum(){
				this.$if0(userCartNum).then(res => {
					this.options[2].info = res.Data;
				}).catch(err => {
					console.log(err);
				})
			},
			onClick(e){
				switch(e.index){
					case 0:
						console.log('收藏')
						this.collectHandle();
						break;
					case 1:
						console.log('客服')
						break;
					case 2:
						console.log('购物车')
						uni.switchTab({url:'/pages/member/usercart/usercart'});
						break;
				}
			},
			buttonClick(e){
				switch(e.index){
					case 0:
						console.log('加入购物车')
						this.addUserCart()
						break;
					case 1:
						console.log('立即购买')
						this.toBuy();
						break;
				}
			},
			collectHandle(){
				if(this.collect){
					this.delCollect();
				}else{
					this.addCollect();
				}
			},
			addCollect(){
				let app = getApp();
				if (uni.getStorageSync('access_token')) {
					if (this.selectSku.skuId) {
						let userInfo = app.globalData.getUserInfo;
						if(!userInfo.phoneNumber){
							this.$logOut();
							return;
						}
						uni.showLoading({
							title: ''
						});
						this.$if0(addCollect , {
							"id": 0,
							"userId": userInfo.id,
							"goodsId": this.detail.id,
							// "skuId": this.selectSku.skuId,
							// "quantity": this.selectSku.num,
							"goodsTitle": this.detail.title,
							"goodsLogo": this.detail.logo,
							"sku": '',
							"userName": userInfo.userName ? userInfo.userName : userInfo.nickName,
							"agentsId": '0',
							"agentsName": '',
							"staffName": ''
						}).then(res => {
							uni.hideLoading();
							this.$successToast('收藏成功')
							this.isCollect(1);
						}).catch(err => {
							uni.hideLoading();
							console.log(err);
							this.$errToast(err);
						})
					}
				}else{
					uni.navigateTo({
						url: '/pages/member/login/login'
					})
				}

			},
			delCollect(){
				let app = getApp();
				let userInfo = app.globalData.getUserInfo;
				if(!userInfo.phoneNumber){
					this.$logOut();
					return;
				}
				uni.showLoading({
					title: ''
				});
				this.$if0(delCollect , this.detail.id).then(res => {
					uni.hideLoading();
					console.log('取消收藏',res);
					this.$successToast('已取消')
					this.isCollect(2);
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
					this.$errToast(err);
				});
			},

		},
		components: {
			priceSlice,
			uniGoodsNav,
			uniNumberBox,
			uniRate,
			uniNavBar
		}
	}
</script>
<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		.page{
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
	}
</style>

<style lang="scss" scoped>
	.top_tabs {
		justify-content: space-around;
		page-break-after: 0 20rpx;
		padding: 20rpx 0;
		font-size: 36rpx;
		height: 50rpx;
	}
	.scroll-Y{
		height: calc(100vh - 150rpx);
	}
	.active_color{
		color:#ee5b00;
	}

	.padding_bottom{
		height: 180rpx;
		width: 100%;
	}	

	swiper {
		width: 100%;
		height: 710rpx;

		.swiper-item {
			width: 100%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.godos_title {
		font-size: 32rpx;
		line-height: 50rpx;
		color: #333;
	}

	.goods_zhaiyao {
		font-size: 24rpx;
		line-height: 50rpx;
		color: #666;
	}

	.goods_price {
		font-size: 32rpx;
		line-height: 60rpx;
		color: #ee5b00;
		font-weight: 700;
	}

	.border_top {
		height: 96rpx;
		border-top: 1rpx solid #ccc;
	}

	.gf_wrap {
		font-size: 28rpx;
		justify-content: space-between;
		color: #333;
		.gf{
			width: 138rpx;
			height: 40rpx;
			line-height: 40rpx;
			border-radius: 20rpx 0 20rpx 0;
			background-color: #ee5b00;
			text-align: center;
			color: #fff;
			font-size: 28rpx;
			font-weight: 700;
		}
		.zqgl{
			color: #333;
			font-weight: 700;
		}
		.txt_point{
			height: 40rpx;
			vertical-align: middle;
			color: #666;
			.ico_right{
				display: inline-block;
				width: 28rpx;
				height: 28rpx;
				margin-right: 10rpx;
				line-height: 40rpx;
				background-image: url(~@/static/ico/ico-right.png);
				background-position: center;
				background-size: 100%;
				vertical-align: middle;
			}
		}
		.title{
			font-size: 34rpx;
			line-height: 96rpx;
		}
		.mid_info{
			width: 60%;
			color: #666;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
	}

	.advans{
		display: block;
		height: auto;
		padding-bottom: 30rpx;
		.title{
			text-align: left;
		}
		.advan{
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			color: #666;
			font-size: 28rpx;
		}
	}
	
	.layer_info{
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 670rpx;
		height: 800rpx;
		padding: 20rpx;
		background-color: #fff;
		border: 1rpx solid #ccc;
		border-radius: 10rpx;
		overflow-y: scroll;
		.table{
			justify-content: space-between;
			font-size: 28rpx;
			color: #666;
			line-height: 50rpx;
			.tab_d{
				width: 35%;
				height: 50rpx;
				padding-left: 10rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid #ccc;
				border-right: 1rpx solid #ccc;
				border-left: 1rpx solid #ccc;
			}
			.tab_d1{
				width: 65%;
				height: 50rpx;
				padding-left: 10rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid #ccc;
				border-right: 1rpx solid #ccc;
			}
		}
		.table:first-child{
			border-top: 1rpx solid #ccc;
		}
		.title,
		.sku_title{
			margin: 10rpx 0;
			font-size: 30rpx;
			line-height: 40rpx;
		}
		.sku_list{
			justify-content: flex-start;
			flex-flow:wrap;
			.sku_item{
				padding: 10rpx 20rpx;
				margin: 10rpx;
				font-size: 26rpx;
				line-height: 26rpx;
				border-radius: 10rpx;
				background-color: #ccc;
				color:#333;
			}
			.sku_item.active{
				background-color: #ee5b00;
				color: #fff;
			}
		}
		uni-number-box{
			margin: 20rpx 0;
		}
		.sub{
			margin: 20rpx 0;
		}
	}

	.rich-img {
		width: 710rpx;
		margin: 20rpx 0;
	}

	.bottom_buttons{
		width: 100%;
		position: fixed;
		bottom: 0;
	}
	.bottom_padding{
		height: 100rpx;
	}
	.blk_r{
		display: inline-block;
		width: calc(100% - 330rpx);
		margin-left: 20rpx;
		vertical-align: top;
	}
	.mask_bg{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0,0,0,.7)
	}
	image{
		width: 250rpx;
		height: 250rpx;
		background-color: #ccc;
	}
.goods_name{
	line-height: 40rpx;
	height: 50rpx;
	font-size: 30rpx;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.point{
	height: 30rpx;
	margin-top: 40rpx;
	line-height: 30rpx;
	font-size: 24rpx;
	color: #666;
	display: -webkit-box;
	text-overflow:ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.price{
	margin-top: 30rpx;
	height: 40rpx;
	line-height: 40rpx;
	font-size: 30rpx;
	color: #ee5b00;
	font-weight: 700;
}
#pj{
	border-top: none;
}
.pj_all{
	color: #ee5b00;
}
.no_coment{
	font-size: 28rpx;
	text-align: center;
	color: #666;
	padding-bottom: 50rpx;
}

.evaluateList{
	width: 96%;
	height: 165rpx;
	padding: 30rpx 0;
	border-bottom: 1px solid #DDDDDD;
}
.user_info{
	width: 17%;
	float: left;
}
.user_evaluate{
	width: 75%;
	float: left;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding:25rpx;
}
.user_info .userLogo{
	width: 110rpx;
	height: 110rpx;
	background-color: #FFFFFF;
	border-radius: 10rpx;
}
.user_info .userLogo image{
	width: 100%;
	height: 100%;
}
.user_info text{
	font-size: 26rpx;
	color: #333333;
	padding-top: 10rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp:1;
	overflow: hidden;
}
.user_evaluate .eva_con{
	font-size: 26rpx;
	height: 70rpx;
	color: #333;
	margin-bottom: 10rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.user_evaluate .example-body{
	width: 45%;
	float: left;
}
.user_evaluate .eva_time{
	width: 55%;
	float: right;
	text-align: right;
	line-height: 40rpx;
	color: #666666;
	font-size: 22rpx;
}
.no_data_wrap{
	background-color: #fff;
	text-align: center;
	color: #666;
	font-size: 28rpx;
	.no_data{
		display: block;
		margin: 50rpx auto;
		background-color: #fff;
	}
}
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
</style>
