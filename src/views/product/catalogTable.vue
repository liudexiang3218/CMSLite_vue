<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-tree
      ref="tree"
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
            size="mini"
            @click="() => update(node, data)">
            编辑
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
    <el-dialog v-if="editFormVisible" :before-close="closeEdit" visible title="编辑">
      <catalog-edit :id="editForm.id" :name="editForm.name" :options="list" :parent-ids="parentIds" @edited="createdCatalog"/>
    </el-dialog>
  </div>
</template>
<script>
import CatalogAdd from '@/views/product/catalogAdd'
import CatalogEdit from '@/views/product/catalogEdit'
import { getCatalogTree, deleteCatalogs, upCatalog, downCatalog } from '@/api/product'
import { bisError } from '@/api/util'
export default {
  name: 'CatalogTable',
  components: { CatalogAdd, CatalogEdit },
  data() {
    return {
      list: [],
      parentIds: ['0'],
      listLoading: false,
      listQuery: {
        andDelEqualTo: false
      },
      createFormVisible: false,
      editFormVisible: false,
      editForm:
      {
        id: '0',
        name: ''
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
    closeEdit(done) {
      this.editFormVisible = false
      done()
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
    update(node, data) {
      debugger
      let p = node.parent
      const op = []
      while (p && p.key) {
        op.unshift(p.key)
        p = p.parent
      }
      if (op.length === 0) {
        op.push('0')
      }
      this.parentIds = op
      this.editForm.id = data.id
      this.editForm.name = data.name
      this.editFormVisible = true
    },
    executeUp(data) {
      this.listLoading = true
      upCatalog(data.id).then(response => {
        this.listLoading = false
        this.getList()
      }).catch(error => {
        this.listLoading = false
        bisError(error)
        this.getList()
      })
    },
    up(node, data) {
      if (data.leftId === '0') {
        this.$confirm('此操作将会提升分类到上一个层级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.executeUp(data)
        })
      } else {
        this.executeUp(data)
      }
    },
    executedown(data) {
      this.listLoading = true
      downCatalog(data.id).then(response => {
        this.listLoading = false
        if (response.success) {
          this.getList()
        }
      }).catch(error => {
        this.listLoading = false
        bisError(error)
      })
    },
    down(node, data) {
      if (data.rightId === '0') {
        this.$confirm('此操作将会提升分类到上一个层级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.executedown(data)
        })
      } else {
        this.executedown(data)
      }
    },
    createdCatalog(data) {
      this.getList()
    },
    remove(node, data) {
      this.$confirm('请确认是否要执行删除' + data.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteCatalogs([data.id]).then(response => {
          this.listLoading = false
          this.getList()
        }).catch(error => {
          this.listLoading = false
          bisError(error)
          this.getList()
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-tree-custom .el-tree-node__content{
   padding-top: 8px;
padding-bottom: 8px;
 border-bottom: 1px solid #dcdfe6;
 height: 46px;
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

  }
</style>
