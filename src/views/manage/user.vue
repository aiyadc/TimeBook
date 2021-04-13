<!-- layout -->
<template>
  <div>
    <div class="header">
      <div class="left">
        <el-button type="success" size="small" @click="createUser"
          >添加用户</el-button
        >
      </div>
      <div class="right">
        <el-form class="form-search" :model="searchForm" inline>
          <el-form-item label="">
            <el-input
              v-model="searchForm.account"
              size="small"
              placeholder="账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="-">
            <el-input
              v-model="searchForm.nickname"
              size="small"
              placeholder="昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="-">
            <el-input
              v-model="searchForm.mobile"
              size="small"
              placeholder="手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="-">
            <el-input
              v-model="searchForm.mail"
              size="small"
              placeholder="邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="-">
            <el-input
              v-model="searchForm.address"
              size="small"
              placeholder="地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" @click="fetchUserList"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content">
      <e-table
        :list-data="userList"
        :headers="tableHeader"
        :pagination="pagination"
        @changesize="changePageSize"
        @changepage="changeCurrentPage"
        v-loading="fetchUserLoading"
      >
        <el-table-column label="状态" align="center" slot="status">
          <template slot-scope="{ row }">
            <el-switch v-model="row.status"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300px"
          align="center"
          slot="action"
        >
          <template slot-scope="{ row }">
            <div>
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="small"
                @click="handleDelete(row.uid)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </e-table>
    </div>
  </div>
</template>

<script>
import userTable from "./tableConfig/user";
import ETable from "@/components/ETable.vue";
import userRequest from "@/api/user.js";
export default {
  components: {
    ETable
  },

  data() {
    return {
      userList: [],
      tableHeader: [],
      searchForm: {
        account: "",
        nickname: "",
        mobile: "",
        mail: "",
        address: ""
      },
      pagination: {
        currentPage: 1,
        size: 10,
        totalCount: 10
      },
      fetchUserLoading: false
    };
  },

  computed: {},

  created() {
    // console.log("userTable :>> ", userTable);
    console.log("tableHeader :>> ", this.tableHeader);

    this.tableHeader = userTable;
    this.init();
  },

  methods: {
    // 初始化界面
    init() {
      this.fetchUserList();
    },
    // 拉取用户列表
    fetchUserList() {
      this.fetchUserLoading = true;
      let params = {};
      params.searchForm = this.searchForm;
      params.pagination = this.pagination;
      userRequest
        .fetchUserList(params)
        .then(res => {
          this.userList = res.data;
          this.pagination.totalCount = this.userList.length;
          this.userList.forEach(user => {
            user.status = !!user.status;
          });
          console.log("this.userList :>> ", this.userList);
          this.fetchUserLoading = false;
        })
        .catch(() => {
          this.fetchUserLoading = false;
        });
    },
    handleEdit() {
      // todo
    },
    handleDelete(uid) {
      // todo
      this.$confirm("确定要删除此用户吗？", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        userRequest.deleteUser(uid).then(() => {
          this.$message.success("删除成功");
        });
      });
    },
    // 格式化status
    formatStatus(row) {
      console.log("row :>> ", row);
      console.log("!!row.status :>> ", !!row.status);
      return !!row.status;
    },
    toSearch() {
      userRequest.searchUsers(this.searchForm).then(res => {
        this.userList = res.data;
      });
    },
    // 添加用户
    createUser() {},
    // 处理页数改变
    changeCurrentPage(val) {
      this.pagination.currentPage = val;
      this.fetchUserList();
    },
    // 处理页面显示项目尺寸改变
    changePageSize(val) {
      this.pagination.size = val;
      this.fetchUserList();
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
</style>
