<template>
  <div class="test2">
    <div class="img-container">
      <img
        ref="dragBox"
        id="img1"
        style="position: absolute;"
        src="../assets/logo.png"
        width="50"
        draggable="true"
        @touchstart="touchstartHandle('dragBox', $event)"
        @touchmove="touchmoveHandle('dragBox', $event)"
        @dragover="allowCovered($event)"
        @dragstart="dragstart($event)"
        @touchend="handleTouchEnd('dragBox', $event)"
      />
      />
    </div>
    <div
      id="cover"
      @drop="drop($event)"
      @dragover="allowCovered($event)"
      @touchend="drop($event)"
    >
      <canvas id="cvs"></canvas>
    </div>
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
      mheight: 0,
      coordinate: {
        client: {},
        elePosition: {},
        aim: {}
      }
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.divobj = document.getElementById("divobj");
    this.canvas = new fabric.Canvas("cvs", {
      width: 800,
      height: 300,
      backgroundColor: "#eee"
    });
    this.canvas.on("mouse:down", () => {
      return false;
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
        let image = new fabric.Image(img, {
          left: 100,
          top: 100
          // height: height
        });
        this.canvas.add(image);
        this.canvas.renderAll();
      });
    },
    allowCovered(e) {
      e.preventDefault();
    },
    // canvas内部移动
    handleMousedown(e) {
      this.moveFlag = true;
      var clickEvent = window.event || e;
      this.mwidth = clickEvent.clientX - this.divobj.offsetLeft;
      this.mheight = clickEvent.clientY - this.divobj.offsetTop;
      this.divobj.mousemove = this.handleMousemove(e);
    },
    handleMousemove(e) {
      var moveEvent = window.event || e;
      if (this.moveFlag) {
        requestAnimationFrame(() => {
          this.divobj.style.left = moveEvent.clientX - this.mwidth + "px";
          this.divobj.style.top = moveEvent.clientY - this.mheight + "px";
          this.divobj.onmouseup = function() {
            this.moveFlag = false;
          };
        });
      }
    },
    touchstartHandle(refName, e) {
      e.preventDefault();
      let element = e.targetTouches[0];
      // 记录点击的坐标（在点击处的位置）
      this.coordinate.client = {
        x: element.clientX,
        y: element.clientY
      };
      // 记录需要移动的元素坐标(在元素起点的位置)
      this.coordinate.elePosition.left = this.$refs[refName].offsetLeft;
      this.coordinate.elePosition.top = this.$refs[refName].offsetTop;
      // console.log(this.coordinate);
    },
    touchmoveHandle(refName, e) {
      e.preventDefault();
      let element = e.targetTouches[0];
      // 根据初始 client 位置计算移动距离(元素移动位置=元素初始位置+光标移动后的位置-光标点击时的初始位置)
      let x =
        this.coordinate.elePosition.left +
        (element.clientX - this.coordinate.client.x);
      let y =
        this.coordinate.elePosition.top +
        (element.clientY - this.coordinate.client.y);
      // // 限制可移动距离，不超出可视区域
      // x =
      //   x <= 0
      //     ? 0
      //     : x >= innerWidth - this.$refs[refName].offsetWidth
      //     ? innerWidth - this.$refs[refName].offsetWidth
      //     : x;
      // y =
      //   y <= 0
      //     ? 0
      //     : y >= innerHeight - this.$refs[refName].offsetHeight
      //     ? innerHeight - this.$refs[refName].offsetHeight
      //     : y;
      requestAnimationFrame(() => {
        // 移动当前元素
        this.coordinate.aim = {
          x: x,
          y: y
        };
        this.$refs[refName].style.left = x + "px";
        this.$refs[refName].style.top = y + "px";
      });
    },
    // 移动端滑动结束时触发
    handleTouchEnd(refName, e) {
      e.preventDefault();
      console.log(e);

      // let element = e.targetTouches[0];
      this.$refs[refName].style.left =
        this.coordinate.client.x -
        (this.coordinate.client.x - this.coordinate.elePosition.left) +
        "px";
      this.$refs[refName].style.top =
        this.coordinate.client.y -
        (this.coordinate.client.y - this.coordinate.elePosition.top) +
        "px";
      console.log(this.coordinate, e.target);
      let image = new fabric.Image(e.target, {
        left: this.coordinate.aim.x,
        top: this.coordinate.aim.y - 400
      });
      console.log(image);
      this.canvas.add(image);
      this.canvas.renderAll();
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
    z-index: 888;
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
  #cover {
    position: absolute;
    left: 0;
    top: 400px;
  }

  .nav{
  position: relative;
  }
}
</style>
