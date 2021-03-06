<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.andNameEqualTo" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column label="名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { gets, deletes, unDeletes } from '@/api/cms'
import { bisError, setSort } from '@/api/util'
export default {
  name: 'BlockTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        andNameEqualTo: undefined,
        sort: '-addTime'
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
        if (this.listQuery.andNameEqualTo === '') {
          this.listQuery.andNameEqualTo = undefined
        }
        gets('block', this.listQuery).then(response => {
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
      this.$router.push('/cms/block/add')
    },
    handleDelete(index, row) {
      this.$confirm('请确认是否要执行删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        deletes('block', [row.id]).then(response => {
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
        unDeletes('block', [row.id]).then(response => {
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
      this.$router.push({
        path: '/cms/block/add',
        query: {
          id: row.id,
          mode: 'edit'
        }
      })
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    sortChange(data) {
      const { prop, order } = data
      setSort(this.listQuery, order, prop)
      this.handleFilter()
    }
  }
}
</script>
