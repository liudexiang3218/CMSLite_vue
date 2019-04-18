<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('login.username')" v-model="listQuery.andUserNameEqualTo" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ showRoles(scope.row) }}</span>
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

    <el-dialog v-if="createUserFormVisible" :before-close="closeAddUser" visible title="创建用户">
      <user-add/>
    </el-dialog>
    <el-dialog v-if="editUserFormVisible" :before-close="closeEditUser" visible title="修改用户">
      <user-edit :id="editForm.id" :nick="editForm.nick" :roles="editForm.roles" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import UserAdd from '@/views/user/userAdd'
import UserEdit from '@/views/user/userEdit'
import { getUsers, deleteUsers, unDeleteUsers } from '@/api/user'
import { bisError, setSort } from '@/api/util'
export default {
  name: 'UserTable',
  components: { Pagination, UserAdd, UserEdit },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        andUserNameEqualTo: undefined,
        sort: '-addTime'
      },
      createUserFormVisible: false,
      editUserFormVisible: false,
      editForm:
      {
        id: '0',
        nick: '',
        roles: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    showRoles(row) {
      const roles = []
      row.roles.forEach((element, index) => {
        switch (element) {
          case 'admin':
            roles[index] = '管理者'
            break
          case 'user':
            roles[index] = '普通用户'
        }
      })
      return roles.join(',')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      if (!this.listLoading) {
        this.listLoading = true
        if (this.listQuery.andUserNameEqualTo === '') {
          this.listQuery.andUserNameEqualTo = undefined
        }
        getUsers(this.listQuery).then(response => {
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
      this.createUserFormVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('请确认是否要执行删除' + row.userName + '账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        deleteUsers([row.id]).then(response => {
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
      this.$confirm('请确认是否要执行恢复' + row.userName + '账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.isLoading = true
        unDeleteUsers([row.id]).then(response => {
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
      this.editForm.id = row.id
      this.editForm.nick = row.nick
      this.editForm.roles = row.roles
      this.editUserFormVisible = true
      console.log(index, row)
    },
    closeEditUser(done) {
      this.editForm.id = '0'
      this.editForm.nick = ''
      this.editForm.roles = []
      this.editUserFormVisible = false
      done()
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
      setSort(this.listQuery, order, prop)
      this.handleFilter()
    }
  }
}
</script>
