<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('login.username')" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
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
        type="index"/>
      <el-table-column :label="$t('login.username')" sortable="custom" prop="userName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nick }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="150px" sortable="custom" prop="addTime" align="center">
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
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog v-if="createUserFormVisible" :before-close="closeAddUser" visible title="创建用户">
      <add-user/>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import AddUser from '@/views/user/userAdd'
import { getUsers } from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'UserTable',
  components: { Pagination, AddUser },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        search: undefined,
        type: undefined,
        sort: '+addTime'
      },
      createUserFormVisible: false
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
      debugger
      if (!this.listLoading) {
        this.listLoading = true
        getUsers(this.listQuery).then(response => {
          this.listLoading = false
          if (response.success) {
            this.total = response.data.total
            this.list = response.data.result
          }
        }).catch(error => {
          this.listLoading = false
          if (!error.success && error.errorCode) {
            if (error.errorCode.substr(0, 1) !== '1') {
              Message({
                message: error.message,
                type: 'error',
                duration: 5 * 1000,
                showClose: true
              })
            }
          }
        })
      }
    },
    handleCreate() {
      this.createUserFormVisible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    closeAddUser(done) {
      this.createUserFormVisible = false
      done()
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
