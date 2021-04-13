<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <el-button type="success" size="small" @click="handleAdd"
          >添加目录</el-button
        >
      </div>
      <div class="right">
        <el-input
          v-model="search"
          placeholder="名称"
          size="small"
          style="display:inline-block; width:150px;"
        ></el-input>
        <el-button type="primary" size="small" @click="fetchFolders"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="content">
      <e-table
        :list-data="folderList"
        :headers="tableHeaders"
        v-loading="fetchLoading"
      >
        <el-table-column label="isvip" align="center" slot="isvip">
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.isvip === 1">是</el-tag>
            <el-tag type="info" v-else>否</el-tag>
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
              @click="handleDelete(row.folderid)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </e-table>
    </div>
    <!-- 编辑/添加弹窗 -->
    <el-dialog
      :title="type == 'edit' ? '编辑' : '添加'"
      :visible.sync="editDia"
      center
      width="700px"
    >
      <el-form
        class="form-equal500"
        :model="editForm"
        label-width="120px"
        label-position="right"
        ref="editForm"
      >
        <el-form-item label="名称：" prop="name" required>
          <el-input v-model="editForm.name" placeholder="目录的名称"></el-input>
        </el-form-item>
        <el-form-item label="VIP专属：" prop="isvip" required>
          <el-select v-model="editForm.isvip" placeholder="是否需要VIP">
            <el-option label="是" :value="1">是</el-option>
            <el-option label="否" :value="0">否</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="type == 'edit' ? updateFolder() : addFolder()"
          >确定</el-button
        >
        <el-button type="default" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableHeaders from "./tableConfig/decorationFolder.js";
import ETable from "@/components/ETable.vue";
import decorationRequest from "@/api/decoration.js";
export default {
  components: {
    ETable
  },
  props: {},
  data() {
    return {
      search: "",
      folderList: [],
      tableHeaders: [],
      type: "edit", // 模式：add/edit 区别同一个弹框使用的模式是编辑还是添加
      editForm: {
        name: "",
        isvip: null
      },
      fetchLoading: false,
      updateLoading: false,
      editDia: false // 编辑添加同一个框
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
      this.fetchLoading = false;
    },
    // 拉取所有装饰目录
    async fetchFolders() {
      await decorationRequest.getFolders(this.search).then(res => {
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
      this.type = "edut";
      this.editForm.name = row.name;
      this.editForm.isvip = row.isvip;
      this.editDia = true;
    },
    // 添加目录
    addFolder() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.updateLoading = true;
          decorationRequest
            .addFolder(this.editForm)
            .then(res => {
              this.$message.success("添加成功");
              this.updateLoading = true;
              this.fetchFolders();
              this.editDia = false;
            })
            .catch(() => {
              this.updateLoading = false;
            });
        } else {
          return;
        }
      });
    },
    // 更新目录信息
    updateFolder() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {};
          data.name = this.editForm.name;
          data.isvip = this.editForm.isvip;
          this.updateLoading = true;
          decorationRequest
            .updateFolder(this.editForm.folderid, data)
            .then(res => {
              this.$message.success("更新成功");
              this.updateLoading = false;
              this.fetchFolders();
              this.editDia = false;
            })
            .catch(() => {
              this.updateLoading = false;
            });
        } else {
          return;
        }
      });
    },
    // 处理删除
    handleDelete(folderid) {
      this.$confirm("确定要删除吗，目录中的所有图片也会被删除噢", "提示", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        decorationRequest.deleteFolder(folderid).then(() => {
          this.$message.success("删除成功");
          this.fetchFolders();
        });
      });
    },
    // 处理当前页改变事件
    async handlePageChange(page) {
      this.pagination.currentPage = page;
      this.fetchLoading = true;
      await this.fetchFolders();
      this.fetchLoading = false;
    },
    // 处理页面尺寸发生改变事件
    async handlePageSizeChange(size) {
      this.pagination.size = size;
      this.fetchLoading = true;
      await this.fetchFolders();
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
