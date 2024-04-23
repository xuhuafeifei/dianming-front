<template>
  <div>
    <el-dialog v-model="visible">
      <el-card>
        <el-descriptions class="margin-top" title="简介" :column="2" border>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-picture-outline" />
              头像
            </template>
            <img class="img" :src="personalInfo.sportrait" alt="" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-location-outline" />
              用户id
            </template>
            {{ personalInfo.id }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-user" />
              用户名
            </template>
            {{ personalInfo.uname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-user" />
              姓名
            </template>
            {{ personalInfo.sname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-odometer" />
              年龄
            </template>
            {{ personalInfo.age }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-male" />
              <i class="el-icon-female" />
              性别
            </template>
            <el-tag size="small">{{ personalInfo.sex }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-message" />
              邮箱Email
            </template>
            {{ personalInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-mobile-phone" />
              手机号码
            </template>
            {{ personalInfo.phoneNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-basketball" />
              兴趣爱好
            </template>
            {{ personalInfo.interest }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-date" />
              注册日期
            </template>
            {{ personalInfo.registerTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-magic-stick" />
              个性签名
            </template>
            {{ personalInfo.label }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-button link type="primary" @click="chat()">@一下</el-button>
    </el-dialog>
    <!-- <chatRoom ref="chatRoom" /> -->
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user.ts";
import chatRoom from "./chat.vue";
import router from "@/router";

export default {
  data() {
    return {
      visible: false,
      personalInfo: {
        id: Number,
        sno: String,
        sportrait: String,
        uname: String,
        age: Number,
        email: String,
        phoneNumber: String,
        area: String,
        registerTime: Number,
        sex: String,
        interest: String,
        label: String
      }
    };
  },
  methods: {
    init(id) {
      this.visible = true;
      getUserInfo(id).then(res => {
        console.log(res);
        this.personalInfo = res.data;
      });
    },
    chat() {
      console.log(this.personalInfo.id);
      // todo: 路由跳转
      router.push(`/friend/chat/${this.personalInfo.id}`);
    }
  }
};
</script>

<style scoped>
.img {
  width: 80px;
  height: 80px;
}
</style>
