<template>
  <v-container fluid tag="section">
    <base-material-card color="indigo" inline>
      <template v-slot:after-heading> </template>
      <v-row justify="center">
        <!-- <v-col cols="1">
          <v-subheader>
          </v-subheader>
        </v-col> -->
        <v-col cols="2" md="2">
          <v-text-field
            v-model="listQuery.keyword"
            class="ml-auto"
            label="关键字: 门牌号码"
            hide-details
            single-line
            style="max-width: 360px;"
          />
        </v-col>
        <v-col cols="2" md="2">
          <v-select
            v-model="listQuery.garden_id"
            :items="gardenOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="小区 | 地块"
            single-line
          ></v-select>
        </v-col>
        <v-col cols="1" md="1">
          <v-select
            v-model="listQuery.housetype_id"
            :items="houseTypeOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="房源类型"
            single-line
          ></v-select>
        </v-col>
        <v-col cols="1" md="1">
          <v-select
            v-model="listQuery.limit"
            :items="pageOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label=""
            single-line
          ></v-select>
        </v-col>
        <v-col cols="1" md="1">
          <v-select
            v-model="listQuery.status"
            :items="statusOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="状态"
            single-line
          ></v-select>
        </v-col>
        <v-col cols="2" md="1">
          <v-btn @click="getList" color="primary">
            查询
            <v-icon right>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="2" md="1">
          <v-btn @click="resetQuery" color="primary">
            重置
            <v-icon right>mdi-lock-reset</v-icon>
          </v-btn>
        </v-col>
        <!-- <v-col cols="6" md="2">
          <AddBookDialog />
        </v-col> -->
        <v-col cols="1" md="1">
          <export-excel
            :data="items"
            :fields="exportFields"
            worksheet="房源数据"
            name="罗星抽签管理系统房源数据.xls"
          >
            <!-- <v-btn @click="setQueryAll">导出 -->
            <v-btn color="info">
              导出
              <v-icon right>mdi-arrow-down-bold-circle-outline</v-icon>
            </v-btn>
          </export-excel>
        </v-col>
      </v-row>

      <!-- <v-divider class="mt-3" /> -->

      <v-simple-table fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left blue--text">ID</th>
              <th class="text-left blue--text">小区 | 地块</th>
              <th class="text-left blue--text">面积1</th>
              <th class="text-left blue--text">面积2</th>
              <th class="text-left blue--text">门牌号码</th>
              <th class="text-left blue--text">户型</th>
              <th class="text-left blue--text">选房批次</th>
              <th class="text-left blue--text">状态</th>
              <th class="text-left blue--text">创建时间</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in items" :key="row.id">
              <td class="mb-0 pb-2 pt-0 grey--text" style="font-size:11px">
                {{ row.id }}
              </td>
              <td
              >
                <v-chip class="ma-0" color="grey" text-color="white">
                  <h3>{{ row.garden }}</h3>
                </v-chip>
              </td>
              <td
              >
                <v-chip class="ma-0" color="grey" text-color="white">
                  <h3>{{ row.area1 }}</h3>
                </v-chip>
              </td>
              <td
                class="mb-0 pb-2 pt-0 black--text text-right"
                style="font-size:14px"
              >
                <span v-if="row.area2 == 0"> - </span>
                <span v-else> {{ row.area2 }} </span>
              </td>
              <td>
                <v-chip class="ma-0" color="grey" text-color="white">
                  <h3>{{ row.house }}</h3>
                </v-chip>
              </td>
              <td>
                <v-chip class="ma-0" color="grey" text-color="white">
                  <h3>{{ row.house_type }}</h3>
                </v-chip>
              </td>
              <td class="mb-0 pb-2 pt-0 black--text" style="font-size:14px">
                {{ row.activity }}
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
              <td class="mb-0 pb-2 pt-0 black--text" style="font-size:14px">
                {{
                  $moment(row.create_time)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")
                }}
              </td>

              <!-- <td class="text-right">
                <v-btn
                  :color="action.color"
                  class="px-1 ml-1"
                  icon
                  fab
                  small
                  @click="handleToDetails(row)"
                >
                  <v-icon v-text="action.icon" />
                </v-btn>
                <v-btn
                  v-if="isAdminRole"
                  color="warning"
                  class="ml-1"
                  text
                  x-small
                  @click="removeAuthor(row)"
                >
                  <v-icon small>mdi-lock</v-icon>
                </v-btn>
              </td> -->
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
    </base-material-card>
  </v-container>
</template>

<script>
import { fetchHouses, deleteHouse } from "@/api/houses";

const pageOptions = [
  { key: 10, display_name: "10条" },
  { key: 50, display_name: "50条" },
  { key: 100, display_name: "100条" },
  { key: 500, display_name: "500条" },
  { key: 1000, display_name: "1000条" },
  { key: 2000, display_name: "2000条" }
];

const statusOptions = [
  { key: 0, display_name: "空闲" },
  { key: 1, display_name: "已选" },
  { key: 9, display_name: "剔除" }
];

const gardenOptions = [
  { key: 1, display_name: "大西门3#地块" },
  { key: 2, display_name: "大西门2#地块" },
  { key: 3, display_name: "大西门1#地块" },
  { key: 4, display_name: "直属库地块" },
  { key: 5, display_name: "家英小区南侧地块" }
];

const houseTypeOptions = [
  { key: 1, display_name: "小户型" },
  { key: 2, display_name: "中户型" },
  { key: 3, display_name: "大户型" }
];

export default {
  name: "Houses",

  components: {
    // AddBookDialog: () => import("./addBookDialog")
    // DeleteBookDialog: () => import("./deleteBookDialog")
  },

  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,

    action: {
      color: "info",
      icon: "mdi-message-text"
    },
    items: [],
    listQuery: {
      page: 1,
      limit: 10,
      keyword: undefined,
      garden_id: undefined,
      status: undefined,
      sort: "+id"
    },
    search: undefined,
    awaitingSearch: false,
    circle: true,
    disabled: false,
    length: 10,
    greenColor: "#3cd47b",
    redColor: "#ff4d4d",
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    totalVisible: 10,
    total_pages: 0,
    // unitOptions: [],
    gardenOptions,
    statusOptions,
    houseTypeOptions,
    pageOptions,
    exportFields: {
      id: "id",
      garden: "garden",
      type: "type",
      area1: "area1",
      area2: "area2",
      house: "house",
      house_type: "house_type",
      activity: "activity",
      create_time: "create_time"
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
      if (this.$store.getters.roles.includes("admin")) {
        return true;
      } else {
        return false;
      }
    }
  },

  created() {
    this.getList();
    console.log(Date.now());
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
    // getQueryOnTimeOut() {
    //   // setTimeout(() => this.getList(), 3000);
    //   if (this.timer) {
    //     clearTimeout(this.timer);
    //     this.timer = null;
    //   }
    //   this.timer = setTimeout(() => {
    //     // your code
    //   }, 800);
    // },
    getQuery() {
      setTimeout(() => this.getList(), 500);
    },
    // changed() {
    //   console.log(
    //     this.listQuery.isAudioBook
    //   )
    // },
    getList() {
      this.listLoading = true;
      // this.listQuery.keyword = this.search
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
    resetQuery() {
      this.listQuery.keyword = undefined;
      this.listQuery.garden_id = undefined;
      this.listQuery.status = undefined;
    },
    handleToDetails(row) {
      // console.log(row.id)
      this.$router.push({
        name: "房源详情",
        params: { id: row.id }
      });
    },
    removeHouse(row) {
      this.$confirm("确认删除号码?").then(res => {
        if (res) {
          deleteHouse(row.id).then(response => {
            this.getList();
            // Just to simulate the time of the request
            this.text = "号码删除成功！";
            this.snackbar = true;
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
</style>
