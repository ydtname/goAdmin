<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
      v-if="total"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="account" label="账号" sortable></el-table-column>
      <el-table-column prop="name" label="姓名" sortable></el-table-column>
      <el-table-column prop="pic" label="头像" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.pic" alt width="50">
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" :formatter="formatSex" sortable></el-table-column>
      <el-table-column prop="age" label="年龄" sortable></el-table-column>
      <el-table-column prop="birth" label="生日" sortable></el-table-column>
      <el-table-column prop="addr" label="地址" min-width="180" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="empty">暂无数据</div>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="10"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="账号" prop="account">
          <el-input v-model="editForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="pic">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.pic" :src="editForm.pic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
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
        <el-form-item label="账号" prop="account">
          <el-input v-model="addForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="pic">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.pic" :src="addForm.pic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
} from "../../api/api";
import { log } from "util";

export default {
  data() {
    return {
      imageUrl: "",
      filters: {
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      delLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        account: "",
        password: "",
        name: "",
        pic: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        account: "",
        password: "",
        name: "",
        pic: "",
        sex: 1,
        age: 0,
        birth: "",
        addr: ""
      },
      user: JSON.parse(sessionStorage.getItem("user"))
    };
  },
  methods: {
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let para
      if (this.filters.name !== '') {
        para = {
          name: this.filters.name
        }
      }else{
        para = null
      }
      let page = this.page;
      this.listLoading = true;
      //NProgress.start();
      getUserListPage(para).then(res => {
        let { code, msg } = res.data;
        if (code !== 200) {
          this.listLoading = false;
          this.$message({
            message: msg,
            type: "error"
          });
        } else {
          this.total = res.data.users.length;
          this.users = res.data.users.filter(
            (u, index) => index < 10 * page && index >= 10 * (page - 1)
          );
          // this.users = res.data.users;
          this.listLoading = false;
          //NProgress.done();
        }
      });
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { _id: row._id };
        console.log(para);
        removeUser(para)
          .then(res => {
            let { code, msg } = res.data;
            if (code !== 200) {
              this.$message({
                message: msg,
                type: "error"
              });
            } else {
              //NProgress.done();
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getUsers();
            }
          })
          .catch(err => {
            this.listLoading = false;
            this.$message({
              message: "fail",
              type: "error"
            });
          });
      });
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      row.sex = parseInt(row.sex);
      this.editForm = Object.assign({}, row);
      this.editForm.id = index + ''
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      this.addForm = {
        id: this.total,
        account: "",
        password: "",
        name: "",
        pic: "",
        sex: 1,
        age: 0,
        birth: "",
        addr: ""
      };
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editUser(para)
              .then(res => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getUsers();
              })
              .catch(err => {
                this.editLoading = false;
                this.$message({
                  message: "fail",
                  type: "error"
                });
              });
          });
        }
      });
    },
    //新增
    addSubmit: function () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addUser(para)
              .then(res => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              })
              .catch(err => {
                this.editLoading = false;
                this.$message({
                  message: "fail",
                  type: "error"
                });
              });
          });
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function () {
      var para = this.sels.map(item => {
        let obj = {};
        obj._id = item._id;
        return obj;
      });
      console.log(para);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        batchRemoveUser(para)
          .then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          })
          .catch(err => {
            this.listLoading = false;
            this.$message({
              message: "fail",
              type: "error"
            });
          });
      });
    },
    //校验图片格式
    beforeAvatarUpload(file) {
      let that = this
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!");
      } else {
        let reader = new FileReader();
        if (/image\/\w+/.test(file.type)) {
          reader.readAsDataURL(file); //将文件转为url
          reader.onload = function (e) {
            that.editForm.pic = e.target.result
            that.addForm.pic = e.target.result
          };
        }
      }
      return false;
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped>
.empty {
  width: 100%;
  color: #8c939d;
  text-align: center;
  font-size: 24px;
}
</style>