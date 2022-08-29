<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="!show" @getCategoryId="getCategoryId" @changeSene="changeScene" />
    </el-card>

    <el-card>
      <div v-show="scene===0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
        <el-table style="width: 100%" border :data="records">

          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="spuName" label="spu名称" width="width" />
          <el-table-column prop="description" label="sku描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, index}">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加saku"
                @click="addSku(row)"
              />

              <!--              -->
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              />
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              />

              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deletespu(row)"
              >
                <hint-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                />
              </el-popconfirm>

              <!--              <el-button type="success" icon="el-icon-plus" size="mini"></el-button>-->
              <!--              <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>-->
              <!--              <el-button type="info" icon="el-icon-info"  size="mini"></el-button>-->
              <!--              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>-->

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3,5,10,20]"
          layout="prev, pager, next,jumper,->,sizes,total"
          :total="total"
          @current-change="changePage"
          @size-change="handleSizeChange"
        />

      </div>
      <SpuForm v-show="scene===1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene===2" ref="sku" @changeScene="changeScene" />

    </el-card>

    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >

      <el-table
        v-loading="loading"
        :data="skuList"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        />
        <el-table-column
          prop="price"
          label="价格"
          width="width"
        />
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
        />

        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '@/views/product/Spu/SpuForm'
import SkuForm from '@/views/product/Spu/SkuForm'

export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      show: true,
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0,
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], // 存储的是SKU列表的数据
      loading: true

    }
  },
  methods: {
    changePage(page) {
      this.page = page
      this.getSpuList()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (level === 3) {
        this.category3Id = categoryId
        console.log('axios')
        this.getSpuList()
      }
    },
    async getSpuList() {
      const { page, limit, category3Id } = this

      const res = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    },
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    changeScene({ scene, flag }) {
      console.log('-> flag', flag)
      console.log('-> scene', scene)

      this.scene = scene
      if (flag === '修改') {
        this.getSpuList()
      } else {
        this.changePage(1)
      }
    },
    // 删除spu
    async deletespu(row) {
      console.log('-> row.id', row.id)
      const res = await this.$API.spu.reqDeleteSpu(row.id)
      console.log('-> res.code', res.code)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    addSku(row) {
      this.scene = 2
      //
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      const res = await this.$API.spu.reqSkuList(spu.id)
      if (res.code === 200) {
        this.skuList = res.data
        this.loading = false
      }
    },
    close(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }

}
</script>

<style scoped>

</style>
