const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system",
  name: "系统管理",
  component: Layout,
  redirect: "/system/index",
  meta: {
    icon: "Setting",
    title: "系统管理",
    rank: 0
  },
  children: [
    {
      path: "/system/index",
      name: "试题列表",
      component: () => import("@/views/system/index.vue"),
      meta: {
        title: "试题列表"
      }
    },
    {
      path: "/system/form",
      name: "试题添加",
      component: () => import("@/views/system/formSave.vue"),
      meta: {
        title: "试题添加",
        roles: ["admin"]
      }
    },
    {
      path: "/system/formUpdate/:id",
      name: "试题修改",
      component: () => import("@/views/system/formUpdate.vue"),
      meta: {
        title: "试题修改",
        showLink: false,
        roles: ["admin"]
      }
    },
    {
      path: "/system/formSee/:id",
      name: "试题查看",
      component: () => import("@/views/system/formSee.vue"),
      meta: {
        title: "试题查看",
        showLink: false,
        roles: ["user"]
      }
    }
  ]
} as RouteConfigsTable;
