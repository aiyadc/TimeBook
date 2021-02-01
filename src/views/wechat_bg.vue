<!--  -->
<template>
  <div>
    <div>
      <button @click="drawImage">绘图</button>
    </div>
    <div class="s169">
      <img id="qsmy" src="../assets/moon.jpg" alt="秦时明月" width="350" />
      <p>今天也要记得开心啊~</p>
    </div>
    <canvas id="canvas" width="450" height="800"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      cxt: null,
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.cxt = document.getElementById("canvas").getContext("2d");
  },

  methods: {
    // 绘图
    drawImage() {
      let img = document.getElementById("qsmy");
      this.cxt.drawImage(img, 40, 40, 370, 360);
      this.cxt.font = "24px KaiTi";
        this.cxt.strokeStyle = "lightskyblue";
      //   console.log(this.cxt.strokeText)
        this.cxt.strokeText("今天也要记得开心啊~", 110, 500);
    //   this.cxt.font = "20px Georgia";
    //   this.cxt.strokeText("今天也要记得开心啊", , 50);
    },
  },
};
</script>
<style lang="scss" scoped>
.s169 {
  position: absolute;
  left: 0;
  top: 100;
  height: 800px;
  width: 450px;
  background-color: lightpink;
  img {
    margin-top: 50px;
  }
  p {
    color: lightskyblue;
    margin-top: 143px;
  }
}
#canvas {
  position: absolute;
  left: 500;
  top: 100;
  background-color: palevioletred;
}
</style>
