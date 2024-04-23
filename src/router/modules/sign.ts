const Layout = () => import("@/layout/index.vue");

export default {
  path: "/sign",
  name: "签到管理",
  component: Layout,
  redirect: "/sign",
  meta: {
    icon: "material-symbols:add-home",
    title: "签到管理",
    rank: 0
  },
  children: [
    {
      path: "/term/modify",
      name: "学期管理",
      component: () => import("@/views/sign/termschedule.vue"),
      meta: {
        title: "学期管理",
        roles: ["admin"]
      }
    },
    {
      path: "/sign/modify",
      name: "签到信息管理",
      component: () => import("@/views/sign/signup.vue"),
      meta: {
        title: "签到信息管理",
        roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;
