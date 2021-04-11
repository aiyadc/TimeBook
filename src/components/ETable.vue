<template>
  <div id="b-table">
    <el-table :data="listData" :row-style="rowStyle" :header-cell-style	="headerCellStyle" border fit empty-text="暂无数据哦~" @selection-change="handleSelectionChange">
      <template v-for="(item, index) in headers">
        <!-- 展开行功能 -->
        <el-table-column :key="index" v-if="item.children" type="expand">
          <template slot-scope="{ row }">
            <el-form class="b-table-insert-form">
              <el-form-item :key="childIndex" :label="`${child.label}:`" v-for="(child, childIndex) in item.children" size="mini">
                <span v-html="row[child.keyName]"/>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!-- 复杂的td -->
        <slot :name="item.slot" v-if="item.type === 'slot'"/>
        <!-- 简单的td <单纯文本框> -->
        <el-table-column
          :label="item.label"
          :prop="item.keyName"
          :width="item.width"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.hasTooltip"
          :fixed="item.fixed"
          :key="index"
          :formatter="item.formatter"
          v-if="item.type === 'text'"/>
        <!-- 多选 -->
        <el-table-column :width="item.width" :align="item.align || 'center'" :key="index" v-if="item.type === 'selection'" type="selection"/>
      </template>
    </el-table>
    <div v-if="pagination.currentPage">
      <el-pagination
        :total="pagination.totalCount"
        :current-page.sync="pagination.currentPage"
        :page-size="pagination.size"
        :page-sizes="[10, 50, 100, 500]"
        background
        class="b-table-pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
/**
 * 
 * @author Eachan.Lin  
 * @param {Array} headers - 表格列的配置信息
 * @param {Array} listData - 表格具体数据
 * @param {Object} [pagination]={currentPage:0,size:0,totalCount:0} - 表格底部的分页组件
 * @param {[Object,Function]} [rowStyle]={color:'#333'} - 表格行的样式
 * @param {[Object,Function]} [headerCellStyle]=function({ row, column, rowIndex, columnIndex }{return {color:'#333',backgroundColor:'#ebecf0'}} - 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style  
 * @event changesize - 当分页器的size改变时触发
 * @event changepage - 当分页组件当前页改变时触发
**/
export default {
  name: 'BTable',
  props: {
    listData: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
      default:()=>({
          currentPage: 0,
          size: 0,
          totalCount: 0,
      })
    },
    // expand: {
    //   type: Boolean,
    //   default: false,
    // },
    rowStyle: {
      type: [Object, Function],
      default:()=>({
        color: '#333'
      })
    },
    headerCellStyle:{
      type: [Object,Function],
      default:()=>function({ row, column, rowIndex, columnIndex }){
        return{
          color:'#333',
          backgroundColor:'#ebecf0'
        }
      }
    }
  },
  // mixins: [],
  data () {
    return {
      multipleSelection: [],
    };
  },
  // computed: {},
  // watch: {},
  // beforeCreate() {},
  // created() {},
  // beforeMount() {},
  // mounted() {},
  // beforeUpdate() {},
  // updated() {},
  // beforeDestroy() {},
  // destroyed() {},
  methods: {
    handleSizeChange (val) {
      this.$emit('changesize', val);
    },
    handleCurrentChange (val) {
      this.$emit('changepage', val);
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.$emit('selection-change',val)
    },
    // formatText(row){
    //   return row.keyName || '--'
    // }
    // rowStyle ({ row, rowIndex}) {
    //   return 'color:#333;';
    // },
    // headerCellStyle ({ row, column, rowIndex, columnIndex }) {
    //   return 'color:#333;background-color:#ebecf0;';
    // },
  },
  mounted(){
    console.log(this.rowStyle)
  }
};
</script>

<style lang="scss">
#b-table {
  td {
    padding: 8px 0;
  }
  .b-table-pagination {
    margin: 20px 0;
    text-align: center;
  }
  .b-table-insert-form {
    padding: 10px 12px;
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
