import { http } from "@/utils/http";
import type { ResType } from "./types";
import { baseUrlApi, examModuleUrlApi } from "./utils";

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
const getList = async (page: number, limit: number, repoId: number) => {
  return await http.request<R<any>>(
    "get",
    examModuleUrlApi(
      `/questions/listQu?page=${page}&limit=${limit}&repoId=${repoId}`
    )
  );
};
const getRandomExam = async (repoId: string) => {
  return await http.request<R<any>>(
    "get",
    examModuleUrlApi(`/questions/randomQu?repoId=${repoId}`)
  );
};
export default {
  getList,
  getRandomExam
};
