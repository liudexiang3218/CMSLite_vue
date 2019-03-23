<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.andCodeEqualTo" placeholder="型号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      :data="list"
      :default-sort = "{prop: 'addTime', order: 'descending'}"
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
        width="80px"
        type="index"/>
      <el-table-column label="型号" width="150px" sortable="custom" prop="code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.spec }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="150px" sortable="custom" prop="addTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.del" type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-loading="scope.row.isLoading">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleCopy(scope.$index, scope.row)">复制</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ProductAdd from '@/views/product/productAdd'
import ProductEdit from '@/views/product/productEdit'
import { getProducts, deleteProducts, unDeleteProducts } from '@/api/product'
import { bisError } from '@/api/util'
export default {
  name: 'UserTable',
  components: { Pagination, ProductAdd, ProductEdit },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        andCodeEqualTo: undefined,
        sort: '+addTime'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      if (!this.listLoading) {
        this.listLoading = true
        if (this.listQuery.andCodeEqualTo === '') {
          this.listQuery.andCodeEqualTo = undefined
        }
        getProducts(this.listQuery).then(response => {
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
      this.$router.push('/product/add')
    },
    handleDelete(index, row) {
      debugger
      this.$confirm('请确认是否要执行删除型号为' + row.code + '的产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        deleteProducts([row.id]).then(response => {
          row.isLoading = false
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
          row.isLoading = false
        })
      })
    },
    handleUnDelete(index, row) {
      this.$confirm('请确认是否要执行恢复型号为' + row.code + '的产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        unDeleteProducts([row.id]).then(response => {
          row.isLoading = false
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
          row.isLoading = false
        })
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/product/add',
        query: {
          id: row.id,
          mode: 'edit'
        }
      })
    },
    handleCopy(index, row) {
      this.$router.push({
        path: '/product/add',
        query: {
          id: row.id
        }
      })
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
    }
  }
}
</script>
