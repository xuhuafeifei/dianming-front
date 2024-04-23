const Layout = () => import("@/layout/index.vue");

export default {
  path: "/dian",
  name: "点名",
  component: Layout,
  redirect: "/attend",
  meta: {
    icon: "fad:random-1dice",
    title: "课堂点名",
    rank: 0
  },
  children: [
    {
      path: "/attend",
      name: "课堂点名",
      component: () => import("@/views/attend/index.vue"),
      meta: {
        isAuth: true,
        show: true,
        title: "课堂点名",
        roles: ["admin", "user"],
        Permissions: ["admin", "user"]
      }
    }
  ]
} as unknown as RouteConfigsTable;
