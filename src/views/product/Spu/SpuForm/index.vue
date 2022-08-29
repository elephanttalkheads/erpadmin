<template>
  <div>
    <el-form ref="form" label-width="80px" :data="spu">
      <el-form-item label="spu名称">
        <el-input v-model="spu.spuName" placeholder="请输入spu名称"/>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"/>

        </el-select>

      </el-form-item>
      <el-form-item label="spu描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="请输入描述"/>

      </el-form-item>
      <!--      -->
      <el-form-item label="spu照片">
        <el-upload
          action="/get-pro/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

      </el-form-item>
      <!--      -->
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndValue" :placeholder="`还有${unSelectorSaleAttrList.length}项没选择`">
          <el-option
            v-for="(unselect) in unSelectorSaleAttrList"
            :key="unselect.id"
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
          />

        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndValue" @click="addSaleAttr">添加销售属性
        </el-button>

        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center"/>
          <el-table-column prop="saleAttrName" label="属性名" width="width" align="center"/>
          <el-table-column prop="prop" label="属性名称列表" width="width" align="center">
            <template slot-scope="{row,$index}">

              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close=" row.spuSaleAttrValueList.splice(index,1)"

              >
                {{ tag.saleAttrValueName }}

              </el-tag>

              <el-input
                v-if="row.inputVisable"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">
                添加

              </el-button>
            </template>

          </el-table-column>
          <el-table-column prop="" label="操作" width="width" align="center">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"/>
            </template>

          </el-table-column>

        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>

export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],

        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]

      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndValue: ''
    }
  },
  computed: {

    unSelectorSaleAttrList() {
      const res = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return res
    }
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async initSpuData(spu) {
      try {
        const res = await Promise.all([

          this.$API.spu.reqSpu(spu.id),
          this.$API.spu.reqTrademarklist(),
          this.$API.spu.reqSpuImageList(spu.id),
          this.$API.spu.reqBaseSaleAttrList()
        ])

        this.spu = res[0].data
        this.tradeMarkList = res[1].data
        res[2].data.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = res[2].data

        this.saleAttrList = res[3].data
      } catch (err) {
        this.$message({ type: 'error', message: err.message })
      }
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndValue.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndValue = ''
    },
    addSaleAttrValue(row) {
      console.log('-> row', row)
      this.$set(row, 'inputVisable', true)
      this.$set(row, 'inputValue', '')
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() === '') {
        this.$message({ type: 'error', message: '不能为空' })
        return
      }
      const res = row.spuSaleAttrValueList.every(item => {
        return item.saleAttrValueName !== inputValue.trim()
      })
      if (!res) {
        this.$message({ type: 'error', message: '重复' })
        return
      }

      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisable = false
    },
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }

      })
      let res = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (res.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', {scene:0,flag:this.spu.id?'修改':'添加'})
      }
      Object.assign(this._data,this.$options.data())

    },
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      let tradeMarkResult = await this.$API.spu.reqTrademarklist()
      if (tradeMarkResult.code === 200) {

        this.tradeMarkList = tradeMarkResult.data
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data

      }

    },
    cancel(){
      this.$emit('changeScene',{scene:0,flag:'取消'})
      Object.assign(this._data,this.$options.data())

    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>
