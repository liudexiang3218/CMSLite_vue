<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.andNameEqualTo" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      :data="list"
      :default-sort = "{prop: 'sort', order: 'ascending'}"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="id"
      stripe
      @sort-change="sortChange"
    >
      <el-table-column
        type="selection"
        width="55px"/>
      <el-table-column
        :index="indexMethod"
        label="排序"
        width="80px"
        type="index"/>
      <el-table-column label="名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品" width="160px" prop="content" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="selectProduct(scope.$index, scope.row)">选择产品</el-button>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="160px" sortable="custom" prop="addTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.del" type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-loading="scope.row.isLoading">
            <el-button v-if="!scope.row.del" size="mini" @click="() => up(scope.row)">
              <svg-icon icon-class="up" />
            </el-button>
            <el-button v-if="!scope.row.del" size="mini" @click="() => down(scope.row)">
              <svg-icon icon-class="down" />
            </el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              v-if="!scope.row.del"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
              v-if="scope.row.del"
              size="mini"
              type="warning"
              @click="handleUnDelete(scope.$index, scope.row)">恢复</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    <el-dialog v-if="createFormVisible" :before-close="closeFormDialog" visible title="添加产品组件">
      <com-product-add :id="ruleForm.id" :name="ruleForm.name" :mode="ruleForm.mode" @modified="closeFormDialog" @created="closeFormDialog"/>
    </el-dialog>

    <el-dialog v-if="selectedFormVisible" :before-close="closeSelectedFormDialog" visible title="选择产品">
      <product-table :selected="selectedProducts" mode="select" @selected="saveSelectedFormDialog"/>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ComProductAdd from '@/views/component/product/comProductAdd'
import ProductTable from '@/views/product/listTable'
import { gets, deletes, unDeletes, up, down, update, getPath } from '@/api/cms'
import { bisError } from '@/api/util'
export default {
  name: 'CompProductTable',
  components: { Pagination, ComProductAdd, ProductTable },
  data() {
    return {
      createFormVisible: false,
      selectedFormVisible: false,
      selectedId: '',
      selectedProducts: [],
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        andNameEqualTo: undefined,
        sort: '+sort'
      },
      ruleForm: {
        id: '',
        name: '',
        mode: 'add'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeFormDialog(done) {
      this.getList()
      this.createFormVisible = false
      done()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    selectProduct(index, row) {
      this.selectedId = row.id
      getPath('comproduct', this.selectedId, 'products').then(response => {
        this.listLoading = false
        if (response.success) {
          this.selectedProducts = response.data
          this.selectedFormVisible = true
        }
      }).catch(error => {
        this.listLoading = false
        bisError(error)
      })
    },
    closeSelectedFormDialog(done) {
      this.selectedFormVisible = false
      done()
    },
    saveSelectedFormDialog(data) {
      var array = []
      data.forEach(element => {
        array.push(element.id)
      })
      update('comproduct', { id: this.selectedId, productIds: array }).then(response => {
        this.listLoading = false
        if (response.success) {
          this.total = response.data.total
          if (response.data.result) {
            response.data.result.forEach(element => {
              element.isLoading = false
            })
          }
          this.list = response.data.result
        }
      }).catch(error => {
        this.listLoading = false
        bisError(error)
      })

      this.selectedFormVisible = false
    },
    getList() {
      if (!this.listLoading) {
        this.listLoading = true
        if (this.listQuery.andNameEqualTo === '') {
          this.listQuery.andNameEqualTo = undefined
        }
        gets('comproduct', this.listQuery).then(response => {
          this.listLoading = false
          if (response.success) {
            this.total = response.data.total
            if (response.data.result) {
              response.data.result.forEach(element => {
                element.isLoading = false
              })
            }
            this.list = response.data.result
          }
        }).catch(error => {
          this.listLoading = false
          bisError(error)
        })
      }
    },
    handleCreate() {
      this.ruleForm.id = ''
      this.ruleForm.name = ''
      this.ruleForm.mode = 'add'
      this.createFormVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('请确认是否要执行删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        deletes('comproduct', [row.id]).then(response => {
          this.getList()
          if (response.success) {
            row.del = true
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000,
              showClose: true
            })
          }
        }).catch(error => {
          bisError(error)
          this.getList()
        })
      })
    },
    handleUnDelete(index, row) {
      this.$confirm('请确认是否要执行恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        unDeletes('comproduct', [row.id]).then(response => {
          this.getList()
          if (response.success) {
            row.del = false
            this.$message({
              message: '恢复成功',
              type: 'success',
              duration: 5 * 1000,
              showClose: true
            })
          }
        }).catch(error => {
          bisError(error)
          this.getList()
        })
      })
    },
    handleEdit(index, row) {
      this.ruleForm.id = row.id
      this.ruleForm.name = row.name
      this.ruleForm.mode = 'edit'
      this.createFormVisible = true
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = '-' + prop
      } else {
        this.listQuery.sort = '+' + prop
      }
      this.handleFilter()
    },
    up(data) {
      this.listLoading = true
      up('comproduct', data.id).then(response => {
        this.listLoading = false
        this.getList()
      }).catch(error => {
        this.listLoading = false
        bisError(error)
        this.getList()
      })
    },
    down(data) {
      this.listLoading = true
      down('comproduct', data.id).then(response => {
        this.listLoading = false
        if (response.success) {
          this.getList()
        }
      }).catch(error => {
        this.listLoading = false
        bisError(error)
      })
    }
  }
}
</script>
