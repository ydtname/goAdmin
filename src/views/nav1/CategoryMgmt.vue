  <template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.city" placeholder="城市"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getCategoryList">查询</el-button>
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
      style="width: 100%;"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="country" label="所属国家" sortable></el-table-column>
      <el-table-column prop="city" label="城市" sortable></el-table-column>
      <el-table-column prop="pic" label="图片" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.pic" alt width="50">
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
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属国家" prop="country">
          <el-input v-model="editForm.country" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="editForm.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="pic">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="所属国家" prop="country">
          <el-input v-model="addForm.country" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="addForm.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="pic">
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
  getCategoryList,
  removeCategory,
  batchRemoveCategory,
  editCategory,
  addCategory
} from "../../api/api";

export default {
  data() {
    return {
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
        country: [{ required: true, message: "请输入所属国家", trigger: "blur" }],
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        pic: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        country: "",
        city: "",
        pic: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        country: [{ required: true, message: "请输入所属国家", trigger: "blur" }],
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        pic: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        country: "",
        city: "",
        pic: ""
      },
      user: JSON.parse(sessionStorage.getItem("user"))
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getCategoryList();
    },
    //获取首页列表
    getCategoryList() {
      let para
      if (this.filters.city !== '') {
        para = {
          city: this.filters.city
        }
      } else {
        para = null
      }
      let page = this.page;
      this.listLoading = true;
      //NProgress.start();
      getCategoryList(para).then(res => {
        let { code, msg } = res.data;
        if (code !== 200) {
          this.listLoading = false;
          this.$message({
            message: msg,
            type: "error"
          });
        } else {
          this.total = res.data.list.length;
          this.list = res.data.list.filter(
            (u, index) => index < 10 * page && index >= 10 * (page - 1)
          );
          // this.list = res.data.list;
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
        removeCategory(para)
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
              this.getCategoryList();
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
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      this.addForm = {
        country: "",
        city: "",
        pic: ""
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
            editCategory(para)
              .then(res => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getCategoryList();
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
            addCategory(para)
              .then(res => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getCategoryList();
              })
              .catch(err => {
                this.addLoading = false;
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
        batchRemoveCategory(para)
          .then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getCategoryList();
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
      let that = this;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(isLt2M);

      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!");
      } else {
        let reader = new FileReader();
        if (/image\/\w+/.test(file.type)) {
          reader.readAsDataURL(file); //将文件转为url
          reader.onload = function (e) {
            that.editForm.pic = e.target.result;
            that.addForm.pic = e.target.result;
          };
        }
      }
      return false;
    }
  },
  mounted() {
    this.getCategoryList();
  }
};
</script>

<style>
.empty {
  width: 100%;
  color: #8c939d;
  text-align: center;
  font-size: 24px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
</style>