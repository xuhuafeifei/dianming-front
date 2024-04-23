import { http } from "@/utils/http";
import { ResType } from "./types";
import { baseUrlApi, examModuleUrlApi } from "./utils";
import { R } from "./class";

interface Repo {
  id: string;
  examId?: any;
  repoId: string;
  repoName: string;
  radioCount: number;
  radioScore: number;
  multiCount: number;
  multiScore: number;
  judgeCount: number;
  judgeScore: number;
  saqCount: number;
  saqScore: number;
}

const getRepoList = () => {
  return http.request<ResType<Repo>>(
    "get",
    examModuleUrlApi("/examrepo/listAll")
  );
};

const saveQu = data => {
  return http.request<R<any>>("post", examModuleUrlApi("/questions/saveQu"), {
    data
  });
};

const getQuById = id => {
  return http.request<R<any>>(
    "get",
    examModuleUrlApi(`/questions/info?id=${id}`)
  );
};

const clearStatus = () => {
  return http.request<R<any>>(
    "get",
    examModuleUrlApi("/questions/clearStatus")
  );
};

export default {
  getRepoList,
  saveQu,
  getQuById,
  clearStatus
};
