<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <el-button type="success" size="small" @click="handleAdd"
          >添加主题</el-button
        >
      </div>
      <div class="right">
        <el-input
          v-model="search"
          placeholder="名称"
          size="small"
          style="display:inline-block; width:150px;"
        ></el-input>
        <el-button type="primary" size="small" @click="fetchThemes"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="content">
      <e-table
        :list-data="tidList"
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
              @click="handleDelete(row.tid)"
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
          <el-input v-model="editForm.name" placeholder="主题的名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="type == 'edit' ? updateTheme() : addTheme()"
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
import tableHeaders from "./tableConfig/theme.js";
import ETable from "@/components/ETable.vue";
import themeRequest from "@/api/theme.js";
export default {
  components: {
    ETable
  },
  props: {},
  data() {
    return {
      search: "",
      tidList: [],
      tableHeaders: [],
      type: "edit", // 模式：区别同一个弹框使用的模式是编辑还是添加:edit/add
      editForm: {
        name: ""
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
      await this.fetchThemes();
      this.fetchLoading = false;
    },
    // 拉取所有主题
    async fetchThemes() {
      await themeRequest.fetchThemes(this.search).then(res => {
        this.tidList = res.data;
      });
    },
    // 处理添加
    handleAdd() {
      this.type = "add";
      this.editDia = true;
    },
    // 处理编辑
    handleEdit(row) {
      this.type = "edit";
      this.editForm = row;
      this.editDia = true;
    },
    // 添加主题
    addTheme() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.updateLoading = true;
          themeRequest
            .addTheme(this.editForm)
            .then(res => {
              this.$message.success("添加成功");
              this.updateLoading = true;
              this.fetchThemes();
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
    // 更新主题信息
    updateTheme() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {};
          data.name = this.editForm.name;
          console.log("this.editForm :>> ", this.editForm);
          this.updateLoading = true;
          themeRequest
            .updateTheme(this.editForm.tid, data)
            .then(res => {
              this.$message.success("更新成功");
              this.updateLoading = false;
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
    handleDelete(tid) {
      this.$confirm("确定要删除吗，主题中的模板将会被移动到“其他”", "提示", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        themeRequest.deleteTheme(tid).then(() => {
          this.$message.success("删除成功");
          this.fetchThemes();
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  & >>> .el-form-item {
    margin-bottom: 0;
  }
}
</style>
