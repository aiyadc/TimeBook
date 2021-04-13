<!-- 系统素材管理 -->
<template>
  <div>
    <div class="header">
      <div class="left">
        <el-button type="success" size="small" @click="handleAdd"
          >添加素材</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete"
          >批量删除</el-button
        >
      </div>
      <div class="right">
        <el-form class="form-search" :model="searchForm" inline>
          <el-form-item label="目录：">
            <el-select
              v-model="searchForm.folderid"
              placeholder="目录"
              size="small"
              @change="fetchDecorations"
            >
              <el-option label="全部" :value="0" :key="-1"></el-option>
              <el-option
                v-for="(folder, i) in folderList"
                :key="i"
                :label="folder.name"
                :value="folder.folderid"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input
              v-model="searchForm.search"
              size="small"
              placeholder="名称/路径/来源"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" @click="fetchDecorations"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content">
      <e-table
        :list-data="decorationList"
        :headers="tableHeaders"
        :pagination="pagination"
        v-loading="fetchLoading"
        @selection-change="handleSelectionChange"
        @changepage="handlePageChange"
        @changesize="handlePageSizeChange"
      >
        <el-table-column label="主题" align="center" slot="tid">
          <template slot-scope="{ row }">
            <span>{{
              folderList.find(folder => folder.folderid == row.folderid) &&
                folderList.find(folder => folder.folderid == row.folderid).name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" slot="src">
          <template slot-scope="{ row }">
            <el-image
              class="table-image"
              :src="row.src"
              fit="contain"
              :preview-src-list="new Array(row.src)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          slot="action"
          width="250px"
        >
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              size="small"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              plain
              icon="el-icon-edit"
              size="small"
              @click="handleDelete(row.did)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </e-table>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" :visible="editDia" center width="700px">
      <el-form class="form-equal500" :model="editForm" label-position="right">
        <el-form-item label="目录：" prop="folderid" required>
          <el-select v-model="editForm.folderid" placeholder="请选择放置目录">
            <el-option
              v-for="(folder, i) in folderList"
              :key="i"
              :label="folder.name"
              :value="folder.folderid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：" prop="name" required>
          <el-input v-model="editForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="路径：" prop="src" required>
          <el-input v-model="editForm.src" placeholder="素材路径"></el-input>
        </el-form-item>
        <el-form-item label="宽度：" prop="width" required>
          <el-input
            v-model="editForm.width"
            placeholder="图片的初始宽度"
          ></el-input>
        </el-form-item>
        <el-form-item label="高度：" prop="height" required>
          <el-input
            v-model="editForm.height"
            placeholder="图片的初始高度"
          ></el-input>
        </el-form-item>
        <el-form-item label="来源：" prop="origin" required>
          <el-input
            v-model="editForm.origin"
            placeholder="图片的来源"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="updateDecoration"
          >确定</el-button
        >
        <el-button type="default" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!-- 上传素材弹窗 -->
    <el-dialog
      custom-class="upload-dia"
      title="上传素材"
      :visible.sync="uploadDia"
      center
      width="420px"
    >
      <div style="position:initial !important;" v-loading="uploadLoading">
        <el-form
          class="form-equal350"
          :model="uploadForm"
          inline
          ref="uploadForm"
          v-if="step == 0"
        >
          <el-form-item label="目录：" prop="folderid" required>
            <el-select v-model="uploadForm.folderid" placeholder="请选择目录">
              <el-option
                v-for="(folder, i) in folderList"
                :key="i"
                :label="folder.name"
                :value="folder.folderid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源" prop="origin">
            <el-input v-model="uploadForm.origin"></el-input>
          </el-form-item>
        </el-form>
        <el-upload
          class="upload"
          drag
          list-type="picture-card"
          action="uploadURL"
          multiple
          ref="upload"
          :auto-upload="false"
          :on-change="updateUploadList"
          v-if="step == 1"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>

      <div slot="footer">
        <el-button type="primary" @click="toNext" v-if="step == 0"
          >下一步</el-button
        >
        <el-button type="success" @click="UploadToService" v-if="step == 1"
          >上传</el-button
        >
        <el-button type="default" @click="cancelUpload">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableHeaders from "./tableConfig/decoration.js";
import ETable from "@/components/ETable.vue";
import decorationRequest from "@/api/decoration.js";

export default {
  components: {
    ETable
  },

  data() {
    return {
      decorationList: [],
      folderList: [],
      tableHeaders: [],
      searchForm: {
        folderid: null,
        search: ""
      },
      uploadForm: {
        folderid: "",
        origin: ""
      },
      editForm: {
        folderid: null,
        name: "",
        src: "",
        width: null,
        height: null,
        origin: ""
      },
      pagination: {
        currentPage: 1,
        size: 10,
        totalCount: 10
      },
      selected: [],
      uploadList: [], // 要上传的素材
      step: 0, // 上传的步骤，第一步填写信息，第二部选择素材上传
      fetchLoading: false,
      updateLoading: false,
      uploadLoading: false,
      // Dia
      editDia: false,
      uploadDia: false
    };
  },

  computed: {},

  created() {
    this.tableHeaders = tableHeaders;
    this.init();
  },

  methods: {
    // 初式化页面
    async init() {
      this.fetchLoading = true;
      await this.fetchFolders();
      await this.fetchDecorations();
      this.fetchLoading = false;
    },
    // 拉取所有装饰
    async fetchDecorations() {
      let params = Object.assign({}, this.searchForm);
      params.currentPage = this.pagination.currentPage;
      params.pageSize = this.pagination.size;
      await decorationRequest.getDecorations(params).then(res => {
        this.decorationList = res.data;
        console.log("this.decorationList :>> ", this.decorationList);
        this.pagination.totalCount = res.pagination.totalCount;
      });
    },
    // 拉取所有装饰目录
    async fetchFolders() {
      await decorationRequest.getFolders().then(res => {
        this.folderList = res.data;
      });
    },
    // 处理添加
    handleAdd() {
      this.uploadDia = true;
    },
    // 处理多选
    handleSelectionChange(selected) {
      this.selected = selected;
    },
    // 处理编辑
    handleEdit(row) {
      this.editForm = row;
      this.editDia = true;
    },
    // 更新装饰信息
    updateDecoration() {
      let data = {};
      for (let key in this.editForm) {
        if (key !== "did") {
          data[key] = this.editForm[key];
        }
      }
      this.updateLoading = true;
      decorationRequest
        .updateDecoration(this.editForm.did, data)
        .then(res => {
          this.$message.success("更新成功");
          this.updateLoading = false;
          this.editDia = false;
        })
        .catch(() => {
          this.updateLoading = false;
        });
    },
    // 处理删除
    handleDelete(did) {
      if (did > 0) {
        this.selected = [did];
      } else {
        if (!this.selected.length) {
          this.$message.warning("请先选择要删除的选项");
          return;
        } else {
          this.selected = this.selected.map(d => {
            return d.did;
          });
        }
      }
      this.$confirm("确定要删除吗，删除之后不可恢复噢", "提示", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        decorationRequest.deleteDecorations(this.selected).then(() => {
          this.$message.success("删除成功");
          this.fetchDecorations();
        });
      });
    },
    // 更新要上传的素材
    updateUploadList(file, fileList) {
      this.uploadList = fileList;
    },
    toNext() {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          this.step = 1;
        } else {
          return;
        }
      });
    },
    // 上传到服务器
    UploadToService() {
      // console.log('this.uploadList :>> ', this.uploadList);
      if (!this.uploadList.length) {
        this.$message.warning("请先上传素材");
        return;
      }
      new Promise((res, rej) => {
        let data = [];
        this.uploadList.forEach((item, i, list) => {
          let obj = {};
          let img = new Image();
          img.src = item.src;
          obj.width = img.naturalWidth;
          obj.height = img.naturalHeight;
          obj.folderid = this.uploadForm.folderid;
          obj.origin = this.uploadForm.origin;
          obj.name = item.name;
          // src
          let reader = new FileReader();
          reader.readAsDataURL(item.raw);
          reader.onload = function(e) {
            let b64 = e.target.result;
            obj.src = b64;
            // console.log('obj :>> ', obj);
            data.push(obj);
            if (i == list.length - 1) {
              res(data);
            }
          };
        });
      }).then(data => {
        console.log("data :>> ", data);
        this.uploadLoading = true;
        decorationRequest
          .addDecorations(data)
          .then(async () => {
            this.fetchDecorations();
          })
          .then(() => {
            this.uploadLoading = false;
            this.$message.success("上传成功");
            this.step = 0;
            this.uploadDia = false;
            this.uploadList = [];
          })
          .catch(() => {
            this.uploadLoading = false;
            this.uploadList = [];
          });
      });
    },
    // 取消上传
    cancelUpload() {
      this.step = 0;
      this.uploadList = [];
      this.uploadDia = false;
    },
    // 处理当前页改变事件
    async handlePageChange(page) {
      this.pagination.currentPage = page;
      this.fetchLoading = true;
      await this.fetchDecorations();
      this.fetchLoading = false;
    },
    // 处理页面尺寸发生改变事件
    async handlePageSizeChange(size) {
      this.pagination.size = size;
      this.fetchLoading = true;
      await this.fetchDecorations();
      this.fetchLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  & >>> .el-form-item {
    margin-bottom: 0;
  }
}

// 上传组件
>>> .upload-dia {
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
.table-image {
  width: 50px;
  height: 50px;
}
</style>
