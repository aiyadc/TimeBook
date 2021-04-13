<!-- 设计页 -->
<template>
  <div class="diy">
    <!-- 顶部工具栏 -->
    <div class="nav">
      <div class="nav-left"><p>DIY</p></div>
      <div class="nav-right">
        <el-button type="text" size="small" circle>
          <i class="el-icon-share"></i><span>分享</span>
        </el-button>
        <el-button
          type="text"
          size="small"
          circle
          @click="reviewAlbum"
          v-loading="saveAlbumLoading"
        >
          <i class="el-icon-view"></i><span>预览</span></el-button
        >
        <el-button type="text" size="small" @click="toSort" circle>
          <i class="el-icon-sort"></i><span>排序</span></el-button
        >
        <el-button type="text" size="small" @click="saveMyAlbum" circle>
          <i class="el-icon-finished"></i><span>保存</span></el-button
        >
        <el-button type="text" size="small" circle @click="resetSize">
          <i class="el-icon-position"></i><span>提交</span></el-button
        >
      </div>
    </div>

    <div class="content">
      <!-- 素材部分 -->
      <div class="materials">
        <div class="m-nav">
          <div class="nav-tool h5">
            <div class="inline-block" v-if="tab == 'material'">
              <img
                class="tool-icon mr0"
                src="./icons/folder_add.svg"
                @click="addMaterialFolder"
              />
              <i
                class="el-icon-plus tool-icon"
                @click="addMaterial"
                v-if="!isCheck"
              ></i>
              <i
                class="el-icon-delete tool-icon"
                @click="removeMaterial"
                v-if="isCheck"
              ></i>
              <el-button type="text" @click="cancelCheck" v-if="isCheck"
                >取消</el-button
              >
            </div>

            <el-button
              class="text-btn"
              type="text"
              icon="el-icon-star-off"
              @click="folderDia = !folderDia"
              >目录</el-button
            >
          </div>
          <el-tabs
            class="m-tab"
            v-model="tab"
            :tab-position="platform === 'pc' ? 'left' : 'top'"
            @tab-click="handleTabClick"
          >
            <!-- 系统素材 -->
            <el-tab-pane name="decoration" label="装饰">
              <div class="head-tool">
                <el-input
                  class="decoration-search pc"
                  v-model="search.materialSearch"
                  size="small"
                  placeholder="可输入照片名进行搜索"
                  suffix-icon="el-icon-search"
                ></el-input>
              </div>
              <div class="d-content">
                <el-collapse class="pc" v-model="dCollapse">
                  <el-collapse-item name="1" title="我的装饰屋">
                    <folder
                      v-for="(d, i) in decorationFolderList"
                      :key="i"
                      :tabindex="d.folderid"
                      :name="d.name"
                      @folder-click="toDFolder(d.folderid)"
                    ></folder>
                  </el-collapse-item>
                </el-collapse>
                <template v-if="decorationList.length">
                  <div
                    class="decoration"
                    v-for="(d, i) in decorationList"
                    :key="i"
                    :tabindex="i"
                  >
                    <img
                      crossOrigin="Anonymous"
                      :src="d.src"
                      :alt="d.name"
                      :width="service === 'pc' ? 94 : 76"
                      :height="service === 'pc' ? 90 : 70"
                      @dragstart="dragstart"
                      @touchend="setOnCanvas($event)"
                    />
                  </div>
                </template>
                <div class="empty-tips" v-else>未选择目录或此目录没有照片~</div>
              </div>
            </el-tab-pane>
            <!-- 我的素材 -->
            <el-tab-pane name="material" label="素材">
              <div class="head-tool">
                <el-input
                  class="material-search pc"
                  v-model="search.materialSearch"
                  size="small"
                  placeholder="可输入照片名进行搜索"
                  suffix-icon="el-icon-search"
                ></el-input>
                <div class="m-tool pc">
                  <img
                    class="tool-icon"
                    src="./icons/folder_add.svg"
                    @click="addMaterialFolder"
                  />
                  <i class="el-icon-plus tool-icon" @click="addMaterial"></i>
                  <i
                    class="el-icon-delete tool-icon"
                    @click="removeMaterial"
                  ></i>
                  <el-button
                    type="danger"
                    size="mini"
                    plain
                    @click="toMultiCheckMode"
                    >批量删除</el-button
                  >
                </div>
              </div>
              <div class="m-content">
                <div class="m-folders pc">
                  <el-collapse v-model="mCollapse">
                    <el-collapse-item name="1" title="我的素材库">
                      <folder
                        v-for="(f, i) in materialFolderList"
                        :key="i"
                        :tabindex="f.mlid"
                        :name="f.name"
                        :show-edit="true"
                        @folder-click="toMFolder(f.mlid)"
                        @edit="updateMaterialFolder(f)"
                        @delete="deleteMaterialFolder(f)"
                      ></folder>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <el-checkbox-group
                  :class="{ 'm-checkbox': true, 'no-select': !isCheck }"
                  v-model="checkedMaterials"
                  v-if="materialList.length"
                >
                  <el-checkbox
                    v-for="(m, i) in materialList"
                    :label="m.mid"
                    :key="i"
                    :tabindex="i"
                  >
                    <img
                      :src="m.src"
                      :alt="m.name"
                      :width="service === 'pc' ? 94 : 76"
                      :height="service === 'pc' ? 90 : 70"
                      :draggable="service == 'pc' ? true : false"
                      crossOrigin="Anonymous"
                      @dragstart="dragstart"
                      @touchstart="calcTimeStart"
                      @touchmove="setMaterialFlag"
                      @touchend="setOnCanvas($event)"
                    />
                  </el-checkbox>
                </el-checkbox-group>
                <div class="empty-tips" v-else>未选择目录或此目录没有照片~</div>
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
            <!-- 我的相册，H5中才有显示 -->
            <el-tab-pane name="album" label="相册" v-if="service === 'h5'">
              <div class="my-album-h5">
                <div class="page" v-for="(ctx, i) in myAlbum.data" :key="i">
                  <img :src="ctx.src" draggable @click="togglePage(ctx)" />
                  <span>{{ ctx.index }}</span>
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
            <el-popover placement="bottom" trigger="click">
              <!-- <i slot="reference" class="el-icon-s-order"></i> -->
              <img
                class="tool-icon"
                slot="reference"
                src="./icons/layer.svg"
                alt="layer"
              />
              <br />
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
                  <i
                    class="el-icon-top tool-icon"
                    @click="setLayerforward(el)"
                  ></i>
                  <i
                    class="el-icon-bottom tool-icon mr10-x"
                    @click="setLayerbottom(el)"
                  ></i
                  ><i
                    class="el-icon-delete tool-icon"
                    @click="deleteSelected(el.object)"
                  ></i>
                </div>
              </div>
            </el-popover>

            <el-color-picker
              class="color tool-icon"
              v-model="bgcolor"
              show-alpha
              :predefine="predefineColors"
              @change="setBGColor"
              @active-change="setBGColor"
            >
            </el-color-picker>
            <img
              class="tool-icon"
              id="undo"
              :draggable="false"
              src="./icons/undo.svg"
              @click="undo"
            /><br />

            <img
              id="redo"
              class="tool-icon"
              src="./icons/redo.svg"
              @click="redo"
              alt="redo"
            />
            <!-- <i id="redo" class="el-icon-right" @click="redo"></i> -->
            <br />

            <img
              class="tool-icon"
              src="./icons/clear.svg"
              @click="clear"
              alt="clear"
            />
            <br />

            <img
              class="tool-icon"
              src="./icons/crop.svg"
              @click="startCroping"
              alt=""
            />
            <br />

            <el-popover v-model="paintDia" placement="left" trigger="click">
              <div>
                <span class="label">尺寸:{{ paintBrush.size }}</span>
                <el-slider
                  v-model="paintBrush.size"
                  :show-tooltip="false"
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
                  <div>
                    <el-button type="primary" size="mini" @click="toPaintMode()"
                      >确定</el-button
                    >
                    <el-button
                      type="default"
                      size="mini"
                      @click="closePaintMode()"
                      >退出</el-button
                    >
                  </div>
                </div>
              </div>
              <img
                slot="reference"
                class="tool-icon"
                src="./icons/draw.svg"
                alt="draw"
              />
            </el-popover>

            <br />
            <img
              class="tool-icon"
              src="./icons/write.svg"
              @click="setwriteMode"
            />
            <br />
            <div class="image-tool">
              <img
                class="tool-icon"
                src="./icons/maxmize.svg"
                @click="maxmize(canvas.getActiveObject())"
              />

              <br />

              <img
                class="tool-icon"
                src="./icons/copy.svg"
                @click="copySelected(canvas.getActiveObject())"
                alt="copy"
              />
              <br />

              <img
                class="tool-icon"
                src="./icons/paste.svg"
                @click="pasteSelected"
                alt="paste"
              /><br />

              <img
                class="tool-icon"
                src="./icons/delete.svg"
                @click="deleteSelected(canvas.getActiveObject())"
                alt="delete"
              /><br />
            </div>
            <div class="text-tool" v-show="activeType === 'Textbox'">
              <el-color-picker
                class="color-container"
                v-model="textColor"
                show-alpha
                :predefine="predefineColors"
                @change="setTextColor"
                @active-change="setTextColor"
              >
              </el-color-picker>

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
              <span class="icon" slot="reference">文</span> <br />

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

              <br />

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
              </el-popover>
              <br />
            </div>
          </div>
          <canvas id="canvas"></canvas>
        </div>
      </div>
      <!-- 相册效果展示 -->
      <div class="my-album-pc content-right pc">
        <div class="page" v-for="(ctx, i) in myAlbum.data" :key="i">
          <img
            height="230"
            width="155"
            :src="ctx.src"
            :draggable="true"
            @dragstart="getPageInfo(ctx)"
            @dragover="handleDragOver($event, i)"
            @click="togglePage(ctx)"
          />
        </div>
      </div>
    </div>
    <el-dialog
      custom-class="upload-dia"
      title="上传照片"
      :visible.sync="uploadDia"
      center
      :width="service === 'pc' ? '420px' : '100vw'"
    >
      <el-upload
        class="upload"
        drag
        list-type="picture-card"
        action="uploadURL"
        multiple
        ref="upload"
        :auto-upload="false"
        :on-change="updateUploadList"
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
    <div
      id="pageBall"
      class="h5"
      draggable
      @click="handleBallClick"
      @touchstart="handleBallMoveStart"
      @touchmove="handleBallMove"
      @touchend="handleBollMoveEnd"
    >
      <img
        class="tool-icon center-center"
        src="./icons/crop.svg"
        v-if="mode == 'crop'"
      />
      <img
        class="tool-icon center-center"
        src="./icons/quit.svg"
        v-if="mode == 'paint'"
      />
    </div>
    <div id="rect">
      <div class="feature-icon"></div>
    </div>
    <el-dialog custom-class="dia-sort" title="排序" :visible.sync="sortDia">
      <div class="sort-container">
        <div
          class="sort"
          v-for="(ctx, i) in myAlbum.data"
          :key="i"
          @click="maskSwap($event, i)"
        >
          <img
            class="sort-pic"
            :src="ctx.src"
            :draggable="true"
            @dragstart="getPageInfo(ctx)"
            @dragover="handleDragOver($event, i)"
          />
          <span class="order-number">{{ ctx.index }}</span>
          <img class="svg-apple" src="./icons/apple.svg" />
        </div>
      </div>
    </el-dialog>
    <!-- 预览弹窗 -->
    <review
      :dataList="reviewList"
      :ish5="service == 'h5'"
      :visible="reviewDia"
    ></review>
    <!-- <el-dialog
      custom-class="dia-review"
      :visible.sync="reviewDia"
      :fullscreen="service == 'h5'"
    >
      <span slot="title">My Album</span>
      <div class="review-pc">
        <img class="review-page" :src="reviewImg.src" alt="" />
        <img
          class="svg svg-left"
          src="./icons/left.svg"
          @click="toPrePage"
          v-show="reviewImg.index > 0"
        />
        <img
          class="svg svg-right"
          src="./icons/right.svg"
          @click="toNextPage"
          v-show="reviewImg.index < myAlbum.count - 1"
        />
        <span class="page-index"
          >{{ reviewImg.index + 1 || 0 }}/{{ myAlbum.count || 0 }}</span
        >
      </div>
    </el-dialog> -->
    <div class="folders" v-if="folderDia">
      <template v-if="tab === 'material'">
        <folder
          v-for="(f, i) in materialFolderList"
          :key="i"
          :name="f.name"
          @folder-click="toMFolder(f.mlid)"
          @edit="updateMaterialFolder(f)"
          @delete="deleteMaterialFolder(f)"
        >
        </folder>
      </template>
      <template v-if="tab === 'decoration'">
        <folder
          v-for="(d, i) in decorationFolderList"
          :key="i"
          :name="d.name"
          @folder-click="toDFolder(d.folderid)"
        >
        </folder>
      </template>
    </div>
  </div>
</template>
<script>
import inobounce from "inobounce";
import Fastclick from "fastclick";
import { fabric } from "fabric";
import material from "@/api/material.js";
import decorationRequest from "@/api/decoration.js";
import albumRequest from "@/api/album.js";
import Folder from "./components/folder.vue";
import Review from "@/components/Review/index.vue";
export default {
  components: {
    Folder,
    Review
  },
  data() {
    return {
      uid: 0, // 当前用户id
      aid: 0, // 当前相册本id
      service: "", // 当前操作平台
      tab: "decoration", // 当前tab栏
      mode: "default", // 当前设计模式['default','crop','paint','featureshow']
      canvas: null,
      canvasInfo: {},
      album: [],
      myAlbum: {
        aid: 1,
        tid: 1,
        width: 0,
        height: 0,
        cover_url: "",
        count: 10,
        name: "秦时明月",
        data: []
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
      layer: [], // 图层{object,src,show}
      lastPoint: {},
      // 被拖拽的元素
      draged: {
        sourceOffsetX: 0,
        sourceOffsetY: 0
      },
      dragBall: {
        width: 40,
        height: 40,
        offsetX: 0,
        offsetY: 0,
        nowX: 0,
        nowY: 0,
        rectdirection: "right"
      },
      size: 14, // 文字尺寸
      // 画笔
      paintBrush: {
        size: 1,
        color: "rgba(0,0,0,1)"
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
      // Options
      sizeOptions: [],
      fontFamilyOptions: [],
      predefineColors: [],
      // tab板块
      // 我的素材
      mlid: 0, // 用户当前点击的素材目录id
      checkMode: "singleCheck", // sigleCheck/multiCheck ：单选和多选
      curFolder: "",
      materialList: [],
      materialFolderList: [],
      checkedMaterials: [],
      checkedMaterial: null,
      // 文本
      // 装饰
      folderid: 0, // 用户当前点击的装饰目录id
      decorationList: [],
      decorationFolderList: [],
      // 上传
      uploadDia: false,
      uploadURL: "",
      fileList: [],
      // flag
      moveFlag: 0, // 拖动标志
      longClick: 0, // 长按标志
      isCheck: false, //是否处于多选状态
      iscroping: 0, // 0 未处于裁剪状态，1：处于裁剪阶段1，生成框框，监听dbclick， 2：处于裁剪阶段2,等待dbclick完成裁剪内容并添加到canvas中
      ballMove: false, // 悬浮球移动标志
      // 计时器
      timeInterval: null,
      timer: 0,
      // 裁剪
      mask: null,
      selectRect: null,
      // 相册页拖动交换顺序
      pageOnDrag: null,
      pageIndex: null,
      AppleShow: false,
      swapFirst: null,
      // 相册预览
      reviewList: [],
      // Dialog
      paintDia: false, // 绘画popover
      sortDia: false,
      reviewDia: false,
      folderDia: false,
      // 折叠面板
      mCollapse: ["1"],
      dCollapse: ["1"],
      tCollapse: ["1"],
      // Loading
      saveAlbumLoading: false
    };
  },

  computed: {
    platform() {
      let service = this.$store.state.platform;
      this.service = service;
      return service;
    }
  },
  watch: {
    platform(val) {
      location.reload();
    }
  },
  created() {
    this.aid = this.$route.params.aid;
    console.log("this.aid :>> ", this.aid);
    this.uid = this.$store.state.uid;
    this.uploadURL = process.env.BASE_API + "/decoration/upload";
    let u = navigator.userAgent;
    window.addEventListener(
      "touchmove",
      e => {
        // console.log(e.target)
        if (e.target.localName !== "img") {
          // 禁止ios页面移动回弹
          if (u.indexOf("iPhone") > -1) {
            inobounce.enable();
          }
        }
      },
      { passive: false }
    );
    document.οncοntextmenu = function(e) {
      console.log("οncοntextmenu");
      e.preventDefault();
    };
    document.addEventListener("contextmenu", function(e) {
      e.preventDefault();
    });
    // Fastclick.attach(document.body);
  },
  beforeDestroy() {
    inobounce.disable();
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
    let width = draw.clientWidth - 45;
    let canvasW, canvasH;
    let scale = this.platform === "pc" ? 0.8 : 1;
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
    // 拉取相册信息
    if (this.aid) {
      this.initDIY();
    }
    this.canvas.on("drop", e => {
      console.log("drop:", e);
      let offsetX = e.e.offsetX;
      let offsetY = e.e.offsetY;
      console.log(this.dragObject, offsetX, offsetY);
      // console.log(this.dragObject, offsetX, offsetY);
      if (this.dragObject && offsetX > 0 && offsetY > 0) {
        if (this.dragObject.localName === "img") {
          let img = new fabric.Image(this.dragObject, {
            left: offsetX - this.draged.sourceOffsetX,
            top: offsetY - this.draged.sourceOffsetY
          });
          let scale = this.getScale(img);
          // tofix:照片放到画布未立即显示
          img.scale(scale); // 将图像缩小至同等比例
          console.log("dragObject.src", this.dragObject.src);
          this.canvas.add(img);
          this.canvas.setActiveObject(img);
          console.log("this.canvas :>> ", this.canvas);
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
        console.log("this.canvas :>> ", this.canvas);
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
      console.log("selection :>> ", e.target);
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
    this.canvas.on("mouse:dblclick", () => {
      if (this.iscroping === 2) {
        console.log("截取选中区域");
        this.cropSelect(); //截取选中区域
      }
    });
    this.canvas.on("mouse:up", e => {
      // 解决popover弹出框在点击canvas后并没有关闭问题
      document.getElementById("canvas").click();
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
          transparentCorners: true,
          touchCornerSize: 5,
          selectable: true,
          lockRotation: true,
          fill: "rgba(255,255,255,5)",
          opacity: 0.2
        });
        this.canvas.add(rect);
        this.selectRect = rect;
        this.canvas.setActiveObject(rect);
        this.canvas.defaultCursor = "auto";
        this.iscroping = 2;
        this.mode = "crop";
      }
      if (this.mode == "write") {
        let p = e.absolutePointer;
        let textbox = new fabric.Textbox("请输入内容", {
          left: p.x,
          top: p.y,
          fontSize: 24
        });
        console.log("textbox.fontSize :>> ", textbox.fontSize);
        this.canvas.add(textbox);
        this.canvas.setActiveObject(textbox);
        this.canvas.defaultCursor = "default";
        this.canvas.renderAll();
        this.mode = "default";
        console.log("canvas:", this.canvas);
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

    this.decorationList = [
      {
        did: 0,
        theme: "dog",
        name: "dd",
        width: 50,
        height: 50,
        src: require("@/assets/dd.jpg")
      },
      {
        did: 1,
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
    // 监听按键
    document.addEventListener("keyup", e => {
      let extra = e.ctrlKey ? "ctrl_" : e.altKey ? "alt_" : "";
      let key = extra + e.key.toLowerCase();
      switch (key) {
        case "delete":
          this.deleteSelected();
          break;
        case "ctrl_z":
          this.undo();
          break;
        case "ctrl_y":
          this.redo();
          break;
        default:
          break;
      }
    });
  },
  methods: {
    // 重置canvas大小
    resetSize() {
      console.log("重置大小");
      let w = this.canvas.width * 0.8;
      let h = this.canvas.height * 0.8;
      let w1 = this.canvas.width / 0.8;
      let h1 = this.canvas.height / 0.8;
      this.canvas.setDimensions(
        { width: w, height: h },
        { backstoreOnly: true }
      );
      this.canvas.renderAll();
      this.$nextTick(() => {
        this.canvas.setDimensions(
          { width: w1, height: w1 },
          {
            backstoreOnly: true
          }
        );
        this.canvas.renderAll();
      });
    },
    // 初始化界面
    async initDIY() {
      this.getDecorationFolders(); // 获取系统素材目录
      //   获取相册信息
      console.log("初始化：this.aid :>> ", this.aid);
      await albumRequest.getAlbumInfo(this.aid).then(res => {
        console.log("res :>> ", res);
        this.myAlbum = res.data;
        // 如果该相册没有数据，则创建空白相册
        if (!this.myAlbum.data.length) {
          let json = this.canvas.toJSON();
          // let cvs = new fabric.Canvas('cvs')
          for (let i = 0; i < this.myAlbum.count; i++) {
            let page = {};
            page.index = i;
            page.canvas = json;
            // 图片展示
            this.canvas.loadFromJSON(json, function() {});
            page.src = this.canvas.toDataURL();
            this.myAlbum.data[i] = page;
          }
          this.currentPage = 0;
        } else {
          // 使画布整体按一定比例缩放
          let scale =
            res.data.width !== 0 ? this.canvas.width / res.data.width : 1;
          console.log("res.data.width :>> ", scale);
          console.log("this.canvas.width :>> ", this.canvas.width);
          this.canvas.setZoom(scale);
          console.log("this.canvas.width :>> ", this.canvas.width);
          this.myAlbum.data.forEach(album => {
            album.canvas = JSON.parse(album.canvas);
          });
          // 将第一页的canvas赋给画布呈现出来
          this.canvas.loadFromJSON(this.myAlbum.data[0].canvas);
        }
        this.updateCanvasState();
      });
    },
    // 处理Tab标签点击事件
    handleTabClick(tab) {
      switch (tab.name) {
        case "material":
          this.getMaterialFolders();
          break;
        case "decoration":
          this.getDecorationFolders();
          break;
        case "text":
          this.getTextFolders();
          break;
        default:
          this.getMaterialFolders();
      }
    },
    // 拖动其他地方的图像到canvas
    dragstart(e) {
      console.log("aaaaa");
      this.draged.sourceOffsetX = e.offsetX;
      this.draged.sourceOffsetY = e.offsetY;
      let obj = e.target;
      this.dragObject = obj;
    },
    /**
     * common
     */
    /**
     * 素材
     */
    // 展示素材文件夹的相关操作图标
    showMoreTool(e) {
      let t = e.target.parentElement.getElementsByClassName("box-more")[0];
      console.log("t.style.display :>> ", t.style.display);
      if (!t.style.display || t.style.display == "none") {
        t.style.display = "inline-block";
      } else {
        console.log("aaa");
        t.style.display = "none";
      }
    },
    // 进入多选模式
    toMultiCheckMode() {
      this.isCheck = !this.isCheck;
    },
    // 获取用户素材目录
    getMaterialFolders() {
      console.log("typeof this.uid :>> ", typeof this.uid);
      material.getFolders(this.uid).then(res => {
        console.log("res :>> ", res.data);
        this.materialFolderList = res.data;
      });
    },
    // 添加素材目录
    addMaterialFolder() {
      console.log("this.mlid :>> ", this.mlid);
      this.$prompt("请输入目录名", "创建目录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /.+/,
        inputErrorMessage: "目录名称不能为空"
      }).then(async ({ value }) => {
        console.log("value :>> ", value);
        await material.addFolder({ name: value }, this.uid);
        await this.getMaterialFolders();
      });
    },
    // 更新素材目录
    updateMaterialFolder(f) {
      console.log("更新相册");
      this.$prompt("请输入新的目录名", "修改名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        material.updateFolder({ name: value }, f.mlid);
        this.materialFolderList.forEach(folder => {
          if (folder.mlid === f.mlid) {
            console.log("folder.mlid,f.mlid :>> ", folder.mlid, f.mlid);
            folder.name = value;
          }
        });
      });
    },
    // 删除素材目录
    deleteMaterialFolder(f) {
      this.$confirm("确定要删除该目录吗，目录中的图片也将会被删除噢", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger"
      }).then(() => {
        material.deleteFolder(f.mlid).then(res => {
          this.$message.success("删除成功");
          this.materialFolderList.forEach((folder, i, list) => {
            if (folder.mlid === f.mlid) {
              list.splice(i, 1);
            }
          });
          this.materialList = [];
        });
      });
    },
    // 展示指定素材目录中的素材
    toMFolder(mlid) {
      if (this.mlid == mlid) {
        return;
      } else {
        this.mlid = mlid;
        material.getMaterials(mlid).then(res => {
          this.materialList = res.data;
        });
      }
    },
    // 添加素材
    addMaterial() {
      this.uploadDia = true;
    },
    // 将点击的图片设为选中：单选模式
    setSelected(m) {
      this.checkedMaterial = m.mid;
      console.log("this.checkedMaterial :>> ", this.checkedMaterial);
    },
    // 删除选中图片
    removeMaterial() {
      if (this.checkedMaterials.length || this.checkedMaterial) {
        this.$confirm("确定要删除选中的图片吗？", "提示", {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            //   material.deleteMaterial()
            if (!this.isCheck) {
              this.checkedMaterials = [this.checkedMaterial];
            }
            material.deleteMaterial(this.checkedMaterials).then(res => {
              this.$message.success(res.message);
              this.isCheck = false;
              console.log("this.checkedMaterials :>> ", this.checkedMaterials);
              this.materialList = this.materialList.filter((m, i, list) => {
                if (!this.checkedMaterials.includes(m.mid)) {
                  return m;
                  this.timer = 0;
                  // 发送请求，从数据库移除
                  // 更新视图，将图片从画布中移除(暂未加上object属性)
                  // this.canvas.remove(m.object)
                }
              });
            });
          })
          .catch(() => {});
      } else {
        this.$message.warning("请先选择图片");
      }
    },
    // 取消选中
    cancelCheck() {
      this.isCheck = false;
      this.timer = 0;
    },
    // 更新添加的素材图片
    updateUploadList(file, fileList) {
      this.fileList = fileList;
    },
    // 处理上传框中的图片删除
    handleRemove(file) {
      console.log("file", file, "fileList:", this.fileList);
      this.fileList.forEach((pic, index, fileList) => {
        if (pic.uid == file.uiid) {
          fileList.splice(index, 1);
        }
      });
    },
    // 处理上传成功事件
    handleUploadSuccess(response, file, fileList) {
      console.log("fileList :>> ", fileList);
    },
    // 将图片上传到服务器
    UploadToService() {
      //todo
      if (this.fileList.length !== 0) {
        let canvas = document.createElement("canvas");
        canvas.id = "materialCanvas";
        canvas = new fabric.Canvas("materialCanvas");
        new Promise((resolve, reject) => {
          let imgData = [];
          this.fileList.forEach(async (img, index, fileList) => {
            // console.log("img :>> ", img);
            new fabric.Image.fromURL(img.url, image => {
              // 创建Image元素，获取相关图片的原始width和height,
              let newIMG = new Image();
              newIMG.src = img.url;
              // console.log("newIMG.src :>> ", newIMG.src);
              console.dir(newIMG);
              image.set({
                width: newIMG.width,
                height: newIMG.height,
                name: img.name
              });
              canvas.set({
                width: newIMG.width,
                height: newIMG.height
              });
              canvas.add(image);
              let src = canvas.toDataURL();
              let obj = {};
              obj.mid = index;
              obj.theme = "unknow";
              obj.name = img.name.replace(/(\.jpg)$|(\.png)$/, "");
              obj.width = 94;
              obj.height = 90;
              obj.src = (src + "").replace(/^data:image\/\w+;base64,/, "");
              obj.mlid = this.mlid;
              imgData.push(obj);
              canvas.clear();
              if (index == this.fileList.length - 1) {
              }
              if (index == fileList.length - 1) {
                resolve(imgData);
              }
            });
          });
        }).then(imgData => {
          this.uploadDia = false;
          material.uploadMore({ data: imgData }).then(res => {
            console.log("this.mlid :>> ", this.mlid);
            material.getMaterials(this.mlid).then(res => {
              this.materialList = res.data;
            });
          });
        });
      } else {
        this.$message.warning("请先上传照片");
      }
    },

    /**
     * 装饰
     */
    getDecorationFolders() {
      decorationRequest.getFolders().then(res => {
        this.decorationFolderList = res.data;
      });
    },
    toDFolder(folderid) {
      if (this.folderid == folderid) {
        return;
      } else {
        this.folderid = folderid;
        decorationRequest.getDecorations({ folderid }).then(res => {
          this.decorationList = res.data;
        });
      }
    },
    /**
     * 文字
     */
    getTextFolders() {},
    /**
     * 相册页展示
     *
     */
    getPageInfo(page) {
      this.pageOnDrag = page;
    },
    handleDragOver(e, i) {
      e.preventDefault();
      this.pageIndex = i;
      if (this.pageIndex == this.pageOnDrag.index) return;
      this.swap();
    },
    swap() {
      console.log("进入到交换环节");
      let indexNow = this.pageOnDrag.index;
      let indexNext = this.pageIndex;
      let len = Math.abs(indexNow - indexNext);
      let albums = this.myAlbum.data;
      let p = Object.assign({}, albums[indexNow]);
      albums.splice(indexNow, 1, albums[indexNext]);
      albums.splice(indexNext, 1, p);
      if (indexNow > indexNext) {
        albums[indexNow].index += len;
        albums[indexNext].index -= len;
      } else if (indexNow < indexNext) {
        albums[indexNow].index -= len;
        albums[indexNext].index += len;
      }
      this.pageOnDrag = albums[indexNext];
      this.currentPage = indexNext; //更新页码
    },

    /**
     * 排序
     */
    toSort() {
      console.log("排序");
      this.sortDia = true;
    },
    maskSwap(e, i) {
      if (this.swapFirst == null) {
        // 标记要交换的对象
        let sortDIV = e.target.parentElement;
        this.pageOnDrag = this.myAlbum.data[i];
        sortDIV.classList.add("show-apple");
        this.swapFirst = i;
        console.log("this.swapFirst :>> ", this.swapFirst);
      } else if (this.swapFirst == i) {
        let sortDIV = e.target.parentElement;
        this.pageIndex = null;
        console.log("sortDIV,second :>> ", sortDIV);
        sortDIV.classList.remove("show-apple");
        this.swapFirst = null;
      } else {
        this.pageIndex = i;
        this.swap();
        let sortContainer = document.getElementsByClassName(
          "sort-container"
        )[0];
        let sortDIV = sortContainer.getElementsByClassName("show-apple")[0];
        sortDIV.classList.remove("show-apple");
        this.swapFirst = null;
      }
    },

    /**
     * 预览
     */
    reviewAlbum() {
      this.reviewDia = true;
      this.reviewList = this.myAlbum.data.map(page => {
        return page.src;
      });
      console.log("this.reviewList :>> ", this.reviewList);
    },
    toPrePage() {
      this.reviewIndex -= 1;
    },
    toNextPage() {
      this.reviewIndex += 1;
    },
    /**
     * 保存相册
     */
    saveMyAlbum() {
      this.saveAlbumLoading = true;
      console.log("this.canvas.width :>> ", this.canvas.width);
      console.log("this.canvas.height :>> ", this.canvas.height);
      this.myAlbum.width = this.canvas.width;
      this.myAlbum.height = this.canvas.height;
      console.log("this.myAlbum :>> ", this.myAlbum);
      this.myAlbum.data.forEach(album => {
        if (typeof album.canvas !== "string")
          album.canvas = JSON.stringify(album.canvas);
      });
      albumRequest
        .updateAlbum(this.myAlbum, this.aid)
        .then(res => {
          this.$message.success("保存成功");
          this.saveAlbumLoading = false;
        })
        .catch(() => {
          this.saveAlbumLoading = false;
        });
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
        this.canvas.setBackgroundColor(color, () => {
          console.log("aaaa");
          this.canvas.renderAll();
          this.updateCanvasState();
        });
      });
    },
    // updateCanvasState
    updateCanvasState() {
      console.log("更新视图");
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
      }
      // 更新图层视图
      this.layer = [];
      this.canvas.forEachObject(o => {
        // console.log("o:", o);
        this.setToLayer(o);
      });
      // 更新相册视图，方法是把前一个视图删除掉，然后用限制的视图作为替换，使用splice可以让vue监听到变化，进行响应式交互
      let page = this.myAlbum.data[this.currentPage];
      page.canvas = this.canvas.toJSON();
      page.src = this.canvas.toDataURL();
      page.index = this.currentPage;
      this.myAlbum.data.splice(this.currentPage, 1, page);
    },
    // 取出画布现有对象
    getObjects(canvas) {},
    // 撤销
    undo() {
      let cf = this._config;
      if (cf.currentStateIndex < 1) return void 0;
      else {
        cf.isUndoing = 1;
        cf.currentStateIndex -= 1;
        this.canvas.loadFromJSON(cf.canvasState[cf.currentStateIndex], () => {
          this.canvas.renderAll();
          cf.isUndoing = 0;
          // 更新相册视图，方法是把前一个视图删除掉，然后用限制的视图作为替换，使用splice可以让vue监听到变化，进行响应式交互
          let page = this.myAlbum.data[this.currentPage];
          console.log("page :>> ", page);
          page.canvas = this.canvas.toJSON();
          page.src = this.canvas.toDataURL();
          page.index = this.currentPage;
          this.myAlbum.data.splice(this.currentPage, 1, page);
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
          // this.updateCanvasState()
        });
      }
    },
    // 删除对象
    deleteSelected(selected) {
      console.log("test :>> ");
      this.canvas.remove(selected || this.selectedObject);
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
    // 设置画笔颜色
    setPaintColor() {
      this.canvas.freeDrawingBrush.color = this.paintBrush.color;
      this.canvas.renderAll();
    },
    setPaintSize() {
      this.canvas.freeDrawingBrush.width = this.paintBrush.size;
      this.canvas.renderAll();
    },
    toPaintMode() {
      // 设置draw模式，可以自由在canvas上绘画
      this.mode = "paint";
      this.canvas.isDrawingMode = true;
      this.canvas.defaultCursor = "crosshair";
      console.log("draw:", this.canvas.freeDrawingBrush.color);
      this.canvas.renderAll();
      this.paintDia = false;
    },
    closePaintMode() {
      this.canvas.isDrawingMode = false;
      this.paintDia = false;
    },
    // 写字
    setwriteMode() {
      // 进入写字模式
      this.mode = "write";
      this.canvas.defaultCursor = "cell";
      this.isWriting = true;
    },
    startCroping() {
      if (this.iscroping === 0) {
        // 设置进入裁剪模式
        this.iscroping = 1;
        this.canvas.hasControls = false;
        // 创建一个蒙版
        this.mask = new fabric.Rect({
          fill: "rgba(0,0,0,5)",
          opacity: 0.2,
          width: this.canvas.width,
          height: this.canvas.height,
          hasControls: false,
          hoverCursor: "crosshair",
          moveCursor: "crosshair",
          evented: false
        });
        this.canvas.add(this.mask);
        this.canvas.discardActiveObject();
        // this.canvas.fill = "rgba(0,200,0,0.8)";
        // 将鼠标样式变成裁剪样式
        this.canvas.defaultCursor = "crosshair";
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
      } else if (this.iscroping > 0) {
        this.canvas.remove(this.selectRect);
        this.canvas.remove(this.mask);
        this.canvas.defaultCursor = "default";
        this.iscroping = 0;
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
      console.log("IH,IW :>> ", IH, IW);
      let CH = this.canvas.getHeight();
      let CW = this.canvas.getWidth();
      console.log("CH,CW :>> ", CH, CW);
      // 长宽不得规定在画布的0.5倍之内，并优先长宽的较小比例
      let scaleX = IW / (0.5 * CW) > 1 ? (0.5 * CW) / IW : 1;
      let scaleY = IH / (0.5 * CH) > 1 ? (0.5 * CH) / IH : 1;
      let scale = scaleX > scaleY ? scaleY : scaleX;
      return scale;
    },
    // 切换页面
    togglePage(ctx) {
      console.log(
        "this.currentPage :>> ",
        this.currentPage,
        ctx.index,
        this.myAlbum.data[ctx.index]
      );
      if (this.currentPage === ctx.index) return;
      console.log("换页");
      // 重置状态，由于在创建画布的时候初始化了一个状态，所以所以回到这个状态
      this._config.canvasState = this._config.canvasState.slice(0, 1);
      if (this._config.canvasState.length > 1) {
        this._config.canvasState = this._config.canvasState.slice(0, 1);
      }
      this.myAlbum.data[this.currentPage].canvas = this.canvas.toJSON();
      let canvasJSON = ctx.canvas;
      this.currentPage = ctx.index;
      console.log("this.currentPage :>> ", this.currentPage);
      this.$nextTick(() => {
        this.canvas.loadFromJSON(canvasJSON, () => {
          this.layer = [];
          this.canvas.forEachObject(o => {
            this.setToLayer(o);
          });
          this.canvas.renderAll();
        });
      });
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
    // 当moveFlag为1时，点击之后不会把照片放到画布上
    setMaterialFlag() {
      this.moveFlag = 1;
    },
    // 监听长按事件
    calcTimeStart() {
      console.log("监听长按开始");
      this.timeInterval = setInterval(() => {
        this.timer += 1;
      }, 500);
    },
    setOnCanvas(e) {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
      if (this.timer > 1) {
        // 阻止长按弹出默认事件
        e.preventDefault();
        this.longClick = 1; // 阻止将照片放到画布上
        this.isCheck = true; // 显示勾选框
      } else {
        if (this.moveFlag || this.longClick) {
          this.moveFlag = 0;
        } else {
          let target = e.target;
          if (target.localName === "img") {
            let img = new fabric.Image(target);
            let scale = this.getScale(img);
            img.scale(scale);
            img.left = (this.canvas.width - img.width * img.scaleX) * 0.5;
            img.top = (this.canvas.height - img.height * img.scaleY) * 0.5;
            this.canvas.add(img);
            this.canvas.setActiveObject(img);
            console.log("setOnCanvas");
            this.canvas.renderAll();
            // this.setToLayer(img);
          } else if (target.localName === "a") {
            let text = new fabric.Textbox(target.innerText);
            text.left = (this.canvas.width - text.width) * 0.5;
            text.top = (this.canvas.height - text.height) * 0.5;
            this.canvas.add(text);
            this.canvas.setActiveObject(text);
            this.canvas.renderAll();
            // this.setToLayer(text);
          }
        }
      }
    },
    handleBallMoveStart(e) {
      //   console.log("eStart:", e);
      let o = document.getElementById("pageBall");
      let pos = o.getBoundingClientRect();
      this.dragBall.offsetX = e.targetTouches[0].clientX - pos.x;
      this.dragBall.offsetY = e.targetTouches[0].clientY - pos.y;
    },
    handleBallMove(e) {
      // console.log("move");
      this.ballMove = true;
      let s = {};
      s.left = e.changedTouches[0].clientX - this.dragBall.offsetX;
      s.top = e.changedTouches[0].clientY - this.dragBall.offsetY;
      s.width = this.dragBall.width;
      s.height = this.dragBall.height;
      let limit = {};
      limit.left = 0;
      limit.top = 0;
      limit.maxX = document.documentElement.clientWidth || window.innerWidth;
      limit.maxY = document.documentElement.clientHeight || window.innerHeight;
      if (!this.isInRect(s, limit)) return;
      let ball = e.target;
      requestAnimationFrame(() => {
        let left = e.changedTouches[0].clientX - this.dragBall.offsetX;
        let top = e.changedTouches[0].clientY - this.dragBall.offsetY;
        ball.style.left = left + "px";
        ball.style.top = top + "px";
        this.dragBall.nowX = left;
        this.dragBall.nowY = top;
        if (this.ballMove && this.mode == "featureshow") {
          this.showFeatures();
        }
      });
    },
    handleBollMoveEnd(e) {
      //   console.log("eEnd :>> ", e);
      if (!this.ballMove) return;
      //   this.ballMove = false;
      //   let ball = e.target;
      //   let clientX = document.documentElement.clientWidth || window.innerWidth;
      //   if (this.dragBall.nowX < clientX * 0.5) {
      //     ball.style.left = "5px";
      //   } else {
      //     ball.style.left = clientX - 5 - this.dragBall.width + "px";
      //   }
    },
    // 点击魔法球
    handleBallClick() {
      switch (this.mode) {
        case "crop":
          this.cropSelect();
          break;
        case "paint":
          this.closePaintMode();
          break;
        case "featureshow":
          this.hideFeatures();
          break;
        default:
          this.showFeatures();
          break;
      }
    },
    // 显示功能区
    showFeatures() {
      let rect = document.getElementById("rect");
      let ball = document.getElementById("pageBall");
      let pos = ball.getBoundingClientRect();
      let clientX = document.documentElement.clientWidth || window.innerWidth;
      let clientY = document.documentElement.clientHeight || window.innerHeight;
      let style = rect.style;
      // 6种情况
      // 左下展示
      if (pos.y < (1 / 3) * clientY && pos.x > 0.5 * clientX) {
        style.left = pos.x - 0.4 * clientX - 4 + "px";
        style.top = pos.y + 20 + "px";
      }
      // 左中展示
      else if (
        pos.y > (1 / 3) * clientY &&
        pos.y < (2 / 3) * clientY &&
        pos.x > 0.5 * clientX
      ) {
        style.left = pos.x - 0.4 * clientX - 4 + "px";
        style.top = pos.y - 0.125 * clientY + 20 + "px";
      }
      // 左上展示
      else if (pos.y > (2 / 3) * clientY && pos.x > 0.5 * clientX) {
        style.left = pos.x - 0.4 * clientX - 4 + "px";
        style.top = pos.y - 0.25 * clientY + 20 + "px";
      }
      // 右下展示
      else if (pos.y < (1 / 3) * clientY && pos.x < 0.5 * clientX) {
        style.top = pos.y + 20 + "px";
        style.left = pos.x + 44 + "px";
      }
      // 右中展示
      else if (
        pos.y > (1 / 3) * clientY &&
        pos.y < (2 / 3) * clientY &&
        pos.x < 0.5 * clientX
      ) {
        style.left = pos.x + 44 + "px";
        style.top = pos.y - 0.125 * clientY + 20 + "px";
      }
      // 右上展示
      else if (pos.y > (2 / 3) * clientY && pos.x < 0.5 * clientX) {
        style.left = pos.x + 44 + "px";
        style.top = pos.y - 0.125 * clientY + 20 + "px";
      }
      style.display = "block";
      console.log("style.top,style.left :>> ", style.top, style.left);
      this.mode = "featureshow";
    },
    // 隐藏功能区
    hideFeatures() {
      let rect = document.getElementById("rect");
      rect.style.display = "none";
      this.mode = "default";
    },
    // 裁剪选取内容
    cropSelect() {
      if (this.iscroping === 2) {
        let oCoods = this.selectedOCoods;
        this.canvas.remove(this.mask);
        this.canvas.remove(this.selectRect);
        this.canvas.renderAll();
        oCoods.dwX = this.selectRect.aCoords.tl.x;
        oCoods.dwY = this.selectRect.aCoords.tl.y;
        oCoods.upX = this.selectRect.aCoords.br.x;
        oCoods.upY = this.selectRect.aCoords.br.y;
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
          //   console.log("img :>> ", img);
          this.canvas.add(img);
          // 删除蒙版
          this.canvas.remove(this.mask);
          this.canvas.setActiveObject(img);
          this.canvas.renderAll();
          // 更新状态
          this.updateCanvasState();
          this.iscroping = 0;
        });
        this.canvas.remove(this.selectRect);
      }
    },
    // 限制移动范围
    isInRect(
      source,
      limit,
      func = () => {
        void 0;
      }
    ) {
      // source:{left,top,width,height},limit{left,top,maxX,maxY,}
      let booll = source.left < limit.left;
      let boolt = source.top < limit.top;
      let boolb = source.top + source.height > limit.top + limit.maxY;
      let boolr = source.left + source.width > limit.left + limit.maxX;
      if (booll || boolt || boolb || boolr) {
        // console.log("超出范围啦");
        func();
        return false;
      } else {
        return true;
      }
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
.diy {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早起浏览器*/
  -moz-user-select: none; /*火狐浏览器*/
  -ms-user-select: none; /*IE浏览器*/
  user-select: none; /*用户是否能够选中文本*/
  -webkit-overflow-scrolling: auto;
  overscroll-behavior-y: none;
}
.nav {
  height: 1.7rem;
  // max-height: 54px;
  background-color: #ffd3d7;
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
// 内容部分
.content {
  height: calc(100vh - 1.7rem);
  overflow: hidden;
  display: flex;
  @media screen and (max-width: 700px) {
    flex-direction: column-reverse;
  }
  // 左边导航栏
  .materials {
    width: 10rem;
    height: 100%;
    background-color: #fff;
    position: relative;
    .m-nav {
      width: 100%;
      height: 100%;
      padding: 5px;
      .m-tab {
        height: 100%;
        width: 100%;
        position: relative;
        /deep/ .el-tabs__header {
          // 禁止长按选中文字
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          .el-tabs__item {
            padding: 0 10px;
          }
        }
        /deep/ .el-tabs__content {
          .el-tab-pane {
            height: 100%;
            // overflow-x: auto;
          }
        }
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
    .material {
      position: relative;
      width: 100%;
    }
    .head-tool {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .m-tool {
        img {
          display: inline-block;
          vertical-align: top;
        }
      }
      .material-search,
      .decoration-search {
        width: 180px;
      }
    }
    .m-content,
    .d-content {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      width: 100%;
      height: 100%;
      min-width: 220px;
      text-align: left;
      .m-folders {
      }
      .m-checkbox {
        & >>> .el-checkbox {
          cursor: pointer;
          width: 100px;
          height: 110px;
          text-align: center;
          display: inline-block;
          box-sizing: border-box;
          padding: 5px 2px;
          margin: 5px;
          position: relative;
          .el-checkbox__label {
            padding-left: 0;
          }
          .el-checkbox__input {
            position: absolute;
            bottom: 20px;
            right: 5px;
            img {
              // pointer-events: none;
            }
          }
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
      .decoration {
        height: 90px;
        width: 94px;
        display: inline-block;
        margin: 5px 10px 0 2px;
        cursor: pointer;
        &:focus {
          outline: turquoise 2px solid;
        }
      }
      .no-select {
        /deep/ .el-checkbox {
          .el-checkbox__input {
            display: none;
          }
        }
      }
    }
    .m-footer {
      width: 100%;
      position: absolute;
      bottom: 0;
      background-color: #b9e9f0;
    }
  }

  // 中间画布部分
  .draw {
    flex: 1;
    position: relative;
    background-color: #f0f9eb;
    overflow-y: auto;
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
        box-sizing: border-box;
        padding: 0 5px 0 0;
        // height: 100%; // 为什么设置100%反而没有100%了
        background-color: #e1eff0;
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
        & >>> .el-color-picker {
          display: inline-block;
          margin: 5px auto !important;
          width: 36px !important;
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

  // PC端才展示的相册部分
  .content-right {
    overflow: auto;
    width: 175px;
    padding: 10px;
    background-color: #bad5ac;
  }
  .my-album-pc {
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
  }
  .my-album-h5 {
    height: 100%;
    width: 100vw;
    overflow: auto;
    white-space: nowrap;
    .page {
      display: inline-block;
      // height: calc(100% - 10px);
      width: 80px;
      background-color: #fdf585;
      padding-top: 3px;
      position: relative;
      span {
        position: absolute;
        bottom: 5px;
        font-size: 9px;
        color: #ccc5c5;
        right: 10px;
      }
      img {
        width: calc(100% - 10px);
      }
    }
  }
}
.layer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: solid 1px #eeeeee;
  padding: 5px;
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
.empty-tips {
  margin-top: 35px;
  font-size: 14px;
  color: coral;
}

// 上传组件
/deep/ .el-dialog__wrapper {
  .upload-dia {
    .el-dialog__body {
      position: relative;
      min-height: 300px;
      padding-bottom: 0;
    }
    .upload {
      max-height: 60vh;
      .el-upload {
        position: absolute;
        top: 20px;
        left: 20px;
        .el-upload__text {
          position: absolute;
          top: 60%;
          left: 50%;
          width: 100%;
          transform: translate(-50%, -50%);
        }
      }
      .el-upload__tip {
        position: absolute;
        top: 200px;
      }
      .el-upload-list {
        display: block;
        margin-top: 220px;
        max-height: 200px;
        overflow: auto;
        li {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
}
#pageBall {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: #a0c6d1;
  position: fixed;
  right: 0;
  bottom: 7rem;
  z-index: 2021;
  img {
    pointer-events: none;
    display: inline-block;
    margin: auto;
  }
  &:active {
    opacity: 0.5;
  }
}
#rect {
  position: absolute;
  z-index: 9999;
  width: 40vw;
  height: 25vh;
  background-color: #000000;
  opacity: 0.2;
  display: none;
}
.diy >>> .dia-sort {
  width: 30rem;
  .sort-container {
    max-height: 60vh;
    overflow: auto;
  }
  .sort {
    width: 4.2rem;
    height: 6rem;
    display: inline-block;
    position: relative;

    .sort-pic {
      width: 100%;
      height: 100%;
      padding: 5px 5px 5px;
      background-color: antiquewhite;
    }
    .order-number {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    .svg-apple {
      width: 30px;
      height: 30px;
      position: absolute;
      left: 50%;
      top: 50%;
      display: none;
      transform: translate(-50%, -50%);
    }
  }
  .show-apple {
    .svg-apple {
      display: block !important;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
.folders {
  width: 80vw;
  height: 40vh;
  position: absolute;
  bottom: 7rem;
  right: 0;
  margin-bottom: 5px;
  background-color: rgba(249, 224, 233, 0.6);
  text-align: left;
  overflow-y: auto;
  .folders {
    width: 100%;
    height: 100%;
  }
}
.h5 {
  display: none;
}
@media screen and (max-width: 700px) {
  .diy {
    .h5 {
      display: inline-block;
    }
    .pc {
      display: none;
    }
    .nav {
      height: 1.7rem;
    }
    .materials {
      width: 100%;
      height: 7rem;
      .m-content {
        .m-folders {
          .folder {
          }
        }
        .m-checkbox {
          width: 100%;
          overflow-x: auto;
          text-align: left;
          .el-checkbox {
            display: inline-block;
            position: relative;
            width: 76px;
            height: 70px;
            padding: 0;
            margin: 5px 10px 0 0;
            /deep/ .el-checkbox__label {
              padding-left: 0;
            }
            /deep/ .el-checkbox__input {
              position: absolute;
              bottom: 0;
              right: 5px;
              -webkit-user-select: none;
              user-select: none;
              img {
                // pointer-events: none;
              }
            }
          }
        }
      }
      .d-content {
        white-space: nowrap;
        overflow-x: auto;
        .decoration {
          width: 76px;
          height: 74px;
          display: inline-block;
        }
      }
      .nav-tool {
        height: 24px;
        position: absolute;
        right: 5px;
        z-index: 66;
        img,
        i {
          display: inline-block;
          vertical-align: top;
          margin: 0;
        }
        .text-btn {
          padding: 0;
        }
      }
      .head-tool {
        position: fixed;
        left: 5px;
        width: 20px;
        display: inline-block;
        height: 100%;
        overflow: auto;
        .m-tool {
          .tool-icon {
            margin: 5px 0;
          }
        }
      }
      .m-content {
        overflow-x: auto;
        white-space: nowrap;
        text-align: left;
        .el-checkbox {
          width: 76px;
          height: 70px;
        }
      }
    }
    & >>> .dia-sort {
      width: 90vw;
    }
    & >>> .dia-review {
      width: 100vw;
      height: 100vh;
    }
  }
}
.no-display {
  display: none;
}
</style>
