<template>
  <div>
    <el-card
      class="relative pb-12 box-border"
      element-loading-svg-view-box="-10, -10, 50, 50"
      v-loading="false"
      :element-loading-svg="svg"
      element-loading-background="rgba(0, 0, 0, 0.4)"
    >
      <el-card>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input v-model="search">
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
            </el-input>
          </el-col>
          <el-col :span="2"
            ><el-button type="success" @click="handleCreate"> 新增 </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              v-if="!multipleSelection"
              type="danger"
              @click="multipleSelection = true"
            >
              批量删除
            </el-button>

            <el-button-group v-if="multipleSelection">
              <el-button @click="multipleSelection = false">取消</el-button>
              <el-button type="danger" @click="handleDelete(deleteList)">
                确认删除
              </el-button>
            </el-button-group>
          </el-col>
          <el-col :span="4" />
          <el-col :span="2">
            <el-upload
              class="upload"
              action="#"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="beforeUpload"
              :limit="1"
              :on-success="handleSuccess"
              :file-list="fileList"
            >
              <el-button type="primary">Excel导入</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog v-model="showExcelDialog">
        <!-- <input
          type="file"
          accept=".xls,.xlsx"
          class="upload-file"
          @change="changeExcel($event)"
        /> -->
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          accept=".xls,.xlsx"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="handleExcel"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">选择excel文件</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload()">
            上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip text-red">
              限制1个文件,新文件会覆盖旧文件
            </div>
          </template>
        </el-upload>
      </el-dialog>
      <el-table
        id="oIncomTable"
        :data="classTable"
        row-key="id"
        stripe
        border
        resizable
        highlight-current-row
        fit
        style="width: 100%"
        @expand-change="handleExpand"
        :expand-row-keys="expands"
        @selection-change="getSelectionRows"
        ref="classForm"
      >
        <el-table-column
          align="center"
          v-if="multipleSelection"
          type="selection"
          width="55"
        />
        <el-table-column
          width="55"
          v-if="!multipleSelection"
          label="#"
          type="expand"
        >
          <template #default="props">
            <Motion>
              <div class="flex flex-col items-center">
                <h1 class="mb-8">{{ props.row.className }}</h1>
                <div class="flex justify-center gap-8 w-9/12 flex-wrap">
                  <el-image
                    :src="props.row.sportrait"
                    class="h-40 object-contain"
                    :preview-src-list="getUserSportraitList(props.row)"
                  />
                  <div class="max-w-lg mb-6">
                    <div>
                      {{
                        props.row.label
                          ? props.row.label
                          : "该学生很低调，没有个性签名"
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </Motion>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="序号"
          width="70"
          size="large"
        />
        <el-table-column prop="sclass" label="班级" />
        <el-table-column prop="sno" label="学号" />
        <el-table-column prop="sname" label="姓名" />
        <el-table-column sortable prop="label" width="200" label="签名" />
        <el-table-column sortable prop="absent" label="缺勤次数" />
        <el-table-column width="140">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <edit-dialog
        v-if="showDialog"
        :show="showDialog"
        :data="editData"
        @close="onDialogClose"
        @confirm="handleConfirm"
      />
      <el-pagination
        small
        background
        :total="classStore.total"
        v-model:current-page="classStore.currentPage"
        @current-change="renderclassTable(classStore.currentPage)"
        layout="prev, pager, next"
        class="absolute right-20 bottom-4"
      />
      <div>
        <!-- <div>
          <el-upload
            class="upload"
            action="#"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :limit="1"
            :on-success="handleSuccess"
            :file-list="fileList"
          >
            <el-button size="large" type="primary">Excel导入</el-button>
          </el-upload>
        </div> -->
        <div>
          <!-- <el-upload
            v-model:file-list="fileList"
            accept=".jpg, .jpeg, .png"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :http-request="httpRequest"
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
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="预览图片" />
          </el-dialog> -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import Motion from "./utils/motion";
// import { classCreateRequest, classType } from "@/api/class";
import classApi from "@/api/class";
// import { ElButton, ElTable, ElTableColumn } from "element-plus";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
import { useEditDialog } from "@/hooks/useEditDialog";
import editDialog from "./edit.vue";
import { message } from "@/utils/message";
import { useClassStore } from "@/store/modules/class";
import { svg } from "./utils/loadingSvg";
// import FileSaver from "file-saver";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx"; // vue3可用此引入
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { genFileId } from "element-plus";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile
} from "element-plus";
import { log } from "console";
import router from "@/router";

defineOptions({
  name: "Class"
});
const { proxy } = getCurrentInstance();
const classTable = ref([]);
const route = useRoute();
const sclass = route.name.toString();
const showExcelDialog = ref(false);
const fileList = ref([]);
const tableData = ref([]);
const selectValue = ref("");

onMounted(async () => {
  await renderclassTable(classStore.currentPage);
});
const getUserSportraitList = user => {
  return [user.sportrait];
};
const loading = ref(true);
const renderclassTable = async (page: number) => {
  loading.value = true;
  const data = await classStore.fetchClassList(page, 10, sclass);
  classTable.value = data.data.list;
  loading.value = false;
};
const search = ref("");
// 简单筛选
// 增加或修改
const handleSearch = () => {
  console.log("selectValue: ", selectValue.value);
  // 重新刷新界面
  if (
    search.value === null ||
    search.value === undefined ||
    search.value === ""
  ) {
    router.go(0);
    return;
  }
  console.log(search.value);
  if (selectValue.value === "1") {
    classApi.listById(search.value, sclass).then(res => {
      if (res.code === 0) {
        classTable.value = res.data.list;
        ElMessage.success("查询成功");
      } else {
        ElMessage.error("查询失败", res.msg);
      }
    });
  } else if (selectValue.value === "2") {
    classApi.listBySno(search.value, sclass).then(res => {
      if (res.code === 0) {
        classTable.value = res.data.list;
        ElMessage.success("查询成功");
      } else {
        ElMessage.error("查询失败", res.msg);
      }
    });
  } else if (selectValue.value === "3") {
    classApi.listByName(search.value, sclass).then(res => {
      if (res.code === 0) {
        classTable.value = res.data.list;
        ElMessage.success("查询成功");
      } else {
        ElMessage.error("查询失败", res.msg);
      }
    });
  }
};
const {
  handleCreate,
  handleEdit,
  showDialog,
  onDialogClose,
  handleConfirm,
  editData
} = useEditDialog<stuType, stuCreateRequest>(classApi, "学生");
// 批量删除
const classForm = ref();
const multipleSelection = ref(false);
let deleteList = [];
const getSelectionRows = val => {
  deleteList = [];
  val.forEach(item => {
    deleteList.push(item.id);
  });
};
// 下拉表格
const expands = ref([]);
const handleExpand = async (row, expandedRows) => {
  expands.value = [];
  if (expandedRows.length > 0) {
    row ? expands.value.push(row.id) : "";
  }
};
// 单独删除
const handleDelete = async (id: []) => {
  if (typeof id === "string") {
    id = [id];
  }
  // 删除逻辑
  classApi.deleteStus(id).then(res => {
    console.log(res);
    if (res.code === 0) {
      ElMessage.success("删除成功");
      renderclassTable(classStore.currentPage);
    } else {
      ElMessage.error("删除失败");
    }
  });
};
// 分页
const classStore = useClassStore();
// 上传文件的对话框是否可见
// const uploadDialogVisiable = ref(false);
// // 将el-table转excel下载至本地
// const exportToExcel = () => {
//   // 检验是否导入成功
//   // console.log('XLSX',XLSX,FileSaver)
//   // 使用 this.$nextTick 是在dom元素都渲染完成之后再执行
//   proxy.$nextTick(function () {
//     // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
//     const xlsxParam = { raw: true };
//     const wb = XLSX.utils.table_to_book(
//       document.querySelector("#oIncomTable"),
//       xlsxParam
//     );
//     // 导出excel文件名
//     const fileName = "class" + new Date().getTime() + ".xlsx";
//     const wbout = XLSX.write(wb, {
//       bookType: "xlsx",
//       bookSST: true,
//       type: "array"
//     });
//     try {
//       // 下载保存文件
//       FileSaver.saveAs(
//         new Blob([wbout], { type: "application/octet-stream" }),
//         fileName
//       );
//     } catch (e) {
//       if (typeof console !== "undefined") {
//         console.log(e, wbout);
//       }
//     }
//     return wbout;
//   });
// };
// 处理excel上传

const transformExcel = f => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      let data = [];
      const { result } = e.target;
      try {
        // 以二进制流读取整份Excel表格对象
        const workbook = XLSX.read(result, { type: "binary" });

        // 遍历工作表进行读取（默认是第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook?.Sheets?.hasOwnProperty(sheet)) {
            // 处理好的数据
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );
          }
        }
      } catch (err) {
        ElMessage.error("文件类型不正确");
        return;
      }
      // 最终的结果
      resolve(data);
    };
    // 以二进制的方式打开
    reader.readAsBinaryString(f);
  });
};

const sleep = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
};

const beforeUpload = async fiel => {
  // 返回处理后的结果
  const res = await transformExcel(fiel);
  console.log(res);
  await classApi.uploadExcel(res).then(res => {
    console.log(res);
    if (res.code === 0) {
      ElMessage.success("添加成功");
    } else {
      ElMessage.error("添加失败 : " + res.msg);
    }
  });
  // await sleep(500);
  // router.go(0);
};

const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  console.log(fileList);
};
</script>

<style scoped></style>
