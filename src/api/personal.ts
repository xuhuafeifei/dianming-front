import { http } from "@/utils/http";
import type { ResType } from "./types";
import { baseModuleUrlApi, baseModuleUrlApi, userModuleUrlApi } from "./utils";

export interface R<T> {
  code: number;
  data: T;
  msg: string;
}

const modifyPersonal = (data: object) => {
  return http.request<R<any>>(
    "post",
    userModuleUrlApi("/student/personal/update"),
    {
      data
    }
  );
};

const changePassword = (id, usedPassword, newPassword, secNewPassword) => {
  return http.request<R<any>>(
    "get",
    userModuleUrlApi(
      `/user/personal/password?id=${id}&usedPassword=${usedPassword}&newPassword=${newPassword}&secNewPassword=${secNewPassword}`
    )
  );
};

const saveStuWithPict = (data: Object) => {
  return http.request<R<any>>(
    "post",
    userModuleUrlApi("/student/save_with_pict"),
    {
      data,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

const saveStuWithoutPict = (data: Object) => {
  return http.request<R<any>>(
    "post",
    userModuleUrlApi("/student/save_without_pict"),
    {
      data
    }
  );
};

const updatePersonWitoutPict = (data: Object) => {
  return http.request<R<any>>(
    "post",
    userModuleUrlApi("/student/personal/update_without_pict"),
    {
      data
    }
  );
};

const updatePersonWithPict = (data: Object) => {
  return http.request<R<any>>(
    "post",
    userModuleUrlApi("/student/personal/update_with_pict"),
    {
      data,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export default {
  modifyPersonal,
  changePassword,
  saveStuWithPict,
  saveStuWithoutPict,
  updatePersonWitoutPict,
  updatePersonWithPict
};
