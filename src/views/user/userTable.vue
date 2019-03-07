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
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="55px"/>
      <el-table-column :label="$t('login.username')" prop="userName" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nick }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.del" type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">{{ $t('table.edit') }}</el-button>
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search: undefined,
        type: undefined,
        sort: '+id'
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
      getUsers(this.listQuery).then(response => {
        debugger
        const responseData = response.data
        if (!responseData.success) {
          Message({
            message: responseData.message,
            type: 'error',
            duration: 5 * 1000,
            showClose: true
          })
        } else {
          this.total = responseData.data.total
          this.list = responseData.data.result
        }
        this.listLoading = false
      }).catch(error => {
        Message({
          message: error,
          type: 'error',
          duration: 5 * 1000,
          showClose: true
        })
        this.listLoading = false
      })
    },
    handleCreate() {
      this.createUserFormVisible = true
    },
    closeAddUser(done) {
      this.createUserFormVisible = false
      // this.$refs.addUser.resetForm()
      done()
    }
  }
}
</script>
