<template>
  <el-dialog
    :title="!dataForm.signId ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="学生学号" prop="stuSno">
        <el-input
          :disabled="dataForm.signId"
          v-model="dataForm.stuSno"
          placeholder="学生学号"
        />
      </el-form-item>
      <el-form-item label="关联学期课程id" prop="semId">
        <el-input
          :disabled="dataForm.signId"
          v-model="dataForm.semId"
          placeholder="关联学期课程id"
        />
      </el-form-item>
      <el-form-item label="签到时间" prop="signTime">
        <el-date-picker
          v-model="dataForm.signTime"
          type="datetime"
          placeholder="签到时间"
          :shortcuts="shortcuts"
        />
      </el-form-item>
    </el-form>
    <!-- <template v-slot:footer> -->
    <!-- <span class="dialog-footer"> -->
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    <!-- </span> -->
    <!-- </template> -->
  </el-dialog>
</template>

<script>
import { $on, $off, $once, $emit } from "@/utils/gogocodeTransfer.js";
import { ElMessage } from "element-plus";
import signApi from "@/api/sign";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        signId: null,
        stuSno: "",
        semId: "",
        signTime: ""
      },
      // 时间序列使用
      shortcuts: [
        {
          text: "今天",
          value: new Date()
        },
        {
          text: "昨天",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          }
        },
        {
          text: "一周前",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          }
        }
      ],

      dataRule: {
        stuSno: [
          { required: true, message: "学生id不能为空", trigger: "blur" }
        ],
        semId: [
          {
            required: true,
            message: "关联学期课程不能为空",
            trigger: "blur"
          }
        ],
        signTime: [
          { required: true, message: "签到时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.signId = id || null;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.signId) {
          signApi.getInfoById(this.dataForm.signId).then(data => {
            if (data && data.code === 0) {
              this.dataForm.stuSno = data.signUp.stuSno;
              this.dataForm.semId = data.signUp.semId;
              this.dataForm.signTime = data.signUp.signTime;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          signApi.save(this.dataForm).then(data => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  $emit(this, "refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  },
  emits: ["refreshDataList"]
};
</script>
