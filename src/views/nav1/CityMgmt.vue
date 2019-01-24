<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px ">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.city" placeholder="城市"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getCityList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      v-if="total"
      :data="list"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100% "
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="city" label="城市" sortable></el-table-column>
      <el-table-column prop="cityPic" label="城市图片" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.cityPic" alt width="50">
        </template>
      </el-table-column>
      <el-table-column prop="hotPicList" label="热门图片" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.hotPicList[0]" alt width="50">
        </template>
      </el-table-column>
      <el-table-column prop="foodPicList" label="美食图片" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.foodPicList[0]" alt width="50">
        </template>
      </el-table-column>
      <el-table-column prop="goPicList" label="去处图片" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.goPicList[0]" alt width="50">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="empty">暂无配置</div>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="10"
        :total="total"
        style="float:right "
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="城市" prop="city">
          <el-input v-model="editForm.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="旅行攻略" prop="info">
          <el-input v-model="editForm.info" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="cityPic">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange"
            @click.native="changePicType('cityPic')"
          >
            <img v-if="editForm.cityPic" :src="editForm.cityPic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 热门 -->
        <el-form-item class="hotTitleGroup">
          <el-form-item label="热门标题1" prop="hotTitle1">
            <el-input v-model="editForm.hotTitle1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="热门标题2" prop="hotTitle2">
            <el-input v-model="editForm.hotTitle2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="热门标题3" prop="hotTitle3">
            <el-input v-model="editForm.hotTitle3" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="热门标题4" prop="hotTitle4">
            <el-input v-model="editForm.hotTitle4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="热门图组" prop="hotPicList">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="editForm.hotPicList.map(item=>{return {url: item}})"
            @click.native.capture="changePicType('hotPicList')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- 美食 -->
        <el-form-item class="hotTitleGroup">
          <el-form-item label="美食标题1" prop="foodTitle1">
            <el-input v-model="editForm.foodTitle1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="美食标题2" prop="foodTitle2">
            <el-input v-model="editForm.foodTitle2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="美食标题3" prop="foodTitle3">
            <el-input v-model="editForm.foodTitle3" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="美食标题4" prop="foodTitle4">
            <el-input v-model="editForm.foodTitle4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="美食图组" prop="foodPicList">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="editForm.foodPicList.map(item=>{return {url: item}})"
            @click.native.capture="changePicType('foodPicList')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- 去处 -->
        <el-form-item class="hotTitleGroup">
          <el-form-item label="去处标题1" prop="goTitle1">
            <el-input v-model="editForm.goTitle1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="去处标题2" prop="goTitle2">
            <el-input v-model="editForm.goTitle2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="去处标题3" prop="goTitle3">
            <el-input v-model="editForm.goTitle3" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="去处标题4" prop="goTitle4">
            <el-input v-model="editForm.goTitle4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="去处图组" prop="goPicList">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="editForm.goPicList.map(item=>{return {url: item}})"
            @click.native.capture="changePicType('goPicList')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="城市" prop="city">
          <el-input v-model="addForm.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="旅行攻略" prop="info">
          <el-input v-model="addForm.info" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="cityPic">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange"
            @click.native.capture="changePicType('cityPic')"
          >
            <img v-if="addForm.cityPic" :src="addForm.cityPic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 热门 -->
        <el-form-item class="hotTitleGroup">
          <el-form-item label="热门标题1" prop="hotTitle1">
            <el-input v-model="addForm.hotTitle1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="热门标题2" prop="hotTitle2">
            <el-input v-model="addForm.hotTitle2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="热门标题3" prop="hotTitle3">
            <el-input v-model="addForm.hotTitle3" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="热门标题4" prop="hotTitle4">
            <el-input v-model="addForm.hotTitle4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="热门图组" prop="hotPicList">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="addForm.hotPicList.map(item=>{return {url: item}})"
            @click.native.capture="changePicType('hotPicList')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- 美食 -->
        <el-form-item class="hotTitleGroup">
          <el-form-item label="美食标题1" prop="foodTitle1">
            <el-input v-model="addForm.foodTitle1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="美食标题2" prop="foodTitle2">
            <el-input v-model="addForm.foodTitle2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="美食标题3" prop="foodTitle3">
            <el-input v-model="addForm.foodTitle3" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="美食标题4" prop="foodTitle4">
            <el-input v-model="addForm.foodTitle4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="美食图组" prop="hotPicList">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="addForm.foodPicList.map(item=>{return {url: item}})"
            @click.native.capture="changePicType('foodPicList')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- 去处 -->
        <el-form-item class="hotTitleGroup">
          <el-form-item label="去处标题1" prop="goTitle1">
            <el-input v-model="addForm.goTitle1" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="去处标题2" prop="goTitle2">
            <el-input v-model="addForm.goTitle2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="去处标题3" prop="goTitle3">
            <el-input v-model="addForm.goTitle3" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="去处标题4" prop="goTitle4">
            <el-input v-model="addForm.goTitle4" auto-complete="off"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="去处图组" prop="hotPicList">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :auto-upload="false"
            :on-remove="handleRemove"
            :file-list="addForm.goPicList.map(item=>{return {url: item}})"
            @click.native.capture="changePicType('goPicList')"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util"
//import NProgress from 'nprogress'
import {
  getCityList,
  removeCity,
  batchRemoveCity,
  editCity,
  addCity
} from "../../api/api"
import { log } from "util"

export default {
  data() {
    return {
      goPicList: [],
      hotPicList: [],
      cityPic: [],
      dialogImageUrl: "",
      dialogVisible: false,
      clickType: "",
      imageUrl: "",
      filters: {
        city: ""
      },
      list: [],
      total: 0,
      page: 1,
      listLoading: false,
      delLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        info: [{ required: true, message: "请输入攻略", trigger: "blur" }],
        cityPic: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        city: "",
        info: "",
        hotTtile1: "",
        hotTtile2: "",
        hotTtile3: "",
        hotTtile4: "",
        foodTtile1: "",
        foodTtile2: "",
        foodTtile3: "",
        foodTtile4: "",
        goTtile1: "",
        goTtile2: "",
        goTtile3: "",
        goTtile4: "",
        goPicList: [],
        hotPicList: [],
        foodPicList: [],
        cityPic: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        info: [{ required: true, message: "请输入攻略", trigger: "blur" }],
        cityPic: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        city: "",
        info: "",
        hotTtile1: "",
        hotTtile2: "",
        hotTtile3: "",
        hotTtile4: "",
        foodTtile1: "",
        foodTtile2: "",
        foodTtile3: "",
        foodTtile4: "",
        goTtile1: "",
        goTtile2: "",
        goTtile3: "",
        goTtile4: "",
        goPicList: [],
        hotPicList: [],
        foodPicList: [],
        cityPic: ''
      },
      user: JSON.parse(sessionStorage.getItem("user"))
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getCityList()
    },
    //获取首页列表
    getCityList() {
      let para
      if (this.filters.city !== '') {
        para = {
          city: this.filters.city
        }
      } else {
        para = null
      }
      let page = this.page
      this.listLoading = true
      //NProgress.start() 
      getCityList(para).then(res => {
        let { code, msg } = res.data
        if (code !== 200) {
          this.listLoading = false
          this.$message({
            message: msg,
            type: "error"
          })
        } else {
          this.total = res.data.list.length
          this.list = res.data.list.filter(
            (u, index) => index < 10 * page && index >= 10 * (page - 1)
          )
          // this.list = res.data.list 
          this.listLoading = false
          //NProgress.done() 
        }
      })
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true
        //NProgress.start() 
        let para = { _id: row._id }
        removeCity(para)
          .then(res => {
            let { code, msg } = res.data
            if (code !== 200) {
              this.$message({
                message: msg,
                type: "error"
              })
            } else {
              //NProgress.done() 
              this.$message({
                message: "删除成功",
                type: "success"
              })
              this.getCityList()
            }
          })
          .catch(err => {
            this.listLoading = false
            this.$message({
              message: "fail",
              type: "error"
            })
          })
      })
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true
      row.hotPicList ? '' : row.hotPicList = []
      row.foodPicList ? '' : row.foodPicList = []
      row.goPicList ? '' : row.goPicList = []
      let cloneRow = JSON.parse(JSON.stringify(row));
      this.editForm = Object.assign({}, cloneRow)
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true
      this.$refs["addForm"] ? this.$refs["addForm"].resetFields() : ""  //第一次点击新增会报错，
      this.addForm.hotPicList = []
      this.addForm.foodPicList = []
      this.addForm.goPicList = []
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true
            //NProgress.start() 
            let para = Object.assign({}, this.editForm)
            editCity(para)
              .then(res => {
                this.editLoading = false
                //NProgress.done() 
                this.$message({
                  message: "提交成功",
                  type: "success"
                })
                this.$refs["editForm"].resetFields()
                this.editFormVisible = false
                this.getCityList()
              })
              .catch(err => {
                this.editLoading = false
                this.$message({
                  message: "fail",
                  type: "error"
                })
              })
          })
        }
      })
    },
    //新增
    addSubmit: function () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true
            //NProgress.start() 
            let para = Object.assign({}, this.addForm)
            addCity(para)
              .then(res => {
                this.addLoading = false
                //NProgress.done() 
                this.$message({
                  message: "提交成功",
                  type: "success"
                })
                this.$refs["addForm"].resetFields()
                this.addFormVisible = false
                this.getCityList()
              })
              .catch(err => {
                this.addLoading = false
                this.$message({
                  message: "fail",
                  type: "error"
                })
              })
          })
        }
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    //批量删除
    batchRemove: function () {
      var para = this.sels.map(item => {
        let obj = {}
        obj._id = item._id
        return obj
      })
      console.log(para)
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true
        //NProgress.start() 
        batchRemoveCity(para)
          .then(res => {
            this.listLoading = false
            //NProgress.done() 
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.getCityList()
          })
          .catch(err => {
            this.listLoading = false
            this.$message({
              message: "fail",
              type: "error"
            })
          })
      })
    },
    changePicType(type) {
      this.clickType = type
    },
    handleRemove(file, fileList) {
      console.log(fileList);
      let that = this
      that.editForm[that.clickType] = []
      that.addForm[that.clickType] = []
      fileList.forEach(element => {
        let reader = new FileReader()
        if (element.raw) {
          reader.readAsDataURL(element.raw)
          reader.onload = function () {
            that.addForm[that.clickType].push(this.result)
            that.editForm[that.clickType].push(this.result)
          }
        } else {
          that.addForm[that.clickType].push(element.url)
          that.editForm[that.clickType].push(element.url)
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      console.log('change', fileList);
      let that = this
      const isJPG = file.raw.type === "image/jpeg"
      const isPNG = file.raw.type === "image/png"
      const isLt2M = file.size / 1024 / 1024 < 2
      let picLength = fileList.length

      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!")
      } else {
        let reader = new FileReader()
        if (that.clickType === "cityPic") {
          let reader = new FileReader()
          reader.readAsDataURL(file.raw)
          reader.onload = function () {
            that.addForm[that.clickType] = this.result
            that.editForm[that.clickType] = this.result
          }
        } else if (picLength > 4) {
          this.$message.error("最多上传4张图片")
          fileList.pop()
        } else {
          let reader = new FileReader()
          reader.readAsDataURL(file.raw)
          reader.onload = function () {
            that.addForm[that.clickType] ? '' : that.addForm[that.clickType] = []
            that.addForm[that.clickType].push(this.result)
            that.editForm[that.clickType].push(this.result)
          }
        }
      }
    }
  },
  mounted() {
    this.getCityList()
  }
} 
</script>

<style>
.empty {
  width: 100%;
  color: #8c939d;
  text-align: center;
  font-size: 24px;
}

/*  热门,美食标题组 */
.hotTitleGroup {
  margin-top: 50px;
}
.hotTitleGroup .el-form-item__content {
  display: flex;
  margin-left: 40px !important;
}
.hotTitleGroup .el-form-item__label {
  position: absolute;
  margin: -30px 0 0 65px;
}
</style>
