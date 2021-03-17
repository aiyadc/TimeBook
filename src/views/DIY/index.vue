<!-- 设计页 -->
<template>
  <div class="diy">
    <!-- 顶部工具栏 -->
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
      <!-- 素材部分 -->
      <div class="materials">
        <div class="m-nav">
          <el-tabs
            class="m-tab"
            v-model="tab"
            :tab-position="plateform === 'pc' ? 'left' : 'top'"
          >
            <!-- 我的素材 -->
            <el-tab-pane name="material" label="素材">
              <div class="head-tool">
                <el-input
                  class="material-search"
                  v-model="search.materialSearch"
                  size="small"
                  placeholder="可输入照片名进行搜索"
                  suffix-icon="el-icon-search"
                ></el-input>
                <div>
                  <i class="el-icon-plus tool-icon" @click="addMaterial"></i>
                  <i class="el-icon-delete tool-icon"></i>
                </div>
              </div>
              <div class="m-child">
                <template v-for="(m, i) in materialOptions">
                  <div :tabindex="i" :key="i">
                    <img
                      :src="m.src"
                      :alt="m.name"
                      :width="service === 'pc' ? 94 : 76"
                      :height="service === 'pc' ? 90 : 70"
                      draggable="true"
                      @dragstart="dragstart($event)"
                      @touchstart="setOnCanvas($event)"
                    />
                    <span class="pic-name ellipsis">{{ m.name }}</span>
                  </div>
                </template>
              </div>
            </el-tab-pane>
            <!-- 文案选择 -->
            <el-tab-pane name="text" label="文本">
              <a
                href="javascript:void(0)"
                :draggable="true"
                @dragstart="dragstart"
                @touchstart="setOnCanvas($event)"
                >H1</a
              >
            </el-tab-pane>
            <!-- 系统素材 -->
            <el-tab-pane name="decoration" label="装饰">
              <div class="material-tool">
                <el-input
                  class="decoration-search"
                  v-model="search.materialSearch"
                  size="small"
                  placeholder="可输入照片名进行搜索"
                  suffix-icon="el-icon-search"
                ></el-input>
                <i class="el-icon-plus tool-icon"></i>
                <i class="el-icon-delete tool-icon"></i>
              </div>
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
            <!-- 我的相册，H5中才有显示 -->
            <el-tab-pane name="album" label="相册" v-if="service === 'h5'">
              <div class="my-album">
                <div class="page" v-for="(ctx, i) in myAlbum.data" :key="i">
                  <img
                    :src="ctx.src"
                    alt=""
                    height="70"
                    width="49"
                    @click="togglePage(ctx)"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 画布部分 -->
      <div class="draw">
        <div class="canvas-container">
          <div class="tool">
            <el-tooltip content="图层" effect="dark" placement="left">
              <el-popover placement="bottom" trigger="click">
                <!-- <i slot="reference" class="el-icon-s-order"></i> -->
                <img
                  class="tool-icon"
                  slot="reference"
                  src="./icons/layer.svg"
                  alt="layer"
                />
                <div>
                  <div class="layer" v-for="(el, i) in layer" :key="i">
                    <i
                      class="el-icon-view icon"
                      v-show="el.show"
                      @click="updateLayer(el)"
                    ></i>
                    <img
                      class="tool-icon"
                      src="./icons/eyeoff.svg"
                      alt="eyeoff"
                      @click="updateLayer(el)"
                      v-show="!el.show"
                    />
                    <img
                      class="mr10-x"
                      :src="el.src"
                      width="60px"
                      height="30px"
                      :key="i"
                    />
                    <el-tooltip content="上移图层" placement="top"
                      ><i
                        class="el-icon-top tool-icon"
                        @click="setLayerforward(el)"
                      ></i
                    ></el-tooltip>
                    <el-tooltip content="下移图层" placement="top"
                      ><i
                        class="el-icon-bottom tool-icon mr10-x"
                        @click="setLayerbottom(el)"
                      ></i
                    ></el-tooltip>
                    <el-tooltip content="删除" placement="top"
                      ><i
                        class="el-icon-delete tool-icon"
                        @click="deleteSelected(el.object)"
                      ></i
                    ></el-tooltip>
                  </div>
                </div>
              </el-popover>
            </el-tooltip>

            <el-tooltip content="背景色" effect="dark" placement="left"
              ><el-color-picker
                class="color tool-icon"
                v-model="bgcolor"
                show-alpha
                :predefine="predefineColors"
                @change="setBGColor"
                @active-change="setBGColor"
              >
              </el-color-picker
            ></el-tooltip>
            <el-tooltip content="撤销" effect="dark" placement="left"
              ><img
                class="tool-icon"
                id="undo"
                :draggable="false"
                src="./icons/undo.svg"
                @click="undo"/></el-tooltip
            ><br />

            <el-tooltip content="恢复" effect="dark" placement="left">
              <img
                id="redo"
                class="tool-icon"
                src="./icons/redo.svg"
                @click="redo"
                alt="redo"
              />
              <!-- <i id="redo" class="el-icon-right" @click="redo"></i> --> </el-tooltip
            ><br />

            <el-tooltip content="清空画布" effect="dark" placement="left">
              <img
                class="tool-icon"
                src="./icons/clear.svg"
                @click="clear"
                alt="clear"
              /> </el-tooltip
            ><br />
            <el-tooltip content="裁切" effect="dark" placement="left">
              <img
                class="tool-icon"
                src="./icons/crop.svg"
                @click="startCroping"
                alt=""
              /> </el-tooltip
            ><br />
            <el-tooltip content="画笔" placement="left" effect="datk">
              <el-popover placement="left" trigger="click">
                <div>
                  <span class="label">尺寸:</span>
                  <el-slider
                    v-model="paintBrush.size"
                    @change="setPaintSize()"
                  ></el-slider>
                  <div>
                    颜色：
                    <el-color-picker
                      class="color-container tool-icon osbottom5"
                      v-model="paintBrush.color"
                      show-alpha
                      :predefine="predefineColors"
                      @change="setPaintColor"
                      @active-change="setPaintColor"
                    >
                    </el-color-picker>
                  </div>
                </div>
                <img
                  slot="reference"
                  class="tool-icon"
                  src="./icons/draw.svg"
                  @click="setDrawMode"
                  alt="draw"
                />
              </el-popover>
            </el-tooltip>
            <br />
            <div class="image-tool">
              <el-tooltip content="平铺" effect="dark">
                <img
                  class="tool-icon"
                  src="./icons/maxmize.svg"
                  @click="maxmize(canvas.getActiveObject())"
                  alt="maxmize"
                />
              </el-tooltip>
              <br />
              <el-tooltip content="复制" effect="dark" placement="left">
                <img
                  class="tool-icon"
                  src="./icons/copy.svg"
                  @click="copySelected(canvas.getActiveObject())"
                  alt="copy"
                /> </el-tooltip
              ><br />
              <el-tooltip content="粘贴" effect="dark" placement="left">
                <img
                  class="tool-icon"
                  src="./icons/paste.svg"
                  @click="pasteSelected"
                  alt="paste"/></el-tooltip
              ><br />
              <el-tooltip content="删除" effect="dark" placement="left">
                <img
                  class="tool-icon"
                  src="./icons/delete.svg"
                  @click="deleteSelected(canvas.getActiveObject())"
                  alt="delete"/></el-tooltip
              ><br />
            </div>
            <div class="text-tool" v-show="activeType === 'Textbox'">
              <el-tooltip content="颜色" effect="dark" placement="left"
                ><el-color-picker
                  class="color-container"
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
                <el-popover class="pop-mw100" placement="bottom">
                  <div class="flex-sb">
                    <img
                      class="tool-icon"
                      src="./icons/align_left.svg"
                      @click="setTextAlign('left')"
                      alt="align_left"
                    />
                    <img
                      class="tool-icon"
                      src="./icons/align_center.svg"
                      @click="setTextAlign('center')"
                      alt=""
                    />
                    <img
                      class="tool-icon"
                      src="./icons/align_right.svg"
                      @click="setTextAlign('right')"
                      alt=""
                    />
                    <img
                      class="tool-icon"
                      src="./icons/justify_center.svg"
                      @click="setTextAlign('justify-center')"
                      alt=""
                    />
                  </div>

                  <i slot="reference" class="el-icon-s-operation"></i>
                </el-popover> </el-tooltip
              ><br />
            </div>
          </div>
          <canvas id="canvas"></canvas>
        </div>
      </div>
      <!-- 相册效果展示 -->
      <div class="my-album content-right pc">
        <div class="page" v-for="(ctx, i) in myAlbum.data" :key="i">
          <img
            :src="ctx.src"
            alt=""
            height="230"
            width="155"
            @click="togglePage(ctx)"
          />
        </div>
      </div>
    </div>
    <el-dialog
      custom-class="upload-dia"
      title="上传照片"
      :visible="uploadDia"
      center
      width="420px"
      @close="closeUploadDia"
    >
      <el-upload
        class="upload"
        drag
        action="uploadURL"
        multiple
        ref="upload"
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <div slot="footer">
        <el-button type="primary" @click="UploadToService">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Fastclick from "fastclick";
import { fabric } from "fabric";
export default {
  data() {
    return {
      service: "",
      canvas: null,
      canvasInfo: {},
      canvasElements: [],
      album: [],
      myAlbum: {
        id: 0,
        num: 10,
        name: "tony",
        data: [],
        account: 123456
      }, // 用户的设计数据
      showLayer: true,
      dragObject: null,
      selectedObject: null,
      activeType: "", // 当前画布激活的对象的类型
      currentPage: 0, // 当前的照片页
      selectedOCoods: {
        dwX: 0,
        dwY: 0,
        upX: 0,
        upY: 0
      },
      layer: [], // 图层
      iscroping: 0, // 0 未处于裁剪状态，1：处于裁剪阶段1，生成框框，监听dbclick， 2：处于裁剪阶段2,等待dbclick完成裁剪内容并添加到canvas中
      lastPoint: {},
      // 被拖拽的元素
      draged: {
        sourceOffsetX: 0,
        sourceOffsetY: 0
      },
      tab: "material",
      size: 14, // 文字尺寸
      // 画笔
      paintBrush: {
        color: ""
      },
      // 取色器
      bgcolor: "rgba(199, 21, 133, 1)",
      textColorFlag: "textColor", // textColor or textBGColor
      textColor: "rgba(1, 1, 1, 1)",
      fontFamily: "",
      _config: {
        undoStatus: false,
        redoStatus: false,
        currentStateIndex: 0,
        canvasState: []
      },
      // search
      search: {
        materialSearch: ""
      },
      // select Options
      materialOptions: [],
      decorationOptions: [],
      sizeOptions: [],
      fontFamilyOptions: [],
      predefineColors: [],
      // Dialog
      // 上传弹窗
      uploadDia: false,
      uploadURL: process.env.BASE_API + "/decoration/upload",
      fileList: []
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
    setTimeout(() => {
      console.log(
        "process.env",
        process.env.BASE_API,
        "this.uploadURL",
        this.uploadURL
      );
    }, 0);
    Fastclick.attach(document.body);
  },
  mounted() {
    this._config = {
      canvasState: [],
      currentStateIndex: -1,
      isUndoing: 0,
      isRedoing: 0
    };
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
      backgroundColor: "#fff",
      enableRetinaScaling: true,
      fireRightClick: true,
      selection: false,
      preserveObjectStacking: true,
      selection: true,
      snapAngle: 45,
      snapThreshold: 15,
      stateful: true,
      stopContextMenu: true,
      uniformScaling: false,
      uniScaleKey: "ctrlKey"
    });
    // 拉取用户的相册本
    if (this.myAlbum.data.length === 0) {
      let json = this.canvas.toJSON();
      // let cvs = new fabric.Canvas('cvs')
      for (let i = 0; i < this.myAlbum.num; i++) {
        let page = {};
        page.page = i;
        page.canvas = json;
        // 图片展示
        // cvs.loadFromJSON(page.canvas,()=>{
        //   page.src = cvs.toDataURL();
        // })
        this.canvas.loadFromJSON(json, function() {});
        page.src = this.canvas.toDataURL();
        this.myAlbum.data[i] = page;
      }
      this.currentPage = 0;
    } else {
      // 加载拉取的数据
    }
    this.updateCanvasState();
    // console.log("this.canvas", this.canvas.on);
    this.canvas.on("drop", e => {
      // console.log("drop:", e);
      let offsetX = e.e.offsetX;
      let offsetY = e.e.offsetY;
      // console.log(this.dragObject, offsetX, offsetY);
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
          this.canvas.setActiveObject(img);
          // 将图层中的对象变成照片展示到图层面板上
          let item = {};
          item.object = img;
          item.src = img.toDataURL();
          item.show = true;
          this.layer.push(item);
        } else if (this.dragObject.localName === "a") {
          let text = this.dragObject.innerText;
          let textbox = new fabric.Textbox(text, {
            left: offsetX,
            top: offsetY
          });
          this.canvas.add(textbox);
          this.canvas.setActiveObject(textbox);
          let item = {};
          item.object = textbox;
          item.src = textbox.toDataURL();
          item.show = true;
          this.layer.push(item);
        }
        this.canvas.renderAll();
      }
    });
    this.canvas.on("object:modified", e => {
      this.updateCanvasState();
    });
    this.canvas.on("object:added", () => {
      this.updateCanvasState();
    });
    this.canvas.on("object:removed", () => {
      this.updateCanvasState();
    });
    this.canvas.on("selection:created", e => {
      if (this.canvas.getActiveObject() instanceof fabric.Textbox)
        this.activeType = "Textbox";
      else this.activeType = "image";
      this.selectedObject = e.target;
    });
    this.canvas.on("selection:updated", e => {
      if (this.canvas.getActiveObject() instanceof fabric.Textbox)
        this.activeType = "Textbox";
      else this.activeType = "image";
      this.selectedObject = e.target;
    });
    this.canvas.on("selection:cleared", e => {
      this.selectedObject = null;
    });
    this.canvas.on("mouse:down", e => {
      if (this.iscroping) {
        let p = e.absolutePointer;
        this.selectedOCoods.dwX = p.x;
        this.selectedOCoods.dwY = p.y;
      }
    });
    this.canvas.on("mouse:up", e => {
      // 优化，点击裁剪时有蒙版出现，解决移动端如何确定裁剪问题
      if (this.iscroping === 0) void 0;
      if (this.iscroping === 1) {
        let p = e.absolutePointer;
        let oCoods = this.selectedOCoods;
        oCoods.upX = p.x;
        oCoods.upY = p.y;
        let rect = new fabric.Rect({
          left: oCoods.dwX,
          top: oCoods.dwY,
          width: oCoods.upX - oCoods.dwX,
          height: oCoods.upY - oCoods.dwY,
          cornerColor: "#ec7259",
          selectable: true,
          lockRotation: true,
          fill: "rgba(0,0,0,0)"
        });
        this.canvas.add(rect);
        this.canvas.setActiveObject(rect);
        this.canvas.defaultCursor = "auto";
        this.iscroping = 2;
        this.canvas.on("mouse:dblclick", () => {
          if (this.iscroping === 2) {
            oCoods.dwX = rect.aCoords.tl.x;
            oCoods.dwY = rect.aCoords.tl.y;
            oCoods.upX = rect.aCoords.br.x;
            oCoods.upY = rect.aCoords.br.y;
            let src = this.canvas.toDataURL({
              left: oCoods.dwX,
              top: oCoods.dwY,
              width: oCoods.upX - oCoods.dwX,
              height: oCoods.upY - oCoods.dwY
            });
            fabric.Image.fromURL(src, img => {
              img.set({
                selectable: true,
                left:
                  oCoods.dwX + 20 < this.canvasInfo.width
                    ? oCoods.dwX + 20
                    : oCoods.dwX - 20,
                top:
                  oCoods.dwY + 20 < this.canvasInfo.height
                    ? oCoods.dwY + 20
                    : oCoods.dwY - 20,
                width: oCoods.upX - oCoods.dwX,
                height: oCoods.upY - oCoods.dwY
              });
              this.canvas.add(img);
              this.canvas.setActiveObject(img);
              this.canvas.renderAll();
              // 更新状态
              this.updateCanvasState();
              this.iscroping = 0;
              // 记录到图层里边
              this.setToLayer(img);
            });
            this.canvas.remove(rect);
          }
        });
      }
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
      // console.log(e);
      this.draged.sourceOffsetX = e.offsetX;
      this.draged.sourceOffsetY = e.offsetY;
      let obj = e.target;
      this.dragObject = obj;
    },
    /**
     * 素材
     */
    addMaterial() {
      // todo
      this.uploadDia = true;
    },
    updateUploadList(file, fileList) {
      console.log("fileList", fileList);
      this.fileList = fileList;
    },
    handleRemove(file) {
      console.log("file", file, "fileList:", this.fileList);
      this.fileList.forEach((pic, index, fileList) => {
        if (pic.uid == file.uiid) {
          fileList.splice(index, 1);
        }
      });
    },
    handleUploadSuccess(response, file, fileList) {
      console.log("fileList :>> ", fileList);
    },
    UploadToService() {
      //todo
      this.$refs.upload.submit();
    },
    closeUploadDia() {
      this.uploadDia = false;
    },

    /**
     * 工具栏
     */
    // 改变画板各对象的层叠顺序
    setLayerforward(el) {
      el.object.bringForward();
    },
    setLayerbottom(el) {
      el.object.sendBackwards();
    },
    // 隐藏或展示画布中的元素
    updateLayer(el) {
      el.show = !el.show;
      // console.log(el.show);
      if (el.show) el.object.set("visible", true);
      else el.object.set("visible", false);
      this.canvas.renderAll();
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
      if (!this._config.isUndoing && !this._config.isRedoing) {
        var jsonData = this.canvas.toJSON();
        var canvasAsJson = JSON.stringify(jsonData);
        if (
          this._config.currentStateIndex <
          this._config.canvasState.length - 1
        ) {
          // 在撤销过程中，如果有进行更改，那么撤销所在的那一步之后的将会被清空
          var InsertedIndedx = this._config.currentStateIndex + 1;
          this._config.canvasState[InsertedIndedx] = canvasAsJson;
          this._config.canvasState = this._config.canvasState.splice(
            0,
            InsertedIndedx + 1
          );
        } else {
          //如果没在撤销给过程中则直接push进去即可
          this._config.canvasState.push(canvasAsJson);
        }
        // 无论什么情况，只要做了改变，那么当前指针就会跑到最前面
        this._config.currentStateIndex = this._config.canvasState.length - 1;
        console.log("after update :", this._config.currentStateIndex);
      }
      // 更新相册视图，方法是把前一个视图删除掉，然后用限制的视图作为替换，使用splice可以让vue监听到变化，进行响应式交互
      let page = this.myAlbum.data[this.currentPage];
      page.canvas = this.canvas.toJSON();
      page.src = this.canvas.toDataURL();
      page.page = this.currentPage;
      this.myAlbum.data.splice(this.currentPage, 1, page);
    },
    // 撤销
    undo() {
      let cf = this._config;
      if (cf.currentStateIndex < 1) return void 0;
      else {
        cf.isUndoing = 1;
        cf.currentStateIndex -= 1;
        this.canvas.loadFromJSON(cf.canvasState[cf.currentStateIndex], () => {
          this.updateCanvasState();
          this.canvas.renderAll();
          cf.isUndoing = 0;
        });
      }
    },
    // 恢复
    async redo() {
      let cf = this._config;
      if (cf.currentStateIndex < cf.canvasState.length - 1) {
        cf.isRedoing = 1;
        cf.currentStateIndex += 1;
        this.canvas.loadFromJSON(cf.canvasState[cf.currentStateIndex], () => {
          this.canvas.renderAll();
          cf.isRedoing = 0;
        });
      }
    },
    // 删除对象
    deleteSelected(selected) {
      this.layer.forEach((el, index, layer) => {
        if (el.object === selected) layer.splice(index, 1);
      });
      this.canvas.remove(selected);
      this.canvas.renderAll();
    },
    // 复制选中
    copySelected(selected) {
      this.$store.commit("Push_TStack", selected);
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
    // 设置draw模式，可以自由在canvas上绘画
    setDrawMode() {
      this.canvas.isDrawingMode = true;
      this.canvas.defaultCursor = "crosshair";
      console.log("draw:", this.canvas.freeDrawingBrush.color);
      this.canvas.renderAll();
    },
    // 设置画笔颜色
    setPaintColor() {
      this.canvas.freeDrawingBrush.color = this.paintBrush.color;
      this.canvas.renderAll();
    },
    setPaintSize() {
      this.canvas.freeDrawingBrush.width = this.paintBrush.size;
      this.canvas.renderAll();
    },
    startCroping() {
      if (this.iscroping !== 2) {
        // 设置进入裁剪模式
        this.iscroping = 1;
        this.canvas.hasControls = false;
        this.canvas.fill = "rgba(0,200,0,0.8)";
        // 将鼠标样式变成裁剪样式
        this.canvas.defaultCursor = "crosshair";
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
      }
    },
    // 将图片最大化
    maxmize(img) {
      let width = img.width;
      let height = img.height;
      let CWidth = this.canvas.width;
      let CHeight = this.canvas.height;
      let scaleX = CWidth / width;
      let scaleY = CHeight / height;
      img.set({ scaleX: scaleX, scaleY: scaleY });
      img.left = (CWidth - width * img.scaleX) * 0.5;
      img.top = (CHeight - height * img.scaleY) * 0.5;
      this.canvas.fire("object:modified");
      this.canvas.renderAll();
    },
    // 改变文字颜色的模式：文字颜色/文字背景颜色
    setColorFlag(val) {
      this.textColorFlag = val;
    },
    setTextColor(val) {
      requestAnimationFrame(() => {
        if (this.selectedObject) {
          this.selectedObject.set("fill", val);
          this.canvas.renderAll();
        }
      });
    },
    // 改变文字样式
    setFontFamily(val) {
      if (this.selectedObject) {
        this.selectedObject.set("fontFamily", val);
        this.canvas.renderAll();
      }
    },
    // 改变文字大小
    setTextSize(val) {
      this.size = val;
      if (this.selectedObject) {
        this.selectedObject.set("fontSize", val);
        this.canvas.renderAll();
      }
    },
    // 改变文字对齐方式
    setTextAlign(align) {
      // todo
      if (this.selectedObject) {
        this.selectedObject.set("textAlign", align);
      }
      this.canvas.renderAll();
    },
    // 清空画布
    clear() {
      this.canvas.clear();
      this.canvas.set("backgroundColor", "#fff");
      this.updateCanvasState();
      this.canvas.renderAll();
    },
    // 获取图像缩放比例,img的类型为fabric.Image()
    getScale(img) {
      // console.log(img);
      let IH = img.getOriginalSize().height;
      let IW = img.getOriginalSize().width;
      let CH = this.canvas.getHeight();
      let CW = this.canvas.getWidth();
      // 长宽不得规定在画布的0.5倍之内，并优先长宽的较小比例
      let scaleX = IW / (0.5 * CW) > 1 ? (0.5 * CW) / IW : 1;
      let scaleY = IH / (0.5 * CH) > 1 ? (0.5 * CH) / IH : 1;
      let scale = scaleX > scaleY ? scaleY : scaleX;
      return scale;
    },
    // 切换页面
    togglePage(ctx) {
      // console.log(this.currentPage, ctx.page);
      // 重置状态，由于在创建画布的时候初始化了一个状态，所以所以回到这个状态
      this._config.canvasState = this._config.canvasState.slice(0,1);
      if (this.currentPage === ctx.page) return;
      this.myAlbum.data[this.currentPage].canvas = this.canvas.toJSON();
      let canvasJSON = ctx.canvas;
      console.log("切换页面,now the canvas is:", canvasJSON);
      // this.updateCanvasState();
      this.canvas.loadFromJSON(canvasJSON, () => {
        this.layer = [];
        this.canvas.forEachObject(o => {
          this.setToLayer(o);
        });
        this.canvas.renderAll.bind(this.canvas);
      });
      this.currentPage = ctx.page;
      // this.canvas.renderAll();
    },
    // 将对象放到图层里边
    setToLayer(object, boo = true) {
      let item = {};
      item.object = object;
      item.src = object.toDataURL();
      item.show = boo ? true : false;
      this.layer.push(item);
    },

    // H5端
    setOnCanvas(e) {
      let target = e.target;
      // console.log(e);
      if (target.localName === "img") {
        let img = new fabric.Image(target);
        let scale = this.getScale(img);
        img.scale(scale);
        this.canvas.add(img);
        img.left = (this.canvas.width - img.width * img.scaleX) * 0.5;
        img.top = (this.canvas.height - img.height * img.scaleY) * 0.5;
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        this.setToLayer(img);
        this.layer.push(item);
      } else if (target.localName === "a") {
        let text = new fabric.Textbox(target.innerText);
        text.left = (this.canvas.width - text.width) * 0.5;
        text.top = (this.canvas.height - text.height) * 0.5;
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
        let item = {};
        item.object = text;
        item.src = text.toDataURL();
        item.show = true;
        this.layer.push(item);
      }
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
  max-height: 54px;
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
  height: calc(100% - 1.7rem);
  max-height: calc(100% - 54px);
  display: flex;
  @media screen and (max-width: 700px) {
    flex-direction: column-reverse;
  }
  .materials {
    width: 10rem;
    height: 100%;
    background-color: #fff;
    .m-nav {
      width: 100%;
      height: 100%;
      padding: 5px;
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
    .head-tool {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .material-search,
      .decoration-search {
        width: 180px;
      }
    }
    .m-child,
    .d-child {
      width: 100%;
      height: 100%;
      min-width: 220px;
      display: flex;
      flex-wrap: wrap;
      div {
        cursor: pointer;
        width: 100px;
        height: 110px;
        background-color: antiquewhite;
        box-sizing: border-box;
        padding: 5px 2px;
        margin: 5px;
        position: relative;
        img {
          vertical-align: middle;
        }
        .pic-name {
          vertical-align: super;
          width: 60px;
          font-size: 12px;
        }
        &:focus {
          outline: turquoise 2px solid;
        }
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
        width: 45px;
        padding: 0 5px 0 0;
        // height: 100%; // 为什么设置100%反而没有100%了
        background-color: cadetblue;
        text-align: center;
        overflow: auto;
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
        .color-container {
          width: 24px;
          vertical-align: middle;
          margin: 0;
          vertical-align: middle;
        }
      }
      #canvas {
        // background-color: #fff;
      }
    }
  }
  .content-right {
    overflow: auto;
    width: 175px;
    padding: 10px;
    background-color: darkgoldenrod;
  }
  .my-album {
    .page {
      height: 250px;
      img {
        cursor: pointer;
        &:hover,
        &:active,
        &:focus,
        &:visited {
          outline: cyan 1px solid;
        }
      }
    }
    @media screen and (max-width: 700px) {
      height: 100%;
      width: calc(100%);
      overflow: auto;
      .page {
        display: inline-block;
        height: calc(100% - 10px);
        width: 80px;
        background-color: #eeeeee;
      }
    }
  }
}
.icon {
  cursor: pointer;
  &:hover {
    outline: tomato solid 1px;
  }
}
.tool-icon {
  width: 16px;
  height: 16px;
  margin: 10px 0;
  text-align: center;
  cursor: pointer;
  &:hover {
    outline: tomato solid 1px;
  }
}
.layer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: solid 1px #eeeeee;
  padding: 5px;
}
.pc {
  @media screen and (max-width: 700px) {
    display: none;
  }
}
.label {
  font-weight: 700;
  font-size: 14px;
}

.cursor-crosshair {
  cursor: crosshair;
}
.osbottom5 {
  position: relative;
  bottom: 5px;
}
</style>
<style lang="scss">
.el-color-picker {
  // width: fit-content!important;
  display: inline-block;
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
.color-container {
  width: 24px;
  vertical-align: middle;
  margin: 0;
  vertical-align: middle;
}
.upload-dia {
  .upload {
    .el-upload-list {
      max-height: 10rem;
      overflow: auto;
    }
  }
}
</style>
