<template>
  <v-container fluid class="px-8 py-0">
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-space-between mx-1 mb-0">
      <div>
        <v-row>
          <v-switch
            v-model="listQuery.paged"
            label="分页"
            style="max-width: 100px;"
            class="mx-3"
          ></v-switch>
          <v-switch
            v-model="listQuery.remain_area_greater_twenty"
            label="≥20㎡"
            style="max-width: 100px;"
            class="mx-3"
          ></v-switch>
          <!-- <v-radio-group
            v-model="listQuery.orderby"
            row
            style="max-width: 200px;"
            class="mx-3"
          >
            <v-radio label="入场号↑" value="1"></v-radio>
            <v-radio label="抽签号↑" value="2"></v-radio>
          </v-radio-group> -->
          <v-select
            v-model="listQuery.orderby"
            :items="orderByOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="排序"
            single-line
            style="max-width: 50px;"
            class="mx-2"
          ></v-select>
          <v-select
            v-model="listQuery.village_id"
            :items="villages"
            item-text="name"
            item-value="id"
            menu-props="auto"
            hide-details
            label="村"
            single-line
            style="max-width: 50px;"
            class="mx-2"
            @change="getQuery"
          ></v-select>
          <v-text-field
            v-model="listQuery.customer_code"
            label="户主编号"
            hide-details
            single-line
            class="mx-2"
            style="max-width: 100px;"
          />
          <v-text-field
            v-model="listQuery.customer_name"
            label="姓名"
            hide-details
            single-line
            class="mx-2"
            style="max-width: 100px;"
          />
          <v-select
            v-model="listQuery.check_flag"
            :items="checkFlagOptions"
            item-text="display_name"
            item-value="key"
            menu-props="auto"
            hide-details
            label="状态"
            single-line
            style="max-width: 50px;"
            class="mx-2"
            @change="getQuery"
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
            class="mx-2"
            style="max-width: 50px;"
            @change="getQuery"
          ></v-select>
          <v-switch
            v-model="listQuery.choices_printed"
            label="方案打印"
            style="max-width: 120px;"
            class="mx-3"
          ></v-switch>
        </v-row>
      </div>
      <div>
        <v-row class="mt-2">
          <v-btn @click="getQuery" color="primary" class="mx-1">
            查询
            <v-icon right>mdi-magnify</v-icon>
          </v-btn>

          <v-btn @click="resetQuery" color="primary" class="mx-1">
            重置
            <v-icon right>mdi-lock-reset</v-icon>
          </v-btn>

          <export-excel
            v-if="isAdminRole"
            :fields="exportFields"
            worksheet="户主数据"
            name="九色鹿公寓房安置户主数据.xls"
            type="xls"
            :fetch="getListforExport"
          >
            <v-btn v-if="isAdminRole" color="primary" class="mx-1">
              导出
              <v-icon right>mdi-arrow-down-bold-circle-outline</v-icon>
            </v-btn>
          </export-excel>

          <div v-if="isAdminRole">
            <AddCustomerDialog />
          </div>
          <div v-if="isAdminRole">
            <CheckinCustomerDialog />
          </div>
          <div v-if="isAdminRole">
            <CheckoutCustomerDialog />
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
            <td>ID</td>
            <th>户主编号</th>
            <th>姓名</th>
            <th class="text-right">状态</th>
            <th>受托人</th>
            <th class="text-right">
              <v-icon color="blue" v-if="isAdminRole" x-small>
                mdi-grease-pencil
              </v-icon>
              入场号
            </th>
            <th class="text-right">
              <v-icon v-if="isAdminRole" x-small>
                mdi-grease-pencil
              </v-icon>
              抽签号
            </th>

            <th>身份证号</th>
            <th class="text-right">总面积</th>
            <th>剩余面积</th>
            <th>
              <v-icon v-if="isAdminRole" x-small> mdi-grease-pencil </v-icon
              >联系电话
            </th>
            <th class="text-right">
              <v-icon v-if="isAdminRole" x-small> mdi-grease-pencil </v-icon
              >人数
            </th>
            <th>所在村</th>
            <th>场次</th>
            <!-- <th>创建日期</th> -->
            <th>签到时间</th>
            <th>签退时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              {{ row.customer_code }}
            </td>
            <td style="font-size:14px">
              <v-row>
                <div v-if="row.contracts.length">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <div icon v-bind="attrs" v-on="on">
                        <v-badge
                          color="green"
                          offset-x="-3"
                          offset-y="16"
                          :content="row.contracts.length"
                        >
                          {{ row.name }}
                        </v-badge>
                      </div>
                    </template>
                    <span v-for="(c, i) in row.contracts" :key="i">
                      <v-chip class="ma-1" color="green" text-color="white">
                        <span v-for="(h, i) in c.houses" :key="i">
                          <h3>
                            {{ h.garden }}, {{ h.building }}幢{{ h.unit }}单元{{
                              h.number
                            }}, {{ h.area }}㎡
                          </h3>
                        </span> </v-chip
                      ><br />
                    </span>
                  </v-tooltip>
                </div>
                <div v-else>{{ row.name }}</div>
              </v-row>
            </td>
            <!-- <td class="text-right">
              <v-chip
                text-color="white"
                :color="row.check_flag == 0 ? greyColor : greenColor"
              >
                <h3>
                  {{ getNamefromOptions(checkFlagOptions, row.check_flag) }}
                </h3>
              </v-chip>
            </td> -->

            <td class="text-right">
              <span :class="`checkflag-status-${row.check_flag}`">
                {{
                  getNamefromOptions(checkFlagOptionsforList, row.check_flag)
                }}
              </span>
            </td>
            <td class="text-left">
              {{ row.sub_name }}
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="row.admission_sequence"
                @save="save(row)"
                @cancel="cancel"
                @open="open"
                @close="close"
                large
                save-text="保存"
                cancel-text="取消"
              >
                {{ row.admission_sequence }}
                <template v-slot:input>
                  <v-text-field
                    v-model="temp.admission_sequence"
                    label="输入入场号"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <div v-if="isAdminRole">
                <v-edit-dialog
                  :return-value.sync="row.lottery_sequence"
                  @save="save(row)"
                  @cancel="cancel"
                  @open="open"
                  @close="close"
                  large
                  save-text="保存"
                  cancel-text="取消"
                >
                  {{ row.lottery_sequence }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="temp.lottery_sequence"
                      label="输入抽签号"
                      single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </div>
              <div v-else>
                {{ row.lottery_sequence }}
              </div>
            </td>

            <td>
              {{ row.cardid }}
            </td>
            <td class="text-right">
              {{ row.myarea }}
            </td>
            <td class="text-right">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <div icon v-bind="attrs" v-on="on">
                    {{ row.myarea_remain }}
                  </div>
                </template>
                <span> 已选 {{ row.total_area }}㎡ </span>
              </v-tooltip>
            </td>
            <td>
              <div v-if="isAdminRole">
                <v-edit-dialog
                  :return-value.sync="row.phone"
                  @save="save(row)"
                  @cancel="cancel"
                  @open="open"
                  @close="close"
                  large
                  save-text="保存"
                  cancel-text="取消"
                >
                  {{ row.phone }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="temp.phone"
                      label="输入电话号码"
                      single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </div>
              <div v-else>
                {{ row.phone }}
              </div>
            </td>
            <td>
              <div v-if="isAdminRole">
                <v-edit-dialog
                  :return-value.sync="row.population"
                  @save="save(row)"
                  @cancel="cancel"
                  @open="open"
                  @close="close"
                  large
                  save-text="保存"
                  cancel-text="取消"
                >
                  {{ row.population }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="temp.population"
                      label="输入在册人数"
                      single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </div>
              <div v-else>
                {{ row.population }}
              </div>
            </td>
            <td>
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <div icon v-bind="attrs" v-on="on">
                    {{ row.village }}
                  </div>
                </template>
                <span>
                  {{ row.address }}
                </span>
              </v-tooltip>
            </td>
            <td>
              {{ row.batch_code }}
            </td>
            <!-- <td>
              {{
                $moment(row.create_at)
                  .utc()
                  .format("YYYY-MM-DD")
              }}
            </td> -->

            <td>
              <span v-if="row.checkin_time">
                {{
                  $moment(row.checkin_time)
                    .utc()
                    .format("MM-DD HH:mm:ss")
                }}
              </span>
            </td>
            <td>
              <span v-if="row.checkout_time">
                {{
                  $moment(row.checkout_time)
                    .utc()
                    .format("HH:mm:ss")
                }}
              </span>
            </td>
            <td>
              <v-btn
                v-if="isAdminRole"
                :color="icons.single.color"
                icon
                fab
                x-small
                @click="handlePrint(row)"
              >
                <v-icon left v-text="icons.single.icon" />
              </v-btn>
              <v-btn
                :color="icons.action.color"
                x-small
                icon
                fab
                @click="handleChoices(row)"
              >
                <v-icon left v-text="icons.action.icon" />
              </v-btn>
              <v-btn
                v-if="isAdminRole"
                color="warning"
                icon
                fab
                x-small
                @click="removeCustomer(row)"
              >
                <v-icon left v-text="icons.delete.icon" />
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
import {
  fetchCustomers,
  updateCustomer,
  deleteCustomer
} from "@/api/customers";

import { updateBillsByCustomerId } from "@/api/bills";
import { fetchVillagesList } from "@/api/villages";

const checkFlagOptions = [
  { key: 0, display_name: "✘.初始" },
  { key: 1, display_name: "✔.签到" },
  { key: 2, display_name: "Ο.签退" }
];

const checkFlagOptionsforList = [
  { key: 0, display_name: "✘" },
  { key: 1, display_name: "✔" },
  { key: 2, display_name: "Ο" }
];

const batchCodeOptions = [
  { key: "01", display_name: "01" },
  { key: "02", display_name: "02" },
  { key: "03", display_name: "03" }
];

const orderByOptions = [
  { key: "1", display_name: "入场号↑" },
  { key: "2", display_name: "抽签号↑" }
];

export default {
  name: "Customers",
  components: {
    AddCustomerDialog: () => import("./addCustomerDialog"),
    CheckinCustomerDialog: () => import("./checkinCustomerDialog"),
    CheckoutCustomerDialog: () => import("./checkoutCustomerDialog")
  },
  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,
    icons: {
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
        icon: "mdi-cash-100"
      },
      delete: {
        color: "green",
        icon: "mdi-delete"
      },
      heart: {
        color: "green",
        icon: "mdi-heart-box"
      },
      action: {
        color: "green",
        icon: "mdi-auto-fix"
      }
    },
    alert: false,
    alert_text: "",

    temp: {
      admission_sequence: undefined,
      lottery_sequence: undefined,
      population: undefined,
      phone: undefined
    },
    checkFlagOptions,
    checkFlagOptionsforList,
    batchCodeOptions,
    orderByOptions,
    items: [],
    // exportItems: [],
    listQuery: {
      page: 1,
      limit: 12,
      // order_by_lottery_sequence: undefined,
      customer_code: undefined,
      customer_name: undefined,
      status: undefined,
      remain_area_greater_twenty: undefined,
      sort: "+id",
      orderby: undefined,
      paged: 1,
      check_flag: undefined,
      village_id: undefined
    },
    villages: "",
    search: "",
    awaitingSearch: false,
    circle: true,
    disabled: false,
    length: 10,
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    totalVisible: 10,
    total_pages: 0,
    greenColor: "rgb(81, 185, 116)",
    greyColor: "rgb(130, 130, 130)",
    redColor: "rgb(200, 30, 30)",
    orangeColor: "rgb(220, 110, 11)",
    whiteColor: "rgb(255, 255, 255)",
    exportFields: {
      id: "id",
      户主编号: "customer_code",
      入场号: "admission_sequence",
      抽签号: "lottery_sequence",
      户主名称: "name",
      身份证号: {
        field: "cardid",
        callback: value => {
          return `'${value}`;
        }
      },
      受托人: "sub_name",
      受托人身份证号: {
        field: "sub_cardid",
        callback: value => {
          return `'${value}`;
        }
      },
      可选面积: "myarea",
      已选面积: "total_area",
      剩余面积: "myarea_remain",
      手机号码: "phone",
      所在片区: "village",
      地址: "address",
      场次: "batch_code",
      备注: "note",
      签到时间: "checkin_time",
      签退时间: "checkout_time",
      '125户型': "plan125",
      '110户型': "plan110",
      '90户型': "plan90",
      '75户型': "plan75",
    },
    checkin_status_0: "#949696",
    checkin_status_1: "#4ba946",
    checkin_status_2: "#e49723"
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
    this.getVillagesList();
  },
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
    changed() {},
    getList() {
      this.listLoading = true;
      this.listQuery.limit = 12;
      console.log(this.listQuery);
      fetchCustomers(this.listQuery).then(response => {
        this.items = response.data.items;
        this.total_pages = response.data._meta.total_pages;
        console.log(this.items);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    getVillagesList() {
      this.listLoading = true;
      fetchVillagesList().then(response => {
        this.villages = response.data.items;
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },

    getListforExport() {
      this.listLoading = true;
      this.listQuery.limit = 10000;
      fetchCustomers(this.listQuery).then(response => {
        this.exportItems = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      return this.exportItems;
    },

    handleUpdataBill(row) {
      // console.log(row.id)
      if (row.bill_is_updated) {
        this.$router.push({
          name: "结算管理",
          params: { id: row.id }
        });
      } else {
        this.$confirm("结算数据未生成，现在生成结算数据?").then(res => {
          const data = { customer_id: row.id };
          if (res) {
            updateBillsByCustomerId(data).then(response => {
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
        });
      }
    },

    resetQuery() {
      this.listQuery.orderby = undefined;
      this.listQuery.id = undefined;
      this.listQuery.customer_code = undefined;
      this.listQuery.customer_name = undefined;
      this.listQuery.status = undefined;
      this.listQuery.check_flag = undefined;
      this.listQuery.village_id = undefined;
      this.listQuery.remain_area_greater_twenty = undefined;
      this.getList();
      console.log("resetQuery");
    },

    handlePrint(row) {
      // console.log(row.id)
      this.$router.push({
        name: "打印客户",
        params: { id: row.id }
      });
    },

    handleChoices(row) {
      // console.log(row.id)
      this.$router.push({
        name: "户主详情",
        params: { id: row.id }
      });
    },

    addChoice(row) {
      // console.log(row.id)
      this.$router.push({
        name: "预选方案",
        params: { id: row.id }
      });
    },

    removeCustomer(row) {
      this.$confirm("确认删除户主资料?").then(res => {
        if (res) {
          deleteCustomer(row.id).then(response => {
            // console.log('response: ', response)
            if (response.data.error) {
              this.alert_text = response.data.error;
              this.alert = true;
            } else {
              this.getList();
              // Just to simulate the time of the request
              this.text = "户主资料删除成功！";
              this.snackbar = true;
            }
          });
        }
      });
    },

    paginationChangeHandler(pageNumber) {
      console.log("paginationChangeHandler, pageNumber: ", pageNumber);
      this.listQuery.page = pageNumber;
      this.getList();
    },

    reset() {
      this.$refs.form.reset();
    },

    resetValidation() {
      this.$refs.form.resetValidation();
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

    save(row) {
      var numReg = /^[0-9]*$/;
      var numRe = new RegExp(numReg);
      if (
        (this.temp.admission_sequence &&
          !numRe.test(this.temp.admission_sequence)) ||
        (this.temp.lottery_sequence &&
          !numRe.test(this.temp.lottery_sequence)) ||
        (this.temp.population && !numRe.test(this.temp.population)) ||
        (this.temp.phone && !numRe.test(this.temp.phone))
      ) {
        this.alert_text =
          "数据输入有误, " +
          "当前输入值为 " +
          this.temp.lottery_sequence +
          ";" +
          this.temp.population;
        ("，请输入有效数字！");
        this.alert = true;
      } else {
        this.alert = false;
        // var data = { lottery_sequence: this.lottery_sequence };
        updateCustomer(row.id, this.temp).then(response => {
          console.log(response.data);
          if (response.data.error) {
            this.alert_text = response.data.error;
            this.alert = true;
          } else {
            this.getList();
            // Just to simulate the time of the request
            this.text = row.name + " 数据更新完成!";
            this.snackbar = true;
          }
        });
        this.temp = {
          lottery_sequence: undefined,
          population: undefined,
          phone: undefined
        };
      }
    },

    cancel() {},
    open() {},
    close() {}
  }
};
</script>

<style lang="scss" scoped>
$colors: (0 #e49723, 1 #4ba946, 2 #23ade4);

$color: nth($colors, random(length($colors)));

@each $i in $colors {
  .checkflag-status-#{nth($i,1)} {
    color: nth($i, 2) !important;
    font-weight: 800;
  }
}

table,
thead,
tr {
  color: rgb(130, 130, 130);
  font-weight: 400;
}
td {
  text-align: center !important;
  vertical-align: middle;
}
</style>
