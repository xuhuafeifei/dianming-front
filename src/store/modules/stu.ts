import { defineStore } from "pinia";
import classApi from "@/api/class";
export const useStuStore = defineStore("stu", {
  state: () => ({
    total: 0,
    data: []
  }),
  actions: {
    async fetchStuList() {
      const data = await classApi.listStus();
      this.total = data.data.length;
      this.data = data.data;
      return data;
    }
  }
});
