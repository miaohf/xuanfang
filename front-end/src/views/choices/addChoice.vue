<template>
  <v-container fluid>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
    <v-row class="d-flex justify-start mx-1">
      <v-col cols="12" sm="1" md="1">
        <v-btn @click="goBack" class="primary mx-3">
          <v-icon left>mdi-arrow-left-bold</v-icon> 返回
        </v-btn>
      </v-col>

      <v-col cols="12" sm="1" md="2">
        <v-autocomplete
          v-model="temp.customer_id"
          :items="customersList"
          chips
          clearable
          hide-details
          hide-selected
          item-text="name"
          item-value="id"
          label="选择户主"
          solo
          style="max-width: 400px;"
          @change="getCustomer"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                等待加载数据中
                <strong>九色鹿网络</strong>
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
      <v-col cols="12" sm="1" md="2">
        <v-checkbox
          v-model="mustExhaustMyArea"
          label="必须用完全部面积"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" sm="1" md="7">
        <v-text-field
          autofocus
          v-model="scan.value"
          append-icon="mdi-barcode"
          class="ml-auto"
          label="扫码输入"
          hide-details
          single-line
          @input="handleScan"
          style="max-width: 300px;"
        />
      </v-col>
    </v-row>
    <v-card class="ma-3 pa-6">
      <div v-if="customer.id" class="ml-6">
        <div id="printMe" class="print-magin">
          <h1 class="ma-3 printstyle-h1">
            {{ customer.name }}
          </h1>
          <div>
            <span class="ma-3 printstyle">
              抽签顺序号：
              <span class="ma-3 printstyle-h2"
                >{{ customer.lottery_sequence }}，</span
              >
            </span>
            <span class="ma-3 printstyle"
              ><span class="noprint">所在村：</span>
              {{ customer.village }}，</span
            >
            <span class="ma-3 printstyle noprint"
              >电话：{{ customer.phone }}，</span
            >
            <span class="ma-3 printstyle"
              >总面积：
              <span class="ma-3 printstyle-h2"> {{ customer.myarea }} m²</span
              >，
            </span>
            <span class="ma-3 printstyle noprint">
              面积差：{{
                (customer.myarea_choice_remain - area_selected).toFixed(2)
              }}
              m²

              <!-- 调试参数 -->
              <!-- {{ area_selected }}
              {{ choice_count }}
              {{ params.boxes }} -->
            </span>
          </div>
          <br />
          <div
            v-for="(li, i) in customer.choices_selected"
            :key="i"
            class="ma-3"
          >
            <span class="choice_font"> {{ i + 1 }}： {{ li.box_name }} </span>
            <span class="ml-2 mr-6 choice_font">
              {{ li.garden_name }}
              <!-- {{ li.area.toFixed(2) }}m² -->
              <span v-for="(la, i) in li.labelareas" :key="i">
                {{ la.area.toFixed(2) }}m²
              </span>
            </span>
          </div>
          <v-row class="ma-3 d-flex justify-space-between ">
            <div v-for="(li, i) in temp.labelitems" :key="i">
              <v-btn
                :class="
                  `choice_background-${li.garden_id} box-shadow-${li.deliver_type} noprint`
                "
                @click="removeLabelitem(li)"
              >
                {{ li.box_name }}
              </v-btn>
              <span style="color:grey;font-weight:400" class="ml-2 mr-6">
                {{ li.garden_name }}
                <!-- {{ li.area.toFixed(2) }}m² -->
                <span v-for="(la, i) in li.labelareas" :key="i">
                  {{ la.area.toFixed(2) }}m²
                </span>
              </span>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="
                temp.labelitems.length > 0 &&
                  (customer.myarea_choice_remain - area_selected < 20 || !mustExhaustMyArea)

              "
              class="info mr-3"
              @click="addCustomerChoices()"
            >
              <v-icon left small> mdi-check</v-icon>提交
            </v-btn>
            <v-btn
              v-if="customer.choices_selected.length == 0"
              @click="reset"
              class="warning mr-3"
            >
              <!-- v-if="temp.labelitems.length > 0" -->

              <v-icon left small>mdi-restart</v-icon>重置
            </v-btn>
            <v-btn
              v-if="customer.choices_selected.length > 0"
              v-print="printObj"
              class="info mr-3 noprint"
            >
              <v-icon left small>mdi-printer</v-icon>打印
            </v-btn>
            <v-btn
              v-if="customer.choices_selected.length > 0"
              @click="deleteCustomerChoices"
              class="warning noprint"
            >
              <v-icon left small>mdi-delete</v-icon>删除
            </v-btn>
          </v-row>
        </div>
        <v-divider class="my-6"></v-divider>
      </div>

      <v-row v-if="customer.choices_selected.length == 0" class="my-6">
        <v-label
          ><v-chip class="mx-8 mt-1" label :color="color" text-color="white">
            <h3>
              多选小区
            </h3>
          </v-chip></v-label
        >
        <v-checkbox
          v-for="(g, index) in gardens[0]"
          multiple
          v-model="checkbox_gardens"
          :key="index"
          :value="g.id"
          :label="g.name"
          hide-details
          :class="`background-${get_garden_disabled(g)}-${g.id} ml-3 mr-3 my-0`"
          :disabled="get_garden_disabled(g)"
          @change="onGardenChanged(g)"
        />
      </v-row>
      <v-row v-if="customer.choices_selected.length == 0">
        <v-label
          ><v-chip class="mx-8 mt-1" label :color="color" text-color="white">
            <h3>
              互斥小区
            </h3>
          </v-chip></v-label
        >
        <v-radio-group v-model="radio_garden" row class="my-0">
          <v-radio
            v-for="(g, index) in gardens[1]"
            :key="index"
            :value="g.id"
            :label="g.name"
            :class="
              `background-${get_garden_disabled()}-${g.id} ml-3 mr-3 my-0`
            "
            :disabled="get_garden_disabled()"
            @change="onGardenChanged()"
          ></v-radio>
        </v-radio-group>

        <!-- <span>
          'radio_garden: '{{ radio_garden }}； 'selected_gardens：'
          {{ selected_gardens }}
          'params.boxes'
          {{ params.boxes }}
        </span> -->
      </v-row>

      <v-row
        v-if="customer.choices_selected.length == 0"
        class="d-flex justify-start mx-2 mb-6 "
      >
        <div v-for="(item, index) in boxes" :key="index">
          <v-badge
            bordered
            overlap
            :color="get_box_disabled(b) ? greyColor : greenColor"
            :content="b.free_choice_count - get_choice_count(b.id)"
            v-for="(b, i) in item"
            :key="i"
            offset-x="12"
            offset-y="18"
            class="mx-3"
          >
            <v-btn
              :class="
                `get_box_disabled(b) ? greyColor : box-${get_box_disabled(b)}-${
                  b.garden_id
                } box-outlined-${b.deliver_type} my-1`
              "
              :disabled="get_box_disabled(b)"
              outlined
              @click="onBoxClick(b)"
            >
              <!-- {{ b.short_name + "# " + b.area + "m²" }} -->
              {{ b.name + "," }}
              <span v-for="(la, i) in b.labelareas" :key="i">
                <span v-if="i == 0">
                  {{ la.area }}
                </span>
                <span v-else>{{ "+" + la.area }} </span> </span
              >㎡
            </v-btn>
          </v-badge>
        </div>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import {
  fetchCustomer,
  fetchCustomerByCode,
  fetchCustomersList
} from "@/api/customers";
import { fetchBoxesListByPost, fetchBoxesListByPost2 } from "@/api/boxes";
import { fetchGardensList } from "@/api/gardens";
import { createChoice, deleteChoice } from "@/api/choices";
import { fetchAreaitems } from "@/api/areaitems";
// import { fetchCustomersList } from "@/api/customers";
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
      mustExhaustMyArea: true,
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
      selected_gardens: [],
      checkbox_gardens: [],
      radio_garden: 1000,
      choice_count: {},
      params: {
        labels_quantity: 1,
        boxes: []
      },
      choices_selected: [],
      area_selected: 0,
      scan: {
        value: "",
        type: ""
      },
      maxNumberOfChoices: 0,
      customer: {
        choices_selected: []
      },
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
    this.getCustomers();
    this.getAreaitems();
    // this.getCustomer(this.$route.params.id);
    this.getBoxesByPost();
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

    // get_garden_disabled() {
    //   if (this.customer.id) {
    //     // console.log("get_garden_disabled: false");
    //     return false;
    //   } else {
    //     // console.log("get_garden_disabled: return true");
    //     return true;
    //   }
    // },

    get_garden_disabled(g) {
      // console.log('g.is_restricted, this.customer.has_restricted_house_selection: ', g.is_restricted, this.customer.has_restricted_house_selection)
      // if (g && g.is_restricted && this.customer.has_restricted_house_selection) {
      //   console.log('is_restricted')
      //   return true;
      // }
      return false;
    },

    get_box_disabled(b) {
      if (
        // b.free_choice_count == 0 ||
        b.free_choice_count - this.get_choice_count(b.id) == 0 ||
        this.customer.myarea_choice_remain - this.area_selected < 20 ||
        // (b.area >= 80 &&
        //   this.customer.myarea_choice_remain < 80 &&
        //   this.areaitems_max_area["小户型"] >
        //     this.customer.myarea_choice_remain) ||
        // (b.area >= 100 && this.customer.myarea_choice_remain < 100 && this.areaitems_max_area["中户型"] > this.customer.myarea_choice_remain) ||

        // 关闭未选小区号箱
        !this.selected_gardens.includes(b.garden_id) ||
        //
        this.check_district_box(b)
        // ||
        // (this.customer.myarea_choice_remain - this.area_selected < 100 &&
        //   b.area >= 100 &&
        //   this.areaitems_max_area["中户型"] >
        //     this.customer.myarea_choice_remain - this.area_selected) ||
        // (this.customer.myarea_choice_remain - this.area_selected < 80 &&
        //   b.area >= 80 &&
        //   this.areaitems_max_area["小户型"] >
        //     this.customer.myarea_choice_remain - this.area_selected)
      ) {
        return true;
      }
      return false;
    },

    check_district_box(b) {
      // console.log("check_disabled_box");
      // {'id': 2, 'name': '善东苑'}
      // {'id': 3, 'name': '翡翠公馆'}, {'id': 6, 'name': '善和苑'}, {'id': 9, 'name': '枫南小镇'}
      const gardenIds = [1];

      // 同小区其他号箱灭灯
      if (gardenIds.includes(b.garden_id)) {
        var district_box = this.params.boxes.find(
          box => this.get_gardenid_from_boxid(box.id) == b.garden_id
        );
        if (district_box) {
          if (district_box != b.id) {
            return true;
          }
          console.log("check_disabled_box");
        }
      }

      return false;
    },

    get_gardenid_from_boxid(box_id) {
      // console.log('box_id: ', box)
      // console.log(this.boxes_allinone)
      var garden_id = this.boxes_allinone.find(b => b.id === box_id).garden_id;
      return garden_id;
    },

    reset() {
      this.temp.labelitems = [];
      this.area_selected = 0;
      this.choice_count = {};
      this.params.boxes = [];
      this.radio_garden = -1;
      this.checkbox_gardens = [];
      this.selected_gardens = [];
    },

    getAreaitems() {
      this.listLoading = true;
      fetchAreaitems().then(response => {
        this.areaitems_max_area = response.data;
        // console.log("this.areaitems_max_area: ", this.areaitems_max_area);
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },

    reCheck() {
      // 重新统计号签
      this.temp.labelitems = this.temp.labelitems.filter(li =>
        this.selected_gardens.includes(li.garden_id)
      );

      // 重新号箱已选号签数值
      for (var box_id in this.choice_count) {
        if (
          !this.selected_gardens.includes(
            this.get_gardenid_from_boxid(parseInt(box_id))
          )
        ) {
          delete this.choice_count[box_id];
        }
      }
      // 重新客户已选面积
      this.getAreaSelected();
    },

    // 处理小区变更
    onGardenChanged() {
      this.getBoxesByPost();

      // 重新计算已选小区
      setTimeout(() => {
        this.selected_gardens = [];
        this.selected_gardens.push(this.radio_garden);
        this.selected_gardens = this.selected_gardens.concat(
          this.checkbox_gardens
        );
      }, 0.1 * 1000);

      // 删除未选小区的号箱
      setTimeout(() => {
        console.log("this.selected_gardens: ", this.selected_gardens);
        this.params.boxes = this.params.boxes.filter(b =>
          this.selected_gardens.includes(this.get_gardenid_from_boxid(b.id))
        );
        this.reCheck();
        console.log("this.params.boxes: ", this.params.boxes);
      }, 0.2 * 1000);

      // 删除未选小区的号签, 并重置已选号签的统计数值
      setTimeout(() => {
        this.reCheck();
      }, 0.3 * 1000);
    },

    getBoxesByPost() {
      this.listLoading = true;
      this.getAreaitems();
      var data = { gardens: this.selected_gardens };
      fetchBoxesListByPost2(data).then(response => {
        this.boxes = response.data.items;
        this.boxes_allinone = response.data.allinonelist;
        setTimeout(() => {
          this.listLoading = false;
        }, 3 * 1000);
      });
      // console.log("this.params.boxes: ", this.params.boxes);
    },

    // 获取小区列表
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

    get_choice_count(box_id) {
      if (box_id in this.choice_count) {
        return this.choice_count[box_id];
      }
      return 0;
    },

    // 重新计算所选面积
    getAreaSelected() {
      var total = 0;
      for (var i in this.temp.labelitems) {
        console.log("labelitem area: ", this.temp.labelitems[i].area);
        total += this.temp.labelitems[i].area;
      }
      this.area_selected = total;
    },

    // 点击号箱
    onBoxClick(box) {
      this.params.boxes.push(box);
      this.temp.labelitems = this.temp.labelitems.concat(box.labelitems);
      console.log("this.temp.labelitems: ", this.temp.labelitems);
      this.getAreaSelected();
      this.choice_count[box.id] = this.get_choice_count(box.id) + 1;
      this.temp.labelitems = this.temp.labelitems.sort(
        (a, b) => b.area - a.area
      );
    },

    // 删除所选项
    removeLabelitem(labelitem) {
      this.temp.labelitems = this.temp.labelitems.filter(li => {
        return li !== labelitem;
      });

      this.params.boxes = this.params.boxes.filter(box => {
        return box.id !== labelitem.box_id;
      });

      delete this.choice_count[labelitem.box_id];
      setTimeout(() => {
        this.reCheck();
      }, 0.02 * 1000);
    },

    // 提交预选方案
    addCustomerChoices() {
      this.$confirm("确定提交预选方案?").then(res => {
        if (res) {
          createChoice(this.temp).then(response => {
            this.text = this.customer.name + " 的预选方案录入！";
            this.snackbar = true;
            setTimeout(() => {
              this.getAreaitems();
              this.getBoxesByPost();
              this.reset();
              this.getCustomer(this.temp.customer_id);
            }, 1 * 1000);
          });
        }
      });
    },

    // 删除预选方案
    deleteCustomerChoices(item) {
      this.$confirm("确定需要删除方案?").then(res => {
        if (res) {
          deleteChoice(this.temp).then(response => {
            this.text = this.customer.name + " 预选方案已删除";
            this.snackbar = true;
            if (response) {
              this.getBoxesByPost();
            }
            setTimeout(() => {
              this.reset();
              this.getCustomer(this.customer.id);
            }, 1 * 1000);
          });
        }
      });
    },

    // 扫码
    handleScan() {
      console.log("handleScan");
      if (this.scan.value.length > 8) {
        console.log("this.scan.value.length > 8");
        console.log(this.scan.value);
        this.scan.value = "";
        console.log(this.scan.value);
        this.reset();
      }
      if (this.scan.value.length == 8) {
        this.scan.type = this.scan.value.substr(0, 1);
        if (this.scan.type == "8") {
          // const customer_code = Number(this.scan.value.substr(1, 6));
          const customer_code = Number(this.scan.value.substr(0, 7));
          console.log("customer_code: ", customer_code);
          this.reset();
          this.getCustomerByCode(customer_code);
        }
      }
    },

    // 根据客户编号获取客户信息
    getCustomerByCode(customer_code) {
      console.log("getCustomer");
      fetchCustomerByCode(customer_code).then(response => {
        this.customer = response.data;
        this.temp.customer_id = this.customer.id;
        this.reset();
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

    // 根据客户ID获取客户信息
    getCustomer() {
      this.listLoading = true;
      fetchCustomer(this.temp.customer_id).then(response => {
        this.customer = response.data;
        this.reset();
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

<style lang="scss">
$colors: (
  1 #2b6d6a,
  2 #4e3152,
  3 #2e3761,
  4 #856936,
  5 #80594a,
  6 #6d2b36,
  7 #2b6d6a,
  8 #413370,
  9 #03444d,
  10 #754719
);

$color: nth($colors, random(length($colors)));

@each $i in $colors {
  .choice_background-#{nth($i, 1)} {
    background-color: nth($i, 2) !important;
    color: rgb(241, 233, 233) !important;
    font-weight: 500 !important;
    // border-radius: 5px;
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
    border-radius: 1px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 100px;
  }
}

@each $i in $colors {
  .background-false-#{nth($i, 1) label} {
    background-color: nth($i, 2) !important;
    color: rgb(241, 233, 233) !important;
    font-weight: 500 !important;
    border-radius: 1px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 100px;
  }
}

@each $i in $colors {
  .background-true-#{nth($i, 1) label} {
    background-color: rgb(50, 50, 50) !important;
    color: rgb(241, 233, 233) !important;
    font-weight: 500 !important;
    border-radius: 1px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 100px;
  }
}

@each $i in $colors {
  .box-false-#{nth($i, 1)} {
    background-color: nth($i, 2) !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    width: 190px;
  }
}

@each $i in $colors {
  .box-true-#{nth($i, 1)} {
    background-color: rgb(50, 50, 50) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    width: 190px;
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
  .box-shadow-#{nth($i, 1) } {
    box-shadow: 1px 1px nth($i, 2) !important;
  }
  .box-outlined-#{nth($i, 1)} {
    // border: thin solid #CCCCCC;
    border: solid nth($i, 2) !important;
  }
}

@each $i in $shadowcolors {
  .checkbox-shadow-#{nth($i, 1) label} {
    box-shadow: 1px 1px nth($i, 2) !important;
  }
}

.customer-header1 {
  background-color: rgba(30, 76, 136, 0.9) !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 5px;
  padding: 10px;
}

.choice_font {
  color: rgb(253, 159, 71);
  font-weight: 400;
  font-size: 24px;
}

.printstyle {
  font-size: 18px;
}

.printstyle-h2 {
  color: rgb(247, 142, 45) !important;
  font-weight: 800;
  font-size: 36px;
}

@media print {
  @page {
    size: A4 landscape;
  }

  .print-magin {
    margin: 30px 30px 30px 30px;
  }

  .printstyle-h1 {
    color: rgb(100, 100, 100) !important;
    font-size: 80px;
  }

  .printstyle-h2 {
    color: rgb(100, 100, 100) !important;
    font-weight: 800;
    font-size: 58px;
  }

  .printstyle {
    color: rgb(100, 100, 100) !important;
    font-size: 36px;
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

  @each $i in $colors {
    .choice_background-#{nth($i, 1)} {
      color: rgb(100, 100, 100) !important;
      font-size: 18px;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }

  @each $i in $shadowcolors {
    .box-shadow-#{nth($i, 1)} {
      color: rgb(100, 100, 100) !important;
      font-size: 32px;
    }
    .box-outlined-#{nth($i, 1)} {
      color: rgb(100, 100, 100) !important;
      font-size: 32px;
    }
  }

  .choice_font {
    color: rgb(100, 100, 100) !important;
    font-weight: 600;
    font-size: 54px;
  }
}
</style>
