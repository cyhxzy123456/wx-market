<template>
	<view>
		<picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
			<view class="picker">
				{{area||"选择所在省份、城市、区县"}}
			</view>
		</picker>
	</view>
  
</template>

<script>
export default {
  data() {
    return {
      title: 'picker',
			region: ['', '', ''],
			customItem: ''
    }
  },
	props: ["area"],
  onReady() {
    if(this.area){
			this.region=this.area.split(",");
		}
  },
	methods:{
		bindRegionChange: function (e) {
			this.region=e.detail.value;
			this.initArea();
		},
		initArea(){
			let area;
			area=this.region[0]+','+this.region[1]+','+this.region[2];
			this.$emit("city",area);
		}
	}
};
</script>

<style scoped>

</style>