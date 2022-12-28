<template>
  <div>
    <v-row class="header">
      <v-col cols="12" md="1" class="header-col">
        <span class="d-flex justify-space-between mx-1 mb-0 coloredeer">
          <v-img class="logo" :src="require(`@/assets/${src}`)"></v-img>
        </span>
      </v-col>

      <v-col cols="12" md="9" class="operation_duration">
        <span v-if="operation_duration">
          {{ operation_duration }}
        </span>
      </v-col>

      <v-col cols="12" md="2" class="header-col">
        <v-row v-if="temp.customer.name">
          <v-col cols="12" md="5">
            <div class="customer_name">
              {{ this.temp.customer.name }}
            </div>
            <div class="lottery">
              <span class="lottery_sequence_font">第</span>
              <span class="lottery_sequence">
                {{ temp.customer.lottery_sequence }}
              </span>
              <span class="lottery_sequence_font">号</span>
            </div>
          </v-col>
          <v-col cols="12" md="7" class="header-col">
            <v-card class="customer-card" outlined>
              <v-simple-table class="customer-table" bordered>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th></th>
                      <th
                        v-for="(p, i) in temp.customer.plans"
                        :key="i"
                        class="areaitem_name"
                      >
                        {{ p.areaitem_name }}
                      </th>
                    </tr>
                    <tr>
                      <!-- <td class="areaitem_name">✔ 可选</td> -->
                      <td class="areaitem_name">可选</td>
                      <td
                        v-for="(p, i) in temp.customer.plans"
                        :key="i"
                        class="quantity"
                      >
                        × {{ p.quantity }}
                      </td>
                    </tr>
                    <tr>
                      <!-- <td class="areaitem_name">✗ 取消</td> -->
                      <td class="areaitem_name">取消</td>
                      <td class="quantity">× {{ removeCounts["large"] }}</td>
                      <td class="quantity">× {{ removeCounts["medium"] }}</td>
                      <td class="quantity">× {{ removeCounts["small"] }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
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
                          } td-btn-selected-style-${get_selected(house)}`
                        "
                        x-small
                        :disabled="get_house_disabled(house)"
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
    removeCounts: {},

    timer: 0,
    i: 0,
    timeout: 3000,
    addlogdialog: false,
    operation_duration: 0,
    operate_start: ""
  }),

  mounted() {
    const scanInput = document.getElementById("scan-input");
    this.timer = setInterval(() => {
      // setTimeout(this.getGardens(), 0);
      setTimeout(scanInput.addEventListener("blur", this.blurHandler), 0);
      setTimeout(this.update_operation_duration, 0);
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
    update_operation_duration() {
      console.log("update_operation_duration");
      if (this.operate_start) {
        // const dt_now = Date.now();

        const duration = this.$moment().diff(this.operate_start, "seconds");
        this.operation_duration = this.$moment
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

    resetCustomer() {
      this.temp = {
        customer: {
          plans: []
        },
        labels: []
      };
    },

    get_house_disabled(house) {
      const is_selected = this.temp.labels.find(
        l => l.houses[0].id == house.id
      );
      const plan = this.temp.customer.plans.find(
        p => p.areaitem_keyname == house.areaitem_keyname
      );

      if ((plan && plan.quantity > 0 && house.status == 0) || is_selected) {
        return false;
      }
      return true;
    },

    get_selected(house) {
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

    get_removeCounts(plans) {
      plans.map(p => (this.removeCounts[p.areaitem_keyname] = p.quantity));
    },

    getCustomerByCode(customer_code) {
      console.log("getCustomer");
      fetchCustomerByCode(customer_code).then(response => {
        this.temp.customer = response.data;

        this.get_removeCounts(response.data.plans);
        this.operate_start = Date.now();
        console.log("this.removeCounts: ", this.removeCounts);

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

    updateCustomerPlanQuantity(house, type) {
      const planIndex = this.temp.customer.plans.findIndex(
        p => p.areaitem_keyname == house.areaitem_keyname
      );
      if (type == "add") {
        this.temp.customer.plans[planIndex].quantity =
          this.temp.customer.plans[planIndex].quantity - 1;
      } else {
        this.temp.customer.plans[planIndex].quantity =
          this.temp.customer.plans[planIndex].quantity + 1;
      }
    },

    onClick(house) {
      if (this.get_selected(house)) {
        this.removeLabels(house);
      } else if (
        this.temp.labels.length < this.temp.customer["plan_house_count"]
      ) {
        this.addToLabels(house);
      }
    },

    removeLabels(house) {
      console.log("removeLabels");
      const areaitem_keyname = house.areaitem_keyname;
      console.log(
        "areaitem_keyname, this.removeCounts[areaitem_keyname]: ",
        areaitem_keyname,
        this.removeCounts[areaitem_keyname]
      );
      if (this.removeCounts[areaitem_keyname] > 0) {
        const labelIndex = this.temp.labels.findIndex(
          l => l.houses[0].id == house.id
        );
        console.log("labelIndex: ", labelIndex);
        this.temp.labels.splice(labelIndex, 1);
        this.updateCustomerPlanQuantity(house, "subraction");
        this.removeCounts[areaitem_keyname] =
          this.removeCounts[areaitem_keyname] - 1;
      } else {
        console.log("取消次数已用完");
      }
    },

    addToLabels(house) {
      console.log("addToLabels");
      fetchLabel(house.label_id).then(response => {
        this.label_code = "";
        var new_label = response.data;

        var found = 0;
        if (this.temp.labels) {
          found = this.temp.labels.find(element => element.id == new_label.id);
        }

        if (response.data.status != 0) {
          this.alert = true;
          this.alert_text = "号签状态不匹配";
        } else if (!found) {
          this.alert = false;
          this.temp.labels.push(new_label);
          this.updateCustomerPlanQuantity(house, "add");
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
  max-width: 180px;
  padding: 0 0 0 0;
  margin: 8px 5px 5px 30px;
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

.customer_name {
  color: #f6914d;
  font-size: 48px;
  font-weight: 800;
  padding: 10px 0 0 20px !important;
}

.lottery {
  padding: 0 0 0 22px !important;
}

.lottery_sequence {
  color: #3996c9;
  font-size: 32px;
  font-weight: 800;
  padding: 0 10px 0 10px !important;
}

.lottery_sequence_font {
  color: #d5ad60;
  font-size: 20px;
  padding: 0 0 0 0 !important;
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

.customer-card {
  margin: 5px 23px 0 25px;
  padding: 0px 0px 0px 0;
  border-style: solid;
  border-width: 1px;
  // border: #b0e6a3;
  border-color: #8ca6b9;
  background-color: #0c1e2a;
  width: 210px;
}

.customer-table {
  background-color: #0c1e2a;
  // background-color: #64727c;
}

.areaitem_name {
  font-size: 18px !important;
  font-weight: 800 !important;
  color: #d5ad60 !important;
  padding: 0 0 0 0 !important;
}

.quantity {
  color: #3996c9 !important;
  padding: 0 0 0 0px !important;
  font-size: 24px !important;
  text-align: center !important;
  height: 10px !important;
}

.floor {
  color: #d5ad60 !important;
  background-color: #132a3a !important;
  font-size: 12px !important;
  font-weight: 800 !important;
  text-align: right !important;
}

.operation_duration {
  color: #d5ad60 !important;
  font-size: 100px !important;
  font-weight: 800 !important;
  text-align: right !important;
  // margin: 20px 0 0 0;
}

// .v-app {
//   background-color: #0C1E2A !important;
// }

// .v-application--wrap {
//   max-height: 10px !important;
// }
</style>
