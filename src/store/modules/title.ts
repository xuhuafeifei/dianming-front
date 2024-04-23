import { defineStore } from "pinia";
import titleApi from "@/api/title";
import { R } from "@/api/class";
export const useTitleStore = defineStore("title", {
  state: () => ({
    currentPage: 1,
    total: 0,
    data: []
  }),
  actions: {
    async fetchTitleList(
      page: number,
      limit: number,
      repoId: number
    ): Promise<R<any>> {
      const data = await titleApi.getList(page, limit, repoId);
      this.total = data.data.totalCount;
      this.data = data.data;
      return data;
    }
  }
});
