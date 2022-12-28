<template>
  <div>
    <v-row class="header">
      <v-col cols="12" md="2" class="header-col">
        <span class="d-flex justify-space-between mx-1 mb-0 coloredeer">
          <v-img class="logo" :src="require(`@/assets/${src}`)"></v-img>
        </span>
      </v-col>

      <v-col cols="12" md="8">
        <span v-if="operations.duration" class="operation-duratio-font">
          用时
        </span>
        <span v-if="operations.duration" class="operation-duration">
          {{ operations.duration }}
        </span>
      </v-col>

      <v-col cols="12" md="2" class="header-col">
        <v-row v-if="temp.customer.name" class="customer-card-row">
          <v-card class="remove-counts-card" outlined>
            <v-row>
              <span class="remove-counts-head">
                <div>剩余</div>
                <div>取消</div>
                <div>次数</div>
              </span>
              <span class="remove-counts-quantity">{{
                operations.removeCountsTotal - operations.removeCountsUsed
              }}</span>
            </v-row>
          </v-card>
          <v-card class="plan-card" outlined>
            <v-simple-table class="customer-table" bordered>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th
                      v-for="(p, i) in temp.customer.plans"
                      :key="i"
                      class="plan-areaitem-name"
                    >
                      {{ p.areaitem_name }}
                    </th>
                  </tr>
                  <tr>
                    <td
                      v-for="(p, i) in temp.customer.plans"
                      :key="i"
                      class="quantity"
                    >
                      {{ p.quantity }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
          <v-card class="customer-card" outlined>
            <div class="customer-name">
              {{ this.temp.customer.name }}
            </div>
            <div class="lottery">
              <span class="lottery-sequence-font">第</span>
              <span class="lottery_sequence">
                {{ temp.customer.lottery_sequence }}
              </span>
              <span class="lottery-sequence-font">号</span>
            </div>
          </v-card>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-row v-for="(garden, i) in gardens" :key="i" class="garden">
        <v-col
          v-for="(building, j) in garden.buildings"
          :key="j"
          class="building"
        >
          <div v-for="(unit, k) in building.units" :key="k">
            <v-simple-table class="house-table">
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th></th>
                    <td :colspan="unit.houseitems.length" class="building-head">
                      {{ building.name }}楼
                    </td>
                  </tr>
                  <tr>
                    <th></th>
                    <td
                      v-for="(houseitem, l) in unit.houseitems"
                      :key="l"
                      class="small-td"
                    >
                      {{ houseitem.areaitem_name }}
                    </td>
                  </tr>
                  <tr>
                    <th></th>
                    <td :colspan="unit.houseitems.length" class="building-head">
                      东←中→西
                    </td>
                  </tr>
                  <tr>
                    <th></th>
                    <td
                      v-for="(houseitem, l) in unit.houseitems"
                      :key="l"
                      class="small-td"
                    >
                      {{ houseitem.area }}
                    </td>
                  </tr>
                  <tr v-for="(floor, l) in unit.floors" :key="l">
                    <th class="floor">{{ floor.name }}F</th>
                    <!-- :class="`td-common-style-${house.status}`" -->
                    <td v-for="(house, m) in floor.houses" :key="m">
                      <v-btn
                        @click.stop="onClick(house)"
                        :class="
                          `td-btn-style-${
                            house.status
                          } td-btn-selected-style-${isSelected(house)}`
                        "
                        x-small
                        :disabled="getHouseDisabled(house)"
                      >
                        {{ house.number }}
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
      </v-row>
    </v-row>
    <v-row class="pannel">
      <v-col cols="12" md="10">
        <v-row>
          <span v-for="(label, i) in temp.labels" :key="i" class="selection">
            第 {{ i + 1 }} 套：{{ label.garden_name }}，{{
              label.building_name
            }}幢，{{ label.houses[0].number }}室 ({{ label.houses[0].area }}m²)
          </span>
        </v-row>
      </v-col>
      <v-col cols="12" md="2">
        <v-row>
          <v-text-field
            autofocus
            v-model="scan.value"
            class="my-scan ma-9"
            label=""
            hide-details
            single-line
            @input="handleScan"
            id="scan-input"
          />
          <!-- <v-btn
            v-if="temp.labels.length == temp.customer['plan_house_count']"
            color="primary"
            @click="addlogdialog = true"
            large
            class="my-button"
            >提交</v-btn
          > -->
          <div
            v-if="temp.labels.length == temp.customer['plan_house_count']"
            data-app
          >
            <CommitContractDialog :selection-data="temp" />
          </div>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// const baseUrl = "https://xuanfang.tuozhanad.com";
import { fetchGardens } from "@/api/gardens";
import { fetchLabel } from "@/api/labels";
import { createContracts } from "@/api/contracts";
import { fetchCustomerByCode } from "@/api/customers";

export default {
  name: "HuiminContract",

  components: {
    CommitContractDialog: () => import("./commitContractDialog")
  },

  data: () => ({
    src: "coloredeer.jpg",
    gardens: [],
    temp: {
      customer: {
        plans: []
      },
      labels: []
    },
    scan: {
      value: "",
      type: ""
    },
    operations: {
      removeCountsTotal: 0,
      removeCountsUsed: 0,
      plansOrign: [],
      plansSelected: [],
      duration: 0,
      startDataTime: ""
    },
    timer: 0,
    i: 0,
    timeout: 3000,
    addlogdialog: false
  }),

  mounted() {
    const scanInput = document.getElementById("scan-input");
    scanInput.addEventListener("blur", this.blurHandler)
    this.timer = setInterval(() => {
      // setTimeout(this.getGardens(), 0);
      // if (!this.addlogdialog) {
      //   setTimeout(scanInput.addEventListener("blur", this.blurHandler), 1);
      // }

      setTimeout(this.updateOperationDuration, 0);
    }, 1000 * 1);
  },

  computed: {},

  created() {
    this.getGardens();
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    updateOperationDuration() {
      console.log("updateOperationDuration");
      if (this.operations.startDataTime) {
        // const dt_now = Date.now();

        const duration = this.$moment().diff(
          this.operations.startDataTime,
          "seconds"
        );
        this.operations.duration = this.$moment
          .utc(duration * 1000)
          .format("HH:mm:ss");
      }
    },

    getGardens() {
      fetchGardens(this.listQuery).then(response => {
        this.gardens = response.data.items;
        // console.log(this.gardens)
      });
    },

    resetData() {
      this.temp = {
        customer: {
          plans: []
        },
        labels: []
      };

      this.operations = {
        removeCountsTotal: 0,
        removeCountsUsed: 0,
        plansOrign: [],
        plansSelected: [],
        duration: 0,
        startDataTime: null
      };
    },

    getHouseDisabled(house) {
      const plan = this.temp.customer.plans.find(
        p => p.areaitem_keyname == house.areaitem_keyname
      );

      // const plan_operation = this.operations.plansOrign.find(
      //   p => p.areaitem_keyname == house.areaitem_keyname
      // );

      if (
        (plan && plan.quantity > 0 && house.status == 0) ||
        this.isSelected(house)
      ) {
        return false;
      }
      return true;
    },

    isSelected(house) {
      // console.log(house, this.temp.labels);
      const is_selected = this.temp.labels.find(
        l => l.houses[0].id == house.id
      );
      if (is_selected) return 1;
      return 0;
    },

    blurHandler() {
      const scanInput = document.getElementById("scan-input");
      scanInput.focus();
    },

    handleScan() {
      console.log("handleScan");
      if (this.scan.value.length == 8) {
        this.scan.type = this.scan.value.substr(0, 1);
        if (this.scan.type == "8") {
          const customer_code = Number(this.scan.value.substr(0, 7));
          console.log("customer_code: ", customer_code);
          this.getCustomerByCode(customer_code);
        }
      }
    },

    // get_removeCounts(plans) {
    //   plans.map(p => (this.removeCounts[p.areaitem_keyname] = p.quantity));
    // },

    setRemoveCounts(plans) {
      var count = 0;
      plans.map(p => (count += p.quantity));
      this.operations.removeCountsTotal = count;
    },

    getCustomerByCode(customer_code) {
      console.log("getCustomer");
      fetchCustomerByCode(customer_code).then(response => {
        this.temp.customer = response.data;

        this.setRemoveCounts(response.data.plans);
        this.operations.plansOrign = response.data.plans;
        this.operations.startDataTime = Date.now();

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      this.scan = {
        type: "",
        value: ""
      };
      console.log("getCustomerByCode");
    },

    onClick(house) {
      if (this.isSelected(house)) {
        this.removeLabels(house);
      } else {
        this.addToLabels(house);
      }
    },

    // updateCustomerPlanQuantity(house, actionName) {
    //   const areaitem_keyname = house.areaitem_keyname;
    //   if (actionName == "add") {
    //     this.temp.customer.plans[areaitem_keyname].quantity += 1;
    //   } else if (actionName == "remove") {
    //     this.temp.customer.plans[areaitem_keyname].quantity -= 1;
    //   }
    // },

    updateCustomerPlanQuantity(house, actionName) {
      const planIndex = this.temp.customer.plans.findIndex(
        p => p.areaitem_keyname == house.areaitem_keyname
      );
      if (actionName == "add") {
        this.temp.customer.plans[planIndex].quantity =
          this.temp.customer.plans[planIndex].quantity - 1;
      } else if (actionName == "remove") {
        this.temp.customer.plans[planIndex].quantity =
          this.temp.customer.plans[planIndex].quantity + 1;
      }
    },

    addToLabels(house) {
      console.log("addToLabels");
      const areaitem_keyname = house.areaitem_keyname;
      fetchLabel(house.label_id).then(response => {
        this.label_code = "";
        var label = response.data;

        var found = 0;
        if (this.temp.labels) {
          found = this.temp.labels.find(l => l.id == label.id);
        }

        if (response.data.status != 0) {
          this.alert = true;
          this.alert_text = "号签状态不匹配";
          console.log("号签状态不匹配");
        } else if (!found) {
          this.alert = false;

          const plansOrign = this.temp.customer.plans.find(
            p => p.areaitem_keyname == areaitem_keyname
          );

          const plansSelectedQuantity = 0;
          if (this.operations.plansSelected[areaitem_keyname]) {
            const plansSelectedQuantity = this.operations.plansSelected[
              areaitem_keyname
            ];
          }

          if (plansOrign.quantity > plansSelectedQuantity) {
            this.temp.labels.push(label);
            this.updateCustomerPlanQuantity(house, "add");
          }
        }

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      this.scan = {
        type: "",
        value: ""
      };
    },

    removeLabels(house) {
      console.log("removeLabels");
      // const areaitem_keyname = house.areaitem_keyname;

      // if (this.removeCounts[areaitem_keyname] > 0) {
      //   const labelIndex = this.temp.labels.findIndex(
      //     l => l.houses[0].id == house.id
      //   );
      //   console.log("labelIndex: ", labelIndex);
      //   this.temp.labels.splice(labelIndex, 1);
      //   this.updateCustomerPlanQuantity(house, "remove");
      //   this.removeCounts[areaitem_keyname] =
      //     this.removeCounts[areaitem_keyname] - 1;
      // } else {
      //   console.log("取消次数已用完");
      // }

      if (
        this.operations.removeCountsTotal - this.operations.removeCountsUsed >
        0
      ) {
        const labelIndex = this.temp.labels.findIndex(
          l => l.houses[0].id == house.id
        );
        console.log("labelIndex: ", labelIndex);
        this.temp.labels.splice(labelIndex, 1); //根据索引删除原始
        this.updateCustomerPlanQuantity(house, "remove");
        this.operations.removeCountsUsed += 1;
      } else {
        console.log("取消次数已用完");
      }
    },

    confirmAddScanDialog() {
      const tempData = this.temp;
      const id = this.$route.params.id;
      createContracts(tempData).then(() => {
        this.dialogScan = false;
        this.scan = {
          type: "",
          value: ""
        };
        this.temp = {
          customer: {},
          labels: []
        };
        this.label_code = "";
        this.getGardens();
      });
    },

    cancelAddScanDialog() {
      this.dialogScan = false;
      this.scan = {
        type: "",
        value: ""
      };
      this.temp = {
        customer: {},
        labels: []
      };
      console.log("cancelAddScanDialog");
    }
  },

  length_bigger_than_five(name) {
    if (name.length > 5) {
      return 1;
    } else {
      return 0;
    }
  }
};
</script>

<style lang="scss" scoped>
body {
  background-color: #070707;
}

.title {
  padding: 5px 0;
  margin: 0 0;
  display: flex;
  text-align: center;
}

.total {
  padding: 0 0;
  margin: 0 0;
  display: flex;
  text-align: center;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.house-table {
  height: 1162px;
  // background-color: #0C1E2A;
  background-color: #132a3a;
}

.coloredeer {
  background-color: #0c1e2a;
}

.pannel {
  height: 146px;
  color: #f6f6f6;
  background-color: #0c1e2a;
  padding: auto;
  margin: auto;
}

.header {
  background-color: #0c1e2a;
  height: 125px;
}

.header-col {
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}

.v-data-table {
  border-spacing: 10px 5px !important;
  border-collapse: separate !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  line-height: 1.5 !important;
}

th {
  height: 32px !important;
  font-size: 11px !important;
  color: #89d9e0 !important;
  font-weight: 800 !important;
  padding: 0 4px 0 4px !important;
}

$fontsize: (0 19px, 1 12px);

@each $i in $fontsize {
  .fontsize-td-#{nth($i,1) } {
    font-size: nth($i, 2) !important;
  }
}

td {
  height: 40px !important;
  // font-size: 12px !important;
  color: #b9ae8c !important;
  font-weight: 800;
  text-align: right;
  padding: 0 !important;
  margin: 0 !important;
}

$colors: (1 #276c9b, 2 #415661, 3 #415661, 4 #415661, 9 #415661);

// @each $i in $colors {
//   .td-common-style-#{nth($i, 1)} {
//     background-color: nth($i, 2) !important;
//     height: 40px !important;
//     font-size: 16px !important;
//     font-weight: 600;
//     text-align: right;
//     padding: 0 5px 0 5px !important;
//     margin: 0 !important;
//   }
// }

$btncolors: (0 #f0e1cc, 1 #f8fafa, 2 #f8fafa, 3 #f8fafa, 4 #f8fafa, 9 #f8fafa);

@each $j in $btncolors {
  .td-btn-style-#{nth($j, 1)} {
    color: nth($j, 2) !important;
    font-size: 18px !important;
    font-weight: 800;
    margin: 0 4px 0 4px !important;
    padding: 0 1px 0 1px !important;
  }
}

$selectedbtncolors: (0 #22557b, 1 #e96c18);

@each $j in $selectedbtncolors {
  .td-btn-selected-style-#{nth($j, 1)} {
    background-color: nth($j, 2) !important;
    // color:#a7b7c0;
  }
}

.v-btn:disabled {
  color: #7a7a7a !important;
  // background-color: #74f10d !important;
}

tr:hover {
  background-color: #132a3a !important;
}

th:hover {
  background-color: #132a3a !important;
}

td:hover {
  background-color: #3b79a5 !important;
  color: #f37454 !important;
  font-weight: 800 !important;
}

.title {
  color: #ff3b0a;
  font-size: 44px;
  font-weight: 800;
  padding: 0;
  text-shadow: 2px 0px #fa947a;
}

.logo {
  width: 240px;
  padding: 0 0 0 0;
  margin: 30px 5px 5px 20px;
}

.footprint {
  color: #f7f3f3;
  font-size: 22px;
  font-weight: 400;
  margin: 0 10px 0 24px;
}

.garden {
  background-color: #8ca6b9;
  padding: 0 28px 0 25px !important;
}

.building {
  color: #ede5b8;
  margin: 2px !important;
  padding: 0 0 0 0 !important;
  background-color: #132a3a;
}

.unit {
  background-color: #ede5b8;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}

.floor {
  background-color: #6b653f;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}

.house {
  background-color: #8ca6b9;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}

.number {
  color: #ede5b8;
  margin: auto;
  padding: auto;
  width: 100;
}

.building-head {
  text-align: center !important;
  font-size: 20px !important;
  color: #d5ad60 !important;
}

.small-td {
  text-align: center !important;
  font-size: 14px !important;
  font-weight: 800;
  color: #d5ad60 !important;
}

.selection {
  text-align: left !important;
  font-size: 25px !important;
  font-weight: 500;
  margin: 0 30px 0 30px;
  padding: 0 10px 0 10px;
  color: #f6914d !important;
}

.my-scan {
  text-align: center !important;
  font-size: 50px !important;
  font-weight: 800;
  color: #0c1e2a !important;
}

.customer {
  color: #a7b7c0;
  font-size: 20px;
  font-weight: 800;
  margin: auto;
  padding: auto;
  // text-align: right !important;
}

.customer-info {
  text-align: left !important;
  font-size: 30px !important;
  font-weight: 800 !important;
  color: #ede5b8 !important;
  margin: 70px 0 0 0;
  padding: 0 0 0 0;
}

// .customer-name-col {
//   padding: 0 0 0 0 !important;
//   margin: 0 0 0 0 !important;
// }

.customer-card {
  margin: 10px 5px 10px 0px;
  padding: 0px 0px 0px 8px;
  border-style: solid;
  border-width: 2px;
  // border: #b0e6a3;
  border-color: #8ca6b9;
  background-color: #0c1e2a;
  width: 140px;
  height: 100px;
}

.plan-card {
  margin: 10px 5px 10px 0px;
  padding: 10px 3px 0 0;
  border-style: solid;
  border-width: 2px;
  // border: #b0e6a3;
  border-color: #8ca6b9;
  background-color: #0c1e2a;
  width: 170px;
  height: 100px;
}

.remove-counts-card {
  margin: 10px 5px 10px 0px;
  padding: 10px 8px 0 0;
  border-style: solid;
  border-width: 2px;
  // border: #b0e6a3;
  border-color: #8ca6b9;
  background-color: #0c1e2a;
  width: 105px;
  height: 100px;
}

.plan-col {
  margin: 0 !important;
  padding: 0 !important;
}

.customer-table {
  background-color: #0c1e2a;
  // background-color: #64727c;
}

.customer-name {
  color: #f6914d;
  font-size: 40px;
  font-weight: 800;
  margin: 0;
  padding: 3px 0 0 0;
  // padding: 15px 0 0 20px !important;
}

.lottery {
  padding: 0 0 0 2px !important;
  margin: 0;
}

.lottery_sequence {
  color: #3996c9;
  font-size: 30px;
  font-weight: 800;
  padding: 0 !important;
}

.lottery-sequence-font {
  color: #d5ad60;
  font-size: 20px;
  padding: 0 0 0 0 !important;
}

.remove-counts-head {
  font-size: 18px !important;
  font-weight: 800 !important;
  color: #d5ad60 !important;
  padding: 0 0 0 20px !important;
}

.remove-counts-quantity {
  color: #3996c9 !important;
  padding: 0 0 10px 10px !important;
  font-size: 70px !important;
  text-align: center !important;
  height: 10px !important;
}

.plan-areaitem-name {
  font-size: 18px !important;
  font-weight: 800 !important;
  color: #d5ad60 !important;
  padding: 0 0 0 0 !important;
}

.quantity {
  color: #3996c9 !important;
  padding: 0 0 0 0 !important;
  font-size: 34px !important;
  text-align: center !important;
  height: 10px !important;
}

.v-input input {
  font-size: 50px !important;
}

.v-icon {
  color: white !important;
}

.my-button {
  font-size: 30px;
  font-weight: 400;
  margin: 10px;
  background-color: #8ca6b9 !important;
  color: #0c1e2a !important;
}

.floor {
  color: #d5ad60 !important;
  background-color: #132a3a !important;
  font-size: 12px !important;
  font-weight: 800 !important;
  text-align: right !important;
}

.operation-duratio-font {
  color: #d5ad60;
  font-size: 20px;
  padding: 0 10px 0 0 !important;
}

.operation-duration {
  color: #d5ad60 !important;
  font-size: 100px !important;
  font-weight: 800 !important;
  // text-align: right !important;
  // margin: 20px 0 0 0;
}

// .v-app {
//   background-color: #0C1E2A !important;
// }

// .v-application--wrap {
//   max-height: 10px !important;
// }
</style>
