<!-- 设计页 -->
<template>
  <div class="diy">
    <div class="nav">
      <div class="nav-left"><p>DIY</p></div>
      <div class="nav-right">
        <el-button type="default" size="small" circle>
          <i class="el-icon-share"></i><span>分享</span>
        </el-button>
        <el-button type="default" size="small" circle>
          <i class="el-icon-view"></i><span>预览</span></el-button
        >
        <el-button type="default" size="small" circle>
          <i class="el-icon-sort"></i><span>排序</span></el-button
        >
        <el-button type="default" size="small" circle>
          <i class="el-icon-finished"></i><span>保存</span></el-button
        >
        <el-button type="default" size="small" circle>
          <i class="el-icon-position"></i><span>提交</span></el-button
        >
      </div>
    </div>

    <div class="content">
      <div class="material">
        <div class="m-nav">
          <el-tabs
            class="m-tab"
            v-model="tab"
            :tab-position="plateform === 'pc' ? 'left' : 'top'"
          >
            <el-tab-pane name="material" label="素材">
              <div class="m-child">
                <div v-for="(m, i) in materialOptions" :key="i">
                  <img
                    :src="m.src"
                    :alt="m.name"
                    :width="service === 'pc' ? 94 : 76"
                    :height="service === 'pc' ? 90 : 70"
                    draggable="true"
                    @dragover="allowCovered($event)"
                    @dragstart="dragstart($event)"
                    @dragend="drop($event, m)"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="text" label="文本">文本 </el-tab-pane>
            <el-tab-pane name="decoration" label="装饰">
              <div class="d-child">
                <div v-for="(d, i) in decorationOptions" :key="i">
                  <img
                    :src="d.src"
                    :alt="d.name"
                    :width="service === 'pc' ? 94 : 76"
                    :height="service === 'pc' ? 90 : 70"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="album" label="相册" v-if="service === 'h5'"
              >我的相册
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- <el-button type="default" plain size="mini">素材</el-button>
          <el-button type="default" plain size="mini">文本</el-button>
          <el-button type="default" plain size="mini">装饰</el-button>
          <el-button type="default" plain size="mini">相册</el-button>
        </div> -->
      </div>
      <div class="draw">
        <div class="canvas-container">
          <div class="tool">
            <el-tooltip content="图层" effect="dark" placement="left"
              ><i class="el-icon-s-order"></i
            ></el-tooltip>
            <el-tooltip content="背景色" effect="dark" placement="left"
              ><el-color-picker
                class="color"
                v-model="bgcolor"
                show-alpha
                :predefine="predefineColors"
                @change="setBGColor"
                @active-change="setBGColor"
              >
              </el-color-picker
            ></el-tooltip>
            <el-tooltip content="撤销" effect="dark" placement="left"
              ><i id="undo" class="el-icon-back" @click="undo"></i></el-tooltip
            ><br />

            <el-tooltip content="恢复" effect="dark" placement="left"
              ><i id="redo" class="el-icon-right" @click="redo"></i></el-tooltip
            ><br />

            <el-tooltip content="清空画布" effect="dark" placement="left"
              ><i class="el-icon-refresh" @click="clear"></i
            ></el-tooltip>
            <div class="image-tool">
              <el-tooltip content="裁切" effect="dark" placement="left"
                ><svg
                  t="1613382090797"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="853"
                  width="16"
                  height="16"
                >
                  <path
                    d="M928 768h-64V224c0-17.67-14.33-32-32-32H224v-64c0-17.67-14.33-32-32-32s-32 14.33-32 32v64H96c-17.67 0-32 14.33-32 32s14.33 32 32 32h64v544c0 17.67 14.33 32 32 32h608v64c0 17.67 14.33 32 32 32s32-14.33 32-32v-64h64c17.67 0 32-14.33 32-32s-14.33-32-32-32z m-160 0H224V256h576v512h-32z"
                    p-id="854"
                  ></path></svg></el-tooltip
              ><br />
              <el-tooltip content="复制" effect="dark" placement="left"
                ><i class="el-icon-document-copy"></i></el-tooltip
              ><br />
              <el-tooltip content="删除" effect="dark" placement="left"
                ><i
                  class="el-icon-delete-solid"
                  @click="deleteSelected"
                ></i></el-tooltip
              ><br />
            </div>
            <div class="text-tool">
              <el-tooltip content="背景色" effect="dark" placement="left"
                ><el-color-picker
                  class="color"
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="setBGColor"
                  @active-change="setBGColor"
                >
                </el-color-picker
              ></el-tooltip>
              <el-tooltip content="文字样式" effect="dark" placement="left">
                <el-popover
                  placement="right"
                  title="标题"
                  width="200"
                  trigger="click"
                  content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                >
                  <span class="icon" slot="reference">文</span>
                </el-popover> </el-tooltip
              ><br />
              <el-tooltip content="尺寸" effect="dark" placement="left">
                <!-- <el-popover placement="bottom" trigger="click"> -->
                <el-select
                  class="size"
                  v-model="size"
                  @change="setSize"
                  placeholder=""
                >
                  <el-option
                    v-for="num in sizeOptions"
                    :key="num"
                    :label="num"
                    :value="num"
                  ></el-option>
                </el-select>
                <!-- <el-input
                    class="size"
                    slot="reference"
                    v-model="size"
                    size="mini"
                  ></el-input>
                </el-popover> -->
              </el-tooltip>
              <br />
              <el-tooltip content="对齐" effect="dark" placement="left">
                <i class="el-icon-s-operation"></i> </el-tooltip
              ><br />
            </div>
          </div>
          <canvas id="canvas"></canvas>
        </div>
      </div>

      <div class="my-album content-right">相册</div>
    </div>
  </div>
</template>

<script>
import Fastclick from "fastclick";
import { fabric } from "fabric";
import canvas from "@/utils/canvas.js";
export default {
  data() {
    return {
      canvas: null,
      canvasInfo: {},
      cover: null,
      features: {},
      moveFlag: false,
      // 被拖拽的元素
      draged: {
        sourceOffsetX: 0,
        sourceOffsetY: 0
      },
      materialOptions: [],
      decorationOptions: [],
      sizeOptions: [],
      service: "",
      tab: "material",
      size: 14, // 文字尺寸
      // 取色器
      bgcolor: "rgba(199, 21, 133, 1)",
      color: "rgba(1, 1, 1, 1)",
      predefineColors: [],
      _config: {}
    };
  },

  computed: {
    plateform() {
      let service = this.$store.state.plateform;
      this.service = service;
      return service;
    }
  },
  watch: {
    plateform(val) {
      location.reload();
    }
  },
  created() {
    Fastclick.attach(document.body);
  },
  mounted() {
    let draw = document.getElementsByClassName("draw")[0];
    let toolContainer = document.getElementsByClassName("tool")[0];
    let height = draw.clientHeight;
    let width = draw.clientWidth;
    let canvasW, canvasH;
    let scale = this.plateform === "pc" ? 0.8 : 1;
    // console.log(draw);
    if (height * 0.7 >= width) {
      canvasW = +width * scale;
      canvasH = (+width / 0.7) * scale;
    } else {
      canvasH = height * scale;
      canvasW = height * 0.7 * scale;
    }
    toolContainer.style.height = canvasH + "px";
    this.canvasInfo.width = canvasW;
    this.canvasInfo.height = canvasH;
    this.canvas = new fabric.Canvas("canvas", {
      width: canvasW,
      height: canvasH,
      enableRetinaScaling: true,
      fireRightClick: true,
      selection: false,
      preserveObjectStacking: true,
      // selectionBorderColor: "#c71585",
      selection: true,
      snapAngle: 45,
      snapThreshold: 15,
      stateful: true,
      stopContextMenu: true,
      uniformScaling: false,
      uniScaleKey: "ctrlKey"
    });
    this._config = {
      canvasState: [],
      currentStateIndex: -1,
      undoStatus: false,
      redoStatus: false,
      undoFinishedStatus: 1,
      redoFinishedStatus: 1,
      undoButton: document.getElementById("undo"),
      redoButton: document.getElementById("redo")
    };
    this.canvas.on("object:modified", () => {
      this.updateCanvasState();
    });

    this.canvas.on("object:added", () => {
      this.updateCanvasState();
    });
    this.canvas.on("object:removed", () => {
      this.updateCanvasState();
    });
    this.predefineColors = [
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
    ];
    this.sizeOptions = [
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      36,
      48,
      60,
      72,
      80,
      100
    ];
    this.materialOptions = [
      {
        mid: 0,
        theme: "cat",
        name: "cc",
        width: 94,
        height: 90,
        src: require("@/assets/cc.jpg")
      },
      {
        did: 0,
        theme: "dog",
        name: "dd",
        width: 50,
        height: 50,
        src: require("@/assets/dd.jpg")
      }
    ];

    this.decorationOptions = [
      {
        did: 0,
        theme: "dog",
        name: "dd",
        width: 50,
        height: 50,
        src: require("@/assets/dd.jpg")
      },
      {
        mid: 0,
        theme: "cat",
        name: "cc",
        width: 94,
        height: 90,
        src: require("@/assets/cc.jpg")
      }
    ];
    this.textOptions = [
      {
        size: "14px",
        family: "",
        color: "",
        backgroundColor: "",
        message: "艾尼亚"
      }
    ];
  },
  methods: {
    // 拖动其他地方的图像到canvas
    dragstart(e) {
      // console.log(e);
      this.moveFlag = true;
      this.draged.sourceOffsetX = e.offsetX;
      this.draged.sourceOffsetY = e.offsetY;
    },
    allowCovered(e) {
      e.preventDefault();
    },
    drop(e, m) {
      console.log(e, m);
      e.preventDefault();
      let img = e.target;
      // let pageX = e.pageX;
      // let pageY = e.pageY;
      // let offsetCVX = pageX - this.draged.sourceOffsetX;
      // let offsetCVY = pageY - this.draged.sourceOffsetY;
      var width, height;

      if (img.naturalWidth) {
        width = img.naturalWidth;
        height = img.naturalHeight;
      } else {
        width = img.width;
        height = +img.height;
      }
      let CW08 = this.canvasInfo.width * 0.8;
      let CH08 = this.canvasInfo.height * 0.8;
      if (width > CW08 || height > CH08) {
        let scaleX = CW08 / width;
        let scaleY = CH08 / height;
        var scale = scaleX > scaleY ? scaleY : scaleX;
      }

      let image = new fabric.Image(img, {
        left: 20,
        top: 20,
        width: width,
        height: height,
        scaleX: scale,
        scaleY: scale
        // height: height
      });
      this.canvas.add(image);
      this.canvas.renderAll();
      console.log(
        "elements:",
        this.canvas.getElement(),
        "objects:",
        this.canvas.getObjects()
      );
    },
    // // 监听点击处的坐标
    //     showClick('click'){

    //     },
    setSize(val) {
      this.size = val;
    },
    // 工具栏
    // 改变画板各对象的层叠顺序
    reorder() {
      // todo
    },

    // 改变画板背景色
    setBGColor(color) {
      requestAnimationFrame(() => {
        this.canvas.setBackgroundColor(
          color,
          this.canvas.renderAll.bind(this.canvas)
        );
      });
    },
    // updateCanvasState
    updateCanvasState() {
      if (
        this._config.undoStatus == false &&
        this._config.redoStatus == false
      ) {
        var jsonData = this.canvas.toJSON();
        var canvasAsJson = JSON.stringify(jsonData);
        if (
          this._config.currentStateIndex <
          this._config.canvasState.length - 1
        ) {
          // 在撤销过程中，如果有进行更改，那么撤销所在的那一步之后的将会被清空
          var indexToBeInserted = this._config.currentStateIndex + 1;
          this._config.canvasState[indexToBeInserted] = canvasAsJson;
          var numberOfElementsToRetain = indexToBeInserted + 1;
          this._config.canvasState = this._config.canvasState.splice(
            0,
            numberOfElementsToRetain
          );
        } else {
          //如果没在撤销给过程中则直接push进去即可
          this._config.canvasState.push(canvasAsJson);
        }
        // 无论什么情况，只要做了改变，那么当前指针就会跑到最前面
        this._config.currentStateIndex = this._config.canvasState.length - 1;
        if (
          this._config.currentStateIndex ==
            this._config.canvasState.length - 1 &&
          this._config.currentStateIndex != -1
        ) {
          this._config.redoButton.disabled = "disabled";
        }
      }
    },
    // 撤销
    undo() {
      if (this._config.undoFinishedStatus) {
        if (this._config.currentStateIndex == -1) {
          this._config.undoStatus = false;
        } else {
          if (this._config.canvasState.length >= 1) {
            this._config.undoFinishedStatus = 0;
            if (this._config.currentStateIndex != 0) {
              this._config.undoStatus = true;
              this.canvas.loadFromJSON(
                this._config.canvasState[this._config.currentStateIndex - 1],
                () => {
                  var jsonData = JSON.parse(
                    this._config.canvasState[this._config.currentStateIndex - 1]
                  );
                  this.canvas.renderAll();
                  this._config.undoStatus = false;
                  this._config.currentStateIndex -= 1;
                  this._config.undoButton.removeAttribute("disabled");
                  // 只要不是最前面的步骤，undo之后，redo就是解封的
                  if (
                    this._config.currentStateIndex !==
                    this._config.canvasState.length - 1
                  ) {
                    this._config.redoButton.removeAttribute("disabled");
                  }
                  this._config.undoFinishedStatus = 1;
                }
              );
            } else if (this._config.currentStateIndex == 0) {
              this.canvas.clear();
              this._config.undoFinishedStatus = 1;
              this._config.undoButton.disabled = "disabled";
              this._config.redoButton.removeAttribute("disabled");
              this._config.currentStateIndex -= 1;
            }
          }
        }
      }
    },
    // 恢复
    redo() {
      if (this._config.redoFinishedStatus) {
        if (
          this._config.currentStateIndex ==
            this._config.canvasState.length - 1 &&
          this._config.currentStateIndex != -1
        ) {
          this._config.redoButton.disabled = "disabled";
        } else {
          if (
            this._config.canvasState.length > this._config.currentStateIndex &&
            this._config.canvasState.length != 0
          ) {
            this._config.redoFinishedStatus = 0;
            this._config.redoStatus = true;
            this.canvas.loadFromJSON(
              this._config.canvasState[this._config.currentStateIndex + 1],
              () => {
                var jsonData = JSON.parse(
                  this._config.canvasState[this._config.currentStateIndex + 1]
                );
                this.canvas.renderAll();
                this._config.redoStatus = false;
                this._config.currentStateIndex += 1;
                if (this._config.currentStateIndex != -1) {
                  this._config.undoButton.removeAttribute("disabled");
                }
                this._config.redoFinishedStatus = 1;
                if (
                  this._config.currentStateIndex ==
                    this._config.canvasState.length - 1 &&
                  this._config.currentStateIndex != -1
                ) {
                  this._config.redoButton.disabled = "disabled";
                }
              }
            );
          }
        }
      }
    },
    // 删除选中
    deleteSelected() {
      console.log("执行了删除操作", this.canvas.getActiveObject());
      this.canvas.remove(this.canvas.getActiveObject());
    },
    // 复制选中
    copySelected(ele) {
      // todo
    },
    // 改变文字大小
    resize() {
      // todo
    },
    // 改变文字颜色
    recolor() {
      // todo
    },
    // 改变文字样式
    restyle() {
      // todo
    },
    // 改变文字对齐方式
    reline() {
      // todo
    },
    // 清空画布
    clear() {
      this.canvas.clear();
    }
  }
};
</script>
<style lang="scss" scoped>
.diy {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.nav {
  height: 1.7rem;
  background-color: cyan;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  .nav-right {
    span:nth-child(n) {
      @media screen and (max-width: 700px) {
        display: none;
      }
    }
  }
}
.content {
  flex: 1;
  display: flex;
  @media screen and (max-width: 700px) {
    flex-direction: column-reverse;
  }
  .material {
    width: 10rem;
    height: 100%;
    background-color: #fff;
    .m-nav {
      width: 100%;
      padding: 5px;
      height: 100%;
      overflow: auto;
      .m-tab {
        height: 100%;
        width: 100%;
        overflow: auto;
        @media screen and (max-width: 700px) {
          & >>> .el-tabs__header {
            margin: 0;
            .el-tabs__nav-wrap {
              height: 24px;
              .el-tabs__item {
                line-height: 24px;
              }
            }
          }
        }
      }
    }
    .m-child,
    .d-child {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      div {
        display: inline-block;
        width: 100px;
        height: 100px;
        background-color: antiquewhite;
        box-sizing: border-box;
        padding: 5px 2px;
        margin: 5px;
      }
    }
    @media screen and (max-width: 700px) {
      width: 100%;
      height: 7rem;
      .m-child,
      .d-child {
        div {
          width: 80px;
          height: 80px;
        }
      }
    }
  }
  .draw {
    flex: 1;
    position: relative;
    background-color: crimson;

    .canvas-container {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: fit-content;
      height: fit-content;
      @media screen and (max-width: 700px) {
        width: 100%;
        height: 100%;
      }
      display: flex;
      .tool {
        width: 40px;
        // height: 100%; // 为什么设置100%反而没有100%了
        background-color: cadetblue;
        text-align: center;
        i,
        svg {
          display: inline-block;
          // width: fit-content;
          margin: 10px 0;
          text-align: center;
          cursor: pointer;
          &:hover {
            outline: tomato solid 1px;
          }
        }
        .text-tool {
          div,
          span {
            margin: 10px 0;
          }
        }
        .size {
          & >>> input {
            width: 40px;
            height: 24px;
            padding: 0 10px;
            cursor: pointer;
          }
          & >>> i {
            line-height: 24px;
          }
        }
        span {
          @media screen and (max-width: 700px) {
            display: none;
          }
        }
        & >>> .el-color-picker {
          // width: fit-content!important;
          display: inline-block;
          margin: 10px 0;
          width: 40px;
          height: 28px !important;
          .el-color-picker__trigger {
            border: none;
            width: 24px;
            height: 24px;
            &:hover,
            &:active {
              outline: tomato solid 1px;
            }
          }
        }

        .color {
          width: 40px;
          height: 50px;
          vertical-align: middle;
        }
      }
      #canvas {
        background-color: darkgreen;
      }
      #cover {
        position: absolute;
        left: 40px;
        z-index: 88;
      }
    }
  }

  .my-album {
    width: 6rem;
    background-color: darkgoldenrod;
    @media screen and (max-width: 700px) {
      display: none;
    }
  }
}
.icon {
  cursor: pointer;
  &:hover {
    outline: tomato solid 1px;
  }
}
</style>
