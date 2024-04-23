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
    signModuleUrlApi(
      `/termschedule/list?page=${page}&limit=${limit}&key=${key}`
    )
  );
};

const getInfoById = id => {
  return http.request<R<any>>(
    "get",
    signModuleUrlApi(`/termschedule/info/${id}`)
  );
};

const save = data => {
  return http.request<R<any>>("post", signModuleUrlApi("/termschedule/save"), {
    data
  });
};

const deleteByIdList = data => {
  return http.request<R<any>>(
    "delete",
    signModuleUrlApi("/termschedule/delete"),
    {
      data
    }
  );
};

export default {
  getList,
  getInfoById,
  save,
  deleteByIdList
};
