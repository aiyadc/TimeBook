<template>
  <div class="container">
    <div id="system"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import systemRequest from "@/api/system.js"
export default {
  components: {},
  props: {},
  data() {
    return {
      systemChart: null
    };
  },
  watch: {},
  computed: {},
  created() {
    this.init()
  },
  mounted() {
    this.systemChart = echarts.init(document.getElementById("system"));
    const options = {
      title: { text: "访问量统计" },
      tooltip:{},
      legend:{
        data:['日统计','月统计']
      },
      xAxis:{
        data:[] // x轴刻度
      },
      yAxis:{
        data:[] // y轴刻度
      },
      series:[
        {
          name:'日统计',
          type:'bar',
          data:[]
        },
        {
          name:'月统计',
          type:'bar',
          data:[]
        }
      ]
    };
    this.systemChart.setOption(options)
  },
  methods: {
    // 初始化
    init(){
      this.getDayView()
    },
    // 获取日访问量
    getDayView(){
      systemRequest.getDayView(new Date()).then(res=>{
        console.log('res :>> ', res);
      })
    }
  }
};
</script>

<style scoped lang="scss"></style>
