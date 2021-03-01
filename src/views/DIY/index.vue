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
                    @touchstart="setOnCanvas($event)"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="text" label="文本">
              <a
                href="javascript:void(0)"
                :draggable="true"
                @dragstart="dragstart"
                @touchstart="setOnCanvas($event)"
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
      <div class="draw">
        <div class="canvas-container">
          <div class="tool">
            <el-tooltip content="图层" effect="dark" placement="left">
              <el-popover placement="bottom" trigger="click">
                <i slot="reference" class="el-icon-s-order"></i>
                <!-- <el-button type="primary" slot='reference'>图层</el-button> -->
                <div>
                  <div class="layer" v-for="(el, i) in layer" :key="i">
                    <i
                      class="el-icon-view icon"
                      v-show="el.show"
                      @click="updateLayer(el)"
                    ></i>
                    <svg
                      t="1613811395982"
                      class="icon"
                      v-show="!el.show"
                      @click="updateLayer(el)"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="1808"
                      width="14"
                      height="14"
                    >
                      <path
                        d="M512 800c-66.112 0-128.32-24.896-182.656-60.096l94.976-94.976A156.256 156.256 0 0 0 512 672c88.224 0 160-71.776 160-160a156.256 156.256 0 0 0-27.072-87.68l101.536-101.536C837.28 398.624 896 493.344 896 512c0 32-171.936 288-384 288m96-288a96 96 0 0 1-96 96c-14.784 0-28.64-3.616-41.088-9.664l127.424-127.424C604.384 483.36 608 497.216 608 512m-480 0c0-32 171.936-288 384-288 66.112 0 128.32 24.896 182.656 60.096l-417.12 417.12C186.72 625.376 128 530.656 128 512m664.064-234.816l91.328-91.328-45.248-45.248-97.632 97.632C673.472 192.704 595.456 160 512 160 265.248 160 64 443.008 64 512c0 39.392 65.728 148.416 167.936 234.816l-91.328 91.328 45.248 45.248 97.632-97.632C350.528 831.296 428.544 864 512 864c246.752 0 448-283.008 448-352 0-39.392-65.728-148.416-167.936-234.816"
                        p-id="1809"
                      ></path>
                      <path
                        d="M512 352c-88.224 0-160 71.776-160 160 0 15.328 2.848 29.856 6.88 43.872l58.592-58.592a95.616 95.616 0 0 1 79.808-79.808l58.592-58.592A157.76 157.76 0 0 0 512 352"
                        p-id="1810"
                      ></path>
                    </svg>
                    <img
                      class="mr10-x"
                      :src="el.src"
                      width="60px"
                      height="30px"
                      :key="i"
                    />
                    <el-tooltip content="上移图层" placement="top"
                      ><i
                        class="el-icon-top icon"
                        @click="setLayerforward(el)"
                      ></i
                    ></el-tooltip>
                    <el-tooltip content="下移图层" placement="top"
                      ><i
                        class="el-icon-bottom icon mr10-x"
                        @click="setLayerbottom(el)"
                      ></i
                    ></el-tooltip>
                    <el-tooltip content="删除" placement="top"
                      ><i
                        class="el-icon-delete icon"
                        @click="deleteSelected(el.object)"
                      ></i
                    ></el-tooltip>
                  </div>
                </div>
              </el-popover>
            </el-tooltip>

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
            ></el-tooltip><br>
            <el-tooltip content="裁切" effect="dark" placement="left"
              ><svg
                t="1613382090797"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="853"
                width="14"
                height="14"
                @click="startCroping"
              >
                <path
                  d="M928 768h-64V224c0-17.67-14.33-32-32-32H224v-64c0-17.67-14.33-32-32-32s-32 14.33-32 32v64H96c-17.67 0-32 14.33-32 32s14.33 32 32 32h64v544c0 17.67 14.33 32 32 32h608v64c0 17.67 14.33 32 32 32s32-14.33 32-32v-64h64c17.67 0 32-14.33 32-32s-14.33-32-32-32z m-160 0H224V256h576v512h-32z"
                  p-id="854"
                ></path></svg></el-tooltip
            ><br />
            <el-tooltip content="画笔" placement="left" effect="datk">
              <svg
                t="1614528050966"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2799"
                width="14"
                height="14"
              >
                <path
                  d="M800.46 547.624L413.14 934.93c-20.374 20.376-20.374 53.406 0 73.782 10.156 10.156 23.53 15.282 36.874 15.282s26.688-5.094 36.876-15.312l387.354-387.304-73.784-73.754z"
                  fill="#ED5564"
                  p-id="2800"
                ></path>
                <path
                  d="M1004.52 416.408c-54.188 0-217.964 8.812-217.964 119.874 0 54.188 43.906 98.094 98.062 98.094 54.188 0 98.09-43.906 98.09-98.094 0-54.156 75.968-119.874 21.812-119.874z"
                  fill="#965353"
                  p-id="2801"
                ></path>
                <path
                  d="M701.246 92.54c-28.876-29.28-64.312-51.968-105.406-67.468C551.746 8.448 500.826 0.01 444.42 0.01c-12.624 0-25.718 0.406-38.906 1.25-64.248 4.094-123.78 18.376-176.904 42.468-50.402 22.874-94.122 54.062-129.934 92.716-69.5 75-104.28 172.404-97.936 274.338C7.866 526.124 40.334 616.032 97.208 678c27.686 30.184 60.936 53.246 98.904 68.558 37.062 14.938 78.686 22.532 123.686 22.532 121.748 0 157.372-78.5 183.434-135.808 13.25-29.188 24.686-54.406 43.078-63.812 13.718-7.032 34.376-9.812 56.188-12.718 39.376-5.282 84.032-11.282 120.808-43.28 41.594-36.218 62.468-97.718 63.75-188.09 1.342-92.658-29.158-175.344-85.81-232.842zM597.34 448c-35.344 0-64.016-28.656-64.016-63.998s28.672-64 64.016-64 64 28.656 64 64S632.684 448 597.34 448z"
                  fill="#FFD2A6"
                  p-id="2802"
                ></path>
                <path
                  d="M597.34 469.314c-47.062 0-85.358-38.282-85.358-85.31 0-47.062 38.296-85.342 85.358-85.342s85.344 38.282 85.344 85.342c0 47.028-38.282 85.31-85.344 85.31z m0-127.998c-23.532 0-42.656 19.156-42.656 42.686 0 23.5 19.124 42.654 42.656 42.654s42.656-19.156 42.656-42.654c0-23.53-19.124-42.686-42.656-42.686z"
                  fill="#F4BE8E"
                  p-id="2803"
                ></path>
                <path
                  d="M469.326 149.32c0 23.562-19.094 42.686-42.656 42.686-23.562 0-42.686-19.124-42.686-42.686s19.124-42.656 42.686-42.656 42.656 19.092 42.656 42.656z"
                  fill="#A0D468"
                  p-id="2804"
                ></path>
                <path
                  d="M426.67 85.32c-35.31 0-63.998 28.718-63.998 64 0 35.312 28.688 64 63.998 64 35.282 0 64-28.688 64-64 0-35.28-28.718-64-64-64z m0 85.344c-11.78 0-21.342-9.562-21.342-21.344 0-11.75 9.562-21.312 21.342-21.312 11.75 0 21.312 9.562 21.312 21.312 0 11.78-9.562 21.344-21.312 21.344z"
                  fill="#8CC153"
                  p-id="2805"
                ></path>
                <path
                  d="M298.672 213.318c0 23.562-19.124 42.686-42.686 42.686s-42.656-19.124-42.656-42.686 19.094-42.656 42.656-42.656c23.562 0.002 42.686 19.094 42.686 42.656z"
                  fill="#AC92EB"
                  p-id="2806"
                ></path>
                <path
                  d="M255.986 149.32c-35.282 0-64 28.718-64 64 0 35.312 28.718 63.998 64 63.998 35.312 0 64-28.686 64-63.998 0-35.282-28.688-64-64-64z m0 85.342c-11.75 0-21.312-9.562-21.312-21.342 0-11.75 9.562-21.312 21.312-21.312 11.78 0 21.342 9.562 21.342 21.312 0.002 11.78-9.562 21.342-21.342 21.342z"
                  fill="#967ADC"
                  p-id="2807"
                ></path>
                <path
                  d="M213.33 362.66c0 23.562-19.094 42.654-42.654 42.654-23.562 0-42.688-19.092-42.688-42.654 0-23.562 19.124-42.656 42.688-42.656 23.56 0 42.654 19.094 42.654 42.656z"
                  fill="#5D9CEC"
                  p-id="2808"
                ></path>
                <path
                  d="M170.676 298.66c-35.312 0-64 28.718-64 64 0 35.28 28.686 63.998 64 63.998 35.28 0 63.998-28.716 63.998-63.998s-28.718-64-63.998-64z m0 85.342c-11.782 0-21.344-9.592-21.344-21.342s9.562-21.344 21.344-21.344c11.75 0 21.31 9.594 21.31 21.344s-9.562 21.342-21.31 21.342z"
                  fill="#4A89DC"
                  p-id="2809"
                ></path>
                <path
                  d="M234.674 533.312c0 23.562-19.124 42.688-42.688 42.688-23.56 0-42.654-19.124-42.654-42.688 0-23.562 19.094-42.656 42.654-42.656 23.562 0.002 42.688 19.094 42.688 42.656z"
                  fill="#ED5564"
                  p-id="2810"
                ></path>
                <path
                  d="M191.986 469.314c-35.28 0-63.998 28.718-63.998 64s28.718 64 63.998 64c35.312 0 64-28.718 64-64s-28.688-64-64-64z m0 85.342c-11.75 0-21.31-9.562-21.31-21.344 0-11.75 9.562-21.312 21.31-21.312 11.782 0 21.344 9.562 21.344 21.312 0 11.782-9.562 21.344-21.344 21.344z"
                  fill="#DA4453"
                  p-id="2811"
                ></path>
              </svg>
            </el-tooltip>
            <br>
            <div class="image-tool">
              <el-tooltip content="平铺" effect="dark">
                <svg
                  t="1613870236722"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2125"
                  width="14"
                  height="14"
                  @click="maxmize(canvas.getActiveObject())"
                >
                  <path
                    d="M597.34016 554.33216q17.67424 0 30.33088 12.67712l268.32896 268.32896 0-195.66592q0-17.67424 12.4928-30.16704t30.16704-12.4928 30.16704 12.4928 12.4928 30.16704l0 298.65984q0 17.67424-12.67712 30.33088t-30.33088 12.67712l-298.65984 0q-17.67424 0-30.16704-12.4928t-12.4928-30.16704 12.4928-30.16704 30.16704-12.4928l195.66592 0-268.32896-268.32896q-12.32896-13.0048-12.32896-30.33088 0-17.67424 12.4928-30.33088t30.16704-12.67712zM85.34016 42.65984l298.65984 0q17.67424 0 30.16704 12.4928t12.4928 30.16704-12.4928 30.16704-30.16704 12.4928l-195.66592 0 268.32896 268.00128q12.67712 12.67712 12.67712 30.33088t-12.67712 30.16704-30.33088 12.4928q-16.9984 0-30.33088-12.32896l-268.00128-268.32896 0 195.66592q0 17.67424-12.4928 30.16704t-30.16704 12.4928-30.16704-12.4928-12.4928-30.16704l0-298.65984q0-17.67424 12.4928-30.16704t30.16704-12.4928z"
                    p-id="2126"
                  ></path>
                </svg>
              </el-tooltip>
              <br />
              <el-tooltip content="复制" effect="dark" placement="left"
                ><i
                  class="el-icon-document-copy"
                  @click="copySelected(canvas.getActiveObject())"
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
                  width="14"
                  height="14"
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
                  @click="deleteSelected(canvas.getActiveObject())"
                ></i></el-tooltip
              ><br />
            </div>
            <div class="text-tool" v-show="activeType === 'Textbox'">
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
                <el-popover class="pop-mw100" placement="bottom">
                  <div class="flex-sb">
                    <svg
                      t="1613813262557"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2654"
                      width="14"
                      height="14"
                      @click="setTextAlign('left')"
                    >
                      <path
                        d="M85.333333 245.333333A32 32 0 0 1 117.333333 213.333333h661.333334a32 32 0 0 1 0 64H117.333333A32 32 0 0 1 85.333333 245.333333zM85.333333 800a32 32 0 0 1 32-32h448a32 32 0 0 1 0 64H117.333333a32 32 0 0 1-32-32zM117.333333 490.666667a32 32 0 0 0 0 64h789.333334a32 32 0 0 0 0-64H117.333333z"
                        p-id="2655"
                      ></path>
                    </svg>
                    <svg
                      t="1613813294956"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2784"
                      width="14"
                      height="14"
                      @click="setTextAlign('center')"
                    >
                      <path
                        d="M170.666667 256a42.666667 42.666667 0 0 1 42.666666-42.666667h597.333334a42.666667 42.666667 0 1 1 0 85.333334H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667zM256 768a42.666667 42.666667 0 0 1 42.666667-42.666667h426.666666a42.666667 42.666667 0 1 1 0 85.333334H298.666667a42.666667 42.666667 0 0 1-42.666667-42.666667zM128 469.333333a42.666667 42.666667 0 1 0 0 85.333334h768a42.666667 42.666667 0 1 0 0-85.333334H128z"
                        p-id="2785"
                      ></path>
                    </svg>
                    <svg
                      t="1613813323050"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2914"
                      width="14"
                      height="14"
                      @click="setTextAlign('right')"
                    >
                      <path
                        d="M213.333333 245.333333A32 32 0 0 1 245.333333 213.333333h661.333334a32 32 0 0 1 0 64H245.333333A32 32 0 0 1 213.333333 245.333333zM426.666667 800a32 32 0 0 1 32-32h448a32 32 0 0 1 0 64h-448a32 32 0 0 1-32-32zM117.333333 490.666667a32 32 0 0 0 0 64h789.333334a32 32 0 0 0 0-64H117.333333z"
                        p-id="2915"
                      ></path>
                    </svg>
                    <svg
                      t="1613813489945"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="3044"
                      width="14"
                      height="14"
                      @click="setTextAlign('justify-center')"
                    >
                      <path
                        d="M85.333333 245.333333A32 32 0 0 1 117.333333 213.333333h789.333334a32 32 0 0 1 0 64H117.333333A32 32 0 0 1 85.333333 245.333333zM85.333333 800a32 32 0 0 1 32-32h789.333334a32 32 0 0 1 0 64H117.333333a32 32 0 0 1-32-32zM117.333333 490.666667a32 32 0 0 0 0 64h789.333334a32 32 0 0 0 0-64H117.333333z"
                        p-id="3045"
                      ></path>
                    </svg>
                  </div>

                  <i slot="reference" class="el-icon-s-operation"></i>
                </el-popover> </el-tooltip
              ><br />
            </div>
          </div>
          <canvas id="canvas"></canvas>
        </div>
      </div>

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
  </div>
</template>

<script>
import Fastclick from "fastclick";
import { fabric } from "fabric";
export default {
  data() {
    return {
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
      layer: [], // 图层
      showLayer: true,
      dragObject: null,
      selectedObject: null,
      activeType: "", // 当前画布激活的对象的类型
      selectedOCoods: {
        dwX: 0,
        dwY: 0,
        upX: 0,
        upY: 0
      },
      iscroping: 0, // 0 未处于裁剪状态，1：处于裁剪阶段1，生成框框，监听dbclick， 2：处于裁剪阶段2,等待dbclick完成裁剪内容并添加到canvas中
      // 截取图片
      cropInfo: {
        source: null,
        iscroping: false,
        scope: null
      },
      lastPoint: {},
      // 被拖拽的元素
      draged: {
        sourceOffsetX: 0,
        sourceOffsetY: 0
      },
      materialOptions: [],
      decorationOptions: [],
      sizeOptions: [],
      fontFamilyOptions: [],
      predefineColors: [],
      service: "",
      tab: "material",
      size: 14, // 文字尺寸
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
      currentPage: 0
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
      console.log(this.canvas.getActiveObject() instanceof fabric.Textbox);
      if (this.canvas.getActiveObject() instanceof fabric.Textbox)
        this.activeType = "Textbox";
      else this.activeType = "image";
      this.selectedObject = e.target;
    });
    this.canvas.on("selection:updated", e => {
      console.log(this.canvas.getActiveObject() instanceof fabric.Textbox);
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
    // 工具栏
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
      let page = this.myAlbum.data[this.currentPage];
      page.canvas = this.canvas.toJSON();
      page.src = this.canvas.toDataURL();
      page.page = this.currentPage;
      this.myAlbum.data.splice(this.currentPage, 1, page);
    },
    // 撤销
    undo() {
      console.log(this.canvas.isEmpty());
      if (this.canvas.isEmpty()) return;
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
        .color {
          width: 40px;
          height: 50px;
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

.cursor-crosshair {
  cursor: crosshair;
}
</style>
