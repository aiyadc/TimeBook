<template>
  <div class="hello">
    <div class="test1">
      <div class="album">
        <img
          id="img1"
          src="../assets/logo.png"
          width="50"
          draggable="true"
          @dragstart="dragstart($event)"
        />
      </div>
      <div id="covCanvas">
        <canvas
          id="canvas"
          width="400"
          height="400"
          style="background-color: pink;position: absolute;"
          @drop="drop($event)"
          @dragover="dragOver($event)"
        ></canvas>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      cxt: null,
      covCanvas: null,
      sourceOffsetX: "",
      sourceOffsetY: "",
    };
  },
  mounted() {
    this.cxt = document.getElementById("canvas").getContext("2d");
    this.covCanvas = document.getElementById("covCanvas");
  },
  methods: {
    // 设置canvas内松开鼠标时的位置
    setwh(e) {
      console.log("mouseUp", e);
    },
    dragstart(e) {
      console.log(e);
      this.sourceOffsetX = e.offsetX;
      this.sourceOffsetY = e.offsetY;
      e.dataTransfer.setData("startE", e.target.id);
    },
    drop(e) {
      // console.log("drop:", e);
      // e.preventDefault();
      let data = e.dataTransfer.getData("startE");
      let img = document.getElementById(data);
      let offsetX = e.offsetX;
      let offsetY = e.offsetY - 1;
      this.covCanvas.appendChild(img);
      this.cxt.drawImage(
        img,
        offsetX - this.sourceOffsetX,
        offsetY - this.sourceOffsetY,
        50,
        50
      );
    },
    dragOver(e) {
      e.preventDefault();
    },
    testClick(e) {
      console.log(e);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.album {
  height: 300px;
  width: 300px;
  border: lightcoral 1px solid;
}
.test1 {
  #covCanvas {
    position: absolute;
    z-index: 9999;
    #canvas {
      border: 1px solid lightcoral;
    }
  }
}
</style>
