<template>
  <v-container fluid class="px-8 py-0">
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-space-between mx-1 mb-0">
      <div>
        <v-row>
          <v-select
            v-model="listQuery.garden_id"
            :items="gardenOptions"
            item-text="name"
            item-value="id"
            menu-props="auto"
            hide-details
            label="小区"
            single-line
            style="max-width: 150px;"
            class="mx-3"
          ></v-select>

          <v-text-field
            v-model="listQuery.building_name"
            class="mx-3"
            label="幢"
            hide-details
            single-line
            style="max-width: 50px;"
          />

          <v-text-field
            v-model="listQuery.unit_name"
            class="mx-3"
            label="单元"
            hide-details
            single-line
            style="max-width: 50px;"
          />

          <v-text-field
            v-model="listQuery.number"
            class="mx-3"
            label="门牌号码"
            hide-details
            single-line
            style="max-width: 150px;"
          />

          <v-select
            v-model="listQuery.areaitem_id"
            :items="areaitemOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="户型"
            single-line
            style="max-width: 80px;"
            class="mx-3"
          ></v-select>

          <v-select
            v-model="listQuery.status"
            :items="statusOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="状态"
            single-line
            style="max-width: 80px;"
            class="mx-3"
          ></v-select>

          <!-- <v-select
            v-model="listQuery.check_flag"
            :items="checkFlagOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="校对"
            single-line
            style="max-width: 80px;"
            class="mx-3"
          ></v-select> -->

          <v-select
            v-model="listQuery.multi_flag"
            :items="multiOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="子母套"
            single-line
            style="max-width: 80px;"
            class="mx-3"
          ></v-select>
          <v-switch
            v-model="pagedown_auto"
            label="自动翻页"
            style="max-width: 120px;"
            class="mx-3"
          ></v-switch>
        </v-row>
      </div>
      <div>
        <v-row class="mt-2">
          <v-btn @click="onQuery" color="primary" class="mx-2">
            查询<v-icon right>mdi-magnify</v-icon>
          </v-btn>
          <export-excel
            :fields="exportFields"
            worksheet="房源数据"
            name="九色鹿公寓楼安置房源数据.xls"
            :fetch="exportListData"
            type="xls"
          >
            <v-btn color="primary" class="mx-2">
              导出<v-icon right>mdi-arrow-down-bold-circle-outline</v-icon>
            </v-btn>
          </export-excel>
          <!-- <v-btn @click="exportToExel" color="primary" class="mx-2">
            导出<v-icon right>mdi-arrow-down-bold-circle-outline</v-icon>
          </v-btn> -->
        </v-row>
      </div>
    </v-row>

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
    <v-simple-table fixed-header class="pa-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>号签编号</th>
            <th>房源编号</th>
            <th>小区 | 地块</th>
            <th>楼幢</th>
            <th>单元</th>
            <th>总楼层</th>
            <th>所在楼层</th>
            <th class="text-right">门牌号码</th>
            <th class="text-right">建筑面积</th>
            <th>户型</th>
            <th>子母套</th>
            <th>项目名称</th>
            <th>最后更新</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td class="grey--text" style="font-size:11px">
              {{ row.id }}
            </td>
            <td>
              {{ row.house_code }}
            </td>
            <td>
              {{ row.label_code }}
            </td>
            <td>
              {{ row.garden }}
            </td>
            <td>
              {{ row.building }}
            </td>
            <td>
              {{ row.unit }}
            </td>
            <td>
              {{ row.floors }}
            </td>
            <td>
              {{ row.floor }}
            </td>
            <td class="text-right">
              {{ row.number }}
            </td>
            <td class="text-right">
              {{ row.area }}
            </td>

            <td>
              {{ row.house_type }}
            </td>
            <td>
              <span v-if="row.multi_flag">
                <v-icon color="red">mdi-tag-text-outline</v-icon>
              </span>
              <span v-else>
                <v-icon color="grey">mdi-tag-outline</v-icon>
              </span>
            </td>
            <td>
              {{ row.villagecomb }}
            </td>
            <td>
              {{
                $moment(row.last_update)
                  .utc()
                  .format("MM-DD HH:mm")
              }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

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
      class="my-3"
    ></v-pagination>
    <!-- <span>共{{total_pages}}页</span> -->

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { fetchHouses } from "@/api/houses";
import { fetchGardensList } from "@/api/gardens";

const statusOptions = [
  { key: 0, display_name: "未选中" },
  { key: 1, display_name: "已选中" },
  { key: 9, display_name: "入库" }
];

const multiOptions = [
  { key: 0, display_name: "否" },
  { key: 1, display_name: "是" }
];

const checkFlagOptions = [
  { key: 0, display_name: "✘" },
  { key: 1, display_name: "✔" }
];

const areaitemOptions = [
  { key: 1, display_name: "小户型" },
  { key: 2, display_name: "中户型" },
  { key: 3, display_name: "大户型" }
];

export default {
  name: "HousesList",

  components: {},

  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,
    alert: false,
    alert_text: "",

    action: {
      color: "info",
      icon: "mdi-message-text"
    },
    exportItems: [],
    items: [],
    pagedown_auto: true,
    listQuery: {
      page: 1,
      limit: 15,
      status: 0,
      check_flag: undefined,
      building_name: undefined,
      unit_name: undefined,
      number: undefined,
      orderby_lastupdate_desc: undefined,
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
    totalVisible: 12,
    total_pages: 0,
    gardenOptions: [],
    statusOptions,
    multiOptions,
    checkFlagOptions,
    areaitemOptions,
    exportFields: {
      序号: "id",
      号签编号: "label_code",
      房源编号: "house_code",
      小区或地块: "garden",
      楼幢: {
        field: "building",
        callback: value => {
          return `'${value}`;
        }
      },
      单元: "unit",
      门牌: "number",
      状态: "status",
      面积: "area",
      预测面积: "yuce_area",
      实测面积: "measured_area",
      所在楼层: "floor",
      总楼层: "floors",
      子母套: "multi_flag",
      户型类别: "house_type",
      项目名称: "villagecomb"
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
    // this.getList();
    // this.getGardens();
    // console.log(Date.now());
  },

  mounted() {
    this.getList();

    this.getGardens();
    this.timer = setInterval(() => {
      // setTimeout(this.turnPages(), 0);
      this.turnPages();

      setTimeout(console.log("this.timer"), 0);
    }, 1000 * 1);

    // this.$once("hook:beforeDestroy", () => {
    //   clearInterval(this.timer);
    //   this.timer = null;
    //   console.log('clearInterval')
    // });
  },

  // destroyed() {
  //   clearTimeout(this.timer);  // 错了
  // },

  // beforeDestroy() {
  //   //清除定时器
  //   clearInterval(this.timer);
  //   console.log("beforeDestroy");
  // },
  // destroyed() {
  //   //清除定时器
  //   //clearInterval(this.timer);
  //   console.log("destroyed");
  // },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
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
    getGardens() {
      fetchGardensList().then(response => {
        this.gardenOptions = response.data.items[0].concat(
          response.data.items[1]
        );
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    getQuery() {
      setTimeout(() => this.getList(), 500);
    },

    onQuery() {
      this.listQuery.page = 1;
      this.getList();
      this.pagedown_auto = false;
    },

    getList() {
      this.listLoading = true;
      this.listQuery.limit = 12;
      if (this.listQuery.number) {
        this.listQuery.number = this.listQuery.number.trim();
      }

      if (this.listQuery.building_name) {
        this.listQuery.building_name = this.listQuery.building_name.trim();
      }

      if (this.listQuery.unit_name) {
        this.listQuery.unit_name = this.listQuery.unit_name.trim();
      }

      fetchHouses(this.listQuery).then(response => {
        this.items = response.data.items;
        this.total_pages = response.data._meta.total_pages;
        // console.log(this.items);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    exportListData() {
      this.listLoading = true;
      this.listQuery.limit = 10000;
      fetchHouses(this.listQuery).then(response => {
        this.exportItems = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 6 * 1000);
      });
      return this.exportItems;
    },

    // exportToExel() {
    //   // for webpack 3: dynamic import
    //   this.pagedown_auto = false;
    //   clearInterval(this.timer);
    //   this.listQuery.limit = 10;
    //   this.listQuery.page = 1;
    //   var exportItems = [];
    //   fetchHouses(this.listQuery).then(response => {
    //     exportItems = response.data.items;
    //     // Just to simulate the time of the request
    //     setTimeout(() => {
    //       this.listLoading = false;
    //       import(/* webpackChunkName: "js2excel" */ "js2excel")
    //         .then(({ json2excel }) => {
    //           json2excel({
    //             exportItems,
    //             name: "test",
    //             formateDate: "dd/mm/yyyy"
    //           });
    //         })
    //         .catch(e => {});
    //     }, 6 * 1000);
    //   });
    // },

    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 10,
        sort: "+id"
      };
      this.getList();
    },

    turnPages() {
      if (this.listQuery.page == this.total_pages) {
        this.$router.push({
          name: "汇总数据"
        });
      } else {
        if (this.pagedown_auto) {
          this.listQuery.page = this.listQuery.page + 1;
          this.getList();
        } else {
          clearInterval(this.timer)
        }
      }
    },

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

    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style>
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
</style>
