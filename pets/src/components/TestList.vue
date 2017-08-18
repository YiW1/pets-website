<template>
  <div class="test-list">
    <el-table ref='testTable' :data="allTestData" @selection-change="handleSelsChange" highlight-current-row style="width:80%; margin-top:3%; margin-left:10%; margin-right:10%;">
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" header-align="center" align="center" width="80"></el-table-column>
      <el-table-column prop="item.itemName" label="项目名称" header-align="center" align="center" sortable></el-table-column>
      <el-table-column prop="typeName" label="考试类型" header-align="center" align="center" sortable></el-table-column>
      <el-table-column label="操作" header-align="center" align="center" width="120">
        <template scope="scope">
          <el-button size="small" @click="handleEditTest(scope.$index, scope.row)">编辑</el-button>
          <!--  <el-button size="small" type="danger" @click="handleDeleteTest(scope.$index, scope.row)">删除</el-button>  -->
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 2%">
      <el-col :span="18" :offset="3">
        <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0" style="float:left;">移除项目</el-button>
      </el-col>
    </el-row>
    <el-dialog title='编辑考试项目' v-model='editTestVisible' @close="closeDialog('editForm')">
      <div id='editTestDiv'>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form :model="editForm" ref="editForm" label-width="40%">
              <el-form-item label="考试项目">
                <el-input v-if="this.editForm.itemName !== null" :disabled="true" :value="this.editForm.item.itemName"></el-input>
              </el-form-item>
              <el-form-item label="考试类型" prop="typeName"  
                :rules="[{ required: true, message: '考试类型不能为空'}]">
                <el-select v-model="editForm.typeName" placeholder="请选择考试类型">
                  <el-option value="非考试项"></el-option>
                  <el-option value="男生项"></el-option>
                  <el-option value="女生项"></el-option>
                  <el-option value="男女生共同考试项"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-row>
            <el-col :span="24" style="margin-bottom: 25px;">
              <el-button type="primary" @click="editTestSubmit('editForm')">确 定</el-button>
              <el-button @click="cancelEditTest('editForm')">取 消</el-button>
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
        editTestVisible: false,
        selectedRow: null,
        sels: [],
        editForm: {
          item: {
            itemId: '',
            itemName: ''
          },
          type: '',
          typeName: ''
        },
        allTestData: [
      /*    {
            "testId": "23152e7a44b1465180088a132d04b15a",
            "item": {
              "itemId": "3b2d5591a918418796d9c003c0454c93",
              "itemName": "实心球"
            },
            "adminId": "1723dbcd79ea495d98834ffa3e7e6617",
            "type": 2
          },
          {
            "testId": "71577b6eadd34d578e0a0370771237cf",
            "item": {
              "itemId": "d1a5c33bfea9442eab94f16d7d11f851",
              "itemName": "立定跳远"
            },
            "adminId": "1723dbcd79ea495d98834ffa3e7e6617",
            "type": 3
          }  */
        ]
      }
    },
    computed: {
    },
    methods: {
      insertTypeName() {
        for(var i=0; i<this.allTestData.length; i++) {
          switch(this.allTestData[i].type) {
            case 0:
              this.allTestData[i].typeName = '非考试项';
              break;
            case 1:
              this.allTestData[i].typeName = '男生项';
              break;
            case 2:
              this.allTestData[i].typeName = '女生项';
              break;
            case 3:
              this.allTestData[i].typeName = '男女生共同考试项';
              break;
            default: 
              this.allTestData[i].typeName = '';
          }
        }
      },
      handleSelsChange(val) {
        this.sels = val;
      },
      batchDelete() {
        var itemList = [];
        for(var i=0; i<this.sels.length; i++) {
          itemList.push({
	          "testId": this.sels[i].testId,
	          "item": this.sels[i].item,
            "adminId": this.sels[i].adminId,
            "type": this.sels[i].type
          });
        }
        if (confirm('确认移除？') === true) {
          this.$http.post(
            'http://120.26.60.164:7777/pets/admin/batchDeleteTestItem', 
            itemList,
            {emulateJSON: false}
          ).then(
          (response) => {
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                alert('移除成功');
                this.loadTests();
              }
              else if (state === 1) {alert('移除失败');}
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
      handleEditTest(index, row) {
        this.selectedRow = row;
        this.editForm = {
          item: {
            itemId: this.selectedRow.item.itemId,
            itemName: this.selectedRow.item.itemName
          },
          type: '',
          typeName: this.selectedRow.typeName
        };
        this.editTestVisible = true;
        console.log(this.selectedRow);
        console.log(this.editForm);
      },
      closeDialog(formName) {
        this.selectedRow = null;
        this.$refs[formName].resetFields();
      },
      cancelEditTest(formName) {
        this.editTestVisible = false;
        this.selectedRow = null;
        this.$refs[formName].resetFields();
      },
      editTestSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            switch(this.editForm.typeName) {
              case '非考试项':
                this.editForm.type = 0;
                break;
              case '男生项':
                this.editForm.type = 1;
                break;
              case '女生项':
                this.editForm.type = 2;
                break;
              case '男女生共同考试项':
                this.editForm.type = 3;
                break;
              default: 
                this.editForm.type = '';
            }
            this.$http.post(
              'http://120.26.60.164:7777/pets/admin/editTestType', {
                itemId: this.selectedRow.item.itemId,
                type: this.editForm.type
              }
            ).then(
              (response) => {
              if(response.data !== null){ 
                var state = response.data.state;
                if (state === 0) {
                  alert('编辑成功');
                  this.loadTests();
                  this.editTestVisible = false;
                  this.$refs[formName].resetFields();
                  this.selectedRow = null;
                }
                else if (state === 1) {alert('编辑失败');}
                else if (state === 2) {
                  alert('未登录');
                  this.$router.push('login');
                }
                else if (state === 11) {alert('该项目已添加为考试项目');}
                else if (state === 12) {alert('没有该项目');}
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
      handleDeleteTest(index, row) {
        if (confirm("确认删除？") === true) {
          this.$http.post(
            'http://120.26.60.164:7777/pets/admin/deleteTestItem', 
            {itemId: row.item.itemId}
          ).then(
            (response) => {
            if(response.data !== null){ 
              var state = response.data.state;
              if (state === 0) {
                alert('删除成功');
                this.loadTests();
                this.selectedRow = null;
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
        } else {this.selectedRow === null;}
      },
      loadTests() {
        this.$http.post('http://120.26.60.164:7777/pets/admin/getTestItemList').then(
          (response) => { 
          if(response.data !== null){ 
            var state = response.data.state;
            if (state === 0) {
              this.allTestData = response.data.testItemList;
              this.insertTypeName();
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
            this.insertTypeName();
            alert('请求失败');
            //this.$router.go(-1);
          }
        }, response => {
          (error)=> alert(error);
          this.insertTypeName();
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
  .test-list {
    width: 80%;
    margin-top: 52px;
    float: right;
  }
</style>
