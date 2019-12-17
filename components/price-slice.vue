<template>
  <view class="fmt_price">
    ￥<text class="int_p">{{intP}}</text><text class="float_p">{{'.' + floatP}}</text>
  </view>
</template>
<script>
export default {
  props:{
    price:{
      type:[String , Number],
      required:true,
      default:0,
    }
  },
  computed:{
    intP(){
      if(isNaN(this.price)){
        return '0';
      }else{
        this.price = +this.price;
        let str = Number.prototype.toFixed.call(this.price + 0.000000001 , 2);
        // let str = Number.prototype.toString.call(this.price);
        return str.split('.')[0]
      }
    },
    floatP(){
      if(isNaN(this.price)){
        return '00';
      }else{
        this.price = +this.price;
        // let str = Number.prototype.toString.call(this.price);
        let str = Number.prototype.toFixed.call(this.price + 0.000000001 , 2);
        str = str.split('.')[1];
        return str.slice(0,2);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.fmt_price{
  font-size: 26rpx;
  .int_p{
    font-size: 30rpx;
  }
  .float_p{
    font-size: 24rpx;
  }
}
</style>