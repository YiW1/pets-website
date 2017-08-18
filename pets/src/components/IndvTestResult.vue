<template>
  <div class="indv-test-result">
    <el-form :model="indvForm" ref="indvForm" label-position="right" label-width="80px" @keyup.enter.native="getIndvResult('indvForm')">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="testerNo" label="学生考号" 
            :rules="[{ required: true, message: '学生考号不能为空'}]">
            <el-input v-model="indvForm.testerNo" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-button type="primary" @click="getIndvResult('indvForm')">查  询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item prop="startTime" label="起始日期">
            <el-date-picker v-model="indvForm.startTime" type="date" placeholder="选择起始日期" :picker-options="startOptions"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="endTime" label="截止日期">
            <el-date-picker v-model="indvForm.endTime" type="date" placeholder="选择截止日期" :picker-options="endOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="show-indv-results" v-if="studentInfo !== ''" style="margin-top: 1.5%">
      <hr style="width: 90%;">
      <el-row style="margin-top: 1.5%">
        <el-col :span="6" :offset="2">
          <p><strong>姓名：</strong>{{studentInfo.studentName}}</p>
        </el-col>
        <el-col :span="6">
          <p><strong>性别：</strong>{{stuGender}}</p>
        </el-col>
        <el-col :span="6">
          <p><strong>考号：</strong>{{studentInfo.testerNo}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <p><strong>学校：</strong>{{studentInfo.schoolName}}</p>
        </el-col>
        <el-col :span="10">
          <p><strong>班级：</strong>{{studentInfo.className}}</p>
        </el-col>
      </el-row>
      <el-row style="margin-top: 2%">
        <el-col :span="20" :offset="2">
          <el-table :data="tableData">
            <el-table-column prop="itemName" header-align="center" label="项  目"></el-table-column>
            <el-table-column prop="result" header-align="center" label="考试结果"></el-table-column>
            <el-table-column prop="point" header-align="center" label="成  绩"></el-table-column>
            <el-table-column prop="testTime" header-align="center" label="测试时间"></el-table-column>
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
        needExplain: false,
        indvForm: {
          testerNo: '',
          startTime: '',
          endTime: ''
        },
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
        studentInfo: 
      /*  {
          "studentId": "5d59fea8f24d4501880e76f779060fcb",
          "studentName": "郭又绮",
          "gender": 1,
          "testerNo": 1000006,
          "schoolName": "常州市武进区湖塘镇实验小学",
          "className": "2012级01班",
          "studentNo": 10006,
          "adminId": "1723dbcd79ea495d98834ffa3e7e6617"
        }  */
        '',
        testData: [
      /*    {
            "itemName": "立定跳远",
            "result": 1.68,
            "point": 80,
            "testTime": "2017-07-24 11:21:23"
          },
          {
            "itemName": "立定跳远",
            "result": 1.75,
            "point": 90,
            "testTime": "2017-07-24 11:25:23"
          }  */
        ],
      }
    },
    computed: {
      total: function() {
        return this.testData.length;
      },
      tableData: function() {
        return this.testData.slice((this.page-1)*this.pageSize, this.page*this.pageSize);
      },
      stuGender: function() {
        if (this.studentInfo !== '') {
          if (this.studentInfo.gender === 1) {return "男";}
          else {return "女";}
        }
        else {return '';}
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
      dateFormatter(time) {
        var month = time.getMonth()+1;
        var date = time.getDate();
        return time.getFullYear()+'-'+(month<10?"0"+month:month)+'-'+(date<10?"0"+date:date);
      },
      getIndvResult(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var request = {testerNo: this.indvForm.testerNo};
            if (this.indvForm.startTime !== '') {
              if(this.indvForm.startTime > this.indvForm.endTime) {
                alert('截止时间不可早于起始时间');
                return;
              }
              request.startTime = this.dateFormatter(this.indvForm.startTime);
            }
            if (this.indvForm.endTime !== '') {
              request.endTime = this.dateFormatter(this.indvForm.endTime);
            }
            this.$http.post(
              'http://120.26.60.164:7777/pets/admin/getIndvTestResult', request
            ).then(
              (response) => {
              if(response.data !== null){ 
                var state = response.data.state;
                if (state === 0) {
                  if (response.data.message === "查询成功") {
                    this.studentInfo = response.data.studentInfo;
                    this.testData = response.data.testResultList;
                    this.checkPoint();
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
      }
    }
  }
</script>

<style>
  .indv-test-result {
    width: 80%;
    margin-top: 96px;
    float: right;
  }
  p {
    float: left;
    margin-bottom: 0;
  }
</style>
