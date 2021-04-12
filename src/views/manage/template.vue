<!-- layout -->
<template>
  <div>
    <div class="header">
      <div class="left">
        <el-button type="success" size="small" @click="showAddDia"
          >添加模板</el-button
        >
        <el-button type="danger" size="small" @click="deleteTemplates(0)"
          >批量删除</el-button
        >
      </div>
      <div class="right">
        <el-form class="form-search" :model="searchForm" inline>
          <el-form-item label="主题：">
            <el-select
              v-model="searchForm.tid"
              placeholder="主题"
              size="small"
              @change="fetchTemplateList"
            >
              <el-option label="全部" :value="0" :key="-1"></el-option>
              <el-option
                v-for="(theme, i) in themeOptions"
                :key="i"
                :label="theme.name"
                :value="theme.tid"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="地址：">
            <el-input
              v-model="searchForm.address"
              size="small"
              placeholder="地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" @click="fetchTemplateList"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content">
      <e-table
        :list-data="templateList"
        :headers="tableHeaders"
        :pagination="pagination"
        v-loading="fetchTemplateLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="主题" align="center" slot="tid">
          <template slot-scope="{ row }">
            <span>{{
              themeOptions.find(theme => theme.tid == row.tid) &&
                themeOptions.find(theme => theme.tid == row.tid).name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封面" align="center" slot="cover_url">
          <template slot-scope="{ row }">
            <el-image :size="50" :src="row.cover_url"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="是否上架" align="center" slot="status">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              @change="disgardTemplate(row.tpid, row.status)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          slot="action"
          min-width="200px"
        >
          <template slot-scope="{ row }">
            <el-dropdown trigger="click" @command="handleCommand($event, row)">
              <el-button type="primary" plain icon="el-icon-edit" size="small"
                >编辑</el-button
              >
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="editinfo">信息编辑</el-dropdown-item>
                <el-dropdown-item command="editalbum"
                  >相册编辑</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <el-button type="primary" plain icon="el-icon-zoom-in" size="small"
              >预览</el-button
            >
            <el-button
              type="danger"
              plain
              icon="el-icon-edit"
              size="small"
              @click="deleteTemplates(row.tpid)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </e-table>
    </div>
    <!-- 编辑弹框 -->
    <el-dialog
      :visible.sync="editDia"
      width="700px"
      title="编辑"
      center
      v-loading="updateLoading"
    >
      <el-form class="form-equal500" :model="editForm" inline>
        <el-form-item label="主题：" required>
          <el-select v-model="editForm.tid" placeholder="请选择主题">
            <el-option
              v-for="(theme, i) in themeOptions"
              :key="i"
              :label="theme.name"
              :value="theme.tid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：" required>
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="封面：" required>
          <el-input v-model="editForm.cover_url"></el-input>
        </el-form-item>
        <el-form-item label="备注：" required>
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="updateTemplate"
          >确定</el-button
        >
        <el-button type="default" size="small" @click="editDia = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <!-- 创建相册 -->
    <el-dialog
      custom-class="dia-create"
      title="创建"
      :visible.sync="createDia"
      v-loading="createLoading"
      center
    >
      <el-form :model="createForm" label-width="80px" ref="createForm">
        <el-form-item label="名称：" prop="name" required>
          <el-input
            v-model="createForm.name"
            placeholder="为你的相册取一个好听的名称吧~"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题：" prop="tid" required>
          <el-select v-model="createForm.tid" placeholder="与相册相关的主题">
            <el-option
              v-for="(t, i) in themeOptions"
              :key="i"
              :label="t.name"
              :value="t.tid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="页数："
          prop="count"
          required
          :rules="[{ type: 'number', message: '页数必须为10~100的数字' }]"
        >
          <el-input
            v-model.number="createForm.count"
            placeholder="请输入相册的页数"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="createForm.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          @click="createTemplate()"
          >确定</el-button
        >
        <el-button type="default">取消</el-button>
      </div>
    </el-dialog>
    <!-- <review :visible="reviewDia" ></review> -->
  </div>
</template>

<script>
import tableHeaders from "./tableConfig/template.js";
import ETable from "@/components/ETable.vue";
import Review from "@/components/Review/index.vue";
import albumRequest from "@/api/album.js";
import themeRequest from "@/api/theme.js";
export default {
  components: {
    ETable,
    Review
  },

  data() {
    return {
      templateList: [],
      tableHeaders: [],
      searchForm: {
        tid: 0,
        name: ""
      },
      editForm: {
        tpid: null,
        tid: null,
        name: "",
        cover_url: "",
        remark: ""
      },
      createForm: {
        name: "",
        tid: "",
        count: 10,
        remark: ""
      },
      themeOptions: [],
      row: null, // 过渡更新
      pagination: {
        currentPage: 1,
        size: 10,
        totalCount: 10
      },
      selected: [],
      fetchTemplateLoading: false,
      updateLoading: false,
      createLoading: false,
      // Dia
      createDia: false,
      reviewDia: false,
      editDia: false
    };
  },

  computed: {},

  created() {
    this.tableHeaders = tableHeaders;
    this.init();
  },

  methods: {
    // 初始化页面
    init() {
      this.getThemeList();
      this.fetchTemplateList();
    },
    // 获取主题列表:
    getThemeList() {
      themeRequest.fetchThemes().then(res => {
        this.themeOptions = res.data;
        console.log("themeOptions :>> ", this.themeOptions);
        // let count = res.data.reduce((pre, cur) => {
        //   return pre + cur.count;
        // }, 0);
        // this.themeOptions.unshift({
        //   tid: 0,
        //   name: "全部",
        //   count: count
        // });
      });
    },
    // 拉取所有模板
    fetchTemplateList() {
      let params = {};
      params.search = this.searchForm.name;
      params.tid = this.searchForm.tid;
      params.isAll = 1; // 不过滤status == 0 的模板
      params.currentPage = this.pagination.currentPage;
      params.pageSize = this.pagination.size;
      this.fetchTemplateLoading = true;
      albumRequest
        .getTemplateList(params)
        .then(res => {
          this.templateList = res.data;
          this.templateList.forEach(template => {
            template.status = !!template.status;
          });
          this.fetchTemplateLoading = false;
        })
        .catch(() => {
          this.fetchTemplateLoading = false;
        });
    },
    handleCommand(command, row) {
      console.log("处理command", command);
      switch (command) {
        case "editinfo":
          this.handleEdit(row);
          break;
        case "editalbum":
          this.toDesign();
          break;
      }
    },
    // 处理编辑事件
    handleEdit(row) {
      console.log("编辑");
      this.row = row;
      for (let i in this.editForm) {
        this.editForm[i] = row[i];
      }
      this.editDia = true;
    },
    // 添加模板相册
    createTemplate(){
      this.createLoading = true;
      albumRequest.addTemplate(this.createForm).then(res=>{
        // console.log('res :>> ', res);
        this.createLoading = false;
        const aid = res.data.aid
        this.$confirm('创建成功','提示',{
          confirmButtonText:'现在就去',
          cancelButtonText: "稍后",
          type:'success'
        }).then(()=>{
          this.$router.push({
            name:'diy',
            params:{aid}
          })
        })
      }).catch(()=>{
        this.createLoading = false;
        this.createDia = false;
      })
    },
    // 编辑模板相册
    toDesign() {},
    // 更新模板
    updateTemplate() {
      let data = {};
      let tpid = this.editForm.tpid;
      for (let i in this.editForm) {
        if (i !== "tpid") data[i] = this.editForm[i];
      }
      this.updateLoading = true;
      albumRequest
        .updateTemplate(tpid, data)
        .then(async res => {
          for (let i in this.editForm) {
            if (i !== "tpid") this.row[i] = this.editForm[i];
          }
          this.$message.success("修改成功");
          this.updateLoading = false;
          this.editDia = false;
        })
        .catch(() => {
          this.updateLoading = false;
        });
    },
    // 上下架模板
    disgardTemplate(tpid, newStatus) {
      let status = newStatus ? 1 : 0;
      let data = { status };
      albumRequest.updateTemplate(tpid, data).then(() => {
        if (newStatus) {
          this.$message.success("已将该模板上架");
        } else {
          this.$message.warning("已将该模板下架");
        }
      });
    },
    showAddDia() {
      this.createDia = true;
    },
    handleSelectionChange(selected) {
      // console.log("selected :>> ", selected);
      this.selected = selected.map(item => {
        return item.tpid;
      });
    },
    // 删除模板
    deleteTemplates(tpid) {
      console.log("tpid :>> ", tpid);
      if (tpid > 0) {
        this.selected = [tpid];
      } else {
        console.log("this.selected.length :>> ", this.selected.length);
        if (!this.selected.length) {
          this.$message.warning("请先选择要删除的选项");
          return;
        }
      }
      this.$confirm("确定要将这些模板删除吗，删除后将不可恢复噢", "警告", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.templateList = this.templateList.filter(template => {
          return !this.selected.includes(template.tpid);
        });
        albumRequest
          .deleteTemplates({ selected: this.selected })
          .then(() => {
            this.$message.success("删除成功");
            this.selected = [];
          })
          .catch(() => {
            this.fetchTemplateList();
            this.selected = [];
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  & >>> .el-form-item {
    margin-bottom: 0;
  }
}
</style>
