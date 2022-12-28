<template>
  <v-container fluid tag="section">
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
    <v-row>
      <v-col cols="6" sm="6" md="6">
        <v-text-field
          autofocus
          v-model="scan.value"
          prepend-icon="mdi-barcode"
          class="ml-auto"
          label="扫码输入"
          hide-details
          single-line
          @input="handleScan"
          style="max-width: 300px;"
        />
      </v-col>
      <v-col cols="6" sm="6" md="6">
        <v-autocomplete
          v-model="temp.customer_id"
          :items="customersList"
          :loading="isLoading"
          chips
          clearable
          hide-details
          hide-selected
          item-text="name"
          item-value="id"
          label="输入户主姓名或者编号..."
          solo
          style="max-width: 300px;"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                ColoreDeer
                <strong>九色鹿抽签管理系统</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:selection="{ attr, on, item, selected }">
            <v-chip
              v-bind="attr"
              :input-value="selected"
              color="blue-grey"
              class="white--text"
              v-on="on"
            >
              <span v-text="item.name"></span>
            </v-chip>
          </template>
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-card class="mt-3 mx-3 px-12 py-6">
      <div class="ma-3 px-10 py-10">
        <v-row
          v-if="customer.choices_selected.length > 0"
          class="d-flex justify-end"
        >
          <v-btn v-print="printObj" class="primary mr-5">
            <v-icon left small>mdi-printer</v-icon>打印
          </v-btn>
          <v-btn @click="deleteCustomerChoices" class="primary mr-5">
            <v-icon left small>mdi-delete</v-icon>清空
          </v-btn>
        </v-row>
        <div id="printMe">
          <v-row class="ml-3">
            <v-col>
              <v-chip>
                <h1>
                  {{ customer.name }}
                </h1>
              </v-chip>
              <v-row class="ml-6">
                <v-icon>mdi-map-marker</v-icon>
                <span class="my-2 ml-1 mr-6">{{ customer.village }} </span>
                <v-icon v-if="customer.phone">mdi-phone</v-icon>
                <span class="my-2 ml-1 mr-6">{{ customer.phone }} </span>
                <span class="my-2 ml-1 mr-6"
                  >总面积 {{ customer.myarea }} m²，剩余可选
                  {{ customer.remain_area }} m²
                </span>
              </v-row>
            </v-col>
            <v-col>
              <v-row class="d-flex justify-end">
                <v-btn @click="goBack" class="primary mx-3 mt-5">
                  <v-icon left>mdi-arrow-left-bold</v-icon> 返回
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="ml-3 mt-4 mb-2">
            <v-chip v-if="customer.choices_selected.length > 0" class="mr-10">
              <v-icon color="white">mdi-check</v-icon>
            </v-chip>

            <v-row v-for="c in customer.choices_selected" :key="c.id">
              <span
                :class="
                  `ma-1 text-right choice_background-${c.garden_id} box-shadow-${c.deliver_type}`
                "
              >
                {{ c.box_name }}
              </span>
              <span class="mt-2 text-right" style="color:grey;font-weight:400">
                {{ c.garden_name }}
                {{ c.area.toFixed(2) }}㎡
              </span>
              <!-- <v-icon color="info">mdi-home</v-icon> -->
            </v-row>
          </v-row>
        </div>

        <div class="mx-3" v-if="details.choices">
          <v-row
            class="d-flex justify-end mx-1 mb-1 mt-8"
            style="font-size:13px"
            color="secondary"
          >
            满足除最后一套外剩余面积（ >=80可以选取中套，>=20可以选取小套
            ）条件的所有方案，以总面积从大到小列出
          </v-row>
          <v-divider v-if="details.choices" class="mt-2" />
          <v-simple-table dense v-if="details.choices">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    序号
                  </th>
                  <th class="text-left">
                    差额(红为超)
                  </th>
                  <th class="text-left">
                    方案
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in details.choices" :key="i">
                  <td class="grey--text text-left" style="font-size:12px">
                    {{ i + 1 }}
                  </td>
                  <td class="text-left">
                    <v-chip class="ma-0 red-outlined-chip" label outlined>
                      <h3
                        :style="{
                          color:
                            item.total_area - customer.remain_area > 0
                              ? 'rgb(252, 115, 90)'
                              : 'rgb(106, 190, 110)'
                        }"
                      >
                        {{
                          (item.total_area - customer.remain_area).toFixed(2)
                        }}
                      </h3>
                    </v-chip>
                  </td>
                  <td v-for="(l, j) in item.choices" :key="j" class="text-left">
                    <v-row>
                      <span
                        :class="
                          `ma-1 text-right choice_background-${l.garden_id} box-shadow-${l.deliver_type}`
                        "
                      >
                        {{ l.box_name }}
                      </span>
                      <span
                        class="mt-2 text-right"
                        style="color:grey;font-weight:400"
                      >
                        {{ l.garden_name }}
                        {{ l.area.toFixed(2) }}㎡
                      </span>
                    </v-row>
                  </td>
                  <td class="text-right text-right">
                    <v-btn
                      class="px-1 ml-1"
                      icon
                      small
                      color="info"
                      @click="addCustomerChoices(item.choices)"
                    >
                      <v-icon v-text="action.icon" />
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <span> </span>
        </div>
      </div>

      <v-divider class="mt-0"></v-divider>
      <v-row class="mb-5">
        <v-checkbox
          v-for="(g, index) in gardens"
          multiple
          v-model="select_gardens"
          :key="index"
          :value="g.id"
          :label="g.name"
          hide-details
          :class="`background-${g.id} ml-8 mt-7`"
          @change="getBoxesListByPost()"
        />
      </v-row>

      <div class="d-flex justify-start mx-2 mb-6 ">
        <v-col v-for="(item, index) in boxes" :key="index">
          <!-- icon="mdi-lock" -->
          <v-badge
            bordered
            overlap
            :color="
              b.free_choice_count === '00' || get_disabled(b)
                ? greyColor
                : greenColor
            "
            :content="b.free_choice_count"
            v-for="b in item"
            :key="b.id"
            offset-y="21"
          >
            <v-btn
              :class="
                `get_disabled(b) ? greyColor : box-${get_disabled(b)}-${
                  b.garden_id
                } box-outlined-${b.deliver_type} my-1`
              "
              :disabled="get_disabled(b)"
              outlined
              @click="goBack"
            >
              {{ b.name + "," + b.area + "㎡" }}
            </v-btn>
          </v-badge>
        </v-col>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { fetchCustomer, fetchCustomerByCode } from "@/api/customers";
import { fetchBoxesListByPost, fetchBoxesListByPost2 } from "@/api/boxes";
import { fetchGardensList } from "@/api/gardens";
import { createChoice, deleteChoice } from "@/api/choices";
import { fetchAreaitems } from "@/api/areaitems";
import { fetchCustomersList } from "@/api/customers";
// import { ModelListSelect } from "vue-search-select";

export default {
  name: "AddChoice",

  components: {},

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 3000,
      dt_now: "",
      action: {
        color: "grey",
        icon: "mdi-checkbox-marked"
      },

      color: "#555",
      icons: {
        left: "mdi-chevron-left",
        right: "mdi-chevron-right",
        info: "mdi-exclamation",
        success: "mdi-check",
        warning: "mdi-alert",
        error: "mdi-close"
      },
      greyColor: "#444",
      greenColor: "#338833",
      details: {},
      gardens: [],
      select_gardens: [],
      params: {
        labels_quantity: 1,
        boxes: []
      },

      scan: {
        value: "",
        type: ""
      },
      maxNumberOfChoices: 0,
      customer: {},
      customersList: [],
      boxes: {},
      temp: {
        customer_id: "",
        labelitems: []
      },
      areaitems_max_area: {},
      printObj: {
        id: "printMe",
        popTitle: "good print",
        extraCss: "https://www.baidu.com",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      printCertificateObj: {
        id: "printCertificate",
        popTitle: "方案列表",
        extraCss: "https://www.baidu.com",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
    };
  },

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
    console.log('aaaaa')
    this.getCustomers();
    this.getAreaitems();
    // this.getCustomer(this.$route.params.id);
    this.getBoxesListByPost();
    this.getGardensList();
    this.dt_now = Date.now();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    getCustomers() {
      fetchCustomersList().then(response => {
        this.customersList = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      console.log("customersList:", this.customersList);
    },

    get_disabled(b) {
      console.log('get_disabled')
      if (
        b.free_choice_count == 0 ||
        this.customer.myarea_remain < 20 ||
        (b.area >= 80 &&
          this.customer.myarea_remain < 80 &&
          this.areaitems_max_area["小户型"] > this.customer.myarea_remain) ||
        (b.area >= 100 &&
          this.customer.myarea_remain < 100 &&
          this.areaitems_max_area["中户型"] > this.customer.myarea_remain) ||
        !this.select_gardens.includes(b.garden_id)
      ) {
        return true;
      } else {
        return false;
      }
    },

    getAreaitems() {
      this.listLoading = true;
      console.log('getAreaitems')
      fetchAreaitems().then(response => {
        this.areaitems_max_area = response.data;
        console.log("this.areaitems_max_area: ", this.areaitems_max_area);
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },

    getBoxesListByPost() {
      this.listLoading = true;
      this.getAreaitems;
      this.params.boxes = [];
      var data = { gardens: this.select_gardens };
      fetchBoxesListByPost2(data).then(response => {
        this.boxes = response.data.items;

        console.log(this.boxes);
        setTimeout(() => {
          this.listLoading = false;
        }, 3 * 1000);
      });
    },

    getGardensList() {
      this.listLoading = true;
      fetchGardensList().then(response => {
        this.gardens = response.data.items;
        // 默认选择所有小区
        // this.select_gardens = this.gardens.map(x => {
        //   return x.id;
        // });
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },

    onClick(labelitem) {
      this.temp.labelitems.push(labelitem);
    },

    addCustomerChoices(item) {
      this.$confirm("确定提交方案?").then(res => {
        if (res) {
          this.temp.customer_id = this.$route.params.id;
          this.temp.labelitems = item;
          console.log("this.temp: ", this.temp);
          createChoice(this.temp).then(response => {
            this.text = this.customer.name + " 的预选方案录入完成！";
            this.snackbar = true;
            setTimeout(() => {
              this.getAreaitems();
              this.getCustomerChoices();
              this.getBoxesListByPost();
              this.getCustomer(this.temp.customer_id);
            }, 1 * 1000);
          });
        }
      });
    },

    deleteCustomerChoices(item) {
      this.$confirm("确定需要清空方案?").then(res => {
        if (res) {
          this.temp.customer_id = this.$route.params.id;
          deleteChoice(this.temp).then(response => {
            this.text = this.customer.name + " 预选方案已清空";
            this.snackbar = true;
            setTimeout(() => {
              this.getCustomerChoices();
              this.getCustomer(this.$route.params.id);
            }, 1 * 1000);
          });
        }
      });
    },

    handleScan() {
      console.log("handleScan");
      if (this.scan.value.length == 8) {
        this.scan.type = this.scan.value.substr(0, 1);
        if (this.scan.type == "8") {
          const customer_code = Number(this.scan.value.substr(1, 6));
          console.log("customer_code: ", customer_code);
          this.getCustomerByCode(customer_code);
        }
      }
    },

    getCustomerByCode(customer_code) {
      console.log("getCustomer");
      fetchCustomerByCode(customer_code).then(response => {
        this.customer = response.data;

        this.maxNumberOfChoices =
          Math.ceil((response.data.myarea + 20) / 80) + 1;
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

    getCustomer(id) {
      this.listLoading = true;
      fetchCustomer(id).then(response => {
        this.customer = response.data;

        this.maxNumberOfChoices =
          Math.ceil((response.data.myarea + 20) / 80) + 1;
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },

    getNamefromOptions(options, key) {
      let showname = "";
      options.forEach(item => {
        if (item.key === key) {
          showname = item.display_name;
        }
      });
      return showname;
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>
<style scope lang="scss">
.A4 {
  background: white;
  width: 794px;
  height: 1122px;
  display: block;
  overflow-y: auto;
  box-sizing: border-box;
}

$colors: (
  1 #9b6449,
  2 #815088,
  3 #a77e33,
  4 #4c7c20,
  5 #2f4294,
  6 #923d4b,
  7 #387e6c,
  8 #625fc5,
  9 #12506d,
  10 #754719
);

$color: nth($colors, random(length($colors)));

@each $i in $colors {
  .choice_background-#{nth($i,1)} {
    background-color: nth($i, 2) !important;
    color: rgb(241, 233, 233) !important;
    font-weight: 500 !important;
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}

@each $i in $colors {
  .background-#{nth($i,1) label} {
    background-color: nth($i, 2) !important;
    color: rgb(241, 233, 233) !important;
    font-weight: 500 !important;
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

@each $i in $colors {
  .box-false-#{nth($i,1)} {
    background-color: nth($i, 2) !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
}

@each $i in $colors {
  .box-true-#{nth($i,1)} {
    background-color: rgb(50, 50, 50) !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
}

.grey-label label {
  background-color: rgb(90, 90, 90) !important;
  color: rgb(241, 233, 233) !important;
  font-weight: 500 !important;
  border: 10px lightblue;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
}

$shadowcolors: (0 rgb(50, 50, 50), 1 #083f83);

@each $i in $shadowcolors {
  .box-shadow-#{nth($i,1) } {
    box-shadow: 1px 1px nth($i, 2) !important;
  }
  .box-outlined-#{nth($i,1)} {
    // border: thin solid #CCCCCC;
    border: solid nth($i, 2) !important;
  }
}

@each $i in $shadowcolors {
  .checkbox-shadow-#{nth($i,1) label} {
    box-shadow: 1px 1px nth($i, 2) !important;
  }
}

.customer-header1 {
  background-color: rgba(30, 76, 136, 0.9) !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 5px;
  padding: 10px;
}

@media print {
  .noprint {
    display: none;
  }

  .enable-print {
    display: block;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .A4 {
    box-shadow: none;
    padding: 0 0;
    width: 794px;
    height: 1122px;
    display: block;
  }

  .noprint {
    display: none;
  }

  .enable-print {
    display: block;
  }
}
</style>
