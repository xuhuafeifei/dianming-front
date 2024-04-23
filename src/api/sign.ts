import { http } from "@/utils/http";
import type { ResType } from "./types";
import {
  baseModuleUrlApi,
  baseModuleUrlApi,
  signModuleUrlApi,
  userModuleUrlApi
} from "./utils";

export interface R<T> {
  code: number;
  data: T;
  msg: string;
}

export type StuType = {
  length: any;
  id: number;
  sno: string;
  sclass: string;
  sname: string;
  label?: string;
  absent?: string;
  sportrait: string;
};
export type StuResult = ResType & {
  data: { list: StuType[] };
};

const getList = (page, limit, key) => {
  return http.request<R<any>>(
    "get",
    signModuleUrlApi(`/signup/list?page=${page}&limit=${limit}&key=${key}`)
  );
};

const getInfoById = id => {
  return http.request<R<any>>("get", signModuleUrlApi(`/signup/info/${id}`));
};

const save = data => {
  return http.request<R<any>>("post", signModuleUrlApi("/signup/save"), {
    data
  });
};

const deleteByIdList = data => {
  return http.request<R<any>>("delete", signModuleUrlApi("/signup/delete"), {
    data
  });
};

const signUpPict = (id, semId) => {
  return http.request<R<any>>(
    "get",
    signModuleUrlApi(`/signup/sign-up-pict?id=${id}&semId=${semId}`),
    // 一定要加, 否则axois会把二进制数据处理为json
    {
      responseType: "blob"
    }
  );
};

const getLinhua = () => {
  return http.request<R<any>>("get", signModuleUrlApi("/signup/get-linghua"));
};

export default {
  getList,
  getInfoById,
  save,
  deleteByIdList,
  signUpPict,
  getLinhua
};
