<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-tree
      :data="list"
      :props="props"
      :expand-on-click-node="false"
      class="el-tree-custom"
      node-key="id"
      default-expand-all>
      <span v-if="data.id!=='0'" slot-scope="{ node, data }" class="custom-tree-node">

        <span>{{ node.label }}</span>
        <span>
          <el-button size="mini" @click="() => up(node,data)">
            <svg-icon icon-class="up" />
          </el-button>
          <el-button size="mini" @click="() => down(node,data)">
            <svg-icon icon-class="down" />
          </el-button>
          <el-button
            v-show="!data.del"
            type="primary"
            size="mini"
            @click="() => append(node,data)">
            添加子类
          </el-button>
          <el-button
            v-show="!data.del"
            type="danger"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>

      </span>
    </el-tree>

    <el-dialog v-if="createFormVisible" :before-close="closeAdd" visible title="创建">
      <catalog-add :options="list" :parent-ids="parentIds" @created="createdCatalog"/>
    </el-dialog>
  </div>
</template>
<script>
import CatalogAdd from '@/views/product/catalogAdd'
import { getCatalogTree, deleteCatalogs } from '@/api/product'
import { bisError } from '@/api/util'
export default {
  name: 'UserTable',
  components: { CatalogAdd },
  data() {
    return {
      list: [],
      parentIds: ['0'],
      listLoading: false,
      listQuery: {
        andDelEqualTo: false
      },
      createFormVisible: false,
      editForm:
      {
        id: '0',
        nick: '',
        roles: []
      },
      props: {
        value: 'id',
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    sortCatalog(arr) {
      arr.sort((a, b) => {
        return b.sort - a.sort
      })
    },
    sortList() {
      this.sortCatalog(this.list)
    },
    getList() {
      if (!this.listLoading) {
        this.listLoading = true
        getCatalogTree(this.listQuery).then(response => {
          this.listLoading = false
          if (response.success) {
            this.list = response.data
          }
        }).catch(error => {
          this.listLoading = false
          bisError(error)
        })
      }
    },
    handleCreate() {
      this.parentIds = ['0']
      this.createFormVisible = true
    },
    closeAdd(done) {
      this.createFormVisible = false
      done()
    },
    up(node, data) {
      debugger
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      if (index > 0) {
        const t0 = children[index - 1]
        const t1 = children[index]
        t1.sort = t0.sort + 1
        this.$set(children, index - 1, t1)
        this.$set(children, index, t0)
      }
    },
    down(node, data) {

    },
    append(node, data) {
      let p = node.parent
      const op = []
      while (p && p.key) {
        op.unshift(p.key)
        p = p.parent
      }
      op.push(data.id)
      this.parentIds = op
      this.createFormVisible = true
    },
    forEachCatalog(catalog, data, cb) {
      const callCatalog = this.forEachCatalog
      if (catalog.id === data.parentId) {
        cb(catalog)
        return true
      } else {
        if (catalog.children) {
          catalog.children.forEach(function(val, index, arr) {
            if (callCatalog(val, data, cb)) {
              return true
            }
          })
        }
      }
    },
    createdCatalog(data) {
      const callCatalog = this.forEachCatalog
      if (data.parentId === '0') {
        this.list.push(data)
      } else {
        this.list.forEach(function(val, index, arr) {
          if (callCatalog(val, data, function(ct) {
            if (!ct.children) {
              ct.children = []
            }
            ct.children.push(data)
          })) {
            return true
          }
        })
      }
      this.sortList()
    },
    remove(node, data) {
      const arr = []
      this.getCatalogs(data, arr)
      const ids = []
      arr.forEach(element => {
        ids.push(element.id)
      })
      this.listLoading = true
      deleteCatalogs(ids).then(response => {
        this.listLoading = false
        if (response.success) {
          arr.forEach(element => {
            element.del = true
          })
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        }
      }).catch(error => {
        this.listLoading = false
        bisError(error)
      })
    },
    getCatalogs(catalog, arr) {
      const cb = this.getCatalogs
      arr.push(catalog)
      if (catalog.children) {
        catalog.children.forEach(element => {
          cb(element, arr)
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-tree-custom .el-tree-node{

      padding-top: 8px;

}
</style>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    border-bottom: 1px solid #dcdfe6;
  }
</style>
