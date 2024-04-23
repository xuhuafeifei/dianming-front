<script setup lang="ts">
import { ref } from "vue";
import classApi from "@/api/class";
import { ElMessage } from "element-plus";

const fileList = ref([]);
const fileBase64 = ref();
const httpRequest = data => {
  // 调用转方法base64
  // getBase64(data.file).then((resBase64: string) => {
  //   // eslint-disable-next-line vue/no-mutating-props
  //   // props.data.classes.sportrait = resBase64;
  //   fileBase64.value = resBase64.split(",")[1];
  //   fileList.value.push({
  //     base64: fileBase64.value,
  //     fileName: data.file.name
  //   });
  // });
  console.log(data);
  fileList.value.push(data.file);
};
// 转base64码
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file);
    // 开始转
    reader.onload = () => {
      fileResult = reader.result as string;
    };
    // 转 失败
    reader.onerror = error => {
      reject(error);
    };
    // 转 结束
    reader.onloadend = () => {
      resolve(fileResult);
    };
  });
};

const submit = async () => {
  // 创建formData
  console.log("图片上传服务器");
  const data = new FormData();
  for (let i = 0; i < fileList.value.length; ++i) {
    data.append("images", fileList.value[i]);
  }
  await classApi.uploadImg(data).then(res => {
    console.log(res);
    if (res.code === 0) {
      ElMessage.success("上传成功");
    } else {
      ElMessage.error("上传失败:", res.msg);
    }
  });
};
</script>

<template>
  <div>
    <el-upload
      accept=".jpg, .jpeg, .png"
      multiple
      :file-list="fileList"
      :http-request="httpRequest"
    >
      <ElButton>选择图片</ElButton>
      <template #tip>
        <div class="el-upload__tip">
          只能上传图片,且单张图片大小不能超过10MB,暂时无法上传
        </div>
      </template>
    </el-upload>
    <ElButton @click="submit">上传服务器</ElButton>
  </div>
</template>

<style scoped></style>
