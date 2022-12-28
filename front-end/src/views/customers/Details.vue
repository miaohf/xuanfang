<template>
  <v-container fluid tag="section">
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
    <v-card class="mt-3 mx-3 px-12 py-6">
      <v-row>
        <v-col>
          <v-row class="ml-6">
            <h1>
              {{ customer.name }}
            </h1>
            <v-row>
              <span class="my-2 mx-3 printstyle">
                抽签顺序号：{{ customer.lottery_sequence }}
              </span>
              <v-icon>mdi-map-marker</v-icon>
              <span class="my-2 ml-1 mr-3 printstyle"
                >{{ customer.village }}
              </span>
              <v-icon v-if="customer.phone">mdi-phone</v-icon>
              <span class="my-2 ml-1 mr-3 printstyle"
                >{{ customer.phone }}
              </span>
              <span class="my-2 ml-1 mr-3 printstyle"
                >身份证 {{ customer.cardid }}，总面积 {{ customer.myarea }} m²
                <!-- ，剩余可选 {{ customer.remain_area }} m² -->
              </span>
            </v-row>
          </v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-end">
            <v-btn @click="getCustomerChoices" class="mx-3 mt-5" color="blue">
              <v-icon left>mdi-magnify</v-icon>查询
            </v-btn>
            <v-btn @click="resetSelection" color="primary" class="mx-3 mt-5">
              <v-icon left>mdi-lock-reset</v-icon> 重置
            </v-btn>
            <v-btn @click="goBack" class="primary mx-3 mt-5">
              <v-icon left>mdi-arrow-left-bold</v-icon> 返回
            </v-btn>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="my-1"></v-divider>
      <v-row>
        <v-label
          ><v-chip
            class="mt-5 ml-8 mr-16"
            label
            :color="color"
            text-color="white"
          >
            <h3>
              选择数量
            </h3>
          </v-chip></v-label
        >
        <v-radio-group v-model="params.labels_quantity" row>
          <v-radio
            v-for="(n, i) in maxNumberOfChoices"
            :key="i"
            :label="`${n} 套`"
            :value="n"
            class="grey-label ml-1 mr-3 my-0"
          ></v-radio>
        </v-radio-group>
      </v-row>
      <!-- <strong> 号箱</strong> -->

      <v-row class="mb-5">
        <v-label
          ><v-chip class="mx-8 mr-13" label :color="color" text-color="white">
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
          :class="`background-${g.id} ml-4 my-0`"
          :disabled="get_garden_disabled(g)"
          @change="onCheckboxGardenChanged()"
        />
      </v-row>
      <v-row>
        <v-label
          ><v-chip class="mx-8 mr-13" label :color="color" text-color="white">
            <h3>
              互斥小区
            </h3>
          </v-chip></v-label
        >
        <v-radio-group v-model="radio_garden" row class="my-0 ml-4">
          <v-radio
            v-for="(g, index) in gardens[1]"
            :key="index"
            :value="g.id"
            :label="g.name"
            :class="`background-${g.id}`"
            @change="onRadioGardenChanged()"
          ></v-radio>
        </v-radio-group>

        <!-- <span>
          'radio_garden: '{{ radio_garden }}； 'selected_gardens：'
          {{ selected_gardens }}
          'params.boxes'
          {{ params.boxes }}
        </span> -->
      </v-row>
      <!-- <v-label
        ><v-chip class="mx-5 mr-13" label :color="color" text-color="white">
          <h3>
            选取号箱
          </h3>
        </v-chip></v-label
      > -->
      <v-row class="d-flex justify-start mb-6 px-0">
        <div v-for="(box, i) in boxes" :key="i">
          <v-badge
            bordered
            icon="mdi-lock"
            overlap
            :color="get_disabled(b) ? greyColor : greenColor"
            :content="b.free_choice_count"
            v-for="b in box"
            :key="b.id"
            offset-y="30"
          >
            <v-checkbox
              multiple
              v-model="params.boxes"
              :value="b.id"
              :label="b.name + ',' + b.area + 'm²'"
              hide-details
              :class="
                `get_disabled(b) ? greyColor : checkbox-${get_disabled(b)}-${
                  b.garden_id
                } checkbox-outlined-${b.deliver_type} ml-4`
              "
              :disabled="get_disabled(b)"
            />
          </v-badge>
        </div>
      </v-row>
    </v-card>
    <v-card class="ma-3 pa-10">
      <v-row class="d-flex justify-end">
        <v-btn v-if="details.choices" v-print="printObj" class="primary mr-5" @click="updateCustomerPrintStatus">
          <v-icon left small>mdi-printer</v-icon>打印
        </v-btn>
      </v-row>
      <div id="printMe">
        <h1>
          {{ customer.name }}
        </h1>
        <v-row>
          <span class="ma-3 printstyle">
            抽签顺序号：{{ customer.lottery_sequence }}；
          </span>
          <span class="ma-3 printstyle">所在村：{{ customer.village }}；</span>
          <span class="ma-3 printstyle">电话：{{ customer.phone }}；</span>
          <span class="ma-3 printstyle">总面积 {{ customer.myarea }} m²；</span>
          <span class="ma-3 ml-16 printstyle">
              查询结果仅供参考。
            </span>
            <span class="ma-3 printstyle">
              打印时间：{{ $moment(dt_now).format("YYYY-MM-DD HH:mm:ss") }}
            </span>
        </v-row>
        <!-- 
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
              {{ c.area.toFixed(2) }}m²
            </span>
          </v-row>
        </v-row> -->

        <div v-if="details.choices">
          <v-row
            class="d-flex justify-space-between mx-0"
            style="font-size:13px"
            color="secondary"
          >
            <span>
              <span class="noprint">
                满足除最后一套外剩余面积（ >=80可以选取中套，>=20可以选取小套
                ）条件的所有方案。
              </span>
              <!-- <span class="printstyle">
                以房源户型总面积从大到小罗列，查询结果仅供参考。
              </span> -->
            </span>

            
          </v-row>

          <v-divider v-if="details.choices" class="mt-2" />
          <v-simple-table dense v-if="details.choices">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-right noprint" style="width:60px">
                    序号
                  </th>
                  <th class="text-right noprint" style="width:100px">
                    差额(红为超)
                  </th>
                  <th class="text-left noprint">
                    预选方案
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in details.choices" :key="i">
                  <td class="grey--text text-right" style="font-size:12px">
                    {{ i + 1 }}
                  </td>
                  <td class="text-right">
                    <h4
                      v-if="item.total_area - customer.myarea_remain > 0"
                      :style="{
                        color:
                          item.total_area - customer.myarea_remain > 0
                            ? 'rgb(252, 115, 90)'
                            : 'rgb(106, 190, 110)'
                      }"
                    >
                      +{{
                        (item.total_area - customer.myarea_remain).toFixed(2)
                      }}
                    </h4>
                    <h3
                      v-else
                      :style="{
                        color:
                          item.total_area - customer.myarea_remain > 0
                            ? 'rgb(252, 115, 90)'
                            : 'rgb(106, 190, 110)'
                      }"
                    >
                      {{
                        (item.total_area - customer.myarea_remain).toFixed(2)
                      }}
                    </h3>
                  </td>
                  <td v-for="(l, j) in item.choices" :key="j" class="text-left">
                    <v-row>
                      <span
                        :class="
                          `ma-1 text-right choice_background-${l.garden_id} box-shadow-${l.deliver_type} noprint`
                        "
                      >
                        <!-- {{ l.box_id }}# -->
                        {{ l.box_name }}
                      </span>
                      <span
                        v-if="j < 20"
                        class="mt-2 text-right"
                        style="color:grey;font-weight:400"
                      >
                        {{ l.garden_name }}
                        {{ l.area.toFixed(2) }}m²
                      </span>
                      <span
                        v-else
                        class="mt-2 text-right noprint"
                        style="color:grey;font-weight:400"
                      >
                        {{ l.garden_name }}
                        {{ l.area.toFixed(2) }}m²
                      </span>
                    </v-row>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { fetchCustomer, fetchCustomerChoices, updateCustomer } from "@/api/customers";
import { fetchBoxesListByPost, fetchBoxesListByPost2 } from "@/api/boxes";
import { fetchGardensList } from "@/api/gardens";
import { createChoice, deleteChoice } from "@/api/choices";
import { fetchAreaitems } from "@/api/areaitems";


// /**
//  * 生成一个从 start 到 end 的连续数组
//  * @param start
//  * @param end
//  */
// function generateArray(start, end) {
//   return Array.from(new Array(end + 1).keys()).slice(start);
// }

export default {
  name: "CustomerDetails",
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
      selected_gardens: [],
      checkbox_gardens: [],
      radio_garden: 1000,
      params: {
        labels_quantity: 1,
        boxes: []
      },
      maxNumberOfChoices: 0,
      customer: {},
      boxes: {},
      boxes_allinone: [],
      temp: {
        customer_id: "",
        labelitems: []
      },
      areaitems_max_area: {},
      printObj: {
        id: "printMe",
        popTitle: "方案列表"
        // extraCss: "https://www.baidu.com",
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
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

    // rules() {
    //   return [
    //     this.gardens.length > 0 || "At least one item should be selected"
    //   ];
    // }
  },
  created() {
    this.getAreaitems();
    this.getCustomer(this.$route.params.id);
    this.getBoxesByPost();
    this.getGardensList();
    this.dt_now = Date.now();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    check_params_box(garden_id, b) {
      // 1|善和苑2期  只能选一套
      // 2|善和苑3期
      // 3|善新苑
      const gardenIds = [1];
      if (gardenIds.includes(garden_id)) {
        var district_box = this.params.boxes.find(
          box => this.get_gardenid_from_boxid(box) == garden_id
        );
        if (district_box) {
          // console.log(district_box);
          if (district_box != b.id) {
            return true;
          }
        }
      }
      return false;
    },

    get_garden_disabled(g) {
      console.log('g.is_restricted, this.customer.has_restricted_house_selection: ', g.is_restricted, this.customer.has_restricted_house_selection)
      if (g.is_restricted && this.customer.has_restricted_house_selection) {
        console.log('is_restricted')
        return true;
      } 
      return false;
    },

    get_disabled(b) {
      if (
        b.free_choice_count == 0 ||
        this.customer.myarea_remain < 20 ||
        (b.area >= 80 &&
          this.customer.myarea_remain < 80 &&
          this.areaitems_max_area["小户型"] > this.customer.myarea_remain) ||
        (b.area >= 100 &&
          this.customer.myarea_remain < 100 &&
          this.areaitems_max_area["中户型"] > this.customer.myarea_remain) ||
        !this.selected_gardens.includes(b.garden_id) ||
        this.check_params_box(b.garden_id, b)
      ) {
        return true;
      }
      return false;
    },

    getAreaitems() {
      this.listLoading = true;
      fetchAreaitems().then(response => {
        this.areaitems_max_area = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },
    getCustomer(id) {
      this.listLoading = true;
      fetchCustomer(id).then(response => {
        this.customer = response.data;
        // console.log(
        //   "this.customer.myarea_remain: ",
        //   this.customer.myarea_remain
        // );
        this.maxNumberOfChoices =
          Math.ceil((response.data.myarea + 20) / 80) + 1;
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },

    get_gardenid_from_boxid(box_id) {
      var garden_id = this.boxes_allinone.find(b => b.id === box_id).garden_id;
      return garden_id;
    },

    onCheckboxGardenChanged() {
      this.getBoxesByPost();
      this.selected_gardens = [];
      this.selected_gardens.push(this.radio_garden);
      this.selected_gardens = this.selected_gardens.concat(
        this.checkbox_gardens
      );

      this.params.boxes = this.params.boxes.filter(b =>
        this.selected_gardens.includes(this.get_gardenid_from_boxid(b))
      );
    },

    onRadioGardenChanged() {
      this.getBoxesByPost();

      setTimeout(() => {
        this.selected_gardens = [];
        this.selected_gardens.push(this.radio_garden);
        this.selected_gardens = this.selected_gardens.concat(
          this.checkbox_gardens
        );
      }, 0.1 * 1000);
      setTimeout(() => {
        this.params.boxes = this.params.boxes.filter(b =>
          this.selected_gardens.includes(this.get_gardenid_from_boxid(b))
        );
      }, 0.5 * 1000);
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
      console.log("this.params.boxes: ", this.params.boxes);
    },

    getGardensList() {
      this.listLoading = true;
      fetchGardensList().then(response => {
        this.gardens = response.data.items;
        // 默认选择所有小区
        // this.checkbox_gardens = this.gardens.map(x => {
        //   return x.id;
        // });
        setTimeout(() => {
          this.listLoading = false;
        }, 5 * 1000);
      });
    },
    getCustomerChoices() {
      this.listLoading = true;
      if (this.params.boxes.length == 0) {
        this.text = "至少选择 1 个【号箱】";
        console.log(this.text);
        this.snackbar = true;
      } else {
        fetchCustomerChoices(this.$route.params.id, this.params).then(
          response => {
            this.details = response.data;
            // Just to simulate the time of the request
            // this.maxNumberOfChoices =
            //   Math.ceil((response.data.myarea + 20) / 80) + 1;

            // Just to simulate the time of the request
            this.text =
              "本次操作共查询到 " + response.data.choices.length + " 条记录。";
            console.log(this.text, this.details);
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 3 * 1000);
          }
        );
      }
    },
    // handleToHouseItemDetail(houseitem_id) {
    //   this.$router.push({
    //     name: "户型详情",
    //     params: { id: houseitem_id }
    //   });
    // },
    // addChoice(item) {
    //   this.$confirm("确定提交方案?").then(res => {
    //     if (res) {
    //       this.temp.customer_id = this.$route.params.id;
    //       this.temp.labelitems = item;
    //       console.log("this.temp: ", this.temp);
    //       createChoice(this.temp).then(response => {
    //         this.text = this.customer.name + " 的预选方案录入完成！";
    //         this.snackbar = true;
    //         setTimeout(() => {
    //           this.getAreaitems();
    //           this.getCustomerChoices();
    //           this.getBoxesByPost();
    //           this.getCustomer(this.$route.params.id);
    //         }, 1 * 1000);
    //       });
    //     }
    //   });
    // },

    // deleteCustomerChoices(item) {
    //   this.$confirm("确定需要清空方案?").then(res => {
    //     if (res) {
    //       this.temp.customer_id = this.$route.params.id;
    //       deleteChoice(this.temp).then(response => {
    //         this.text = this.customer.name + " 预选方案已清空";
    //         this.snackbar = true;
    //         setTimeout(() => {
    //           this.getCustomerChoices();
    //           this.getCustomer(this.$route.params.id);
    //         }, 1 * 1000);
    //       });
    //     }
    //   });
    // },
    updateCustomerPrintStatus() {
      console.log('xxxxxxxxxxxxxxxxxxxxx')
      var temp = {'choices_printed': 1}
      updateCustomer(this.customer.id, temp).then(response => {
          console.log(response.data);
          if (response.data.error) {
            this.alert_text = response.data.error;
            this.alert = true;
          } else {
            // Just to simulate the time of the request
            this.text = this.customer.name + " 数据更新完成!";
            this.snackbar = true;
          }
        });
    },
    resetSelection() {
      this.boxes = [];
      this.getBoxesByPost();
      this.selected_gardens = [];
      this.checkbox_gardens = [];
      this.radio_garden = [];
      console.log("resetSelection");
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
  .choice_background-#{nth($i,1)} {
    background-color: nth($i, 2) !important;
    color: rgb(241, 233, 233) !important;
    font-weight: 500 !important;
    border-radius: 1px;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
    width: 92px;
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
    width: 92px;
  }
}

@each $i in $colors {
  .checkbox-false-#{nth($i,1) label} {
    background-color: nth($i, 2) !important;
    color: rgb(241, 233, 233) !important;
    font-weight: 500 !important;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 5px;
    width: 138px;
    // box-shadow: 2px 2px yellow;
  }
}

@each $i in $colors {
  .checkbox-true-#{nth($i,1) label} {
    background-color: rgb(36, 35, 35) !important;
    color: rgb(107, 104, 104) !important;
    font-weight: 500 !important;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 5px;
    width: 138px;
    // box-shadow: 2px 2px yellow;
  }
}

.grey-label label {
  background-color: rgb(90, 89, 89) !important;
  color: rgb(241, 233, 233) !important;
  font-weight: 500 !important;
  // border: 1px lightblue;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 1px;
  width: 92px;
  // box-shadow: 2px 2px yellow;
}

$shadowcolors: (0 #0a0a0a, 1 #7cb2fa);

@each $i in $shadowcolors {
  .box-shadow-#{nth($i,1) } {
    box-shadow: 1px 1px nth($i, 2) !important;
  }
}

@each $i in $shadowcolors {
  // .checkbox-shadow-#{nth($i,1) label} {
  //   box-shadow: 1px 1px nth($i, 2) !important;
  // }
  .checkbox-outlined-#{nth($i,1) label} {
    // border: thin solid #CCCCCC;
    border: thin solid nth($i, 2) !important;
  }
}

.customer-header1 {
  background-color: rgba(30, 76, 136, 0.9) !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 5px;
  padding: 10px;
}

.customer-header2 {
  background-color: rgba(75, 73, 73, 0.8) !important;
  color: rgb(238, 235, 235) !important;
  border-radius: 25px;
  padding: 10px;
  font-style: italic;
}

.customer-header3 {
  background-color: rgba(75, 73, 73, 0.8) !important;
  color: rgb(238, 235, 235) !important;
  border-radius: 25px;
  padding: 6px;
  /* font-style: italic; */
}

.customer-header4 {
  background-color: rgba(247, 151, 8, 0.9) !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 25px;
  padding: 10px;
}

.customer-header5 {
  background-color: rgba(75, 73, 73, 0.8) !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 5px;
  padding: 10px;
}

.red-chip {
  background-color: rgb(252, 115, 90) !important;
  color: white !important;
}

.red-outlined-chip {
  color: rgb(252, 115, 90) !important;
}

.green-outlined-chip {
  color: rgb(106, 190, 110) !important;
}

.grey-chip {
  background-color: rgb(174, 179, 175) !important;
  color: white !important;
}

.my-card {
  position: relative;
}

.addchoice:hover {
  color: rgb(60, 135, 247);
}

span {
  color: #d6d9da !important;
}
@media print {
  @page {
    size: A4 landscape;
  }
  body {
    margin: 15px;
    // padding: 3px;
    background: transparent !important;
  }

  // span {
  //   color: black !important;
  //   background: transparent !important;

  // }

  //  .v-application.theme--dark{
  //   background: white;
  // }

  // .A4 {
  //   box-shadow: none;

  //   margin: 20px;
  //   padding: 0 0;
  //   // width: 794px;
  //   width: 1122px;
  //   height: 794px;
  //   display: block;

  // }
  .printstyle {
    color: black !important;
    font-size: 16px;
    margin: 0 0 0 13px;
  }
  .noprint {
    display: none;
  }

  .enable-print {
    display: block;
  }

  table,
  th,
  tr,
  td {
    background: white !important;
    // border-color: rgb(87, 86, 86) !important;
    // border: 1px solid black;
    color: black !important;
    font-size: 14px !important;
  }

  td {
    border: 1px solid black;
  }
  span {
    color: black !important;
  }
}
</style>
