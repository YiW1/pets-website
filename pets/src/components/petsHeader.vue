<template>
  <div class="pets-header">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" theme="dark">
      <div class="left" style="float: left; margin-left:3%;">
        <h3 style="color: #bfcbd9; font-weight: normal;">体育考试测评系统</h3>
      </div>
      <div class="right" style="float: right; margin-right: 1.5%;">
        <div v-if="this.user.userName.length !== 0">
          <el-submenu index="4">
            <template slot="title">{{user.userName}}</template>
            <el-menu-item index="4-1" @click='editInfoVisible=true'>编辑信息</el-menu-item>
            <el-menu-item index="4-2" @click='editPswVisible=true'>修改密码</el-menu-item>
            <el-menu-item index="4-3" @click='logout'>注  销</el-menu-item>
          </el-submenu>
        </div>
        <!-- <div v-else>
          <el-menu-item index="5" @click='login'>登  录</el-menu-item>
        </div> -->
      </div>
      <el-dialog title='修改密码' v-model='editPswVisible' @close="closeDialog('form')" @keyup.enter.native="submitEditPswForm('form')">
        <div id='editPswDiv'>
          <el-row>
            <el-col :span="15" :offset="3">
              <el-form :model="form" ref="form" label-width="35%">
                <el-form-item label="旧密码" prop="passwd"  
                  :rules="[{ required: true, message: '旧密码不能为空'}]">
                  <el-input type="password" v-model="form.passwd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newpasswd"  
                  :rules="[{ required: true, message: '新密码不能为空'}]">
                  <el-input type="password" v-model="form.newpasswd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmpwd"  
                  :rules="[{ required: true, message: '确认密码不能为空'}]">
                  <el-input type="password" v-model="form.confirmpwd" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-row>
              <el-col :span="24" style="margin-bottom: 25px;">
                <el-button type="primary" @click="submitEditPswForm('form')">确 定</el-button>
                <el-button @click="cancelEdit('form')">取 消</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-dialog>
      <el-dialog title='编辑信息' v-model='editInfoVisible' @close="closeDialog('infoForm')" @keyup.enter.native="submitEditInfoForm('infoForm')">
        <div id='editPswDiv'>
          <el-row>
            <el-col :span="15" :offset="3">
              <el-form :model="infoForm" ref="infoForm" label-width="45%">
                <el-form-item label="考试单位或者学校名称" prop="orgName">
                  <el-input v-model="infoForm.orgName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="区域代码" prop="areaCode">
                  <el-input v-model="infoForm.areaCode" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-row>
              <el-col :span="24" style="margin-bottom: 25px;">
                <el-button type="primary" @click="submitEditInfoForm('infoForm')">确 定</el-button>
                <el-button @click="cancelEdit('infoForm')">取 消</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'header',
  data() {
    return {
      user: {
        userName: '',
        adminId: '',
        orgName: '',
        auth: ''
      },
      activeIndex: '1',
      editPswVisible: false,
      editInfoVisible: false,
      form: {
        passwd: '',
        newpasswd: '',
        confirmpwd: ''
      },
      infoForm: {
        orgName: '',
        areaCode: '', 
      }

    };
  },
  computed: {
    isLogin() {
      return (this.user.userName.length !== 0);
    },
  },
  methods: {
    setUser() {
      if (sessionStorage.getItem("userName")===null) {
        this.user = {
          userName: '',
          adminId: '',
          orgName: '',
          areaCode: '',
          auth: '',
        }
      }
      else {
        this.user = {
          userName: sessionStorage.getItem("userName"),
          adminId: sessionStorage.getItem("adminId"),
          orgName: sessionStorage.getItem("orgName"),
          areaCode: sessionStorage.getItem("areaCode"),
          auth: sessionStorage.getItem("auth"),
        }
      }
      
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    login() {
      this.$router.push({ path: 'login' });
    },
    logout() {
      //this.$store.commit({type: 'isLogout'});
      this.$http.post('http://120.26.60.164:7777/pets/logout').then(
        (response) => {}, (response) => {}
      );
      this.setSession('', '', '', '', '');
      this.setUser();
      this.$router.push({ path: 'login' })
    },
    setSession(userName, adminId, orgName, areaCode, auth) {
      sessionStorage.setItem("userName", userName);
		  sessionStorage.setItem("adminId", adminId);
      sessionStorage.setItem("orgName", orgName);
      sessionStorage.setItem("areaCode", areaCode);
		  sessionStorage.setItem("auth", auth);
    },
    submitEditPswForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(
            'http://120.26.60.164:7777/pets/admin/updatePassword', 
            {passwd: this.form.passwd,
            newPasswd: this.form.newpasswd}
          ).then(
          (response) => {
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                alert('修改成功');
                this.$refs[formName].resetFields();
                this.editPswVisible = false;
              }
              else if (state === 1) {alert('修改失败');}
              else if (state === 2) {
                alert('未登录或者没有权限');
                this.$router.push('login');
              }
              else if (state === 11) {alert('用户不存在');}
              else if (state === 12) {alert('旧密码与账号不匹配');}
              else if (state === 13) {alert('新密码不能为空');}
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
    submitEditInfoForm(formName) {
      var request = {};
      if(this.infoForm.orgName === this.user.orgName && this.infoForm.areaCode === this.user.areaCode) {
        alert('请修改后再提交');
      }
      else {
        if(this.infoForm.orgName !== this.user.orgName) {
          request.orgName = this.infoForm.orgName;
        }
        if(this.infoForm.areaCode !== this.user.areaCode) {
          request.areaCode = this.infoForm.areaCode;
        }
        this.$http.post(
          'http://120.26.60.164:7777/pets/admin/updateAdminInfo', 
          request
        ).then(
        (response) => {
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              alert('修改成功');
              sessionStorage.setItem("orgName", this.infoForm.orgName);
              sessionStorage.setItem("areaCode", this.infoForm.areaCode);
              this.editInfoVisible = false;
              this.setInfo();
            }
            else if (state === 1) {alert('修改失败');}
            else if (state === 2) {
              alert('未登录');
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
    setEditForm() {
      this.infoForm.orgName = sessionStorage.getItem("orgName");
      this.infoForm.areaCode = sessionStorage.getItem("areaCode");
    },
    setInfo() {
      this.setUser();
      this.setEditForm();
    },
    cancelEdit(formName) {
      this.setEditForm();
      this.editPswVisible = false;
      this.editInfoVisible = false;
    },
    closeDialog(formName) {
      this.setEditForm();
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      console.log(vm.user);
      vm.setInfo();
    })
  },
  beforeRouteUpdate (to, from, next) {
    console.log("updating...");
    next()
  },
  beforeRouteLeave (to, from, next) {
    // this.setEditForm();
    next()
  },
}
</script>

<style scoped>
  .pets-header {
    width: 100%;
    height: 64.44px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10001;
  }
</style>
