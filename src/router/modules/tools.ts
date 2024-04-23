const Layout = () => import("@/layout/index.vue");

export default {
  path: "/tools",
  name: "小工具",
  component: Layout,
  redirect: "/tools/index",
  meta: {
    icon: "homeFilled",
    title: "小工具",
    rank: 0
  },
  children: [
    {
      path: "/tools/index",
      name: "批量上传图片",
      component: () => import("@/views/tools/index.vue"),
      meta: {
        title: "批量上传图片",
        roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;
