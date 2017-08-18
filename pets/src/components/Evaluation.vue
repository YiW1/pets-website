<template>
  <div class="evaluation">
    <el-collapse v-model="activeNames" style="text-align: left;">
      <el-collapse-item title="上传评分标准" name="1">
        <div class="upload-eval" style="margin: 2.5% 0 2% 0;">
          <!-- <el-row>
            <el-col :span="20" :offset="2"><h4 style="float: left;">上传评分标准</h4></el-col>
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
    
      <el-collapse-item title="查看评分标准" name="2">
        <div class="view-eval" style="margin-top:2.5%">
          <!-- <hr style="width: 90%;">
          <el-row>
            <el-col :span="20" :offset="2"><h4 style="float: left;">查看评分标准</h4></el-col>
          </el-row> -->
          <el-row>
            <el-form :model="selectForm" ref="selectForm">
              <el-col :span="6" :offset="1">
                <el-form-item>
                  <el-select v-model="selectForm.item" @change="onChangeHandleViewEval" placeholder="请选择考试项目">
                    <el-option v-for="item in allTests" :key="item.testId" :label="item.item.itemName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item>
                  <el-radio-group v-model="selectForm.type" @change="onChangeHandleViewEval()">
                    <el-radio :label="1" :disabled="radioDisabled1">男  生</el-radio>
                    <el-radio :label="2" :disabled="radioDisabled2">女  生</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div class="show-eval" v-if="showEvals">
            <el-row style="margin-top: 1%;">
              <el-col :span="20" :offset="2">
                <el-table :data="evalTableData" border>
                  <!--  <el-table-column prop="type" label="性别"></el-table-column>  -->
                  <el-table-column prop="point" label="成绩"></el-table-column>
                  <el-table-column prop="lowerBound" label="大于或等于"></el-table-column>
                  <el-table-column prop="upperBound" label="小于"></el-table-column>
                  <el-table-column prop="unit" label="单位"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row style="margin-top: 2%; margin-bottom: 2%;">
              <el-col :span="20" :offset="2">
                <el-button v-if="evalTableData.length!==0" type="danger" @click="deleteEval">删除评分标准</el-button>
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
        showEvals: false,
        radioDisabled1: true,
        radioDisabled2: true,
        allTests: [],
        evalTableData: [
      /*    {
            "evalId": "70f81b18ea33473f94e691f98b0f2138",
            "testId": "7bcdb8fc9bcf4ab99f3616c7e1c7053c",
            "type": 2,
            "lowerBound": 1.35,
            "upperBound": 1.45,
            "unit": "米",
            "point": 50
          },
          {
            "evalId": "e5b8f283dc8f4c01bd71afd607e52bc0",
            "testId": "7bcdb8fc9bcf4ab99f3616c7e1c7053c",
            "type": 2,
            "lowerBound": 1.45,
            "upperBound": 1.55,
            "unit": "米",
            "point": 60
          },
          {
            "evalId": "f317e3c8c2024648b99a48625e59b2e4",
            "testId": "7bcdb8fc9bcf4ab99f3616c7e1c7053c",
            "type": 2,
            "lowerBound": 1.55,
            "upperBound": 1.65,
            "unit": "米",
            "point": 70
          },
          {
            "evalId": "813cfd072e034ab68006b4582531ef77",
            "testId": "7bcdb8fc9bcf4ab99f3616c7e1c7053c",
            "type": 2,
            "lowerBound": 1.65,
            "upperBound": 1.75,
            "unit": "米",
            "point": 80
          },
          {
            "evalId": "b0a2764de8904ecf9eea2403134598f8",
            "testId": "7bcdb8fc9bcf4ab99f3616c7e1c7053c",
            "type": 2,
            "lowerBound": 1.75,
            "upperBound": 1.85,
            "unit": "米",
            "point": 90
          }  */
        ],
        uploadForm: {
          file: ''
        },
        selectForm: {
          item: '',
          type: '',
        }
      };
    },
    methods: {
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
          fd.append('filename', f, f.name);
          this.$http.post(
            'http://120.26.60.164:7777/pets/admin/loadEvaluation', fd,{
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
                  this.onChangeHandleViewEval();
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
      handleTestType() {
        switch(this.selectForm.item.type) {
          case 0:
            this.radioDisabled1 = true;
            this.radioDisabled2 = true;
            break;
          case 1:
            this.radioDisabled1 = false;
            this.radioDisabled2 = true;
            this.selectForm.type = 1;
            break;
          case 2:
            this.radioDisabled1 = true;
            this.radioDisabled2 = false;
            this.selectForm.type = 2;
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
      handleUnit(unit) {
        for(var i=0; i<this.evalTableData.length; i++) {
          this.evalTableData[i].unit = unit;
        }
      },
      onChangeHandleViewEval() {
        if(this.selectForm.item !== '') {
          this.handleTestType();
        }
        if(this.selectForm.item!=='' && this.selectForm.type!=='') {
          this.$http.get('http://120.26.60.164:7777/pets/admin/getEvaluationList/'+this.selectForm.item.testId+'/type/'+this.selectForm.type).then(
            (response) => { 
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                this.evalTableData = response.data.evalList;
                this.handleUnit(response.data.unit);
                this.showEvals = true;
              }
              else if (state === 1) {
                alert('返回失败');
              }
              else if (state === 11) {
                alert('没有该考试项目');
              }
              else if (state === 12) {
                alert('尚未添加该考试项目');
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
      deleteEval() {
        this.$http.post(
          'http://120.26.60.164:7777/pets/admin/clearEvaluation',
          {itemName: this.selectForm.item.item.itemName,
          type: this.selectForm.type
        }).then(
          (response) => {
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.evalTableData = [];
              alert('删除成功');
            }
            else if (state === 1) {
              alert('删除失败');
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
      }
    },
    beforeMount() {
      this.loadTests();
    }
  }
</script>

<style>
  .evaluation {
    width: 72%;
    margin: 90px 4% 25px 4%;
    float: right;
  }
</style>
