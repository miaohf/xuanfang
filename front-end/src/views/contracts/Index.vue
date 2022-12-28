<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" />

    <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" />

    <dashboard-core-view />

    <dashboard-core-settings v-model="expandOnHover" />
  </v-app>
</template>

<script>
export default {
  name: "DashboardIndex",

  components: {
    DashboardCoreAppBar: () => import("../base/components/core/AppBar"),
    DashboardCoreDrawer: () => import("../base/components/core/Drawer"),
    DashboardCoreView: () => import("../base/components/core/View")
  },

  data: () => ({
    expandOnHover: false
  })
};
</script>
