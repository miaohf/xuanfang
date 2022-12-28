<template>
  <v-container fluid class="ma-0 pa-0 container">
    <template v-slot:after-heading> </template>
    <!-- <v-row class="d-flex justify-end mx-0">
      <v-text-field
        v-model="customer_count"
        color="yellow darken-3"
        label="总人数"
        required
        class="mx-6"
        style="width:80px"
      ></v-text-field>
      <v-text-field
        v-model="temp.population"
        color="yellow darken-3"
        label="所在村总人数"
        required
        class="mx-6"
        style="width:80px"
      ></v-text-field>
      <v-btn @click="onClick" color="primary">
        <v-icon left>mdi-check-circle-outline</v-icon> 确定
      </v-btn>
    </v-row> -->

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

    <!-- <v-card class="pa-8">
      <v-row class="d-flex justify-space-between">
        <v-card>
          <span v-for="(item, i) in labelitems['善东苑']" :key="i">
            {{i}}:{{item}}
          </span>
        </v-card>
      </v-row>
      {{ labelitems }}
    </v-card> -->
    <v-row class="d-flex justify-start">
      <span class="note mx-15 my-1 mt-3">
        {{ note }}
      </span>
    </v-row>
    <v-row class="d-flex justify-space-between ma-0">
      <v-card
        v-for="(label, i) in labels"
        :key="i"
        class="my-0 my-card"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h3 mx-1 mb-1">
              <span class="garden">{{ label.garden_name }}</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-simple-table fixed-header>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-right">A</th>
                      <th class="text-right">B</th>
                      <th class="text-right">C</th>
                      <th class="text-right">D</th>
                      <th class="text-right">E</th>
                      <th class="text-right">F</th>
                      <th class="text-right">G</th>
                      <th class="text-right">H</th>
                      <th class="text-right">项目</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in label.items" :key="i">
                      <td v-for="(ar, j) in item" :key="j" class="text-right">
                        <div v-if="ar != 0">
                          {{ ar }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-row>
    <!-- <v-row class="d-flex justify-end ma-3" style="color:orange">
      <span> {{ countdown }} </span> 秒后，自动跳转至清单页面.
    </v-row> -->

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { fetchLabelStatistics } from "@/api/labels";
import { fetchCustomersCount } from "@/api/customers";

const statusOptions = [
  { key: 0, display_name: "空闲" },
  { key: 1, display_name: "已选" },
  { key: 9, display_name: "剔除" }
];

export default {
  name: "Bills",

  components: {},

  data: () => ({
    countdown: 900,
    snackbar: false,
    text: "",
    timeout: 3000,
    alert: false,
    alert_text: "",
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
    action: {
      color: "info",
      icon: "mdi-message-text"
    },
    exportItems: [],
    labels: {},
    items: [],
    note:
      // "备注： A： <70㎡， B: >=70㎡ 且 <80㎡； C： >=80㎡ 且 <90㎡； D： >=90㎡ 且 <100㎡； E: >=100㎡ 且 <110㎡； F： >110㎡",
      // "备注：A  < 70㎡ ≤  B  < 80㎡< =  C  < 90㎡ ≤  D  < 100㎡ ≤  E  < 110㎡ ≤  F  < 190㎡ ≤  G  < 205㎡ ≤  H ＜＞＞＜",
      "A<70㎡，B≥70㎡ 且 B<80㎡，C≥80㎡ 且 C<90㎡，D≥90㎡ 且 D<100㎡，E≥100㎡ 且 E<110㎡，F≥110㎡ 且 F<190㎡，G≥190㎡ 且 G<205㎡，H≥205㎡ 且 H<220㎡",
    temp: {
      population: 0
    },
    customers_count: 0,
    listQuery: {
      page: 1,
      limit: 10,
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
    exportFields: {
      序号: "id",
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
      自行车库: "sub_area",

      号箱: "box_name",
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
      if (this.$store.getters.roles.includes("administrator")) {
        return true;
      } else {
        return false;
      }
    }
  },

  created() {
    this.getCustomersCount();
    this.getLabelStatistics();
    this.temp.population = this.$route.params.population;

    // this.timerStart();
  },
  watch: {},
  methods: {
    getCustomersCount() {
      fetchCustomersCount().then(response => {
        this.customers_count = response.data.customers_count;
        console.log("this.customers_count: ", this.customers_count);
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    getLabelStatistics() {
      fetchLabelStatistics().then(response => {
        this.labels = response.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    // onClick() {
    //   console.log("onClick");
    //   this.$router.push({
    //     name: "倒计时"
    //   });
    // },

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

    // //倒计时
    // timerStart() {
    //   this.loading(); //启动定时器
    //   this.timer = setInterval(() => {
    //     //创建定时器
    //     if (this.countdown === 0) {
    //       this.$router.push({
    //         name: "抽签房源"
    //       });
    //       this.clearTimer(); //关闭定时器
    //       // this.skipStep();
    //     } else {
    //       this.loading();
    //     }
    //   }, 1000);
    // },
    loading() {
      //启动定时器
      this.countdown--; //定时器减1
    },
    clearTimer() {
      //清除定时器
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss" scoped>
/* table,
tr,
td {
  color: rgb(247, 133, 81) !important;
  font-weight: 600 !important;
  font-size: 30px !important;
} */

.garden {
  // background-color: rgb(34, 39, 44);
  color: rgb(143, 156, 165) !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  // border-radius: 5px;
  // padding-left: 10px;
  // padding-right: 10px;
  // padding-top: 5px;
  // padding-bottom: 5px;
}

.my-card {
  background-color: rgb(45,45,45);
  width: 536px;
  border: none;
}

th {
  font-weight: 600 !important;
  font-size: 14px !important;
  height: 34px !important;
  background-color: rgb(49, 59, 65) !important;
  padding: 0 14px 0 14px !important;
}

td {
  background-color: rgb(55, 81, 100) !important;
  color: rgb(214, 218, 215) !important;
  font-weight: 400 !important;
  font-size: 17px !important;
  padding: 0 14px 0 14px !important;
  height: 48px !important;
}

.container {
  background-color: rgb(45,45,45) !important;
  // height: 780px;
}

.note {
  color: rgb(152, 152, 155);
  font-size: 20px;
  font-weight: 400;
}
</style>
