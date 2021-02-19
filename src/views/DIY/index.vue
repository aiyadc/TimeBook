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
                    @dragstart="dragstart($event)"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="text" label="文本">
              <a
                href="javascript:void(0)"
                :draggable="true"
                @dragstart="dragstart"
                >H1</a
              >
            </el-tab-pane>
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
      </div>
      <div class="draw">
        <div class="canvas-container">
          <div class="tool">
            <el-tooltip content="图层" effect="dark" placement="left"
              ><el-popover placement="left">
                这是图层
                <i slot="reference" class="el-icon-s-order"></i></el-popover
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
                ><i
                  class="el-icon-document-copy"
                  @click="copySelected"
                ></i></el-tooltip
              ><br />
              <el-tooltip content="粘贴" effect="dark" placement="left"
                ><svg
                  t="1613707083249"
                  class="icon"
                  viewBox="0 0 1025 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="1898"
                  width="16"
                  height="16"
                  @click="pasteSelected"
                >
                  <path
                    d="M704 128l-128 0 0-64c0-35.20512-28.79488-64-64-64l-128 0c-35.20512 0-64 28.79488-64 64l0 64-128 0 0 128 512 0 0-128zM512 128l-128 0 0-63.87712c0.04096-0.04096 0.08192-0.08192 0.12288-0.12288l127.77472 0c0.04096 0.04096 0.08192 0.08192 0.12288 0.12288l0 63.87712zM832 320l0-160.01024c0-17.59232-14.39744-32.01024-32.01024-32.01024l-64 0 0 64 32.01024 0 0 128-192 0-192 192 0 256-256 0 0-576 32.01024 0 0-64-64 0c-17.59232 0-32.01024 14.39744-32.01024 32.01024l0 640c0 17.59232 14.39744 32.01024 32.01024 32.01024l288.01024 0 0 192 640 0 0-704-192 0zM576 410.50112l0 101.49888-101.49888 0 101.49888-101.49888zM960 960l-512 0 0-384 192 0 0-192 320 0 0 576z"
                    p-id="1899"
                  ></path></svg></el-tooltip
              ><br />
              <el-tooltip content="删除" effect="dark" placement="left"
                ><i
                  class="el-icon-delete-solid"
                  @click="deleteSelected"
                ></i></el-tooltip
              ><br />
            </div>
            <div class="text-tool">
              <el-tooltip content="颜色" effect="dark" placement="left"
                ><el-color-picker
                  class="color"
                  v-model="textColor"
                  show-alpha
                  :predefine="predefineColors"
                  @change="setTextColor"
                  @active-change="setTextColor"
                >
                </el-color-picker
              ></el-tooltip>
              <el-tooltip content="文字样式" effect="dark" placement="left">
                <el-select
                  class="size"
                  v-model="fontFamily"
                  placeholder="文"
                  @change="setFontFamily"
                >
                  <el-option
                    v-for="(f, i) in fontFamilyOptions"
                    :key="i"
                    :label="f.label"
                    :value="f.value"
                  ></el-option>
                </el-select>
                <span class="icon" slot="reference">文</span> </el-tooltip
              ><br />
              <el-tooltip content="尺寸" effect="dark" placement="left">
                <!-- <el-popover placement="bottom" trigger="click"> -->
                <el-select
                  class="size"
                  v-model="size"
                  @change="setTextSize"
                  placeholder=""
                >
                  <el-option
                    v-for="num in sizeOptions"
                    :key="num"
                    :label="num"
                    :value="num"
                  ></el-option>
                </el-select>
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
      dragObject: null,
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
      textColorFlag: "textColor", // textColor or textBGColor
      textColor: "rgba(1, 1, 1, 1)",
      fontFamily: "",
      fontFamilyOptions: [],
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
    this.canvas.on("drop", e => {
      console.log(e);
      let offsetX = e.e.offsetX;
      let offsetY = e.e.offsetY;
      console.log(this.dragObject, offsetX, offsetY);
      if (this.dragObject && offsetX > 0 && offsetY > 0) {
        if (this.dragObject.localName === "img") {
          let img = new fabric.Image(this.dragObject, {
            left: offsetX - this.draged.sourceOffsetX,
            top: offsetY - this.draged.sourceOffsetY
          });
          let scale = this.getScale(img);
          img.scale(scale); // 将图像缩小至同等比例
          // console.log("img", img);
          this.canvas.add(img);
        } else if (this.dragObject.localName === "a") {
          let text = this.dragObject.innerText;
          let textbox = new fabric.Textbox(text, {
            left: offsetX,
            top: offsetY,
            fill: "aqua"
          });
          console.log(textbox);
          this.canvas.add(textbox);
        }

        this.canvas.renderAll();
      }
    });
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
    this.fontFamilyOptions = [
      {
        label: "宋体",
        value: "SimSun"
      },
      {
        label: "黑体",
        value: "SimHei"
      },
      {
        label: "微软雅黑",
        value: "Microsoft YaHei"
      },
      {
        label: "微软正黑体",
        value: "Microsoft JhengHei"
      },
      {
        label: "新宋体",
        value: "NSimSun"
      },
      {
        label: "标楷体 ",
        value: "DFKai-SB"
      },
      {
        label: "仿宋",
        value: "FangSong"
      },
      {
        label: "楷体",
        value: "KaiTi"
      }
    ];
  },
  methods: {
    // 拖动其他地方的图像到canvas
    dragstart(e) {
      console.log(e);
      this.draged.sourceOffsetX = e.offsetX;
      this.draged.sourceOffsetY = e.offsetY;
      let obj = e.target;
      this.dragObject = obj;
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
    copySelected() {
      // todo
      let selected = this.canvas.getActiveObject();
      if (selected) {
        let aim = selected._objects || selected;
        this.$store.commit("Push_TStack", aim);
        // console.log("stack:", this.$store.state.TStack);
      }
    },
    // 粘贴选中
    pasteSelected() {
      // clone again, so you can do multiple copies.
      let _clipboards = this.$store.state.TStack;
      let canvas = this.canvas;
      let canvasInfo = this.canvasInfo;
      let clonesObj = [];
      _clipboards.forEach(_clipboard => {
        // console.log("1", _clipboard);
        _clipboard.clone(function(clonedObj) {
          canvas.discardActiveObject();
          let osleft = _clipboard.left;
          let ostop = _clipboard.top;
          // 这里换成clonedObj为什么会有负值  tofix
          clonedObj.set({
            left: osleft + 20 < canvasInfo.width ? osleft + 20 : osleft - 20,
            top: ostop + 20 < canvasInfo.height ? ostop + 20 : ostop - 20,
            evented: true
          });
          if (clonedObj.type === "activeSelection") {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function(obj) {
              canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
          } else {
            canvas.add(clonedObj);
          }
          clonesObj.push(clonedObj);
          canvas.setActiveObject(clonedObj);
          // canvas.requestRenderAll();
        });
      });
    },
    // 改变文字颜色的模式：文字颜色/文字背景颜色
    setColorFlag(val) {
      this.textColorFlag = val;
    },
    setTextColor(val) {
      requestAnimationFrame(() => {
        let selected = this.canvas.getActiveObject();
        // console.log('selected',selected)
        if (selected) {
          selected.set("fill", val);
          this.canvas.renderAll();
        }
      });
    },
    // 改变文字样式
    setFontFamily(val) {
      let selected = this.canvas.getActiveObject();
      // console.log('selected',selected)
      if (selected) {
        selected.set("fontFamily", val);
        this.canvas.renderAll();
      }
    },
    // 改变文字大小
    setTextSize(val) {
      this.size = val;
      let selected = this.canvas.getActiveObject();
      if (selected) {
        selected.set("fontSize", val);
        this.canvas.renderAll();
      }
    },
    // 改变文字对齐方式
    reline() {
      // todo
    },
    // 清空画布
    clear() {
      this.canvas.clear();
    },
    // 获取图像缩放比例,img的类型为fabric.Image()
    getScale(img) {
      let IH = img.getOriginalSize().height;
      let IW = img.getOriginalSize().width;
      let CH = this.canvas.getHeight();
      let CW = this.canvas.getWidth();
      // 长宽不得规定在画布的0.5倍之内，并优先长宽的较小比例
      let scaleX = IW / (0.5 * CW) > 1 ? (0.5 * CW) / IW : 1;
      let scaleY = IH / (0.5 * CH) > 1 ? (0.5 * CH) / IH : 1;
      let scale = scaleX > scaleY ? scaleY : scaleX;
      return scale;
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
