import { http } from "@/utils/http";
import type { ResType } from "./types";
import { baseModuleUrlApi, baseModuleUrlApi, userModuleUrlApi } from "./utils";

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

const getList = async (page: number, limit: number, sclass: string) => {
  return await http.request<StuResult>(
    "get",
    userModuleUrlApi(
      `/student/list?page=${page}&limit=${limit}&sclass=${sclass}`
    )
  );
};
const edit = async (data): Promise<ResType> => {
  return http.request<ResType>("post", userModuleUrlApi("/student/save"), {
    data
  });
};
const create = async (data): Promise<ResType> => {
  return http.request<ResType>("post", userModuleUrlApi("/student/save"), {
    data
  });
};
const deleteStus = async data => {
  // data = JSON.parse(data);
  return http.post(userModuleUrlApi("/student/delete"), { data });
};
export const listStus = () => {
  return http.request<R<StuType>>("get", userModuleUrlApi("/student/listAll"));
};
const uploadExcel = data => {
  return http.request<R<any>>(
    "post",
    userModuleUrlApi("/student/upload/excel"),
    {
      data
    }
  );
};
const uploadImg = async (data: string[]) => {
  console.log(data);

  return http.request<R<any>>(
    "post",
    userModuleUrlApi("/student/uploadImages"),
    {
      data,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
const listById = (id: string, sclass: string) => {
  return http.get(userModuleUrlApi(`/student/list?sclass=${sclass}&id=${id}`));
};
const listByName = (sname: string, sclass: string) => {
  return http.get(
    userModuleUrlApi(`/student/list?sclass=${sclass}&sname=${sname}`)
  );
};
const listBySno = (sno: string, sclass: string) => {
  return http.get(
    userModuleUrlApi(`/student/list?sclass=${sclass}&sno=${sno}`)
  );
};
const lockStu = (id: string) => {
  return http.get(userModuleUrlApi(userModuleUrlApi(`/student/lock?id=${id}`)));
};
export default {
  getList,
  edit,
  create,
  listStus,
  deleteStus,
  uploadExcel,
  uploadImg,
  listById,
  listByName,
  listBySno,
  lockStu
};
