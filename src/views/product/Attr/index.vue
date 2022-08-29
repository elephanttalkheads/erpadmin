<template>

  <div>

    <el-card style="margin:20px 0">
      <CategorySelect :show="!isShowtable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>

      <!--  table    -->
      <div v-show="isShowtable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          :disabled="!category3Id"
          @click="handleEdit"
        >添加
        </el-button>

        <el-table style="width:100% ;margin-top: 10px" border :data="attrList">

          <el-table-column type="index" label="序号" width="50" align="center" />

          <el-table-column prop="attrName" label="属性名称" width="150" align="center" />

          <el-table-column prop="prop" label="属性列表" width="width" align="left">
            <template slot-scope="{row,$index}">
              <!--            {{row}}-->

              <el-tag
                v-for="(attrValue,index) in row.attrValueList"
                :key="attrValue.id"
                :hit="true"
                type="success"
                style="margin: 0 10px"
              >{{ attrValue.valueName }}
              </el-tag>

            </template>

          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <div slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateattr(row)" />

              <el-popconfirm
                :title="`确定删除${row.attrName}？`"
                @onConfirm="deleteAttrName(row,$index)"
              >
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>

            </div>

          </el-table-column>

        </el-table>
      </div>

      <!--      修改属性结构-->

      <div v-show="!isShowtable">

        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
            />
          </el-form-item>

        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button>取消</el-button>
        <el-table
          border
          style="width: 100% ;
          margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            width="width"
            prop="prop"
            label="属性名称"
            align="center"
          >
            <template
              slot-scope="{row,$index}"
            >
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                :autofocus="true"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              />
              <span
                v-else
                style="
                    width: 100%;
                    height:23px;
                    display:block;"
                @click="inputfocus(row,$index)"
              >
                {{ row.valueName }}
              </span>

            </template>
          </el-table-column>
          <el-table-column
            width="width"
            prop="prop"
            label="操作"
            align="center"
          >
            <template
              slot-scope="{row,$index}"
            >
              <el-popconfirm
                :title="`确定删除${row.valueName}？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />

              </el-popconfirm>

            </template>

          </el-table-column>

        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addorupdateatttr">保存</el-button>
        <el-button @click="isShowtable=true">取消</el-button>

      </div>

    </el-card>
  </div>

</template>

<script>
import { reqAttrList } from '@/api/product/attr'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Index',
  data() {
    return {
      attrList: [],
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制table显示与隐藏
      isShowtable: true,
      // 收集新增数据
      attrInfo: {
        'attrName': '', // 属性名
        'attrValueList': [// 属性值
          // {
          //   // "attrId": 0,
          //   // "valueName": ""
          // }
        ],
        'categoryId': 0,
        'categoryLevel': 3
      }
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      switch (level) {
        case 1:
          this.category1Id = categoryId
          this.category2Id = ''
          this.category3Id = ''
          break
        case 2:
          this.category2Id = categoryId
          this.category3Id = ''
          break
        case 3:
          this.category3Id = categoryId
          this.getAttrList()

          break
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this

      const res = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (res.code === 200) {
        // console.log("-> res", res.data);
        this.attrList = res.data
      }
    },
    handleEdit() {
      this.isShowtable = false
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    updateattr(row) {
      console.log('-> row', row)
      this.isShowtable = false

      // 这里得使用深拷贝
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach((item) => {
        // item.flag = false
        this.$set(item, 'flag', false)
      })
    },
    // input说去焦点后的回调
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      const isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepat) {
        this.$message('属性值以重复')
        return
      }

      row.flag = false

      // console.log("-> row", row);
      // console.log("-> this.attrInfo.attrValueList", this.attrInfo.attrValueList);
    },
    // 自动获取焦点
    inputfocus(row, $index) {
      row.flag = true
      // console.log('-> this.$refs', this.$refs)
      this.$nextTick(() => {
        this.$refs[$index].focus()
      })
    },
    // 气泡确认框确认回调
    deleteAttrValue($index) {
      this.attrInfo.attrValueList.splice($index, 1)
    },
    async addorupdateatttr() {
      //  整理参数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowtable = true
        this.$message({ type: 'success', message: '保存成功' })
        await this.getAttrList()
      } catch (err) {
        this.$message({ type: 'error', message: '保存失败' })
      }
    },
    async deleteAttrName(row, $index) {
      console.log('-> $index', $index)
      console.log('-> row', row)
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.splice(0, this.attrInfo.attrValueList.length)
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.$message({ type: 'success', message: '删除成功' })
        await this.getAttrList()
      } catch (err) {
        this.$message({ type: 'error', message: '删除失败' })
      }
    }

  }

}
</script>

<style scoped>

</style>
