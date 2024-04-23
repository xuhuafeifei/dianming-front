<template>
  <div style="padding: 10px; margin-bottom: 50px">
    <el-row>
      <el-col :span="8">
        <el-scrollbar height="500px">
          <el-card style="width: 100%; min-height: 500px; color: #333">
            <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">
              <el-input-number
                v-model="stuId"
                size="small"
                placeholder="输入学生id"
              />
              <el-button
                plain
                type="primary"
                size="small"
                @click="addUser(stuId)"
                >添加用户</el-button
              >
              <br />
              <span style="font-size: 12px">（点击聊天气泡开始聊天）</span>
            </div>
            <div
              style="padding: 10px 0"
              v-for="user in users"
              :key="user.sname"
            >
              <span>{{ user.sname }}</span>
              <el-button
                class="el-icon-chat-dot-round"
                style="margin-left: 10px; font-size: 16px; cursor: pointer"
                @click="chooesChatUser(user)"
                type="success"
              >
                <el-icon><ChatDotRound /></el-icon>
              </el-button>
              <span
                style="font-size: 12px; color: limegreen; margin-left: 5px"
                v-if="user.id === chatUser.id"
                >chatting...</span
              >
            </div>
          </el-card>
        </el-scrollbar>
      </el-col>
      <el-col :span="16">
        <div
          style="
            width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px #ccc;
          "
        >
          <div style="text-align: center; line-height: 50px">
            Web聊天室（{{ chatUser.sname }}）
          </div>
          <div
            style="height: 250px; overflow: auto; border-top: 1px solid #ccc"
            v-html="content"
          />
          <div style="height: 200px">
            <textarea
              v-model="text"
              style="
                height: 160px;
                width: 100%;
                padding: 20px;
                border: none;
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                outline: none;
              "
            />
            <div style="text-align: right; padding-right: 10px">
              <el-button type="success" plain @click="getChatHistory"
                >历史记录</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="send"
                @key.enter="send"
                >发送</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Expand, Fold } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getUserInfo } from "@/api/user";
import router from "@/router";
import { useRoute } from "vue-router";
import chatApi from "@/api/chat";

let socket;
export default {
  name: "Im",
  data() {
    return {
      stuId: Number,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      user: {},
      isCollapse: false,
      users: [],
      chatUser: {},
      text: "",
      messages: [],
      content: "",
      page: "1"
    };
  },
  created() {
    this.init();
  },
  mounted() {
    const route = useRoute();
    console.log(route.params);
    if (route.params.stuId !== ":stuId") {
      // 将字符串处理为number
      const id = Number(route.params.stuId);
      this.addUser(id);
    }
  },
  methods: {
    getChatHistory() {
      console.log(this.chatUser.id);
      // 判断是否选定
      if (
        this.chatUser === undefined ||
        this.chatUser === null ||
        this.chatUser.id === undefined
      ) {
        ElMessage.error("请先点击聊天气泡开始聊天");
        return;
      }
      const res = sessionStorage.getItem("user-info");
      const id = JSON.parse(res).id;
      const toUserId = this.chatUser.id;
      // 查询历史记录
      chatApi
        .getChatHistory(id.toString(), toUserId.toString(), this.page, 20)
        .then(res => {
          console.log(res);

          const chatList = res.data;

          let html;

          for (let i = 0; i < chatList.length; i++) {
            const chat = chatList[i];
            const fromId = parseInt(chat.fromUserId);
            const curId = parseInt(id);
            console.log(typeof fromId);
            console.log(typeof curId);
            console.log(fromId);
            console.log(curId);

            // 自己发送的
            if (fromId === curId) {
              html += this.makeContent(null, chat.fromUserId, chat.content);
            } else {
              html += this.makeContent(chat.fromUserId, null, chat.content);
            }
          }
          html += this.content;
          this.content = html;
        });
    },
    chooesChatUser(user) {
      this.chatUser = user;
      const res = sessionStorage.getItem("user-info");
      const id = JSON.parse(res).id;
      const toUserId = user.id;
      this.html = "";
      // 发送请求, 初始化聊天信息
      chatApi.chatInit(id, toUserId).then(res => {
        // 构建消息
        console.log(res.data);
        const chatList = res.data;

        for (let i = 0; i < chatList.length; i++) {
          const chat = chatList[i];
          const fromId = parseInt(chat.fromUserId);
          const curId = parseInt(id);
          console.log(typeof fromId);
          console.log(typeof curId);
          console.log(fromId);
          console.log(curId);

          // 自己发送的
          if (fromId === curId) {
            this.createContent(null, chat.fromUserId, chat.content);
          } else {
            this.createContent(chat.fromUserId, null, chat.content);
          }
        }
      });
    },
    addUser(id: Number) {
      const res = sessionStorage.getItem("user-info");
      console.log(typeof JSON.parse(res).id);
      console.log(typeof id);
      if (id === JSON.parse(res).id) {
        ElMessage.warning("自己和自己聊天是什么鬼");
        return;
      }
      getUserInfo(id).then(res => {
        // debug
        console.log(res);
        this.users.push(res.data);
      });
      console.log(this.users);
    },
    send() {
      // 判断是否选定
      if (
        this.chatUser === undefined ||
        this.chatUser === null ||
        this.chatUser.id === undefined
      ) {
        ElMessage.error("请先点击聊天气泡开始聊天");
        return;
      }

      if (!this.chatUser) {
        this.$message({ type: "warning", message: "请选择聊天对象" });
        return;
      }
      if (!this.text) {
        this.$message({ type: "warning", message: "请输入内容" });
      } else {
        if (typeof WebSocket == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          // 组装待发送的消息 json
          // {"from": "zhang", "to": "admin", "text": "聊天文本"}
          const message = {
            fromUserId: this.user.id,
            toUserId: this.chatUser.id,
            content: this.text
          };
          // debug
          console.log(message);
          socket.send(JSON.stringify(message)); // 将组装好的json发送给服务端，由服务端进行转发
          this.messages.push({ user: this.user.username, text: this.text });
          // 构建消息内容，本人消息
          this.createContent(null, this.user.username, this.text);
          this.text = "";
        }
      }
    },
    createContentHistory(remoteUser, nowUser, text) {
      let html = this.makeContent(remoteUser, nowUser, text);
      // this.content += html;
      html += this.content;
      this.content = html;
    },
    makeContent(remoteUser, nowUser, text) {
      // 这个方法是用来将 json的聊天消息数据转换成 html的。
      let html;
      // 当前用户消息
      if (nowUser) {
        console.log("构建当前用户发送信息");
        // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
        html =
          '<div class="el-row" style="padding: 5px 0">\n' +
          '  <div class="el-col el-col-22" style="text-align: right; padding-right: 10px">\n' +
          '    <div class="tip left">' +
          text +
          "</div>\n" +
          "  </div>\n" +
          '  <div class="el-col el-col-2">\n' +
          '  <span class="el-avatar el-avatar--circle" style="height: 40px; width: 40px; line-height: 40px;">\n' +
          '    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="object-fit: cover;">\n' +
          "  </span>\n" +
          "  </div>\n" +
          "</div>";
      } else if (remoteUser) {
        console.log("构建远程用户发送信息");
        // remoteUser表示远程用户聊天消息，蓝色的气泡
        html =
          '<div class="el-row" style="padding: 5px 0">\n' +
          '  <div class="el-col el-col-2" style="text-align: right">\n' +
          '  <span class="el-avatar el-avatar--circle" style="height: 40px; width: 40px; line-height: 40px;">\n' +
          '    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="object-fit: cover;">\n' +
          "  </span>\n" +
          "  </div>\n" +
          '  <div class="el-col el-col-22" style="text-align: left; padding-left: 10px">\n' +
          '    <div class="tip right">' +
          text +
          "</div>\n" +
          "  </div>\n" +
          "</div>";
      }
      return html;
    },
    createContent(remoteUser, nowUser, text) {
      const html = this.makeContent(remoteUser, nowUser, text);
      this.content += html;
      true;
    },
    init() {
      this.user = sessionStorage.getItem("user-info")
        ? JSON.parse(sessionStorage.getItem("user-info"))
        : {};
      const id = this.user.id;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        const socketUrl = "wss://www.xhf.icu:443/api/user/ws/" + id;
        // const socketUrl = "ws://localhost:8279/api/user/ws/" + id;
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
          console.log("收到数据====" + msg.data);
          const data = JSON.parse(msg.data); // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
          console.log(data);
          if (data.users) {
            // 获取在线人员信息
            _this.users = data.users.filter(user => user.username !== username); // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
          } else {
            // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
            //  // {"from": "zhang", "text": "hello"}

            if (data.fromUserId === _this.chatUser.id) {
              console.log("准备构建远程消息");
              _this.messages.push(data);
              // 构建消息内容
              _this.createContent(data.fromUserId, null, data.content);
            }
          }
        };
        //关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        };
      }
    }
  }
};
</script>
<style>
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width: auto;
  display: inline-block !important;
  display: inline;
}

.right {
  background-color: deepskyblue;
}

.left {
  background-color: forestgreen;
}
</style>
