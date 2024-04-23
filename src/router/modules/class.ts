const Layout = () => import("@/layout/index.vue");

export default {
  path: "/class",
  name: "数科21级",
  component: Layout,
  redirect: "/class/ds2101",
  meta: {
    icon: "material-symbols:add-home",
    title: "数科21级",
    rank: 0
  },
  children: [
    {
      path: "/class/ds21",
      name: "数科",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科所有班级",
        roles: ["admin"]
      }
    },
    {
      path: "/class/ds2101",
      name: "数科2101班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2101班",
        roles: ["admin"]
      }
    },
    {
      path: "/class/ds2102",
      name: "数科2102班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2102班",
        roles: ["admin"]
      }
    },
    {
      path: "/class/ds2103",
      name: "数科2103班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2103班",
        roles: ["admin"]
      }
    },
    {
      path: "/class/ds2104",
      name: "数科2104班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2104班",
        roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;
