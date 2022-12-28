<template>
  <v-container fluid class="px-8 py-0">
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-space-between mx-1 mb-0">
      <div>
        <v-row>
          <v-switch
            v-model="listQuery.orderby_id_desc"
            label="倒序"
            style="max-width: 100px;"
            class="mx-3"
          ></v-switch>

          <v-select
            v-model="listQuery.village_id"
            :items="villagesOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="所在村"
            single-line
            class="mx-3"
            style="max-width: 80px;"
          ></v-select>

          <v-select
            v-model="listQuery.batch_code"
            :items="batchCodeOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="场次"
            single-line
            class="mx-3"
            style="max-width: 80px;"
          ></v-select>

          <v-text-field
            v-model="listQuery.keyword"
            label="姓名"
            hide-details
            single-line
            class="mx-3"
            style="max-width: 120px;"
          />

          <!-- <v-checkbox
            v-model="listQuery.orderby_id_desc"
            label="倒序"
            class="mx-3"
          >
          </v-checkbox> -->
        </v-row>
      </div>
      <div>
        <v-row class="mt-2"
          ><v-btn @click="getQuery" color="primary" class="mx-3">
            查询
            <v-icon right>mdi-magnify</v-icon>
          </v-btn>

          <v-btn @click="resetQuery" color="primary" class="mx-3">
            重置
            <v-icon right>mdi-lock-reset</v-icon>
          </v-btn>

          <export-excel
            :fields="exportFields"
            worksheet="签约数据"
            name="九色鹿抽签签约数据.xls"
            :fetch="getListforExport"
          >
            <v-btn color="primary" class="mx-3">
              导出
              <v-icon right>mdi-arrow-down-bold-circle-outline</v-icon>
            </v-btn>
          </export-excel>

          <div v-if="isAdminRole">
            <AddContractDialog />
          </div>
          <div v-if="isAdminRole">
            <AddScanContractDialogSingle />
          </div>
          <div v-if="isAdminRole">
            <AddScanContractDialogBatch />
          </div>
        </v-row>
      </div>
    </v-row>

    <!-- <v-divider class="mt-3" /> -->

    <v-simple-table fixed-header class="pa-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>户主编号</th>
            <th>签约单编号</th>
            <th>所在村</th>
            <th class="text-right">姓名</th>
            <th>场次</th>
            <th>详细资料</th>
            <th>创建时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td
              class="font-weight-light grey--text text-left"
              style="font-size:11px"
            >
              {{ row.id }}
            </td>
            <td class="text-left">
              {{ row.customer_code }}
            </td>
            <td class="text-left">
              {{ row.sequence }}
            </td>
            <td class="text-left">
              {{ row.village }}
            </td>
            <td class="text-right">
              <!-- {{ row.customer }}
              <v-btn
                :color="printer.batch.color"
                class="px-1 ml-1"
                icon
                fab
                small
                @click="handlePrintByCustomer(row.customer_id)"
              >
                <v-icon small v-text="printer.batch.icon" />
              </v-btn> -->

              <v-btn
                color="warning"
                icon
                @click="handlePrintByCustomer(row.customer_id)"
              >
                <v-icon small icon right>mdi-printer</v-icon>
              </v-btn>
              {{ row.customer }}
            </td>
            <td class="text-left">
              {{ row.batch_code }}
            </td>
            <td>
              <v-simple-table dense class="background-transparent">
                <template v-slot:default>
                  <tbody>
                    <tr v-for="(item, i) in row.houses" :key="i">
                      <td class="text-left" width="180">{{ item.garden }}</td>
                      <td class="text-right" width="90">
                        {{ item.building }}幢
                      </td>
                      <td class="text-right" width="90">{{ item.unit }}单元</td>
                      <td class="text-right" width="90">{{ item.number }}室</td>
                      <td class="text-right" width="90">
                        {{ item.house_type }}
                      </td>
                      <td class="text-right" width="90">{{ item.area }}㎡</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </td>
            <td class="text-left">
              {{
                $moment(row.create_at)
                  .utc()
                  .format("MM-DD HH:mm:ss")
              }}
            </td>
            <td>
              <v-btn
                :color="printer.single.color"
                icon
                fab
                x-small
                @click="handlePrint(row)"
              >
                <v-icon v-text="printer.single.icon" />
              </v-btn>
              <v-btn
                v-if="row.audio_uri"
                icon
                fab
                :href="'https://taozhuang.tuozhanad.com' + row.audio_uri"
                :target="'https://taozhuang.tuozhanad.com' + row.audio_uri"
                x-small
                color="green"
              >
                <v-icon>mdi-library-music</v-icon>
              </v-btn>
              <v-btn
                v-if="isAdminRole"
                color="warning"
                icon
                fab
                x-small
                @click="removeContract(row)"
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
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
const batchCodeOptions = [
  { key: "01", display_name: "01" },
  { key: "02", display_name: "02" },
  { key: "03", display_name: "03" }
];

const villagesOptions = [
  { key: 1, display_name: "缪家村" },
  { key: 2, display_name: "曹家村" },
  { key: 3, display_name: "东云村" },
  { key: 4, display_name: "江家村" },
  { key: 5, display_name: "大云村" }
];

import {
  fetchContracts,
  updateContract,
  deleteContract
} from "@/api/contracts";

export default {
  name: "Contracts",

  components: {
    AddContractDialog: () => import("./addContractDialog"),
    AddScanContractDialogSingle: () => import("./addScanContractDialogSingle"),
    AddScanContractDialogBatch: () => import("./addScanContractDialogBatch")
  },

  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,
    panel: [0, 1],
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
    exportItems: [],
    items: [],
    listQuery: {
      page: 1,
      limit: 12,
      keyword: undefined,
      activity: undefined,
      batch_code: undefined,
      sort: "+id",
      orderby_id_desc: undefined
    },
    search: "",
    awaitingSearch: false,
    circle: true,
    disabled: false,
    length: 10,
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    totalVisible: 10,
    total_pages: 0,
    // activityOptions,
    // pageOptions,
    // exportFields: {
    //   确认书序号: "sequence",
    //   户主代表: "customer",
    //   委托人: "sub_name",
    //   抽签序号: "customer_lottery_sequence",
    //   小区: "garden",
    //   类型: "type",
    //   面积1: "area",
    //   面积2: "sub_area",
    //   楼幢: "building",
    //   门牌号码: "house",
    //   户型: "house_type",
    //   批次: "customer_batch_code",
    //   创建时间: "create_at"
    //   // "Telephone 2": {
    //   //   field: "phone.landline",
    //   //   callback: value => {
    //   //     return `Landline Phone - ${value}`;
    //   //   }
    //   // }
    // },
    exportFields: {
      确认书序号: "sequence",
      户主姓名: "customer",
      联系方式: "phone",
      所在村: "village",
      身份证号: {
        field: "cardid",
        callback: value => {
          return `'${value}`;
        }
      },
      受托人: "sub_name",
      抽签序号: "customer_lottery_sequence",
      小区: {
        field: "houses",
        callback: value => {
          const house = value[0];
          if (house) {
            return house.garden;
          }
        }
      },
      楼幢: {
        field: "houses",
        callback: value => {
          const house = value[0];
          if (house) {
            // return house.building;
            return `'${house.building}`;
          }
        }
      },
      单元: {
        field: "houses",
        callback: value => {
          const house = value[0];
          if (house) {
            return house.unit;
          }
        }
      },

      // 类型: "type",
      门牌号码A: {
        field: "houses",
        callback: value => {
          const house = value[0];
          if (house) {
            return house.number;
          }
        }
      },
      面积A: {
        field: "houses",
        callback: value => {
          const house = value[0];
          if (house) {
            return house.area;
          }
        }
      },
      自行车库面积A: {
        field: "houses",
        callback: value => {
          const house = value[0];
          if (house) {
            return house.sub_area;
          }
        }
      },
      门牌号码B: {
        field: "houses",
        callback: value => {
          const house = value[1];
          if (house) {
            return house.number;
          }
        }
      },
      面积B: {
        field: "houses",
        callback: value => {
          const house = value[1];
          if (house) {
            return house.area;
          }
        }
      },
      自行车库面积B: {
        field: "houses",
        callback: value => {
          const house = value[1];
          if (house) {
            return house.sub_area;
          }
        }
      },

      // 户型: "house_type",
      抽签场次: "batch_code"
      // 创建时间: "create_at"
      // "Telephone 2": {
      //   field: "phone.landline",
      //   callback: value => {
      //     return `Landline Phone - ${value}`;
      //   }
      // }
    },

    greenColor: "rgb(81, 185, 116)",
    warningColor: "rgb(241, 211, 171)",
    batchCodeOptions,
    villagesOptions
  }),

  computed: {
    isAdminRole() {
      if (this.$store.getters.roles.includes("administrator")) {
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

  // events: {
  //   eventGetlist: function(data) {
  //     console.log('eventGetlist')
  //   }
  // },
  // watch: {
  //     search: function (val) {
  //       if (!this.awaitingSearch) {
  //         setTimeout(() => {
  //           this.getList()
  //           this.awaitingSearch = false
  //         }, 1500); // 1 sec delay
  //       }
  //       this.awaitingSearch = true
  //     },
  //   },
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
      this.listQuery.page = 1;
      this.getList();
    },
    // changed() {
    //   console.log(
    //     this.listQuery.isAudioBook
    //   )
    // },
    getList() {
      this.listLoading = true;
      this.listQuery.limit = 10;
      // this.listQuery.keyword = this.search
      console.log(this);
      fetchContracts(this.listQuery).then(response => {
        this.items = response.data.items;
        this.total_pages = response.data._meta.total_pages;
        console.log(this.items);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    getListforExport() {
      this.listLoading = true;
      this.listQuery.limit = 10000;
      fetchContracts(this.listQuery).then(response => {
        this.exportItems = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      return this.exportItems;
    },

    resetQuery() {
      this.listQuery.keyword = undefined;
      this.listQuery.batch_code = undefined;
      this.listQuery.limit = 10;
    },

    // setQueryAll() {
    //   this.listQuery.limit = 10000;
    //   this.getQuery()
    // },

    handlePrint(row) {
      // console.log(row.id)
      this.$router.push({
        name: "打印签单",
        params: { id: row.id }
      });
    },

    handlePrintClearing(row) {
      // console.log(row.id)
      if (row.isprinted) {
        this.$router.push({
          name: "打印结算单",
          params: { id: row.id }
        });
      } else {
        this.$confirm("当前合同结算数据未生成无法打印，现在生成结算数据?").then(
          res => {
            const data = { id: row.id };
            if (res) {
              updateContract(row.id, data).then(response => {
                // console.log(response)
                if (response.data.error) {
                  this.alert_text = response.data.error;
                  this.alert = true;
                } else {
                  this.getList();
                  // Just to simulate the time of the request
                  this.text = "合同结算数据已经生成！请重新点击结算打印";
                  this.snackbar = true;
                }
              });
            }
          }
        );
      }
    },

    handlePrintByCustomer(customer_id) {
      // console.log(row.id)
      this.$router.push({
        name: "客户签单",
        params: { id: customer_id }
      });
    },
    removeContract(row) {
      this.$confirm("确认删除签约记录?").then(res => {
        if (res) {
          deleteContract(row.id).then(response => {
            this.getList();
            // Just to simulate the time of the request
            this.text = "签约记录删除成功！";
            this.snackbar = true;
          });
        }
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
}
</style>
