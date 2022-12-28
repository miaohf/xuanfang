<template>
  <v-container fluid class="px-8 py-0">
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-space-between mx-1 mb-5">
      <div>
        <v-row class="mx-5">
          <v-select
            v-model="listQuery.status"
            :items="statusOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="状态"
            single-line
            class="mx-3"
            style="max-width: 100px;"
          ></v-select>

          <v-select
            v-model="listQuery.check_flag"
            :items="checkFlagOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="是否已校对"
            single-line
            class="mx-3"
            style="max-width: 100px;"
          ></v-select>

          <v-select
            v-model="listQuery.multi_flag"
            :items="multiOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="是否子母套"
            single-line
            class="mx-3"
            style="max-width: 100px;"
          ></v-select>
        </v-row>
      </div>
      <div>
        <v-row class="mt-2">
          <v-btn @click="getList" color="primary" class="mx-3">
            查询
            <v-icon right>mdi-magnify</v-icon>
          </v-btn>

          <v-btn @click="resetQuery" color="primary" class="mx-3">
            重置
            <v-icon right>mdi-lock-reset</v-icon>
          </v-btn>

          <export-excel
            :fields="exportFields"
            worksheet="号签数据"
            name="九色鹿公寓楼安置号签数据.xls"
            :fetch="getListforExport"
          >
            <v-btn color="primary" class="mx-3">
              导出
              <v-icon right>mdi-arrow-down-bold-circle-outline</v-icon>
            </v-btn>
          </export-excel>

          <div v-if="isAdminRole" class="mx-3">
            <CheckinLabelDialog />
          </div>
        </v-row>
      </div>
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
    <v-simple-table fixed-header class="pa-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>编号</th>
            <th>校对</th>
            <th class="text-right">号签详细信息</th>
            <th class="text-right">面积</th>
            <th>子母套</th>
            <th>状态</th>
            <th>所在号箱</th>
            <th>号箱类别</th>
            <!-- <th>创建日期</th> -->
            <th>最后更新</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td class="grey--text" style="font-size:11px">
              {{ row.id }}
            </td>
            <td>
              {{ row.label_code }}
            </td>
            <td>
              <span :class="`checkflag-status-${row.check_flag}`">
                {{ getNamefromOptions(checkFlagOptions, row.check_flag) }}
              </span>
            </td>
            <td>
              <v-simple-table dense class="background-transparent">
                <template v-slot:default>
                  <tbody>
                    <tr v-for="(item, i) in row.houses" :key="i">
                      <td class="text-left" width="100">{{ item.garden }}</td>
                      <td class="text-right" width="60">
                        {{ item.building }}幢
                      </td>
                      <td class="text-right" width="70">{{ item.unit }}单元</td>
                      <td class="text-right" width="90">{{ item.number }}室</td>
                      <td class="text-left" width="90">
                        {{ item.house_type }}
                      </td>
                      <td class="text-right" width="120">{{ item.area }}㎡</td>
                      <!-- <td class="text-right" width="30">
                        {{
                          getNamefromOptions(checkFlagOptions, item.check_flag)
                        }}
                      </td> -->
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </td>
            <td class="text-right">
              {{ row.area }}
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
              <v-chip
                class="ma-0"
                :color="row.status == 0 ? greenColor : redColor"
                text-color="white"
              >
                <h3>{{ getNamefromOptions(statusOptions, row.status) }}</h3>
              </v-chip>
            </td>
            <td>
              {{ row.box_name }}
            </td>
            <td>
              <!-- {{ getNamefromOptions(boxTypes, row.box_type) }} -->

              {{ row.box_areaitem_name }}
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
                <v-icon small>mdi-delete</v-icon>
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

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { fetchLabels, deleteLabel } from "@/api/labels";

const statusOptions = [
  { key: 0, display_name: "未选" },
  { key: 1, display_name: "已选" },
  { key: 9, display_name: "入库" }
];

const boxTypes = [
  { key: 1, display_name: "小户型" },
  { key: 2, display_name: "中户型" },
  { key: 3, display_name: "大户型" },
  { key: 9, display_name: "子母套" }
];

const checkFlagOptions = [
  { key: 0, display_name: "✘" },
  { key: 1, display_name: "✔" }
];

const multiOptions = [
  { key: 0, display_name: "否" },
  { key: 1, display_name: "是" }
];
export default {
  name: "Houses",

  components: {
    // AddHouseDialog: () => import("./addHouseDialog"),
    CheckinLabelDialog: () => import("./checkinLabelDialog")
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
      limit: 12,
      multi_flag: undefined,
      check_flag: undefined,
      status: undefined,
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
    checkFlagOptions,
    multiOptions,
    boxTypes,

    // 序号	小区或地块	楼幢	单元	门牌	楼层	状态	面积	自行车库	号箱	号箱描述	户型类别

    exportFields: {
      序号: "id",
      号签编号: "label_code",
      号签类别: "type_name",
      小区或地块: "garden_name",
      // 楼幢: "building_name",
      // 单元: "unit",
      楼幢: {
        field: "building_name",
        callback: value => {
          return `'${value}`;
        }
      },
      单元: "unit",
      门牌_A: "number_a",
      面积_A: "area_a",
      门牌_B: "number_b",
      面积_B: "area_b",
      楼层: "floor",
      状态: "status",
      面积: "area",

      号箱: "box_name",
      号箱类别: "box_areaitem_name",
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
      this.listQuery.limit = 12;
      // this.listQuery.keyword = this.search
      fetchLabels(this.listQuery).then(response => {
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
      this.listQuery = {
        page: 1,
        limit: 12,
        sort: "+id"
      };
      this.getList();
    },

    removeLabel(row) {
      this.$confirm("确认删除房源资料?").then(res => {
        if (res) {
          deleteLabel(row.id).then(response => {
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

    getListforExport() {
      this.listLoading = true;
      this.listQuery.limit = 10000;
      fetchLabels(this.listQuery).then(response => {
        this.exportItems = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      return this.exportItems;
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
