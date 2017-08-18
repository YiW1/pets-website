<template>
  <div class="login">
    <el-row>
      <el-col :span="20" :offset="4">
        <h3 style="margin-top: 160px;">登&nbsp&nbsp&nbsp&nbsp录</h3>
      </el-col>
    </el-row>
    <el-form ref="form" :model="form">
      <el-row>
        <el-col :span="3">
          <icon name="user" :scale="3" style="float:right; margin-top:4px;"></icon>
        </el-col>
        <el-col :span="20" :offset="1">
          <el-form-item>
            <el-input v-model="form.user" placeholder="账  号"></el-input>
          </el-form-item> 
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <icon name="password" :scale="3" style="float:right; margin-top:4px;"></icon>
        </el-col>
        <el-col :span="20" :offset="1">
          <el-form-item>
            <el-input type="password" v-model="form.passwd" placeholder="密  码" @keyup.enter.native="isLogin"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="20" :offset="4">
          <el-button type="primary" @click="isLogin">登  录</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      label: '<icon name="password" :scale="3"></icon>',
      form: {
        user:'',
        passwd:'',
      },
      error:''
    }
  },
  computed: {
  },
  methods:{
    setSession(userName, adminId, orgName, areaCode, auth) {
      sessionStorage.setItem("userName", userName);
		  sessionStorage.setItem("adminId", adminId);
      sessionStorage.setItem("orgName", orgName);
      sessionStorage.setItem("areaCode", areaCode);
		  sessionStorage.setItem("auth", auth);
    },
    isLogin:function() {
      this.$http.post(
        'http://120.26.60.164:7777/pets/login',
        {
          user: this.form.user,
          passwd: this.form.passwd
        },
      ).then((response) => { 
        if(response.data !== null && response.data.state === 0){ 
          //this.$store.commit({type: 'isLogin', userName: this.form.user, adminId: response.data.adminId, auth: response.data.auth, orgName: response.data.orgName});
          this.setSession(this.form.user, response.data.adminId, response.data.orgName, response.data.areaCode, response.data.auth);
          this.form.user='';
          this.form.passwd= '';
          if(response.data.auth==-1) {
            this.$router.push({ path: 'getadminlist' });
          }
          else {
            this.$router.push({ path: 'getitemlist' });
          }
        }else{
          console.log(response.data)
          alert('登录失败');
          this.form.passwd= '';
        }
      }, response => {
        (error)=> alert(error);
        alert('登录失败');
        this.form.passwd= '';
      });
    }
  }
}
</script>

<style scoped>
  .login {
    margin-left:38%;
    width:22%; 
    height:100%; 
  }
</style>
