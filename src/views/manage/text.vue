<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <el-button type="success" size="small" @click="handleAdd"
          >添加文案</el-button
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
              @change="fetchTexts"
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
            <el-button type="primary" size="small" @click="fetchTexts"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content">
      <e-table
        :list-data="textList"
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
        <el-table-column label="操作" align="center" slot="action">
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
              @click="handleDelete(row.textid)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </e-table>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog
      :title="type == 'edit' ? '编辑' : '添加'"
      :visible.sync="editDia"
      :before-close="resetForm"
      center
      width="700px"
    >
      <el-form
        class="form-w500"
        :model="editForm"
        label-position="right"
        ref="editForm"
      >
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
        <el-form-item label="文案：" prop="text" required>
          <el-input
            v-model="editForm.text"
            type="textarea"
            placeholder="文案"
            :rows="1"
          ></el-input>
        </el-form-item>
        <el-form-item label="样式：" prop="style">
          <el-input v-model="editForm.style" placeholder="文案样式"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="type == 'edit' ? updateText() : addText()"
          >确定</el-button
        >
        <el-button type="default" size="small" @click="editDia = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableHeaders from "./tableConfig/text.js";
import ETable from "@/components/ETable.vue";
import textRequest from "@/api/text.js";
export default {
  components: {
    ETable
  },
  props: {},
  data() {
    return {
      textList: [],
      folderList: [],
      tableHeaders: [],
      searchForm: {
        folderid: null,
        search: ""
      },
      type: "edit", // 模式：区别同一个弹框使用的模式是编辑还是添加
      editForm: {
        folderid: null,
        text: "",
        style: ""
      },
      pagination: {
        currentPage: 1,
        size: 10,
        totalCount: 10
      },
      selected: [],
      fetchLoading: false,
      updateLoading: false,
      editDia: false
    };
  },
  watch: {},
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
      await this.fetchTexts();
      this.fetchLoading = false;
    },
    // 拉取所有文案
    async fetchTexts() {
      let params = Object.assign({}, this.searchForm);
      params.currentPage = this.pagination.currentPage;
      params.pageSize = this.pagination.size;
      await textRequest.getTexts(params).then(res => {
        this.textList = res.data;
        console.log("this.textList :>> ", this.textList);
        this.pagination.totalCount = res.pagination.totalCount;
      });
    },
    // 拉取所有文案目录
    async fetchFolders() {
      await textRequest.getFolders().then(res => {
        this.folderList = res.data;
      });
    },
    // 处理添加
    handleAdd() {
      this.type = "add";
      this.editDia = true;
    },
    // 处理多选
    handleSelectionChange(selected) {
      this.selected = selected;
    },
    // 处理编辑
    handleEdit(row) {
      this.type = "edit";
      this.editForm = row;
      this.editDia = true;
    },
    // 添加文案
    addText() {
      console.log(" 添加文案");
      this.$refs.editForm.validate(valid => {
        if (valid) {
          textRequest.addText(this.editForm).then(res => {
            this.$message.success("添加成功");
            this.editDia = false;
            this.fetchTexts();
          });
        } else {
          return false;
        }
      });
    },
    // 编辑文案
    updateText() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {};
          for (let key in this.editForm) {
            if (key !== "textid") {
              data[key] = this.editForm[key];
            }
          }
          this.updateLoading = true;
          textRequest
            .updateText(this.editForm.textid, data)
            .then(res => {
              this.$message.success("更新成功");
              this.updateLoading = false;
              this.editDia = false;
            })
            .catch(() => {
              this.updateLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 处理删除
    handleDelete(textid) {
      console.log("textid,this.selected :>> ", textid, this.selected);
      if (textid > 0) {
        this.selected = [textid];
      } else {
        if (!this.selected.length) {
          this.$message.warning("请先选择要删除的选项");
          return;
        } else {
          this.selected = this.selected.map(d => {
            return d.textid;
          });
        }
      }
      this.$confirm("确定要删除吗，删除之后不可恢复噢", "提示", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        textRequest.deleteTexts(this.selected).then(() => {
          this.$message.success("删除成功");
          this.fetchTexts();
        });
      });
    },
    // 更新要上传的素材
    updateUploadList(file, fileList) {
      this.uploadList = fileList;
    },
    // 重置表单
    resetForm() {
      this.editForm = {
        folderid: null,
        text: "",
        style: ""
      };
      this.editDia = false;
    },
    // 处理当前页改变事件
    async handlePageChange(page) {
      this.pagination.currentPage = page;
      this.fetchLoading = true;
      await this.fetchTexts();
      this.fetchLoading = false;
    },
    // 处理页面尺寸发生改变事件
    async handlePageSizeChange(size) {
      this.pagination.size = size;
      this.fetchLoading = true;
      await this.fetchTexts();
      this.fetchLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  & >>> .el-form-item {
    margin-bottom: 0;
  }
}
</style>
