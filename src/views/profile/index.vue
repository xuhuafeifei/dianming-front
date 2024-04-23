<template>
  <div class="app-container">
    <el-dialog v-model="imageVisiable" width="600">
      <div>
        <el-row :gutter="20">
          <el-card style="margin-bottom: 20xp">
            <el-image
              style="width: 200px; height: 200px"
              :src="user.sportrait"
              :zoom-rate="1.2"
              :preview-src-list="getUserSportraitList(user)"
              :initial-index="4"
              @error="errorHandler"
              fit="cover"
            />
          </el-card>
          <el-card style="margin-bottom: 10xp">
            <el-col :span="30" :xs="24">
              <div v-if="type">
                <el-result
                  icon="success"
                  title="点击图片,产看原图"
                  sub-title="图片加载成功"
                />
              </div>
              <div v-if="!type">
                <el-result
                  icon="error"
                  title="图片加载失败"
                  sub-title="请联系徐华飞"
                  size=""
                />
              </div>
            </el-col>
          </el-card>
        </el-row>
      </div>
    </el-dialog>
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <el-card style="margin-bottom: 10px">
            <div slot="header" class="clearfix">
              <span>个人资料</span>
            </div>

            <div class="user-profile">
              <div class="box-center">
                <pan-thumb
                  :image="user.sportrait"
                  :height="'150px'"
                  :width="'150px'"
                  :hoverable="false"
                >
                  <div>欢迎</div>
                  {{ user.roles }}
                </pan-thumb>
              </div>

              <div class="box-center">
                <div class="user-name text-center">
                  用户名: {{ user.uname }}
                </div>
                <div class="user-role text-center">职位: {{ renderRole }}</div>
                <el-button type="primary" @click="imageDetail"
                  >查看图片</el-button
                >
              </div>
            </div>
          </el-card>
          <el-card>
            <div class="box-center">
              <el-upload
                v-model:file-list="fileList"
                accept="image/*"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :http-request="httpRequest"
                :limit="1"
              >
                <IconifyIconOnline
                  icon="material-symbols:add"
                  width="60px"
                  height="60px"
                />
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传图片,且单张图片大小不能超过10MB,暂时无法上传
                  </div>
                </template>
              </el-upload>
            </div>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="user.sportrait" alt="预览图片" />
            </el-dialog>
            <div class="box-center">
              <el-button @click="submit(1)">提交</el-button>
            </div>
          </el-card>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs ref="userTable" v-model="activeTab" :data="user">
              <el-tab-pane label="修改资料" name="account">
                <el-alert
                  v-if="user.roles !== 'admin'"
                  type="info"
                  show-icon
                  :closable="false"
                >
                  <p>班级，学号已被锁定，无法修改。如果有误，请联系徐华飞</p>
                </el-alert>
                <el-alert
                  v-if="user.roles === 'admin'"
                  type="info"
                  show-icon
                  :closable="false"
                >
                  <p>郑老师,您的账号是永远都不会被抽到滴๑乛v乛๑</p>
                </el-alert>
                <el-form label-position="top">
                  <el-form-item label="用户名">
                    <el-input v-model.trim="user.uname" />
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input v-model.trim="user.sname" />
                  </el-form-item>
                  <el-form-item label="班级">
                    <el-input v-model.trim="user.sclass" disabled readonly />
                  </el-form-item>
                  <el-form-item label="学号">
                    <el-input v-model.trim="user.sno" disabled readonly />
                  </el-form-item>
                  <el-form-item label="个性签名">
                    <el-input v-model.trim="user.label" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submit(0)"
                      >修改</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserInfo } from "@/api/user";
import PanThumb from "@/components/PanThumb/index.vue";
import router from "@/router";
import { getBase64 } from "@/utils/switchBase64";
import { ElMessage, UploadProps, UploadUserFile } from "element-plus";
import { onMounted, ref } from "vue";
import personalApi from "@/api/personal";
import { computed } from "vue";
import { tr } from "element-plus/es/locale";
// import UserCard from "./components/UserCard.vue";
// import Account from "./components/Account.vue";

const fileList = ref<UploadUserFile[]>([]);
const name = "123";
const userTable = ref({});
const user = ref({
  id: "",
  label: "",
  passwd: "",
  roles: [],
  sclass: "",
  sname: "",
  sno: "",
  sportrait: "",
  uname: "",
  modifyType: 0
});
const activeTab = "account";
const imageVisiable = ref(false);
const dialogVisible = ref(false);
let imageUrl = "";
const type = ref(true);

const stateVisible = ref(false);
const errorHandler = () => {
  type.value = false;
};
const getUserSportraitList = user => {
  return [user.sportrait];
};
const close = () => {
  stateVisible.value = false;
};
onMounted(async () => {
  type.value = true;
  // 获取当前用户信息
  const curUser = JSON.parse(sessionStorage.getItem("user-info"));
  const userId = curUser.id;
  // 发送请求,获取详细信息
  getUserInfo(userId).then(res => {
    if (res.code === 0) {
      // debug
      console.log(res);
      console.log(user.value);
      user.value = res.data;
      console.log(user.value);
    } else {
      ElMessage.error("Error: " + res.msg);
    }
  });
});
const renderRole = computed(() => {
  console.log(user.value);
  return user.value.roles === "admin" ? "管理员" : "普通用户";
});
const imageDetail = () => {
  imageVisiable.value = true;
  stateVisible.value = true;
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  imageUrl = uploadFile.url!;
  dialogVisible.value = true;
};

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const fileBase64 = ref();

const httpRequest = data => {
  // 调用转方法base64
  // getBase64(data.file).then((resBase64: string) => {
  // eslint-disable-next-line vue/no-mutating-props
  // props.data.classes.sportrait = resBase64;
  // fileBase64.value = resBase64.split(",")[1];
  // user.value.sportrait = fileBase64.value;
  // imageUrl = fileBase64.value;
  // });
};

const sleep = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
};

const submit = (type: number) => {
  // 0表示提交表单
  if (type === 0) {
    user.value.modifyType = 0;
    // debug
    console.log(user.value);
    personalApi.updatePersonWitoutPict(user.value).then(res => {
      if (res.code === 0) {
        ElMessage.success("修改成功");
        sleep(2000);
        router.go(0);
      } else {
        ElMessage.error(res.msg);
      }
    });
  }
  // 1表示提交图片
  else if (type === 1) {
    user.value.modifyType = 1;
    user.value.sportrait = imageUrl;
    const data = new FormData();
    data.append("id", user.value.id);
    data.append("image", fileList.value[0].raw);
    // debug
    console.log(data);
    personalApi.updatePersonWithPict(data).then(res => {
      if (res.code === 0) {
        ElMessage.success("修改成功");
        sleep(500);
        router.go(0);
      } else {
        ElMessage.error(res.msg);
      }
    });
  }
  // personalApi.modifyPersonal(user.value).then(res => {
  //   if (res.code === 0) {
  //     ElMessage.success("修改成功");
  //     sleep(500);
  //     router.go(0);
  //   } else {
  //     ElMessage.error(res.msg);
  //   }
  // });
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    font-weight: bold;
    padding-top: 10px;
    font-size: 18px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
