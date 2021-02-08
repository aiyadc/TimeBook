<template>
  <div class="test2">
    <div class="img-container">
      <img
        id="img1"
        style="position: absolute;"
        src="../assets/logo.png"
        width="50"
        draggable="true"
        @dragover="allowCovered($event)"
        @dragstart="dragstart($event)"
      />
    </div>
    <canvas id="cvs" @drop="drop($event)" @dragover="allowCovered($event)"></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  components: {},
  props: {},
  data() {
    return {
      canvas: null,
      divobj: null,
      mwidth: 0,
      mheight: 0
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.divobj = document.getElementById("divobj");
    this.canvas = new fabric.Canvas("cvs", {
      left: 400,
      top: 400,
      width: 800,
      height: 300,
      backgroundColor:'#eee'
    });
  },
  methods: {
    // 拖动其他地方的图像到canvas
    dragstart(e) {
      this.moveFlag = true;
      this.sourceOffsetX = e.offsetX;
      this.sourceOffsetY = e.offsetY;
      e.dataTransfer.setData("startE", e.target.id);
    },
    drop(e) {
      e.preventDefault();
      let data = e.dataTransfer.getData("startE");
      let img = document.getElementById(data);
      let pageX = e.pageX;
      let pageY = e.pageY;
      let offsetCVX = pageX - this.sourceOffsetX + 1;
      let offsetCVY = pageY - this.sourceOffsetY - 349;
      img.style.left = offsetCVX + "px";
      img.style.top = offsetCVY + "px";
      let width, height;
      this.$nextTick(async () => {
        if (window.naturalWidth) {
          width = img.naturalWidth;
          height = img.naturalHeight;
        } else {
          width = img.width;
          height = +img.height * (296 / width);
        }
        let rect = new fabric.Rect({
          left: offsetCVX,
          top: offsetCVY,
          width: width,
          height: height
        });
        this.canvas.add(rect);
      });
    },
    allowCovered(e) {
      e.preventDefault();
    },
    // canvas内部移动
    handleMousedown(e) {
      this.moveFlag = true;
      var clickEvent = window.event || e;
      //   console.log(clickEvent);
      this.mwidth = clickEvent.clientX - this.divobj.offsetLeft;
      this.mheight = clickEvent.clientY - this.divobj.offsetTop;
      this.divobj.mousemove = this.handleMousemove(e);
    },
    handleMousemove(e) {
      //   console.log("moving");
      var moveEvent = window.event || e;
      if (this.moveFlag) {
        this.divobj.style.left = moveEvent.clientX - this.mwidth + "px";
        this.divobj.style.top = moveEvent.clientY - this.mheight + "px";
        this.divobj.onmouseup = function() {
          this.moveFlag = false;
        };
      }
    },
    setEditModel(node) {
      let width = node.width;
      let height = node.height;
      console.log(width, height);
      let div1 = document.createElement("div");
      div.style.position = "absolute";
      div.style.width = "8px";
      div.style.height = "8px";
      div.style.left = "-4px";
      div.style.top = "0";
    }
  }
};
</script>

<style scoped lang="scss">
.test2 {
  position: absolute;
  left: 0;
  top: 0;
  .img-container {
    position: absolute;
    width: 1000px;
    height: 300px;
    border: solid 1px lawngreen;
    #img2 {
      left: 50px;
    }
  }
  #tem {
    position: absolute;
    left: 0;
    top: 350px;
    width: 1000px;
    height: 300px;
    z-index: 100;
    border: 1px solid rgb(34, 157, 233);
    background-color: transparent;
  }
  #cover {
    position: absolute;
    left: 0;
    top: 350px;
    width: 1000px;
    height: 300px;
    z-index: 99;

    background-color: transparent;
  }
  #divobj {
    width: 50px;
    height: 50px;
    position: absolute;
    border: 2px solid black;
  }
}
</style>
