<template>
  <div class="side-menu">
    <el-col style="width:100%; height:100%; ">
      <el-menu default-active="2" class="el-menu-vertical-demo" router @open="handleOpen" @close="handleClose" style="width:100%; height:calc(100% - 64px); margin-top:64px;">
        <el-menu-item index="/getadminlist" v-if="auth==='-1'">管理员列表</el-menu-item>
        <el-menu-item index="/getitemlist">项目列表</el-menu-item>
        <!--  <el-menu-item index="/gettestlist" v-if="auth!=='-1'">考试列表</el-menu-item>  -->
        <el-menu-item index="/getevaluation" v-if="auth!=='-1'">评分标准</el-menu-item>
        <el-menu-item index="/getstudentlist" v-if="auth!=='-1'">学生信息</el-menu-item>
        <el-submenu index="/gradeByItem" v-if="auth!=='-1'">
          <template slot="title">成绩查询</template>
            <el-menu-item index="/gettestresultbyitem">按项目查询</el-menu-item>
            <el-menu-item index="/getindvtestresult">按考生查询</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
  </div>
</template>

<script>
  export default {
    computed: {
      auth() {
        return sessionStorage.getItem('auth');
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    },
  };
  
</script>

<style scoped>
  .side-menu {
    height: 100%; 
    width: 20%;
    float: left;
    /* background-color: #eef1f6; */
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

</style>