<template>
  <div>

    <el-form ref="form" label-width="80px">

      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <!--      -->
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <!--      -->
      <el-form-item label="价格">
        <el-input placeholder="价格" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <!--      -->
      <el-form-item label="重量">
        <el-input placeholder="重量" type="number" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">

        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">

            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName"
                         :value="`${attr.id}:${attrValue.id}`"
                         v-for="(attrValue,index) in attr.attrValueList"
                         :key="attrValue.id"
              ></el-option>
            </el-select>


          </el-form-item>

        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">

          <el-form-item :label="saleAttr.saleAttrName"
                        v-for="(saleAttr,index) in spuSaleAttrList"
                        :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :value=`${saleAttr.id}:${saleAttrValue.id}` :label="saleAttrValue.saleAttrValueName"
                         v-for="(saleAttr,index) in saleAttr.spuSaleAttrValueList"
              ></el-option>

            </el-select>
          </el-form-item>
        </el-form>

      </el-form-item>

      <el-form-item label="图片列表">


        <el-table
          border
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            prop="prop"
            label="label"
            width="80"

          >
          </el-table-column>

          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">

            </template>


          </el-table-column>

          <el-table-column prop="prop" label="名称" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.isDefault===0" @click="changeDefa(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>

            </template>
          </el-table-column>


        </el-table>
      </el-form-item>
      <el-form-item>

        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>


      </el-form-item>

    </el-form>
  </div>

</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuName: '',
        weight: '',
        skuDefaultImg: '',
        skuDesc: '',
        skuAttrValueList: [
          {
            attrId: 0,
            attrName: '',
            id: 0,
            skuId: 0,
            valueid: 0,
            valuename: ''

          }
        ],

        skuImageList: [

          {
            id: 0,
            imgName: '',
            imgUrl: '',
            isDefault: '',
            skuId: 0,
            spuImgId: 0

          }
        ],

        skuSaleAttrValueList: [{
          id: 0,
          saleAttrId: 0,
          saleAttrName: '',
          saleAttrValueName: '',
          skuId: 0,
          spuId: 0

        }]

      },
      spu: {},
      imageList: []

    }

  },
  methods: {

    async getData(category1Id, category2Id, spu) {

      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      let res1 = await this.$API.spu.reqSpuImageList(spu.id)
      if (res1.code === 200) {
        let list = res1.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list

      }
      let res2 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (res2.code === 200) {
        this.spuSaleAttrList = res2.data

      }
      let res3 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (res3.code === 200) {
        this.attrInfoList = res3.data

      }

    },
    handleSelectionChange(parmas) {
      this.imageList = parmas

    },
    changeDefa(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      //点击的那个图片的数据变为1
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel() {

      this.$emit('changeScene', { scene: 0, flag: '' })
      Object.assign(this._data, this.$options.data())

    },
    async save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })

        }
        return prev

      }, [])
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id,
        }
      });
      let result  = await this.$API.spu.reqAddSku(skuInfo);
      if(result.code===200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.$emit('changeScene',{ scene: 0, flag: '' });
      }

    }
  }
}
</script>

<style scoped>

</style>
