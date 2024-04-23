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

const chatInit = (id, toUserId) => {
  return http.get(
    userModuleUrlApi(`/chathistory/init?id=${id}&toUserId=${toUserId}`)
  );
};

const getChatHistory = (id, toUserId, page, limit) => {
  return http.get(
    userModuleUrlApi(
      `/chathistory/history?id=${id}&toUserId=${toUserId}&page=${page}&limit=${limit}`
    )
  );
};

export default {
  chatInit,
  getChatHistory
};
