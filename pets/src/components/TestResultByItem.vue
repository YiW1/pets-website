<template>
  <div class="test-result-by-item">
    <el-form :model="itemForm" ref="itemForm" label-position="right" label-width="80px" @keyup.enter.native="getItemResult('itemForm')">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="schoolName" label="学  校">
            <el-select v-model="itemForm.schoolName" @change="loadClasses" placeholder="请选择学校">
              <el-option v-for="aschool in schoolList" :key="aschool" :value="aschool"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item prop="className" label="班  级">
            <el-select v-model="itemForm.className" placeholder="请选择班级">
              <el-option v-for="aclass in classList" :key="aclass" :value="aclass"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="startTime" label="起始日期">
            <el-date-picker v-model="itemForm.startTime" type="date" placeholder="选择起始日期" :picker-options="startOptions"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item prop="endTime" label="截止日期">
            <el-date-picker v-model="itemForm.endTime" type="date" placeholder="选择截止日期" :picker-options="endOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="item" label="考试项目" 
            :rules="[{ required: true, message: '考试项目不能为空'}]">
            <el-select v-model="itemForm.item" @change="handleTestType" placeholder="请选择考试项目">
              <el-option v-for="item in allTests" :key="item.testId" :label="item.item.itemName" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item prop="gender" label="性  别" 
            :rules="[{ required: true, message: '性别不能为空'}]">
            <el-radio-group v-model="itemForm.gender">
              <el-radio :label="1" :disabled="radioDisabled1">男  生</el-radio>
              <el-radio :label="2" :disabled="radioDisabled2">女  生</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="2">
          <el-button type="primary" @click="getItemResult('itemForm')">查  询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="show-result" v-if="showResult" style="margin-top: 1.5%">
      <hr style="width: 90%;">
      <el-row style="margin-top: 2%">
        <el-col :span="20" :offset="2">
          <el-table :data="tableData" border>
            <el-table-column prop="schoolName" label="学  校" width="240" header-align="center"></el-table-column>
            <el-table-column prop="className" label="班  级" width="120" header-align="center"></el-table-column>
            <el-table-column prop="testerNo" label="考  号" width="100" header-align="center"></el-table-column>
            <el-table-column prop="studentName" label="姓  名" width="100" header-align="center"></el-table-column>
            <el-table-column prop="stuGender" label="性  别" width="80" header-align="center"></el-table-column>
            <el-table-column prop="itemName" label="项  目" width="120" header-align="center"></el-table-column>
            <el-table-column prop="result" label="考试结果" width="100" header-align="center"></el-table-column>
            <el-table-column prop="point" label="成  绩" width="80" header-align="center"></el-table-column>
            <el-table-column prop="testTime" label="测试时间" width="180" header-align="center"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="needExplain">
        <el-col :span="20" :offset="2">
          <h5 style="color:gray; float:left; margin-top:0;"><sup>*</sup>成绩-1意为该项目缺少评分标准。</h5>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentPage" :page-size="pageSize" :total="total">
			    </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        page: 1,
        pageSize: 10,
        showResult: false,
        needExplain: false,
        radioDisabled1: true,
        radioDisabled2: true,
        schoolList: [],
        classList: [],
        allTests: [],
        itemForm: {
          schoolName: '',         //学校名称（不是必需）
          className: '',          //班级名称（不是必需）
          gender: '',             //性别（必需，1为男生，2为女生）
          item: '',               //项目名称（必需）
          startTime: '',          //起始时间（不是必需，格式yyyy-MM-dd）
          endTime: '',            //截止时间（不是必需，格式yyyy-MM-dd）
        },
        testData: [
      /*    {
            studentName: "郭又绮",
            gender: 1,
            stuGender: "男",
            testerNo: 1000006,
            schoolName: "常州市武进区湖塘镇实验小学",
            className: "2012级01班",
            studentNo: 10006,
            itemName: "立定跳远",
            result: 1.68,
            point: 80,
            testTime: "2017-07-24 11:21:23"
          }  */
        ],
        startOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        endOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
      }
    },
    computed: {
      total: function() {
        return this.testData.length;
      },
      tableData: function() {
        return this.testData.slice((this.page-1)*this.pageSize, this.page*this.pageSize);
      }
    },
    methods: {
      handleCurrentPage(val) {
				this.page = val;
			},
      checkPoint() {
        this.needExplain = false;
        for(var i=0; i<this.testData.length; i++) {
          if (this.testData[i].point === -1) {
            this.needExplain = true;
            return;
          }
        }
      },
      stuGender() {
        for(var i=0; i<this.testData.length; i++) {
          if (this.testData[i].gender === 1) {this.testData[i].stuGender = "男";}
          else {this.testData[i].stuGender = "女";}
        }
      },
      handleTestType() {
        switch(this.itemForm.item.type) {
          case 0:
            this.radioDisabled1 = true;
            this.radioDisabled2 = true;
            break;
          case 1:
            this.radioDisabled1 = false;
            this.radioDisabled2 = true;
            this.itemForm.gender = 1;
            break;
          case 2:
            this.radioDisabled1 = true;
            this.radioDisabled2 = false;
            this.itemForm.gender = 2;
            break;
          case 3:
            this.radioDisabled1 = false;
            this.radioDisabled2 = false;
            break;
          default:
            this.radioDisabled1 = true;
            this.radioDisabled2 = true;
        }
      },
      dateFormatter(time) {
        var month = time.getMonth()+1;
        var date = time.getDate();
        return time.getFullYear()+'-'+(month<10?"0"+month:month)+'-'+(date<10?"0"+date:date);
      },
      getItemResult(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var request = {
              itemName: this.itemForm.item.item.itemName,
              gender: this.itemForm.gender
            };
            if (this.itemForm.startTime !== '') {
              if(this.itemForm.startTime > this.itemForm.endTime) {
                alert('截止时间不可早于起始时间');
                return;
              }
              request.startTime = this.dateFormatter(this.itemForm.startTime);
            }
            if (this.itemForm.endTime !== '') {
              request.endTime = this.dateFormatter(this.itemForm.endTime);
            }
            if (this.itemForm.schoolName !== '') {
              request.schoolName = this.itemForm.schoolName;
              if (this.itemForm.className !== '') {
                request.className = this.itemForm.className;
              }
            }
            this.$http.post(
              'http://120.26.60.164:7777/pets/admin/getTestResultByItem', request
            ).then(
              (response) => {
              if(response.data !== null){ 
                var state = response.data.state;
                if (state === 0) {
                  if (response.data.message === "查询成功") {
                    this.studentInfo = response.data.studentInfo;
                    this.testData = response.data.testResultList;
                    this.stuGender();
                    this.checkPoint();
                    this.showResult = true;
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
            console.log('error submit!!');
            return false;
          }
        });
      },
      loadTests() {
        this.$http.post('http://120.26.60.164:7777/pets/admin/getTestItemList').then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.allTests = response.data.testItemList;
            }
            else if (state === 1) {
              alert('存在错误');
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
      loadClasses() {
        this.$http.post(
          'http://120.26.60.164:7777/pets/admin/getClassList',
          {schoolName: this.itemForm.schoolName}
        ).then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.classList = response.data.classList;
              this.loadSchools();
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
      }
    },
    beforeMount() {
      this.loadTests();
    }
  }
</script>

<style>
  .test-result-by-item {
    width: 80%;
    margin-top: 96px;
    float: right;
  }
</style>
