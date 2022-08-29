<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"> 添加商品</el-button>
    <el-table border :data="list">

      <el-table-column type="index" label="序号" width="80px" align="center"/>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center"/>
      <el-table-column prop="logoUrl" label="品牌Logo" width="width" align="center">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="商品图片" style="width: 80px;height: 80px">


        </template>

      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{row,$index}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            style="margin-left:10px"
          >删除
          </el-button>

        </template>


      </el-table-column>


    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3,5,10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
    />
    <!-- 对话弹框 -->

    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <!--        -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <!--        -->
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!--          上传图片-->
          <el-upload
            class="avatar-uploader"
            action="get-pro/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>


export default {
  name: 'Index',
  data() {
    const validatetmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称需要在2-10位'))
      } else {

        callback()

      }
    }
        return {

          page: 1,
          limit: 5,
          total: 0,
          list: [],
          dialogFormVisible: false,

          tmForm: {
            tmName: '',
            logoUrl: ''

          },
          //表单验证规则
          rules: {
            tmName: [
              { required: true, message: '请输入品牌名称', trigger: 'blur' },
              { validator: validatetmName, trigger: 'change' }
              // {min:2,max:10,message:'请输入2-10个字符',trigger:'change'}
            ],
            logoUrl: [{ required: true, message: '请添加品牌的图片' }]
          }
        }
      },
      mounted
    ()
    {

      console.log(this.$API)
      this.getPageList()
      // this.$API.tradmark.reqTradeMarkList()
    }
  ,
    methods: {
      async getPageList(pager = 1)
      {
        this.page = pager

        const { page, limit } = this
        let res = await this.$API.tradmark.reqTradeMarkList(page, limit)
        // console.log(res)
        if (res.code === 200) {
          this.total = res.data.total
          this.list = res.data.records

        }

      }
    ,
      handleSizeChange(limit)
      {
        this.limit = limit
        this.getPageList()

      }
    ,
      showDialog()
      {
        this.dialogFormVisible = true
        this.tmForm = {
          tmName: '',
          logoUrl: ''
        }

      }
    ,
      handleAvatarSuccess(res, file)
      {
        // console.log(res)
        // console.log(file)
        // this.imageUrl = URL.createObjectURL(file.raw);
        this.tmForm.logoUrl = res.data
      }
    ,
      beforeAvatarUpload(file)
      {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    ,
      addOrUpdateTradeMark()
      {
        this.$refs.ruleForm.validate(async(success) => {
          // console.log(success)
          if (success) {

            this.dialogFormVisible = false
            let res = await this.$API.tradmark.reqAddOrUpdateTradeMark(this.tmForm)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'

              })
              let newpage = this.tmForm.id ? this.page : Math.ceil((this.total) / this.limit)
              // console.log(newpage)
              this.getPageList(newpage)

            }

          } else {
            console.log('添加失败')
            return false
          }
        })

        // this.dialogFormVisible = false
        // let res = await this.$API.tradmark.reqAddOrUpdateTradeMark(this.tmForm)
        // if (res.code === 200) {
        //   this.$message({
        //     type: 'success',
        //     message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
        //
        //   })
        //   let newpage = this.tmForm.id ? this.page : Math.ceil((this.total) / this.limit)
        //   // console.log(newpage)
        //   this.getPageList(newpage)
        //
        // }

      }
    ,

      updateTradeMark(row)
      {
        this.dialogFormVisible = true
        // console.log(row)
        Object.assign(this.tmForm, row)
        // console.log(this.tmForm)
      }
    ,
      deleteTradeMark(row)
      {
        this.$confirm(`确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let res = await this.$API.tradmark.reqDeleteTrademark(row.id)
          if (res.code===200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            // if (this.page>=this.total/this.limit){
            //    newpage=this.total%this.limit===1? this.page-1:this.page
            // }else {
            //   newpage=this.page;
            //
            //   }
            let newpage=this.list.length>1?this.page:this.page-1;

            this.getPageList(newpage)


          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }

  }


</script>

<style scoped>
.el-button {
  margin: 10px 0;

}

.el-table {
  width: 100%;

}

.el-pagination {
  margin-top: 20px;

  text-align: center;

}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-dialog .el-button {

  margin-left: 10px;
}


</style>
