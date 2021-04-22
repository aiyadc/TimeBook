<template>
  <el-card class="statistics">
    <div class="flex-sb" slot="header">
      <div class="left"><span>访问量统计</span></div>
      <div class="right">
        日期：
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          @change="getDayView"
        >
        </el-date-picker>
      </div>
    </div>
    <div id="system"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import systemRequest from "@/api/system.js";
import convert from "@/utils/convert.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      date: new Date(),
      systemChart: null,
      dayList: [],
      dayViewList: []
    };
  },
  watch: {},
  computed: {},
  created() {
    this.init();
  },
  mounted() {
    this.systemChart = echarts.init(document.getElementById("system"));
    this.systemChart.on("legendselectchanged", params => {});
    window.removeEventListener("resize", this.resize);
    window.addEventListener("resize", this.resize);
  },
  methods: {
    // 初始化
    async init() {
      await this.getDayView();
    },
    // 渲染图表
    render() {
      const options = {
        tooltip: {},
        legend: {
          data: ["日统计"]
        },
        xAxis: {
          data: this.dayList // x轴刻度
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "日统计",
            type: "bar",
            data: this.dayViewList
          }
        ]
      };
      this.systemChart.setOption(options);
    },
    // 获取日访问量
    async getDayView(date = new Date()) {
      const res = await systemRequest.getDayView(date);
      this.dayList = res.data.map(d => convert.parseDatetime(d.date));
      this.dayViewList = res.data.map(d => d.active);
      this.render();
    },
    // 重置大小
    resize() {
      this.systemChart.resize();
    }
  }
};
</script>

<style scoped lang="scss">
.statistics {
  width: 100%;
  height: 100%;
  & >>> .el-card__body {
    width: 100%;
    height: calc(100vh - 110px);
    overflow: hidden;
  }
}
#system {
  width: 100%;
  height: 100%;
}
</style>
