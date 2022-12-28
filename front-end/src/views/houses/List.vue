<template>
  <v-container fluid class="px-8 py-0">
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-space-between mx-1 mb-0">
      <div>
        <v-row>
          <v-switch
            v-model="listQuery.orderby_lastupdate_desc"
            label="倒序"
            style="max-width: 100px;"
            class="mx-3"
          ></v-switch>
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

          <v-select
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
          ></v-select>

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
        </v-row>
      </div>
      <div>
        <v-row class="mt-2">
          <v-btn @click="getQuery" color="primary" class="mx-2">
            查询<v-icon right>mdi-magnify</v-icon>
          </v-btn>
          <v-btn @click="resetQuery" color="primary" class="mx-2">
            重置<v-icon right>mdi-lock-reset</v-icon>
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

          <div v-if="isAdminRole">
            <AddHouseDialog />
          </div>
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
            <th>房源编号</th>
            <th>小区 | 地块</th>
            <th>楼幢</th>
            <th>单元</th>
            <th>总楼层</th>
            <th>所在楼层</th>
            <th>层级差</th>
            <th class="text-right">门牌号码</th>
            <th class="text-right">建筑面积</th>
            <!-- <th class="text-right">实测面积</th> -->
            <th>户型</th>
            <th>状态</th>
            <th>校对</th>
            <th>子母套</th>
            <th>项目名称</th>
            <!-- <th>创建日期</th> -->
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
            <td>
              {{ row.feefloat }}
            </td>
            <td class="text-right">
              {{ row.number }}
            </td>
            <td class="text-right">
              {{ row.area }}
            </td>
            <!-- <td class="text-right">
              {{ row.measured_area }}
            </td> -->
            <td>
              {{ row.house_type }}
            </td>
            <td>
              <v-chip
                class="ma-0"
                :color="row.status == 0 ? greenColor : redColor"
                text-color="white"
              >
                <h3>{{ getNamefromOptions(statusOptions, row.status) }}</h3>
              </v-chip>
            </td>
            <td>
              <span :class="`checkflag-status-${row.check_flag}`">
                {{
                  getNamefromOptions(checkFlagOptions, row.check_flag)
                }}
              </span>
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
            <!-- <td>
              {{
                $moment(row.create_at)
                  .utc()
                  .format("YYYY-MM-DD")
              }}
            </td> -->
            <td>
              {{
                $moment(row.last_update)
                  .utc()
                  .format("MM-DD HH:mm")
              }}
              <v-btn
                v-if="isAdminRole"
                color="warning"
                class="ml-1"
                text
                x-small
                @click="removeHouse(row)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
import { fetchHouses, deleteHouse } from "@/api/houses";
import { fetchGardensList } from "@/api/gardens";

const statusOptions = [
  { key: 0, display_name: "未选" },
  { key: 1, display_name: "已选" },
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
  name: "Houses",

  components: {
    AddHouseDialog: () => import("./addHouseDialog")
    // CheckHouseDialog: () => import("./checkHouseDialog")
  },

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
    listQuery: {
      page: 1,
      limit: 15,
      status: undefined,
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
      房源编号: "house_code",
      小区或地块: "garden",
      // 楼幢: "building",
      楼幢: {
        field: "building",
        callback: value => {
          return `'${value}`;
        }
      },
      单元: "unit",
      门牌: "number",
      楼层: "floor",
      状态: "status",
      面积: "area",
      车库面积: "sub_area",
      户型类别: "house_type",
      // 创建日期: "create_at"
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
    this.getGardens();
    // console.log(Date.now());
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
        this.gardenOptions = response.data.items[0]
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      console.log("gardenOptions:", this.gardenOptions);
    },

    getQuery() {
      this.listQuery.page = 1;
      this.getList()
    },
    // changed() {
    //   console.log(
    //     this.listQuery.isAudioBook
    //   )
    // },

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
        console.log(this.items);

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
        }, 1.5 * 1000);
      });
      return this.exportItems;
    },

    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 10,
        sort: "+id"
      };
      this.getList();
    },

    handleToDetails(row) {
      // console.log(row.id)
      this.$router.push({
        name: "房源详情",
        params: { id: row.id }
      });
    },

    removeHouse(row) {
      this.$confirm("确认删除房源资料?").then(res => {
        if (res) {
          deleteHouse(row.id).then(response => {
            if (response.data.error) {
              this.alert_text = response.data.error;
              this.alert = true;
            } else {
              this.getList();
              // Just to simulate the time of the request
              this.text = "房源资料删除成功！";
              this.snackbar = true;
            }
          });
        }
      });
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

$colors: (0 #e49723, 1 #4ba946, 2 #23ade4);

$color: nth($colors, random(length($colors)));

@each $i in $colors {
  .checkflag-status-#{nth($i,1)} {
    color: nth($i, 2) !important;
    font-weight: 800;
  }
}
</style>
