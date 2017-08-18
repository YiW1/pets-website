<template>
  <div class="all-admin">
  <!--    <el-col :span="7" :offset="1" class="admin-buttons">
    <el-button @click='addAdminVisible=true'>添加管理员</el-button>
      <el-button @click='editAdminVisible=true'>编辑管理员</el-button>
    <el-button @click='deleteAdmin'>删除管理员</el-button>
    <el-button @click='resetPasswd'>重置密码</el-button>
    <el-button @click='cancelCurrent()'>取消选中</el-button>
    </el-col> -->
    <el-table ref='adminTable' :data="tableData" highlight-current-row @selection-change="handleSelsChange" @current-change="handleCurrentChange" style="width:87%; margin-top:4%; margin-left:6.5%; margin-right:6.5%;">
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" header-align="center" align="center" width="80"></el-table-column>
      <el-table-column prop="userName" label="用户名" header-align="center" align="center" sortable></el-table-column>
      <el-table-column prop="areaCode" label="区域代码" header-align="left" align="left" width="100"></el-table-column>
      <el-table-column prop="orgName" label="机构名称" header-align="center" align="center" sortable></el-table-column>
      <el-table-column label="操作" header-align="center" align="center" width="200">
        <template scope="scope">
          <!--  <el-button size="small" @click="editAdminVisible=true">编辑</el-button>  -->
          <el-button size="small" type="danger" @click="handleResetPasswd(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="20" :offset="2" class="toolbar">
        <el-button @click='addAdminVisible=true' style="float:left;">添加管理员</el-button>
        <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0" style="float:left;">删除管理员</el-button>
			  <el-pagination layout="prev, pager, next" @current-change="handleCurrentPage" :page-size="pageSize" :total="total" style="float:right;">
			  </el-pagination>
		  </el-col>
    </el-row>
    <el-dialog title='添加管理员' v-model='addAdminVisible' @close="closeDialog('addForm')">
      <div id='addAdminDiv'>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form :model="addForm" ref="addForm" label-width="40%" @keyup.enter.native="addAdminSubmit('addForm')">
              <el-form-item label="用户名" prop="user"  
                :rules="[{ required: true, message: '用户名不能为空'}]">
                <el-input v-model="addForm.user" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密  码" prop="passwd"  
                :rules="[{ required: true, message: '密码不能为空'}]">
                <el-input type="password" v-model="addForm.passwd" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="权  限" prop="auth"  
                :rules="[{ required: true, message: '权限不能为空'}]">
                <el-select v-model="addForm.auth" placeholder="请选择管理员权限">
                  <el-option label="管理员" value=-1></el-option>
                  <el-option label="经销商" value=0></el-option>
                  <el-option label="考试办" value=1></el-option>
                  <el-option label="学  校" value=2></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考试单位或学校名称" prop="orgName" 
                :rules="[{ required: true, message: '考试单位或学校名称不能为空'}]">
                <el-input v-model="addForm.orgName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="区域代码" prop="areaCode">
                <el-input v-model="addForm.areaCode" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-row>
            <el-col :span="24" style="margin-bottom: 25px;">
              <el-button type="primary" @click="addAdminSubmit('addForm')">确 定</el-button>
              <el-button @click="cancelAddAdmin('addForm')">取 消</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        addAdminVisible: false,
        editAdminVisible: false,
        page: 1,
        pageSize: 10,
        sels: [],
        currentRow: null,
        addForm: {
          user: '',
          passwd: '',
          auth: '',
          orgName: '',
          areaCode: ''
        },
        allData: [
      /*    {
            "adminId": "817c902559ca49c3a8cec4ee6b93005e",
            "areaCode": "",
            "authority": 2,
            "orgName": "0普通管理员",
            "userName": "admin",
            "userPasswd": "21232F297A57A5A743894A0E4A801FC3"
          },
          {
            "adminId": "b9690259f3684d63953117587d8bf4c3",
            "areaCode": "315000",
            "authority": 3,
            "orgName": "1宁波效实中学",
            "userName": "admin1",
            "userPasswd": "21232F297A57A5A743894A0E4A801FC3"
          },
          {
            "adminId": "817c902559ca49c3a8cec4ee6b93005e",
            "areaCode": "",
            "authority": 1,
            "orgName": "2普通管理员",
            "userName": "admin",
            "userPasswd": "21232F297A57A5A743894A0E4A801FC3"
          },
          {
            "adminId": "b9690259f3684d63953117587d8bf4c3",
            "areaCode": "315000",
            "authority": 2,
            "orgName": "3宁波效实中学",
            "userName": "admin1",
            "userPasswd": "21232F297A57A5A743894A0E4A801FC3"
          },
          {
            "adminId": "817c902559ca49c3a8cec4ee6b93005e",
            "areaCode": "",
            "authority": 1,
            "orgName": "4普通管理员",
            "userName": "admin",
            "userPasswd": "21232F297A57A5A743894A0E4A801FC3"
          }  */
        ]
      }
    },
    computed: {
      total: function() {
        return this.allData.length;
      },
      tableData: function() {
        return this.allData.slice((this.page-1)*this.pageSize, this.page*this.pageSize);
      }
    },
    methods: {
      handleSelsChange(val) {
        this.sels = val;
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      cancelCurrent() {
        this.$refs.adminTable.setCurrentRow(null);
      },
      handleCurrentPage(val) {
				this.page = val;
			},
      closeDialog(formName) {
        this.$refs[formName].resetFields();
      },
      addAdminSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(
              'http://120.26.60.164:7777/pets/root/addAdmin', {
                user: this.addForm.user,
                passwd: this.addForm.passwd,
                auth: this.addForm.auth,
                orgName: this.addForm.orgName,
                areaCode: this.addForm.areaCode,            
              }
            ).then(
              (response) => {
              if(response.data !== null){ 
                var state = response.data.state;
                if (state === 0) {
                  alert('添加成功');
                  this.addAdminVisible = false;
                  this.loadAdmins();
                  this.$refs[formName].resetFields();
                }
                else if (state === 1) {alert('添加失败');}
                else if (state === 2) {
                  alert('未登录或者没有权限');
                  this.$router.push('login');
                }
                else {
                  console.log(state);
                  alert('请求失败');
                }
              }else{
                alert('请求失败');
              }
            }, response => {
              (error)=> alert(error);
              alert('请求失败');
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelAddAdmin(formName) {
        this.addAdminVisible = false;
        this.$refs[formName].resetFields();
      },
      handleResetPasswd(index, row) {
        this.currentRow = row;
        if (confirm("确认重置？") === true) {
          this.$http.post(
            'http://120.26.60.164:7777/pets/root/resetPassword', 
            {user: this.currentRow.userName}
          ).then(
            (response) => {
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                alert('修改成功');
                this.$refs.adminTable.setCurrentRow(null);
              }
              else if (state === 1) {alert('修改失败');}
              else if (state === 2) {
                alert('未登录或者没有权限');
                this.$router.push('login');
              }
              else if (state === 11) {alert('用户不存在');}
              else {
                console.log(state);
                alert('请求失败');
              }
            }else{
              alert('请求失败');
            }
          }, response => {
            (error)=> alert(error);
            alert('请求失败');
          });
        }
      },
      deleteAdmin() {
        if (this.currentRow === null) {
          alert('请选中删除对象');
        } else {
          console.log(this.currentRow);
          if (confirm('确认删除？') === true) {
            this.$http.post(
              'http://120.26.60.164:7777/pets/root/deleteAdmin', 
              {user: this.currentRow.userName}
            ).then(
            (response) => {
              if(response.data !== null){ 
                var state = response.data.state;
                if (state === 0) {
                  alert('删除成功');
                  this.loadAdmins();
                }
                else if (state === 1) {alert('删除失败');}
                else if (state === 2) {
                  alert('未登录或者没有权限');
                  this.$router.push('login');
                }
                else {
                  console.log(state);
                  alert('请求失败');
                }
              }else{
                alert('请求失败');
              }
            }, response => {
              (error)=> alert(error);
              alert('请求失败');
            });
          }
        }
      },
      batchDelete() {
        var adminList = [];
        for(var i=0; i<this.sels.length; i++) {
          adminList.push({
            "adminId": this.sels[i].adminId,
            "areaCode": this.sels[i].areaCode,
            "authority": this.sels[i].authority,
            "orgName": this.sels[i].orgName,
            "userName": this.sels[i].userName,
            "userPasswd": this.sels[i].userPasswd
          });
        }
        if (confirm('确认删除？') === true) {
          this.$http.post(
            'http://120.26.60.164:7777/pets/root/batchDeleteAdmin', 
            adminList,
            {emulateJSON: false}
          ).then(
          (response) => {
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                alert('删除成功');
                this.loadAdmins();
              }
              else if (state === 1) {alert('删除失败');}
              else if (state === 2) {
                alert('未登录或者没有权限');
                this.$router.push('login');
              }
              else {
                console.log(state);
                alert('请求失败');
              }
            }else{
              alert('请求失败');
            }
          }, response => {
            (error)=> alert(error);
            alert('请求失败');
          });
        }
      },
      loadAdmins() {
        this.$http.get('http://120.26.60.164:7777/pets/root/getAdminList').then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {this.allData = response.data.adminList;}
            else if (state === 1) {
              alert('返回失败');
              this.$router.go(-1);
            }
            else if (state === 2) {
              alert('未登录或者没有权限');
              this.$router.push('login');
            }
            else {
              console.log(state);
              alert('请求失败');
              this.$router.go(-1);
            }
          }else{
            alert('请求失败');
            this.$router.go(-1);
          }
        }, response => {
          (error)=> alert(error);
          alert('请求失败');
          //this.$router.go(-1);
        });
      }
    },
    beforeMount() {
      this.loadAdmins();
    }
  }
</script>

<style scoped>
  .all-admin {
    width: 80%;
    margin-top: 64px;
    float: right;
  }
  .admin-buttons {
    margin-top: 3%;
    margin-bottom: 2%;
  }
  .toolbar {
    margin-top: 2%;
  }
</style>
