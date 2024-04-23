import ClassResult from "@/api/class";
import { defineStore } from "pinia";
import classApi from "@/api/class";
export const useClassStore = defineStore("class", {
  state: () => ({
    currentPage: 1,
    total: 0
  }),
  actions: {
    async fetchClassList(
      page: number,
      limit: number,
      sclass: string
    ): Promise<stuResult> {
      const data = await classApi.getList(page, limit, sclass);
      console.log(data);
      this.total = data.data.totalCount;
      return data;
    }
  }
});
