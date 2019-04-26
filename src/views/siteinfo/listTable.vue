<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.andTitleEqualTo" placeholder="默认标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.andKeywordEqualTo" placeholder="默认seo keyword" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.andDescriptionEqualTo" placeholder="默认seo description" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="clearCache">清空缓存</el-button>
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
      <el-table-column label="添加时间" width="160px" prop="addTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认标题" prop="title" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认seo keyword" prop="keyword" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认seo description" prop="description" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
    <el-dialog v-if="showDialog" fullscreen visible title="编辑SEO" @close="showDialog=false">
      <site-info-edit :id="id" @close="showDialog=false" @created="closeDialog" @modified="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { gets, deletes, unDeletes, fetch } from '@/api/cms'
import { bisError, setSort } from '@/api/util'
import SiteInfoEdit from '@/views/siteinfo/siteInfoEdit'
export default {
  name: 'SiteInfoTable',
  components: { Pagination, SiteInfoEdit },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        andTitleEqualTo: undefined,
        andKeywordEqualTo: undefined,
        andDescriptionEqualTo: undefined,
        sort: '-addTime'
      },
      showDialog: false,
      id: '0'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      if (!this.listLoading) {
        this.listLoading = true
        if (this.listQuery.andTitleEqualTo === '') {
          this.listQuery.andTitleEqualTo = undefined
        }
        if (this.listQuery.andKeywordEqualTo === '') {
          this.listQuery.andKeywordEqualTo = undefined
        }
        if (this.listQuery.andDescriptionEqualTo === '') {
          this.listQuery.andDescriptionEqualTo = undefined
        }
        gets('siteinfo', this.listQuery).then(response => {
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
        deletes('siteinfo', [row.id]).then(response => {
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
        unDeletes('siteinfo', [row.id]).then(response => {
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
      setSort(this.listQuery, order, prop)
      this.handleFilter()
    },
    handleEdit(index, row) {
      this.id = row.id
      this.showDialog = true
    },
    handleCreate() {
      this.id = '0'
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
      this.getList()
    },
    clearCache() {
      fetch('siteinfo', 'clearcache').then(response => {
        if (response.success) {
          this.$message({
            message: '清除成功',
            type: 'success',
            duration: 5 * 1000,
            showClose: true
          })
        }
      }).catch(error => {
        bisError(error)
      })
    }
  }
}
</script>
