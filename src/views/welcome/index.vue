<template>
  <div>
    <span>
      <el-row :gutter="20">
        <!-- 签到开始界面 -->
        <el-col :span="40">
          <el-card class="box-card" style="margin-bottom: 20xp">
            <template #header>
              <div class="card-header">
                <el-input
                  v-model="semId"
                  placeholder="请输入本次签到所属学科课程id"
                  clearable
                />
                <el-button class="button" @click="startSign" text
                  >开始签到</el-button
                >
              </div>
            </template>
            <div class="demo-image__lazy">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="item in linhuaPict" :key="item">
                  <el-image :src="item" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-card>
          <el-card>
            <el-row>
              <el-col :span="8">
                <el-button size="large" plain type="primary" @click="keyisese"
                  >可以瑟瑟</el-button
                >
              </el-col>
              <el-col :span="8">
                <el-button size="large" plain type="danger" @click="buxusese"
                  >不许瑟瑟</el-button
                >
              </el-col>
              <el-col :span="8">
                <el-countdown
                  v-if="countTimeVisiable"
                  title="剩余签到时间"
                  format="HH:mm:ss"
                  :value="value1"
                />
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <!-- 已签到学生列表 -->
        <el-col :span="8">
          <el-card class="box-card" style="margin-bottom: 10xp">
            <div class="card-header">
              <span>已签到学生</span>
            </div>
            <el-scrollbar height="380px">
              <p
                v-for="item in signUpStuList"
                :key="item"
                class="scrollbar-demo-item"
              >
                {{ item }}
              </p>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import signApi from "@/api/sign";
import { ElMessage } from "element-plus";

// 绫华图片合集
const linhuaPict = ref([]);
// 签到学生信息
const signUpStuList = ref([]);

const semId = ref();

const value1 = ref();

const countTimeVisiable = ref(false);

function reset(time) {
  value1.value = time;
}

/**
 * 初始化linghua图片数据
 */
onMounted(() => {
  signApi.getLinhua().then(res => {
    linhuaPict.value = res.data;
    console.log(linhuaPict.value);
  });
});

/**
 * 请求绫华的图片
 */
const keyisese = () => {
  signApi.getLinhua().then(res => {
    linhuaPict.value = res.data;
    if (res.code === 0) {
      ElMessage.success("瑟瑟成功");
      countTimeVisiable.value = false;
    } else {
      ElMessage.error("瑟瑟失败");
    }
  });
};

const buxusese = () => {
  if (semId.value === null || semId.value === undefined) {
    ElMessage.warning("请先填写学科课程id");
    return;
  }
  startSign();
};

/**
 * 开始签到
 */
const startSign = () => {
  if (semId.value === null || semId.value === undefined) {
    ElMessage.warning("请先填写学科课程id");
    return;
  }
  // 获取当前用户id
  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const id = userInfo.id;

  // 建立websocket
  openSocket(id);

  // 发送请求
  signApi.signUpPict(id, semId.value).then(
    res => {
      console.log(res);
      console.log(res.data);
      // debug
      const blob = new Blob([res], { type: "image/png" });
      // 创建URL对象
      const imageUrl = URL.createObjectURL(blob);
      linhuaPict.value = [imageUrl];
      // 显示倒计时
      countTimeVisiable.value = true;
      reset(Date.now() + 1000 * 5 * 60 + 1000);
    },
    error => {
      console.log(error);
      ElMessage.error("系统错误, 无法生成二维码");
      keyisese();
    }
  );
};

let socket;
// 建立websocket
const openSocket = userId => {
  if (typeof WebSocket == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    console.log("您的浏览器支持WebSocket");
    //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
    //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
    //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
    // 网关ip
    // let socketUrl = `http://ws:2789/api/sign/ws/${userId}`;
    const socketUrl = `wss://www.xhf.icu:443/api/sign/ws/${userId}`;
    // const socketUrl = `ws://localhost:8279/api/sign/ws/${userId}`;
    console.log(socketUrl);
    if (socket != null) {
      socket.close();
      socket = null;
    }
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function () {
      console.log("websocket已打开");
      //socket.send("这是来自客户端的消息" + location.href + new Date());
    };
    //获得消息事件
    socket.onmessage = function (msg) {
      console.log(msg.data);
      //发现消息进入    开始处理前端触发逻辑
      signUpStuList.value.unshift(msg.data);
    };
    //关闭事件
    socket.onclose = function () {
      console.log("websocket已关闭");
    };
    //发生了错误事件
    socket.onerror = function () {
      console.log("websocket发生了错误");
      ElMessage.error("websocket发生了错误");
    };
  }
};
</script>
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 500px;
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
