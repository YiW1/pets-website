<template>
  <div class="student-list">
    <el-collapse v-model="activeNames" style="text-align: left;">
      <el-collapse-item title="导入学生信息" name="1">
    <div class="upload-student" style="margin: 2.5% 0 2% 0;">
      <!-- <el-row>
        <el-col :span="20" :offset="2"><h4 style="float: left;">导入学生信息</h4></el-col>
      </el-row> -->
      <el-form :model="uploadForm" ref="uploadForm">
        <el-row>
          <el-col :span="4" :offset="1">
              <input type="file" id="file" @change="onFileChange">
          </el-col>
        </el-row>
        <el-row style="margin-top:2%">
          <el-col :span="2" :offset="1">
            <el-button size="small" type="primary" @click="handleFiles">点击上传</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
      </el-collapse-item>

      <el-collapse-item title="学生信息列表" name="2">
        <div class="view-student" style="margin-top:2.5%">
          <!-- <hr style="width: 90%;">
          <el-row>
            <el-col :span="20" :offset="2"><h4 style="float: left;">学生信息列表</h4></el-col>
          </el-row> -->
          <el-row>
            <el-form :model="selectForm" ref="selectForm">
              <el-col :span="7" :offset="1">
                <el-form-item prop="schoolName" label="学  校">
                  <el-select v-model="selectForm.schoolName" @change="onSchoolChange" placeholder="请选择学校">
                    <el-option v-for="aschool in schoolList" :key="aschool" :value="aschool"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="2">
                <el-form-item prop="className" label="班  级">
                  <el-select v-model="selectForm.className" @change="onChangeHandleViewStu" placeholder="请选择班级">
                    <el-option v-for="aclass in classList" :key="aclass" :value="aclass"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :offset="2">
                <el-form-item>
                  <el-radio-group v-model="selectForm.gender" @change="onChangeHandleViewStu()">
                    <el-radio :label="1">男  生</el-radio>
                    <el-radio :label="2">女  生</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div class="show-eval">
            <el-row style="margin-top: 1%;">
              <el-col :span="22" :offset="1">
                <el-table :data="stuTableData" @selection-change="handleSelsChange" border>
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column prop="testerNo" label="考  号" width="115" header-align="center" sortable></el-table-column>
                  <el-table-column prop="studentName" label="姓  名" width="100" header-align="center"></el-table-column>
                  <el-table-column prop="stuGender" label="性  别" header-align="center"></el-table-column>
                  <el-table-column prop="schoolName" label="学  校" width="235" header-align="center"></el-table-column>
                  <el-table-column prop="className" label="班  级" width="120" header-align="center"></el-table-column>
                  <el-table-column prop="studentNo" label="学  号" width="100" header-align="center"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row style="margin-top: 2%; margin-bottom: 2%;">
              <el-col :span="22" :offset="1">
                <el-button :disabled="sels.length===0" type="danger" @click="batchDeleteStu" style="float: left">删除学生</el-button>
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentPage" :page-size="pageSize" :total="total" style="float: right">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeNames: ['1', '2'],
        page: 1,
        pageSize: 10,
        studentList: [
      /*    {
            "studentId": "b05883f2f3db4fe98b3f75f44f7f70c1",
            "studentName": "赵彦翔",
            "gender": 1,
            // "stuGender": "男",
            "testerNo": 1000016,
            "schoolName": "常州市武进区湖塘镇实验小学",
            "className": "2012级01班",
            "studentNo": 10016,
            "adminId": "1723dbcd79ea495d98834ffa3e7e6617"
          },
          {
            "studentId": "68c2c1ed3d1f4658abcf9724396937d3",
            "studentName": "于坤",
            "gender": 1,
            // "stuGender": "男",
            "testerNo": 1000017,
            "schoolName": "常州市武进区湖塘镇实验小学",
            "className": "2012级02班",
            "studentNo": 10017,
            "adminId": "1723dbcd79ea495d98834ffa3e7e6617"
          }  */
        ],
        sels: [],
        schoolList: [],
        classList: [],
        uploadForm: {
          file: ''
        },
        selectForm: {
          schoolName: '',
          className: '',
          gender: '',
        }
      };
    },
    computed: {
      total: function() {
        return this.studentList.length;
      },
      stuTableData: function() {
        return this.studentList.slice((this.page-1)*this.pageSize, this.page*this.pageSize);
      }
    },
    methods: {
      handleCurrentPage(val) {
				this.page = val;
			},
      handleSelsChange(val) {
        this.sels = val;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      onFileChange(e){
        this.uploadForm.file = e.target.files[0];
      },
      handleFiles() { 
        if (document.getElementById('file').files.length !== 0 && this.uploadForm.file !== '') {
          var f = this.uploadForm.file;
          var fd = new FormData();
          fd.append('studentInfo', f, f.name);
          this.$http.post(
            'http://120.26.60.164:7777/pets/admin/loadStudents', fd,{
              'headers': {
                'Content-Type': 'multipart/form-data'
              }
            }
          ).then(
          (response) => {
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                if (response.data.message === "添加成功") {
                  alert('上传成功');
                  this.onChangeHandleViewStu();
                }
                else {alert(response.data.message);}
              }
              else if (state === 1) {alert(response.data.message);}
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
        } else {
          alert("请选择上传文件");
        }
      },
      onSchoolChange() {
        this.loadClasses();
        this.onChangeHandleViewStu();
      },
      loadClasses() {
        this.$http.post(
          'http://120.26.60.164:7777/pets/admin/getClassList',
          {schoolName: this.selectForm.schoolName}
        ).then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.classList = response.data.classList;
            }
            else if (state === 1) {
              alert('获取失败');
            }
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
      },
      loadSchools() {
        this.$http.get('http://120.26.60.164:7777/pets/admin/getSchoolList').then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.schoolList = response.data.schoolList;
            }
            else if (state === 1) {
              alert('获取失败');
              this.$router.go(-1);
            }
            else if (state === 2) {
              alert('未登录');
              this.$router.push('login');
            }
            else {
              console.log(state);
              alert('请求失败');
              this.$router.go(-1);
            }
          }else{
            alert('请求失败');
            //this.$router.go(-1);
          }
        }, response => {
          (error)=> alert(error);
          alert('请求失败');
          //this.$router.go(-1);
        });
      },
      stuGender() {
        for(var i=0; i<this.studentList.length; i++) {
          if (this.studentList[i].gender === 1) {this.studentList[i].stuGender = "男";}
          else {this.studentList[i].stuGender = "女";}
        }
      },
      loadStudents() {
        this.$http.post('http://120.26.60.164:7777/pets/admin/getStudentList/').then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.studentList = response.data.studentList;
              this.stuGender();
              this.loadSchools();
            }
            else if (state === 1) {
              alert('返回失败');
            }
            else if (state === 2) {
              alert('未登录');
              this.$router.push('login');
            }
            else {
              console.log(state);
              alert('请求失败');
              this.$router.go(-1);
            }
          }else{
            alert('请求失败');
            // this.$router.go(-1);
          }
        }, response => {
          (error)=> alert(error);
          alert('请求失败');
          // this.$router.go(-1);
        });
      },
      onChangeHandleViewStu() {
        var request = {};
        if(this.selectForm.schoolName !== '') {
          request.schoolName = this.selectForm.schoolName;
        }
        if(this.selectForm.className !== '') {
          request.className = this.selectForm.className;
        }
        if(this.selectForm.gender !== '') {
          request.gender = this.selectForm.gender;
        }
        this.$http.post('http://120.26.60.164:7777/pets/admin/getStudentList/', request).then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.studentList = response.data.studentList;
              this.stuGender();
            }
            else if (state === 1) {
              alert('返回失败');
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
      },
      batchDeleteStu() {
        var stuList = [];
        for(var i=0; i<this.sels.length; i++) {
          stuList.push({
            "studentId": this.sels[i].studentId,
            "studentName": this.sels[i].studentName,
            "gender": this.sels[i].gender,
            "testerNo": this.sels[i].testerNo,
            "schoolName": this.sels[i].schoolName,
            "className": this.sels[i].className,
            "studentNo": this.sels[i].studentNo,
            "adminId": this.sels[i].adminId
          });
        }
        if (confirm('删除学生的同时会删除该学生的所有考试成绩。确认删除？') === true) {
          this.$http.post(
            'http://120.26.60.164:7777/pets/admin/deleteStudents', 
            stuList,
            {emulateJSON: false}
          ).then(
          (response) => {
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                alert('删除成功');
                if(this.selectForm.schoolName !== '' || this.selectForm.className !== '' || this.selectForm.gender !== '') {
                  this.onChangeHandleViewStu();
                } else {this.loadStudents();}
              }
              else if (state === 1) {alert('删除失败');}
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
    },
    beforeMount() {
      this.loadStudents();
    }
  }
</script>

<style>
  .student-list {
    width: 72%;
    margin: 90px 4% 25px 4%;
    float: right;
  }
</style>
