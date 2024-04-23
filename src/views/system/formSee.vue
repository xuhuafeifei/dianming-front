<script setup lang="ts">
import { ref, reactive, onMounted, Ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import router from "@/router";
import questApi from "@/api/quest";
import { getBase64 } from "@/utils/switchBase64";
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();
//form实例
const postFormRef = ref<FormInstance>();
type QuForm = {
  quType: number;
  level: number;
  content: string;
  image: string;
  repoIds: number[];
  analysis: string;
  tagList: string[];
};
const postForm: Ref<QuForm> = ref({
  quType: 1,
  level: 1,
  content: "",
  image: "",
  repoIds: [],
  analysis: "暂无",
  tagList: []
});

type selectOption = {
  value: number;
  label: string;
};
type AnswerForm = { isRight: boolean; content: string; analysis: string };
const answerList: Ref<AnswerForm> = ref([]);

type QuFormDto = QuForm & {
  answerList: AnswerForm[];
};
let quFormDto: QuFormDto = {};

// 所有题目类型
const quTypes: selectOption[] = [
  {
    value: 1,
    label: "单选题"
  },
  {
    value: 2,
    label: "多选题"
  },
  {
    value: 3,
    label: "判断题"
  }
];
// 所有题目等级
const quLevels: selectOption[] = [
  {
    value: 1,
    label: "简单题"
  },
  {
    value: 2,
    label: "中等题"
  },
  {
    value: 3,
    label: "困难题"
  }
];
// 选择属于哪个题库
const quFaRepo: Ref<selectOption[]> = ref([]);
onMounted(async () => {
  const data = (await questApi.getRepoList()).data;
  data.forEach(item => {
    const obj = { label: item.repoName, value: Number(item.repoId) };
    quFaRepo.value.push(obj);
  });
  const id = route.params.id;
  const res = await questApi.getQuById(id);

  postForm.value = res.data;
  // debug
  // console.log(postForm.value);
  answerList.value = postForm.value.answerList;
  postForm.value.repoIds = [1];
  console.log(answerList.value);
});

const removeItem = index => {
  answerList.value.splice(index, 1);
};

// 题目图片
const httpRequest = (data, e: QuForm | AnswerForm) => {
  // 调用转方法base64
  getBase64(data.file).then((resBase64: string) => {
    // eslint-disable-next-line vue/no-mutating-props
    // props.data.classes.sportrait = resBase64;
    postForm.value.image = resBase64.split(",")[1];
  });
};
const quTypeDisabled = ref(true);
const itemImage = ref(true);

const rules = reactive<FormRules>({
  content: [{ required: true, message: "题目内容不能为空！", trigger: "blur" }],

  quType: [{ required: true, message: "题目类型不能为空！" }],

  level: [{ required: true, message: "必须选择难度等级！" }],

  repoIds: [{ required: true, message: "至少要选择一个题库！" }]
});

// 添加子项
const handleAdd = () => {
  console.log(postForm);
  answerList.value.push({ isRight: false, content: "", analysis: "" });
};

const submitForm = (formEl: FormInstance | undefined) => {
  console.log(postForm);

  let rightCount = 0;

  answerList.value.forEach(function (item) {
    if (item.correct) {
      rightCount += 1;
    }
  });

  if (postForm.value.quType === 1) {
    if (rightCount !== 1) {
      ElMessage({
        message: "单选题答案只能有一个",
        type: "warning"
      });

      return;
    }
  }

  if (postForm.value.quType === 2) {
    if (rightCount < 2) {
      ElMessage({
        message: "多选题至少要有两个正确答案！",
        type: "warning"
      });

      return;
    }
  }

  if (postForm.value.quType === 3) {
    if (rightCount !== 1) {
      ElMessage({
        message: "判断题只能有一个正确项！",
        type: "warning"
      });

      return;
    }
  }

  formEl.validate(valid => {
    if (valid) {
      console.log("okk");
    } else {
      console.log("no okk");
    }
    // console.log(answerList);
    // console.log(postForm);
    // quFormDto.push({ ...answerList, ...postForm });
    quFormDto = postForm;
    quFormDto.answerList = answerList;

    console.log(postForm);
    console.log(answerList);
    console.log(quFormDto.value);

    // 发送请求
    questApi.saveQu(JSON.stringify(quFormDto.value)).then(res => {
      if (res.code === 0) {
        ElMessage.success("保存成功");
      } else {
        ElMessage.error("保存失败:" + res.msg);
      }
    });
    quFormDto = {};
  });
  // TODO: 规则检验
  // postForm.validate(valid => {
  //   if (!valid) {
  //     return;
  //   }

  //   saveData(postForm).then(response => {
  //     postForm = response.data;
  //     ElMessage({
  //       message: "试题保存成功！",
  //       type: "success",
  //       duration: 2000
  //     });

  //     router.push({ name: "ListQu" });
  //   });
  // });
};

const onCancel = () => {
  router.push({ name: "ListQu" });
};
</script>

<template>
  <div class="app-container">
    <el-form
      ref="postFormRef"
      :rules="rules"
      :model="postForm"
      label-position="left"
      label-width="150px"
    >
      <el-card>
        <el-form-item label="题目类型 " prop="quType">
          <el-select
            v-model="postForm.quType"
            :disabled="quTypeDisabled"
            class="filter-item"
            placeholder="选择题目类型"
          >
            <el-option
              v-for="item in quTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              disabled
            />
          </el-select>
        </el-form-item>
        <el-form-item label="难度等级 " prop="level">
          <el-select v-model="postForm.level" class="filter-item" disabled>
            <el-option
              v-for="item in quLevels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              disabled
            />
          </el-select>
        </el-form-item>

        <el-form-item label="归属题库" prop="repoIds">
          <el-select
            multiple
            v-model="postForm.repoIds"
            class="filter-item"
            disabled
          >
            <el-option
              v-for="item in quFaRepo"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              disabled
            />
          </el-select>
        </el-form-item>

        <el-form-item label="题目内容" prop="content">
          <el-input v-model="postForm.content" type="textarea" disabled />
        </el-form-item>

        <el-form-item label="试题图片">
          <el-upload
            :limit="1"
            accept=".jpg, .jpeg, .png"
            :http-request="e => httpRequest(e, postForm.image)"
          >
            <el-button type="primary" disabled>Click to upload</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="整题解析" prop="oriPrice" disabled>
          <el-input
            v-model="postForm.analysis"
            :precision="1"
            :max="999999"
            type="textarea"
            diabled
          />
        </el-form-item>
      </el-card>

      <div class="filter-container" style="margin-top: 25px">
        <el-button
          class="filter-item"
          type="primary"
          size="small"
          @click="handleAdd"
          disabled
        >
          + 添加
        </el-button>

        <el-table :data="answerList" :border="true" style="width: 100%">
          <el-table-column label="是否答案" width="120" align="center" disabled>
            <template v-slot="scope">
              <el-checkbox v-model="scope.row.correct" readonly
                >答案</el-checkbox
              >
            </template>
          </el-table-column>

          <el-table-column
            v-if="itemImage"
            label="选项图片"
            width="120px"
            align="center"
            disabled
          >
            <template v-slot="scope">
              <el-upload
                :limit="1"
                accept=".jpg, .jpeg, .png"
                :http-request="httpRequest"
              >
                <el-button disabled>选择</el-button>
              </el-upload>
            </template>
          </el-table-column>

          <el-table-column label="答案内容">
            <template v-slot="scope">
              <el-input v-model="scope.row.content" type="textarea" disabled />
            </template>
          </el-table-column>

          <el-table-column label="答案解析">
            <template v-slot="scope">
              <el-input v-model="scope.row.analysis" type="textarea" disabled />
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="100px">
            <template v-slot="scope">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="removeItem(scope.$index)"
                disabled
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="margin-top: 20px">
        <el-button type="primary" @click="submitForm(postFormRef)" disbaled
          >保存</el-button
        >
        <el-button type="info" @click="onCancel">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped></style>
