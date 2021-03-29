<template>
  <div>
    <input
      id="upload_file"
      type="file"
      style="display: none;"
      accept="image/*"
      name="file"
      @change="fileChange($event)"
    />
    <div class="image-item space" @click="showActionSheet()">
      <div class="image-up"></div>
    </div>

    <div class="upload_warp">
      <div class="upload_warp_img">
        <div
          class="upload_warp_img_div"
          v-for="(item, index) in imgList"
          :key="index"
        >
          <div class="upload_warp_img_div_top">
            <img
              src="http://114.115.162.39/static/image/x.png"
              class="upload_warp_img_div_del"
              @click="fileDel(index)"
            />
          </div>
          <img :src="item.file.src" style="display: inline-block;" />
        </div>
        <div
          id="upload_warp_left"
          style="width:100px;height:100px;background-color:'aqua'"
          @click="fileClick()"
          v-if="this.imgList.length < 6"
        >
        上传照片
          <!--<img src="../assets/upload.png">-->
          <img src="#" class="imgs" />
        </div>
      </div>
    </div>

    <div class="upload_warp_text">
      <span
        >选中{{ imgList.length }}张文件，共{{ bytesToSize(this.size) }}</span
      >
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "cameras-and-albums",
  data() {
    return {
      imgList: [],
      datas: new FormData(),
      files: 0,
      size: 0
    };
  },
  methods: {
    //调用相册&相机
    fileClick() {
      let input = document.getElementById("upload_file");
      input.click();
    },
    //调用手机摄像头并拍照
    getImage() {
      let cmr = plus.camera.getCamera();
      cmr.captureImage(
        function(p) {
          plus.io.resolveLocalFileSystemURL(
            p,
            function(entry) {
              compressImage(entry.toLocalURL(), entry.name);
            },
            function(e) {
              plus.nativeUI.toast("读取拍照文件错误：" + e.message);
            }
          );
        },
        function(e) {},
        {
          filter: "image"
        }
      );
    },
    //从相册选择照片
    galleryImgs() {
      plus.gallery.pick(
        function(e) {
          let name = e.substr(e.lastIndexOf("/") + 1);
          compressImage(e, name);
        },
        function(e) {},
        {
          filter: "image"
        }
      );
    },
    //点击事件，弹出选择摄像头和相册的选项
    showActionSheet() {
      let bts = [
        {
          title: "拍照"
        },
        {
          title: "从相册选择"
        }
      ];
      plus.nativeUI.actionSheet(
        {
          cancel: "取消",
          buttons: bts
        },
        function(e) {
          if (e.index == 1) {
            this.getImage();
          } else if (e.index == 2) {
            this.galleryImgs();
          }
        }
      );
    },
    fileChange(el) {
      let input = document.getElementById("upload_file");
      this.files = input.get(0).files;
      console.log(this.files.length);
      for (let i = 0; i < this.files.length; i++) {
        this.datas.append("file", this.files[i]);
      }
      this.show1 = false;
      console.log(typeof this.files);
      console.log(this.files);
      if (!el.target.files[0].size) return;
      this.fileList(el.target);
      el.target.value = "";
    },
    fileList(fileList) {
      let files = fileList.files;
      for (let i = 0; i < files.length; i++) {
        //判断是否为文件夹
        if (files[i].type != "") {
          this.fileAdd(files[i]);
        } else {
          //文件夹处理
          this.folders(fileList.items[i]);
        }
      }
    },
    //文件夹处理
    folders(files) {
      let _this = this;
      //判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry();
      }
      files.createReader().readEntries(function(file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i]);
          } else {
            _this.folders(file[i]);
          }
        }
      });
    },
    fileAdd(file) {
      //总大小
      this.size = this.size + file.size;
      //判断是否为图片文件
      if (file.type.indexOf("image") == -1) {
        file.src = "wenjian.png";
        this.imgList.push({
          file
        });
      } else {
        let reader = new FileReader();
        reader.vue = this;
        reader.readAsDataURL(file);
        reader.onload = function() {
          file.src = this.result;
          this.vue.imgList.push({
            file
          });
        };
      }
    },
    fileDel(index) {
      this.size = this.size - this.imgList[index].file.size; //总大小
      this.imgList.splice(index, 1);
    },
    bytesToSize(bytes) {
      if (bytes === 0) {
        return "0 B";
      }
      let k = 1000, // or 1024
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    dragenter(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    dragover(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    drop(el) {
      el.stopPropagation();
      el.preventDefault();
      this.fileList(el.dataTransfer);
    },
    shows(et, tx) {
      this.strut = et;
      this.txt = tx;
    },
    handleClick() {
      this.$store.commit("add");
    }
  }
};
</script>
