<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import mixNav from "./sidebar/mixNav.vue";
import { useNav } from "@/layout/hooks/useNav";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import topCollapse from "./sidebar/topCollapse.vue";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStore } from "@/store/modules/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import personalApi from "@/api/personal";
import md5 from "js-md5";
import questApi from "@/api/quest";

// import salt from "@/src/view/login/index.vue";
const salt = "ipbd@zhengwen";

const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  avatarsStyle,
  toggleSideBar
} = useNav();
const userStore = useUserStore();

// const dialogTableVisible = ref(false);
const dialogFormVisible = ref(false);

const clearQuStatus = () => {
  questApi.clearStatus().then(res => {
    if (res.code === 0) {
      ElMessage.success("题目状态清理成功");
    } else {
      ElMessage.error("题目状态清理失败");
    }
  });
};

const changePassword = () => {
  ruleForm.checkPass = "";
  ruleForm.oldPass = "";
  ruleForm.pass = "";
  dialogFormVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();

const checkOldPass = (rule: any, value: any, callback: any) => {
  const REGEXP_PWD =
    /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else if (!REGEXP_PWD.test(value)) {
    callback(new Error("密码格式应为8-18位数字、字母、符号的任意两种组合"));
  } else if (value < 8 || value > 18) {
    callback(new Error("密码长度应为8-18"));
  } else {
    callback();
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  const REGEXP_PWD =
    /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else if (value === ruleForm.oldPass) {
    callback(new Error("新密码不能和旧密码一致"));
  } else if (!REGEXP_PWD.test(value)) {
    callback(new Error("密码格式应为8-18位数字、字母、符号的任意两种组合"));
  } else if (value < 8 || value > 18) {
    callback(new Error("密码长度应为8-18"));
  } else {
    if (ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  const REGEXP_PWD =
    /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;
  if (value === "") {
    callback(new Error("请输重新输入密码"));
  } else if (!REGEXP_PWD.test(value)) {
    callback(new Error("密码格式应为8-18位数字、字母、符号的任意两种组合"));
  } else if (value < 8 || value > 18) {
    callback(new Error("密码长度应为8-18"));
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  pass: "",
  checkPass: "",
  oldPass: ""
});

const rules = reactive<FormRules>({
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  oldPass: [{ validator: checkOldPass, trigger: "blur" }]
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(valid => {
    if (valid) {
      const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
      const id = userInfo.id;
      const usedPassword = md5(salt + ruleForm.oldPass);
      const newPassword = md5(salt + ruleForm.pass);
      const secNewPassword = md5(salt + ruleForm.checkPass);

      // 发送请求
      personalApi
        .changePassword(id, usedPassword, newPassword, secNewPassword)
        .then(res => {
          if (res.code === 0) {
            ElMessage.success("修改成功");
          } else {
            ElMessage.error(res.msg);
          }
        });
      dialogFormVisible.value = false;

      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <div
    class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]"
  >
    <topCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <mixNav v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 菜单搜索 -->
      <Search />
      <!-- 通知 -->
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="userStore.avatar" :style="avatarsStyle" />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu class="changePassword">
            <el-dropdown-item @click="changePassword">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              修改密码
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu class="clearQuStatus">
            <el-dropdown-item @click="clearQuStatus">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              清空题目状态
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog v-model="dialogFormVisible" title="密码修改">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="旧密码" prop="oldPass">
            <el-input
              v-model="ruleForm.oldPass"
              type="password"
              autocomplete="off"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input
              v-model="ruleForm.pass"
              type="password"
              autocomplete="off"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认" prop="checkPass">
            <el-input
              v-model="ruleForm.checkPass"
              type="password"
              autocomplete="off"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >Submit</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <span
        class="set-icon navbar-bg-hover"
        title="打开项目配置"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    min-width: 280px;
    height: 48px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;

    .el-dropdown-link {
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      color: #000000d9;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
