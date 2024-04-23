<template>
  <div>
    <div class="wrapper">
      <div class="card-container">
        <div
          class="card"
          :style="{
            backgroundColor: colorList[Math.floor(Math.random() * 10)]
          }"
          :class="{ active: index === 1 }"
          :key="item.id"
          v-for="(item, index) in stus ? stus.slice(0, 5) : []"
        >
          <div class="text">
            <div class="class">
              {{ item.sclass }}
            </div>
            <div class="name">{{ item.sname }}</div>
            <div class="label" v-if="index === 1">{{ item.label }}</div>
          </div>
          <el-avatar
            v-if="index === 1"
            shape="square"
            :size="200"
            :src="item.sportrait"
            fit="cover"
          />
        </div>
      </div>
      <div class="absolute bottom-6 flex justify-center items-center">
        <!-- <ElButton @click="handleChoice">抽一位幸运同学</ElButton>
        <ElButton @click="handleExitChoice" type="danger" v-if="exitBtnVisible"
          >就是你了</ElButton
        > -->
        <ElButton @click="change()" :type="type_value" plain size="large">{{
          txt
        }}</ElButton>
      </div>
      <el-dialog
        v-model="dialogVisible"
        width="400px"
        height="800px"
        :open-delay="1"
        style="height: 500px; background-color: #d4af37; color: white"
        :show-close="false"
        draggable
      >
        <div class="luckycard">
          <ElAvatar
            :src="luckyStu.sportrait"
            :size="200"
            fit="contain"
            @error="errorHandler"
          >
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </ElAvatar>
          <div class="name">{{ luckyStu.sname }}</div>
          <div class="class">{{ luckyStu.sclass }}</div>
          <div class="label">{{ luckyStu.label }}</div>
          <div class="flex">
            <ElButton
              class="mt-8"
              type="danger"
              @click="open"
              v-if="buttomVisiable"
              >缺勤</ElButton
            >
            <ElButton class="mt-8" type="primary" @click="generateTask"
              >做道题吧</ElButton
            >
            <ElButton
              class="mt-8"
              type="success"
              @click="lock(luckyStu.id)"
              v-if="buttomVisiable"
              >锁定</ElButton
            >
          </div>
        </div>
      </el-dialog>
      <el-dialog
        v-model="textVisiable"
        class="flex flex-col items-center"
        :before-close="handleClose"
      >
        <el-card style="font-size: 20px">
          <p v-if="quData.content" class="text-3xl">
            {{ quData.id }}.
            {{ quData.content }}
          </p>
          <p v-if="quData.image != null && quData.image != ''">
            <el-image :src="quData.image" style="max-width: 100%" />
          </p>
          <div v-if="quData.quType === 1 || quData.quType === 3">
            <el-radio-group v-model="radioValue">
              <el-radio
                v-for="(item, index) in answerList"
                :key="item.id"
                :label="item.id"
                style="font-size: 300px"
                border
              >
                <p class="text-3xl">
                  {{ abcd(index) }}.
                  {{ item.content }}
                </p>
              </el-radio>
            </el-radio-group>
          </div>

          <div v-if="quData.quType === 2">
            <el-checkbox-group v-model="multiValue">
              <el-checkbox
                v-for="(item, index) in answerList"
                :key="item.id"
                :label="item.id"
                class="text-3xl"
              >
                <!-- {{ ABCD }}. -->
                {{ abcd(index) }}.
                {{ item.content }}
                <div
                  v-if="item.image != null && item.image != ''"
                  style="clear: both"
                >
                  <el-image :src="item.image" style="max-width: 100%" />
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <div style="margin-top: 20px">
            <el-button type="primary" @click="submit"> 提交选择 </el-button>
            <el-button type="success" @click="rightAnswear">
              显示答案
            </el-button>
          </div>
          <div v-if="isConfirm !== null">
            <el-col
              v-if="isConfirm === false"
              :span="12"
              style="text-align: right; color: #ff0000"
            >
              回答错误
            </el-col>

            <el-col
              v-if="isConfirm === true"
              :span="12"
              style="text-align: right; color: #24da70"
            >
              回答正确
            </el-col>
            <el-col>
              {{ quData.analysis }}
            </el-col>
          </div>
        </el-card>
      </el-dialog>
    </div>
    <!-- <el-dialog v-model="textVisiable"> -->
    <!-- </el-dialog> -->

    <!-- <el-drawer v-model="quDrawer" size="100%">
      <span>{{}}</span>
    </el-drawer> -->
  </div>
</template>

<script setup lang="ts">
// import { useTransition } from "@vueuse/core";
import { ref, onMounted, reactive, Vue, h, computed } from "vue";
import { useStuStore } from "@/store/modules/stu";
import { ElMessageBox, ElMessage, ElNotification } from "element-plus";
import classApi from "@/api/class";
import titleApi from "@/api/title";

const buttomVisiable = ref(true);

// const curActive = ref(0);
// const renderList = ref();
// 卡片颜色设置
const colorList = [
  "hsl(42, 48%, 54%)",
  "hsl(138, 24%, 48%)",
  "rgb(200, 138, 131)",
  "rgb(84, 221, 226)",
  "rgb(178, 199, 168)",
  "rgb(16, 195, 195)",
  "hsl(0, 21%, 68%)",
  "rgb(226, 166, 198)",
  "hsl(278, 17%, 66%)",
  "rgb(153, 199, 235)",
  "blueviolet"
];
const abcd = val => {
  return String.fromCharCode(val + 65);
};
/**
 * 渲染数据
 */
const type_value = ref("primary");
const stus = ref();
const stuStore = useStuStore();
const answerListWithABCD = ref({ option: [], abcd: [] });

const errorHandler = () => {
  ElNotification({
    title: "图片加载失败",
    message: h("i", { style: "color: teal" }, "图床存储图片错误,请联系徐华飞")
  });
  return true;
};

const items = ref({});

onMounted(async () => {
  await stuStore.fetchStuList();
  stus.value = stuStore.data;
  console.log(sessionStorage.getItem("user-info"));

  // 判断当前角色
  const roles = JSON.parse(sessionStorage.getItem("user-info")).roles;
  if (roles.includes("admin")) {
    buttomVisiable.value = true;
  } else {
    buttomVisiable.value = false;
  }
});

/**
 * 抽卡
 */
let time;
const luckyStu = ref();
const exitBtnVisible = ref(false);
const txt = ref("抽取一位幸运同学");
const change = () => {
  if (stus.value.length === 1) {
    ElMessage.error("本轮所有同学都已抽完了哦,如若想继续,请刷新页面");
    return;
  }
  if (txt.value === "抽取一位幸运同学") {
    txt.value = "就是你了";
    type_value.value = "danger";
    handleChoice();
  } else {
    handleExitChoice();
    txt.value = "抽取一位幸运同学";
    type_value.value = "";
  }
};
const handleChoice = () => {
  stus.value.splice(1, 1);
  dialogVisible.value = false;
  // let cnt = Math.floor(Math.random() * 10) + 4000;
  exitBtnVisible.value = true;
  time = window.setInterval(() => {
    stus.value = [...stus.value.slice(1), stus.value[0]];
    /*
    cnt--;
    if (cnt == -1) {
      dialogVisible.value = true;
      luckyStu.value = stus.value[1];
      window.clearInterval(time);
      exitBtnVisible.value = false;
    }
    */
  }, 150);
};
const handleExitChoice = () => {
  window.clearInterval(time);
  exitBtnVisible.value = false;
  dialogVisible.value = true;
  luckyStu.value = stus.value[1];
  console.log(stus.value);
  /*
  stus.value = stus.value.filter(item => {
    if (item.id !== luckyStu.value.id) return item;
  });
  */
};
onMounted(() => {
  window.clearInterval(time);
});

/**
 * 展示幸运同学
 */
const dialogVisible = ref(false);
/**
 * 幸运同学是否缺勤了呢
 */
const open = () => {
  ElMessageBox.confirm(
    "学生获取学分不易,该学生真的缺勤了吗(防误触)",
    "Warning!!!!!!!!",
    {
      confirmButtonText: "是的",
      cancelButtonText: "点错了",
      type: "warning"
    }
  )
    .then(() => {
      luckyStu.value.absent++;
      ElMessage({
        type: "error",
        message: `${luckyStu.value.sname}同学已缺勤，下次注意`
      });
      classApi.edit({ id: luckyStu.value.id, absent: luckyStu.value.absent });
    })
    .catch(() => {
      ElMessage({
        type: "success",
        message: "太好了,该学生逃过一劫"
      });
    })
    .finally(() => {
      dialogVisible.value = false;
    });
};
// drawer
const textVisiable = ref(false);

// 当前题目内容
const quData = ref({
  id: 0,
  content: "",
  image: "",
  quType: 1,
  sort: 1
});

const answerList = ref([]);

// 单选选定值
const radioValue = ref("");
// 多选选定值
const multiValue = ref([]);

const sleep = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
};

const generateTask = async () => {
  // 初始化
  quData.value = {
    id: 0,
    content: "",
    image: "",
    quType: 1,
    sort: 1
  };
  answerList.value = [];
  // 随机抽取题目
  await titleApi.getRandomExam("1").then(res => {
    if (res.code === 412029) {
      ElMessage.error(res.msg);
      return;
    }
    quData.value = res.data;
    answerList.value = res.data.answerList;
    answerListWithABCD.value.option = answerList.value;
    answerListWithABCD.value.abcd = ["A", "B", "C", "D", "E", "F"];

    // debug
    console.log(answerListWithABCD.value);
    sleep(1000);
    textVisiable.value = true;
  });
};

const isConfirm = ref(null);

const submit = () => {
  // console.log(radioValue.value);
  // isConfirm.value = true;
  for (let i = 0; i < answerList.value.length; i++) {
    console.log(answerList.value[i]);
    console.log(radioValue.value);
    console.log(typeof radioValue.value);
    if (answerList.value[i].id === radioValue.value) {
      if (answerList.value[i].correct) {
        isConfirm.value = true;
      } else {
        isConfirm.value = false;
      }
      break;
    }
  }
  console.log(isConfirm.value);
};

const rightAnswear = () => {
  console.log(answerList.value);
  for (let i = 0; i < answerList.value.length; ++i) {
    console.log(answerList.value[i]);
    if (answerList.value[i].correct === true) {
      radioValue.value = answerList.value[i].id;
      console.log(radioValue.value);
      isConfirm.value = true;
      break;
    }
  }
};

const handleClose = done => {
  isConfirm.value = null;
  console.log(isConfirm.value);
  done();
};

const lock = id => {
  console.log(id);
  classApi.lockStu(id).then(res => {
    console.log(res);
    if (res.code === 0) {
      ElMessage.success("锁定成功");
    } else {
      ElMessage.error("锁定失败");
    }
  });
};
</script>

<style scoped lang="scss">
@mixin cardStyle() {
  @apply flex flex-col justify-center items-center text-white p-4;
}

.card-container {
  @apply flex justify-center items-center box-border;
  padding-left: 120px;
  height: 80vh;
  width: 80vw;

  .card {
    @apply rounded-lg shadow-lg;
    @include cardStyle();
    width: 200px;
    height: 320px;
    margin-left: -120px;
    transition: all 0.5s cubic-bezier(0.3, 1.2, 0.5, 1.2);

    .name {
      @apply text-3xl font-semibold;
    }

    &.active {
      @apply flex-row pl-20;
      margin: 0;
      margin-left: -80px;
      height: 400px;
      width: 720px;
      background-color: purple;

      .text {
        @apply flex flex-col justify-center;
        margin-left: -30px;

        .name {
          @apply text-6xl font-bold pr-24;
          display: flex;
        }

        .label {
          width: 220px;
        }
      }

      .img-box {
        @apply bg-white flex justify-center items-center overflow-hidden;
        width: 200px;
        height: 200px;
      }

      img {
        object-fit: contain;
      }
    }

    &.hidden {
      display: none;
      opacity: 0;
    }
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.luckycard {
  @include cardStyle();
  @apply p-2 pt-0;

  .name {
    @apply text-3xl font-bold;
  }

  .label {
    @apply text-2xl font-sans;
    font-size: 20px;
  }
}

.qu-content div {
  line-height: 30px;
  width: 100%;
  font-size: 200xp;
}

.el-radio is-bordered is-checked el-radio--large {
  font-size: 40xp;

  .el-radio__label {
    font-size: 30xp;
  }
}

.el-radio .el-radio__label {
  font-size: 200px !important;
}

.el-checkbox-group label,
.el-radio-group label {
  width: 100%;
}

.content-h {
  height: calc(100vh - 110px);
  overflow-y: auto;
}

.card-title {
  background: #eee;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
}

.card-line {
  padding-left: 10px;
}

.card-line span {
  cursor: pointer;
  margin: 2px;
}

:deep .el-radio,
.el-checkbox {
  padding: 9px 20px 9px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-bottom: 10px;
  width: 100%;
}

.is-checked {
  border: #409eff 1px solid;
}

.el-radio img,
.el-checkbox img {
  max-width: 200px;
  max-height: 200px;
  border: #dcdfe6 1px dotted;
}

:deep .el-checkbox__inner {
  display: none;
}

:deep .el-radio__inner {
  display: none;
}

:deep .el-checkbox__label {
  line-height: 30px;
}

:deep .el-radio__label {
  line-height: 10px;
}
/* 加载前 */
.el-image__placeholder {
  background: "rgba(0, 0, 0, 0.7)" no-repeat 50% 50% !important;
  background-size: 50% !important;
}
</style>
