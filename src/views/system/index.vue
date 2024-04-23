<template>
  <div>
    <el-card
      class="relative pb-12 box-border"
      element-loading-svg-view-box="-10, -10, 50, 50"
      v-loading="false"
      element-loading-background="rgba(0, 0, 0, 0.4)"
    >
      <el-card>
        <el-row :gutter="10">
          <el-col :span="8">
            <!-- <el-row>
              <el-col>
                <el-button type="primary" @click="handleCreate"
                  >+ 添加</el-button
                >
              </el-col>
            </el-row>
 -->
            <!-- <el-input v-model="search">
              <template #prepend>
                <el-select
                  v-model="selectValue"
                  style="width: 100px"
                  placeholder="请选择"
                >
                  <el-option label="学生id" value="1" />
                  <el-option label="学生学号" value="2" />
                  <el-option label="学生姓名" value="3" />
                </el-select>
              </template>
              <template #append>
                <el-button @click="handleSearch">
                  <IconifyIconOnline
                    icon="material-symbols:search-rounded"
                    width="20px"
                    height="20px"
                /></el-button>
              </template>
            </el-input> -->
          </el-col>
          <el-col :span="4" />
        </el-row>
      </el-card>
      <el-table
        id="oIncomTable"
        :data="titleTable"
        row-key="id"
        stripe
        border
        resizable
        highlight-current-row
        fit
        style="width: 100%"
        ref="titleForm"
      >
        <!-- <el-table-column
          align="center"
          prop="id"
          label="序号"
          width="70"
          size="large"
        /> -->
        <el-table-column
          prop="quType"
          label="题目类型"
          width="170xp"
          :formatter="formatQuType"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="content"
          label="题目内容"
          width="480xp"
        />
        <el-table-column prop="createTime" label="创建时间" width="180xp" />
        <el-table-column width="100xp" label="操作">
          <template #default="scope">
            <el-button type="primary" @click="updateQu(scope.row)">{{
              buttomName
            }}</el-button>
          </template>
        </el-table-column>
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
      </el-table>
      <el-pagination
        small
        background
        :total="titleStore.total"
        v-model:current-page="titleStore.currentPage"
        @current-change="renderTitleTable(titleStore.currentPage)"
        layout="prev, pager, next"
        class="absolute right-20 bottom-4"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import titleApi from "@/api/title";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
import { useTitleStore } from "@/store/modules/title";
import { useRoute, useRouter } from "vue-router";
const titleTable = ref([]);
const route = useRoute();
const router = useRouter();
const fileList = ref([]);
const selectValue = ref("");

// 分页
const titleStore = useTitleStore();
const titleForm = ref();
// drawer
const textVisiable = ref(false);
const isConfirm = ref(null);

const handleClose = done => {
  isConfirm.value = null;
  console.log(isConfirm.value);
  done();
};

onMounted(async () => {
  await renderTitleTable(titleStore.currentPage);
  // 获取当前用户的身份
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  console.log(user.roles);
  console.log(user.roles.includes("admin"));

  if (user.roles.includes("admin")) {
    buttomName = "修改";
  } else if (user.roles.includes["user"]) {
    buttomName = "查看";
  }
});

const updateQu = row => {
  console.log(row);
  // 跳转router
  if (buttomName === "修改") {
    router.push(`/system/formUpdate/${row.id}`);
  } else if (buttomName === "查看") {
    router.push(`/system/formSee/${row.id}`);
    // 显示题目
  }
};

const repoId = 1;
const loading = ref(true);
let buttomName = "查看";

const renderTitleTable = async (page: number) => {
  console.log("start to getList...");
  loading.value = true;
  const data = await titleStore.fetchTitleList(page, 10, repoId);
  titleTable.value = data.data.list;
  loading.value = false;
};

// 路由跳转到添加题目界面
const handleCreate = () => {
  router.push("system/form");
};

// 性别数据转换
const formatQuType = row => {
  return row.quType === 1 ? "单选题" : row.quType === 1 ? "多选题" : "判断题";
};
</script>

<style scoped></style>
