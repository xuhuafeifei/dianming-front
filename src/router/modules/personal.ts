const Layout = () => import("@/layout/index.vue");

export default {
  path: "/personal",
  name: "个人信息",
  component: Layout,
  redirect: "/personal",
  meta: {
    icon: "material-symbols:info",
    title: "个人信息",
    rank: 0
  },
  children: [
    {
      path: "/personal",
      name: "个人信息",
      component: () => import("@/views/profile/index.vue"),
      meta: {
        title: "个人信息"
      }
    }
  ]
} as RouteConfigsTable;
