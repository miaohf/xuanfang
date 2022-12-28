<template>
  <v-container fluid class="px-10 py-4">
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-space-between mx-1 mb-0">
      <v-col cols="9" md="9">
        <v-select
          v-model="listQuery.status"
          :items="statusOptions"
          item-text="display_name"
          item-value="key"
          menu-props="auto"
          hide-details
          label="结算状态"
          single-line
          style="max-width: 120px;"
        ></v-select>
      </v-col>

      <v-col cols="3" md="3">
        <v-btn @click="getList" color="primary" class="mx-3">
          查询
          <v-icon right>mdi-magnify</v-icon>
        </v-btn>
        <v-btn @click="resetQuery" color="primary" class="mx-3">
          重置
          <v-icon right>mdi-lock-reset</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- <v-divider class="mt-3" /> -->
    <v-alert
      :value="alert"
      color="red"
      dark
      border="top"
      icon="mdi-bell"
      transition="scale-transition"
    >
      {{ alert_text }}
    </v-alert>
    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>编号</th>
            <th>户主姓名</th>
            <th>面积1</th>
            <th>面积2</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td class="grey--text" style="font-size:11px">
              {{ row.id }}
            </td>
            <td class="grey--text" style="font-size:11px">
              {{ row.sequence }}
            </td>
            <td class="grey--text" style="font-size:11px">
              {{ row.customer }}
            </td>
            <td class="grey--text" style="font-size:11px">
              {{ row.customer_population_area }}
            </td>
            <td class="grey--text" style="font-size:11px">
              {{ row.customer_property_area }}
            </td>
            <td class="grey--text" style="font-size:11px">
              {{ row.customer }}
            </td>
            <td class="grey--text" style="font-size:11px">
              <v-btn
                :color="printer.single.color"
                icon
                fab
                x-small
                @click="handlePrintBill(row)"
              >
                <v-icon v-text="printer.single.icon" />
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div class="text-center">
      <v-row justify="center" align="center">
        <v-pagination
          v-model="listQuery.page"
          :circle="circle"
          :disabled="disabled"
          :length="total_pages"
          :next-icon="nextIcon"
          :prev-icon="prevIcon"
          :total-visible="totalVisible"
          :value="listQuery.page"
          @input="paginationChangeHandler"
        ></v-pagination>
        <!-- <span>共{{total_pages}}页</span> -->
      </v-row>
    </div>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { fetchBills } from "@/api/bills";

const statusOptions = [
  { key: 0, display_name: "空闲" },
  { key: 1, display_name: "已选" },
  { key: 9, display_name: "剔除" }
];

export default {
  name: "Bills",

  components: {},

  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,
    alert: false,
    alert_text: "",
    printer: {
      single: {
        color: "blue",
        icon: "mdi-printer"
      },
      batch: {
        color: "secondary",
        icon: "mdi-printer"
      },
      pay: {
        color: "green",
        icon: "mdi-cash-usd"
      }
    },
    action: {
      color: "info",
      icon: "mdi-message-text"
    },
    exportItems: [],
    items: [],
    listQuery: {
      page: 1,
      limit: 10,
      sort: "+id"
    },
    search: undefined,
    awaitingSearch: false,
    circle: true,
    disabled: false,
    length: 10,
    greenColor: "rgb(81, 185, 116)",
    blankColor: "rgb(90, 90, 90)",
    redColor: "rgb(231, 111, 111)",
    starColor: "rgb(240, 70, 70)",
    orangeColor: "rgb(247, 172, 11)",
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    totalVisible: 10,
    total_pages: 0,
    statusOptions,
    exportFields: {
      序号: "id",
      小区或地块: "garden",
      楼幢: "building",
      单元: "unit",
      门牌: "number",
      楼层: "floor",
      状态: "status",
      面积: "area",
      自行车库: "sub_area",

      号箱: "box_name",
      号箱描述: "box_description",
      户型类别: "house_type",
      创建日期: "create_time"
      // "Telephone 2": {
      //   field: "phone.landline",
      //   callback: value => {
      //     return `Landline Phone - ${value}`;
      //   }
      // }
    }
  }),

  computed: {
    isAdminRole() {
      // console.log("roles: ", this.$store.getters.roles);
      if (this.$store.getters.roles.includes("administrator")) {
        return true;
      } else {
        return false;
      }
    }
  },

  created() {
    this.getList();
  },
  watch: {
    // search: function (val) {
    //   if (!this.awaitingSearch) {
    //     setTimeout(() => {
    //       this.getList()
    //       this.awaitingSearch = false
    //     }, 1500); // 1 sec delay
    //   }
    //   this.awaitingSearch = true
    //   console.log('this.listQuery.status:', this.listQuery.status)
    // },
  },
  methods: {
    getQuery() {
      setTimeout(() => this.getList(), 500);
    },
    // changed() {
    //   console.log(
    //     this.listQuery.isAudioBook
    //   )
    // },

    getList() {
      console.log("xxxx");
      this.listLoading = true;
      this.listQuery.limit = 10;
      var query_params = { customer_id: this.$route.params.id };
      fetchBills(query_params).then(response => {
        this.items = response.data.items;
        this.total_pages = response.data._meta.total_pages;
        console.log(this.items);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    handlePrintBill(row) {
      this.$router.push({
        name: "打印结算单",
        params: { id: row.id }
      });
    },

    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 10,
        sort: "+id"
      };
      this.getList();
    },

    // removeLabel(row) {
    //   this.$confirm("确认删除房源资料?").then(res => {
    //     if (res) {
    //       deleteLabel(row.id).then(response => {
    //         if (response.data.error) {
    //           this.alert_text = response.data.error;
    //           this.alert = true;
    //         } else {
    //           this.getList();
    //           // Just to simulate the time of the request
    //           this.text = "房源资料删除成功！";
    //           this.snackbar = true;
    //         }
    //       });
    //     }
    //   });
    // },

    getNamefromOptions(options, key) {
      // return options[key]
      let showname = "";
      options.forEach(item => {
        if (item.key === key) {
          // console.log(key, item.key, item.display_name)
          showname = item.display_name;
        }
      });
      return showname;
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

<style>
#box ul {
  display: flex;
  flex-wrap: wrap;
}
#box li {
  padding: 3px;
  list-style: none;
  margin-right: 15px;
  border: 1px solid #eee;
}

.book {
  width: 100px;
  /* height: 150px; */
  display: block;
  margin: 0 auto;
}

table,
thead,
th {
  color: rgb(11, 105, 247) !important;
}

table,
thead,
tr {
  color: grey;
  font-weight: 400;
}
</style>
