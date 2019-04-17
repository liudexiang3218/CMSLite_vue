<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.andNameLike" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.andEmailLike" placeholder="email" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.andMobileLike" placeholder="手机" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
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
      @row-dblclick="rowClick"
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
      <el-table-column label="email" prop="email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" prop="mobile" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
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
          <el-tag v-if="!scope.row.del && scope.row.status===1" type="success">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-loading="scope.row.isLoading">
            <el-button
              v-if="scope.row.status===0"
              size="mini"
              @click="handleStatus(scope.$index, scope.row)">完成</el-button>
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
    <el-dialog :visible.sync="showDetail" :show-close="false" title="留言详情">
      <message-detail :message="detail"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { gets, deletes, unDeletes, status } from '@/api/cms'
import { bisError } from '@/api/util'
import MessageDetail from '@/views/message/detail'
export default {
  name: 'MessageTable',
  components: { Pagination, MessageDetail },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        andNameLike: undefined,
        andEmailLike: undefined,
        andMobileLike: undefined,
        sort: '+addTime'
      },
      showDetail: false,
      detail: {
        name: '',
        email: '',
        mobile: '',
        content: ''
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
        if (this.listQuery.andNameLike === '') {
          this.listQuery.andNameLike = undefined
        }
        if (this.listQuery.andEmailLike === '') {
          this.listQuery.andEmailLike = undefined
        }
        if (this.listQuery.andMobileLike === '') {
          this.listQuery.andMobileLike = undefined
        }
        gets('message', this.listQuery).then(response => {
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
    handleDelete(index, row) {
      this.$confirm('请确认是否要执行删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        deletes('message', [row.id]).then(response => {
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
        unDeletes('message', [row.id]).then(response => {
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
    handleStatus(index, row) {
      row.isLoading = true
      status('message', [row.id]).then(response => {
        this.getList()
        if (response.success) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000,
            showClose: true
          })
        }
      }).catch(error => {
        bisError(error)
        this.getList()
      })
    },
    rowClick(row, column, event) {
      this.detail = row
      this.showDetail = true
    }
  }
}
</script>
