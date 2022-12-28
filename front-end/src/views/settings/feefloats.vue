<template>
  <v-container fluid class="px-8 py-0">
    <template v-slot:after-heading> </template>

    <v-divider class="mt-3" />

    <v-simple-table fixed-header class="pa-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-right">总楼层</th>
            <th class="text-right">1层</th>
            <th class="text-right">2层</th>
            <th class="text-right">3层</th>
            <th class="text-right">4层</th>
            <th class="text-right">5层</th>
            <th class="text-right">6层</th>
            <th class="text-right">7层</th>
            <th class="text-right">8层</th>
            <th class="text-right">9层</th>
            <th class="text-right">10层</th>
            <th class="text-right">11层</th>
            <th class="text-right">12层</th>
            <th class="text-right">13层</th>
            <th class="text-right">14层</th>
            <th class="text-right">15层</th>
            <th class="text-right">16层</th>
            <th class="text-right">17层</th>
            <th class="text-right">18层</th>
            <th class="text-right">19层</th>
            <th class="text-right">20层</th>
            <th class="text-right">21层</th>
            <th class="text-right">22层</th>
            <th class="text-right">23层</th>
            <th class="text-right">24层</th>
            <th class="text-right">25层</th>
            <!-- <th>26</th>
            <th>27</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in items" :key="row.index">
            <td
              class="mb-0 pb-2 pt-0 font-weight-light grey--text"
              style="font-size:12p4"
            >
              共 {{ index }} 层
            </td>
             <td v-for="r in row" :key="r" class="text-right">
               {{ r }}
             </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    
  </v-container>
</template>

<script>
import { fetchFeefloats } from "@/api/feefloats";


export default {
  name: "Feefloats",

  components: {},

  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,

    action: {
      color: "info",
      icon: "mdi-blur"
    },
    items: [],
    listQuery: {
      page: 1,
      limit: 100,
      name: undefined,
      status: undefined,
      sort: "+id"
    },
    // search: undefined,
    // userStatusOptions,
    circle: true,
    disabled: false,
    length: 10,
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    totalVisible: 10,
    total_pages: ""
  }),
  computed: {
    isAdminRole() {
      if (this.$store.getters.roles.includes("admin")) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.getList();
  },
  watch: {},
  methods: {
    getList() {
      this.listLoading = true;
      fetchFeefloats(this.listQuery).then(response => {
        this.items = response.data;
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx');

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    
    paginationChangeHandler(pageNumber) {
      this.listQuery.page = pageNumber;
      this.getList();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style lang="scss" scoped>

table,
thead,
tr {
  color: grey;
  font-weight: 400;
}

.background-transparent {
  background-color: transparent !important;
}

tr:hover {
  background-color: #0282b4 !important;
  color: rgb(224, 221, 221);
}

td {
  height: 20px !important;
  font-size: 15px !important;
  // color: #dac592 !important;
  color: rgb(8, 137, 243) !important;
  font-weight: 400;
  padding: 0 8px 0 10px !important;
  // margin: 0 !important;
}


</style>