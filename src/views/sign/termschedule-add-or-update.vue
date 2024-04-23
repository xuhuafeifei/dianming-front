<template>
  <div>
    <el-dialog
      v-model="visible"
      :title="!dataForm.semesterId ? '新增' : '修改'"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter="dataFormSubmit()"
        label-width="140px"
      >
        <el-form-item label="学期" prop="semester">
          <el-input disabled v-model="dataForm.semester" placeholder="学期" />
        </el-form-item>
        <el-form-item label="课程" prop="course">
          <el-input disabled v-model="dataForm.course" placeholder="课程" />
        </el-form-item>
        <el-form-item label="第几节课" prop="classNumber">
          <el-input v-model="dataForm.classNumber" placeholder="第几节课" />
        </el-form-item>
        <el-form-item label="签到开启时间" prop="signStartTime">
          <!-- <el-input
            :disabled="!dataForm.semesterId"
            v-model="dataForm.signStartTime"
            placeholder="签到开启时间"
          /> -->
          <el-date-picker
            :disabled="!dataForm.semesterId"
            v-model="dataForm.signStartTime"
            type="datetime"
            placeholder="签到开启时间"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item label="签到持续时间(min)" prop="signLastTime">
          <el-input
            :disabled="!dataForm.semesterId"
            v-model="dataForm.signLastTime"
            placeholder="签到持续时间, 比如5分钟, 您只需要输出数字即可"
          />
        </el-form-item>
        <el-form-item
          :disabled="!dataForm.semesterId"
          label="签到是否结束"
          prop="finished"
        >
          <!-- <el-input
            v-model="dataForm.finished"
            :disabled="!dataForm.semesterId"
            placeholder="签到是否结束"
          /> -->
          <el-radio-group v-model="dataForm.finished" class="ml-4">
            <el-radio :label="true" size="large">是</el-radio>
            <el-radio :label="false" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签到次数" prop="count">
          <el-input :disabled="true" v-model="dataForm.count" />
        </el-form-item>
      </el-form>
      <!-- <template> -->
      <!-- <span class="dialog-footer"> -->
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      <!-- </span> -->
      <!-- </template> -->
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { $on, $off, $once, $emit } from "@/utils/gogocodeTransfer.js";
import termApi from "@/api/term";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        semesterId: 0,
        semester: "2023学期",
        course: "Linux",
        classNumber: "",
        signStartTime: "",
        signLastTime: 5,
        finished: false,
        count: 0
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
        semester: [
          { required: true, message: "学期不能为空", trigger: "blur" }
        ],
        course: [{ required: true, message: "课程不能为空", trigger: "blur" }],
        classNumber: [
          {
            required: true,
            message: "课堂次序，第几节课不能为空",
            trigger: "blur"
          }
        ],
        signStartTime: [
          {
            required: false,
            message: "签到开启时间不能为空",
            trigger: "blur"
          }
        ],
        signLastTime: [
          { required: false, message: "签到持续时间不能为空", trigger: "blur" }
        ],
        finished: [
          { required: false, message: "签到是否结束不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.semesterId = id || null;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        console.log("test");
        if (this.dataForm.semesterId) {
          termApi.getInfoById(this.dataForm.semesterId).then(data => {
            // debug
            console.log(data);
            if (data && data.code === 0) {
              this.dataForm.semester = data.termSchedule.semester;
              this.dataForm.course = data.termSchedule.course;
              this.dataForm.classNumber = data.termSchedule.classNumber;
              this.dataForm.signStartTime = data.termSchedule.signStartTime;
              this.dataForm.signLastTime = data.termSchedule.signLastTime;
              this.dataForm.finished = data.termSchedule.finished;
              this.dataForm.count = data.termSchedule.count;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // debug
          console.log(this.dataForm);
          termApi.save(this.dataForm).then(data => {
            // debug
            console.log(data);
            if (data && data.code === 0) {
              // ElMessage.success("修改成功");
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 500,
                onClose: () => {
                  this.visible = false;
                  $emit(this, "refreshDataList");
                }
              });
            } else {
              ElMessage.error("修改失败,", data.msg);
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
