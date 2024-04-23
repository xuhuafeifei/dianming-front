<template>
  <div class="demo-image">
    <div v-for="fit in fits" :key="fit" class="block">
      <div>
        <el-image style="width: 300px; height: 250px" :src="url" :fit="fit" />
        <el-input
          v-model="sname"
          maxlength="5"
          placeholder="Please input"
          show-word-limit
          type="textarea"
        />
      </div>
    </div>
    <el-input
      v-model="sclass"
      maxlength="10"
      placeholder="Please input"
      show-word-limit
      type="text"
    />
    <div style="margin: 20px 0" />
    <el-input
      v-model="label"
      maxlength="30"
      placeholder="Please input"
      show-word-limit
      type="textarea"
    />
    <br /><br />
    <div>
      <el-button type="primary" plain @click="start()">{{ txt }}</el-button>
      <el-button type="danger" plain @click="end()">停止</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { listStus } from "@/api/class";
const allStudents = ref([]);
const len = ref(0);
const fits = ["fill"];
let url =
  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
const sclass = ref("");
const label = ref("");
const txt = ref("开始点名");
const sname = ref("");

onMounted(() => {
  listStus().then(res => {
    len.value = res.data.length;
    allStudents.value = res.data;
    console.log(allStudents.value);
  });
  console.log(allStudents);
});

const open = ref(true);
const timer = ref(null);
let num = 0;
// const num = ref(1);

const move = () => {
  // 获取一个 0-当前数组长度的随机数
  num = Math.floor(Math.random() * allStudents.value.length);
  console.log(num);
  // 让随机数成为 list数组的随机下标，赋值给 result ，在页面渲染
  url = allStudents.value[num].sportrait;
  sclass.value = allStudents.value[num].sclass;
  label.value = allStudents.value[num].label;
  sname.value = allStudents.value[num].sname;
};

const start = () => {
  // 流程控制开关
  if (open.value) {
    // 定义计时器，调用move方法
    timer.value = setInterval(move, 300);
    txt.value = "停止点名";
    open.value = false;
  } else {
    // 清除计时器
    clearInterval(timer.value);
    txt.value = "开始点名";
    open.value = true;
    allStudents.value.splice(num, 1);
    console.log(allStudents.value);
  }
};
</script>

<style scoped>
.demo-image .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image .block:last-child {
  border-right: none;
}

.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
