<template>
  <v-footer id="dashboard-core-footer">
    <v-container class="ma-0 pa-0">
      <v-row class="d-flex justify-end mb-1">
        <div class="body-1 font-weight-light pt-6 pt-md-0">
          &copy; 2021,
          <a href="http://www.coloredeer.com">COLOREDEER</a> 九色鹿网络
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "DashboardCoreFooter",

  data: () => ({})
};
</script>

<style lang="scss">
#dashboard-core-footer a {
  font-size: 0.825rem;
  font-weight: 800;
  color: rgb(39, 72, 182) !important;
  text-decoration: none;
  text-transform: uppercase;
}
</style>
