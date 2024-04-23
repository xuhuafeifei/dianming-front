import { ref } from "vue";
import type { Ref } from "vue";
// import type { CellData } from "tdesign-vue-next";
import { ElMessage } from "element-plus";
import type { Editable } from "@/api/types";
import { ResType } from "@/api/types";

export const useEditDialog = <T extends { id: string }, R>(
  api: Editable<R, T>,
  modelLabel = ""
) => {
  const showDialog = ref(false);
  const editData = <Ref<null | T>>ref(null);
  const handleCreate = () => {
    isEdit.value = false;
    showDialog.value = true;
  };

  const isEdit = ref(false);
  const handleEdit = item => {
    isEdit.value = true;
    console.log(item);
    editData.value = item;
    showDialog.value = true;
    return isEdit.value;
  };

  const handleConfirm = async (data: R) => {
    console.log(data);

    if (editData.value && editData.value.id) {
      const res = (await api.edit(data)) as ResType;
      if (res.code === 0) {
        await ElMessage.success(`${modelLabel}编辑成功`);
      } else {
        await ElMessage.error(res.msg);
      }
    } else {
      const res = (await api.create(data)) as ResType;
      if (res.code === 0) {
        await ElMessage.success(`${modelLabel}创建成功`);
      } else {
        await ElMessage.error(res.msg);
      }
    }
    onDialogClose();
  };

  const onDialogClose = () => {
    showDialog.value = false;
    editData.value = null;
  };
  return {
    showDialog,
    editData,
    handleCreate,
    handleEdit,
    onDialogClose,
    handleConfirm
  };
};
