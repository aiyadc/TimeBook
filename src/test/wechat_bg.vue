<!--  -->
<template>
  <div>
    <div class="nav">
      <el-button type="danger" @click="clear">清除画板</el-button>
      <el-button type="success" @click="download">下载</el-button>
      <el-color-picker
        class="color"
        v-model="color"
        show-alpha
        :predefine="predefineColors"
        @change="setBGColor"
        @active-change="setBGColor"
      >
      </el-color-picker
      >背景色
    </div>
    <div class="content">
      <div
        id="cover"
        :draggable="true"
        @dragover="handleDragover($event)"
        @drop="handleDrop($event)"
      ></div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      cover: null,
      img: null,
      ratio: 1,
      num: 0,
      // 取色器
      color: "",
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.canvas = document.getElementById("canvas");
    this.ctx = document.getElementById("canvas").getContext("2d");
    this.ratio = this.getPixelRatio(this.ctx); // 关键代码
    this.canvas.width = 360 * this.ratio; // 画布宽度
    this.canvas.height = 640 * this.ratio; // 画布高度
    this.cover = document.getElementById("cover");
    console.log(this.cover);
  },

  methods: {
    handleDrop(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      // console.dir(this.cover);
      console.log(1);
      var files = ev.dataTransfer.files;
      var file = files[0];
      console.log("file start", file);
      var reader = new FileReader();
      reader.onload = () => {
        var dataURL = reader.result;
        let img = new Image();
        img.src = dataURL;
        let width, height;
        this.$nextTick(async () => {
          if (window.naturalWidth) {
            width = img.naturalWidth;
            height = img.naturalHeight;
          } else {
            width = img.width;
            height = +img.height * (296 / width);
          }
          if (this.num > 0) {
            if (this.num === 1) {
              console.log("背景设置提醒");
              await this.$confirm("是否将此图片设置为背景", "提示", {
                type: "warning",
                confirmButtonText: "是的鸭",
                cancelButtonText: "替换"
              })
                .then(() => {
                  console.log(2);
                  this.ctx.globalCompositeOperation = "destination-over";
                })
                .catch(() => {
                  this.clear();
                });
            }
          } else {
            this.num += 1;
          }
          this.ctx.drawImage(
            img,
            32 * this.ratio,
            32 * this.ratio,
            296 * this.ratio,
            height * this.ratio
          );
        });
      };
      reader.readAsDataURL(file);
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    // 改变画板背景色
    setBGColor(color) {
      console.log("颜色改变了，", color);
      
      this.clear()
      this.ctx.fillStyle = color;
      this.ctx.globalCompositeOperation = "destination-over";
      this.ctx.fillRect(0, 0, 360, 640);
      this.ctx.globalCompositeOperation = "source-over";
    },
    // 清除画版
    clear() {
      this.ctx.clearRect(0, 0, 360 * this.ratio, 640 * this.ratio);
    },
    // 下载图片、
    download() {
      let a = document.createElement("a");
      let body = document.getElementsByTagName("body")[0];
      let url = this.canvas.toDataURL();
      a.download = "图片";
      a.style.display = "none";
      a.href = url;
      body.appendChild(a);
      a.click();
      body.removeChild(a);
    },
    // 适配屏幕渲染比例，使图片的像素能够被1：1绘制，而不是在原来的像素基础上进行放大或缩小绘制，造成类似1个像素用2个像素来画，这就放大了1倍，造成模糊。将图片像素以1：1的比率绘制可以保持原有的清晰度，然后再根据canvas的大小去缩放（已绘制完）。
    getPixelRatio(context) {
      var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    }
  }
};
</script>
<style lang="scss" scoped>
.nav {
  text-align: left;
  margin-bottom: 20px;
  padding: 10px;
}
.content {
  position: relative;
}
#cover {
  position: absolute;
  padding: 32px;
  left: 300px;
  width: 360px;
  height: 640px;
  box-sizing: border-box;
  top: 0;
  z-index: 99;
  background-color: transparent;
}
#canvas {
  position: absolute;
  left: 300px;
  top: 0;
  background-color: palevioletred;
}
.color {
  vertical-align: bottom;
}
</style>
