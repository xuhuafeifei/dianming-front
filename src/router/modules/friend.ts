const Layout = () => import("@/layout/index.vue");

export default {
  path: "/friend",
  name: "交友界面",
  component: Layout,
  redirect: "/friend",
  meta: {
    icon: "material-symbols:add-home",
    title: "交友界面",
    rank: 0
  },
  children: [
    {
      path: "/friend/list",
      name: "交友界面",
      component: () => import("@/views/friend/friendList.vue"),
      meta: {
        title: "交友界面"
        // roles: ["admin"]
      }
    },
    {
      path: "/friend/chat/:stuId",
      name: "聊天界面",
      component: () => import("@/views/friend/chat.vue"),
      meta: {
        title: "聊天界面"
        // roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;
