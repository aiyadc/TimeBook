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
      <img
        id="img2"
        style="position: absolute;"
        src="../assets/logo.png"
        width="50"
        draggable="true"
        @dragover="allowCovered($event)"
        @dragstart="dragstart($event)"
      />
    </div>
    <div id="cover" @drop="drop($event)" @dragover="allowCovered($event)"></div>
    <canvas id="cvs" width="1000" height="300"></canvas>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      elementList: [],
      ctx: null,
      cover: null,
      body: null,
      moveFlag: false,
      divobj: null,
      mwidth: 0,
      mheight: 0
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.ctx = document.getElementById("cvs").getContext("2d");
    this.cover = document.getElementById("cover");
    this.divobj = document.getElementById("divobj");
    // 防止弹出菜单，并监听鼠标点击行为，左键，中键，右键依次是0，1，2
    document.oncontextmenu = function() {
      return false;
    };
    this.cover.onmousedown = function(e) {
      console.log(e);
      console.log(e.button);
    };

    // 监听coverdiv中的变动
    let target = document.getElementById("cover");
    // 创建观察者对象
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log("mutation:", mutations, "type:", mutation.type);
      });
    });
    // 配置观察选项:
    var config = { attributes: true, childList: true, characterData: true };
    // 传入目标节点和观察选项
    observer.observe(target, config);
  },
  methods: {
    // 拖动其他地方的图像到canvas
    dragstart(e) {
      // console.log(e);
      //   e.preventDefault()
      this.moveFlag = true;
      this.sourceOffsetX = e.offsetX;
      this.sourceOffsetY = e.offsetY;
      // console.log("offsetXY", this.sourceOffsetX, this.sourceOffsetY);
      e.dataTransfer.setData("startE", e.target.id);
    },
    drop(e) {
      e.preventDefault();
      let data = e.dataTransfer.getData("startE");
      let img = document.getElementById(data);
      let offsetX = e.clientX;
      let offsetY = e.clientY;
      let offsetCVX = offsetX - this.sourceOffsetX;
      let offsetCVY = offsetY - this.sourceOffsetY - 349;
      img.style.left = offsetCVX + "px";
      img.style.top = offsetCVY + "px";
      // console.log("XY", offsetCVX, offsetCVY);
      let div = document.createElement("div");
      div.appendChild(img);
      div.ondrag = this.dragstart(e);
      div.ondragover = this.allowCovered(e);
      this.cover.appendChild(div);
      let ele = {};
      ele.ele = div;
      ele.type = "image";
      ele.width = "50px";
      ele.height = "50px";
      ele.offsetX = offsetCVX;
      ele.offsetY = offsetCVY;
      ele.name = "vue";
      this.elementList.push(ele);
      img.style.zIndex = this.elementList.indexOf(ele);
      console.log(this.elementList);
      //   this.ctx.drawImage(img, offsetCVX, offsetCVY, 50, 50);
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
      console.log("moving");
      var moveEvent = window.event || e;
      if (this.moveFlag) {
        this.divobj.style.left = moveEvent.clientX - this.mwidth + "px";
        this.divobj.style.top = moveEvent.clientY - this.mheight + "px";
        this.divobj.onmouseup = function() {
          this.moveFlag = false;
        };
      }
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
  #cvs {
    position: absolute;
    left: 0;
    top: 350px;
    border: solid 1px rgb(34, 157, 233);
    background-color: lightskyblue;
  }
  #divobj {
    width: 50px;
    height: 50px;
    position: absolute;
    border: 2px solid black;
  }
}
</style>
