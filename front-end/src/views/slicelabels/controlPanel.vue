<template>
  <v-container fluid>
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-center mb-0">
      <v-text-field
        v-model="houses_count"
        color="yellow darken-3"
        label="房源总数"
        required
        class="mx-6 controlpanel"
        style="width:180px"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="customers_count_static"
        color="yellow darken-3"
        label="总户数"
        required
        class="mx-6 controlpanel"
        style="width:180px"
        readonly
      ></v-text-field>

      <!-- <v-text-field
        v-model="batch_code"
        color="yellow darken-3"
        label="抽取批次"
        required
        class="mx-6 controlpanel"
        style="width:180px"
        readonly
      ></v-text-field> -->
      <!-- <v-text-field
        v-model="villages_count"
        color="yellow darken-3"
        label="村数量"
        required
        class="mx-6 controlpanel"
        style="width:180px"
      ></v-text-field> -->
      <!-- <v-btn @click="onConfirm" color="primary" class="mx-6">
        <v-icon left>mdi-check-circle-outline</v-icon> 确定
      </v-btn> -->

      <!-- <div v-if="villages_count">
        <StartChouQian />
      </div> -->
      <v-text-field
        v-model="temp.b.population"
        label="智果"
        class="mx-6 controlpanel input"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="temp.c.population"
        label="静脉产业"
        class="mx-6 controlpanel input"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="temp.d.population"
        label="农房集聚点"
        class="mx-6 controlpanel input"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="temp.e.population"
        label="南北暑安置"
        class="mx-6 controlpanel input"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="countdown"
        color="green darken-3"
        label="设置倒计时长(S)"
        required
        class="mx-6 controlpanel input"
        style="width:40px"
        @change="onCountdownChange"
      ></v-text-field>
      <div>
        <StartChouQian />
      </div>
      <v-btn @click="goStatistics" color="primary" class="mr-3" fab>
        <v-icon large>mdi-chart-bar-stacked</v-icon>
      </v-btn>
      <v-btn @click="goHouseList" color="primary" class="mr-3" fab>
        <v-icon large>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn @click="onReset" color="red" class="mr-16" fab>
        <v-icon large>mdi-backup-restore</v-icon>
      </v-btn>
    </v-row>

    <!-- <v-row class="d-flex justify-center mb-0 pb-0">
      <v-text-field
        v-model="temp.a.population"
        label="村组A"
        class="mx-6 controlpanel"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="temp.b.population"
        label="村组B"
        class="mx-6 controlpanel"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="temp.c.population"
        label="村组C"
        class="mx-6 controlpanel"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="temp.d.population"
        label="村组D"
        class="mx-6 controlpanel"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
      <v-text-field
        v-model="temp.e.population"
        label="村组E"
        class="mx-6 controlpanel"
        style="width:30px"
        @change="onChange"
      ></v-text-field>
    </v-row> -->
    <v-card style="height:680px" class="pa-6 mx-3">
      <!-- <v-row class="d-flex justify-center ma-3">
        <h1>九色鹿安置房源分配</h1>
      </v-row> -->

      <!-- <div class="head-seamless">
        <v-row>
          <span class="mx-10">ID</span>
          <span class="mx-10">小区 | 地块</span>
          <span class="mx-10">楼幢</span>
          <span class="mx-10">单元</span>
          <span class="mx-10">门牌号码</span>
          <span class="mx-10">面积</span>
          <span class="mx-10">户型</span>
          <span class="mx-10">子母套</span>
          <span class="mx-10">创建日期</span>
        </v-row>
      </div> -->

      <vue-seamless-scroll
        :data="housesList"
        :class-option="myOption"
        class="seamless"
      >
        <table class="seamless">
          <tr v-for="row in housesList" :key="row.id">
            <td class="text-left">
              {{ row.house_code }}
            </td>
            <td class="text-right">
              {{ row.garden }}
            </td>
            <td class="text-right">{{ row.building }}幢</td>
            <td class="text-right">{{ row.unit }}单元</td>
            <td class="text-right">{{ row.number }}室</td>
            <td class="text-right">
              {{ row.area }}
            </td>
            <td class="text-right">
              {{ row.house_type }}
            </td>
            <td class="text-right">
              <span v-if="row.multi_flag">
                <v-icon color="red">mdi-tag-text-outline</v-icon>
              </span>
              <span v-else>
                <v-icon color="grey">mdi-tag-outline</v-icon>
              </span>
            </td>
            <td class="text-right">
              {{
                $moment(row.create_at)
                  .utc()
                  .format("YYYY-MM-DD")
              }}
            </td>
          </tr>
        </table>
      </vue-seamless-scroll>
    </v-card>

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

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { fetchLabels, updateLabels, resetLabels } from "@/api/labels";
import { fetchCustomersCount } from "@/api/customers";
import { fetchLabelsCount } from "@/api/labels";
import { fetchHousesCount } from "@/api/houses";
import { fetchHouses } from "@/api/houses";

const statusOptions = [
  { key: 0, display_name: "空闲" },
  { key: 1, display_name: "已选" },
  { key: 9, display_name: "剔除" }
];

const multiOptions = [
  { key: 0, display_name: "否" },
  { key: 1, display_name: "是" }
];

const checkFlagOptions = [
  { key: 0, display_name: "✘" },
  { key: 1, display_name: "✔" }
];

const areaitemOptions = [
  { key: 1, display_name: "小户型" },
  { key: 2, display_name: "中户型" },
  { key: 3, display_name: "大户型" }
];

export default {
  name: "Bills",

  components: { StartChouQian: () => import("./startChouQian") },

  data: () => ({
    countdown: "30",
    timer: null,
    batch_code: 1,
    myOption: {
      step: 0.5, // 数值越大速度滚动越快
      limitMoveNum: 26, // 开始无缝滚动的数据量 this.dataList.length
      hoverStop: false, // 是否开启鼠标悬停stop
      direction: 1, // 0向下 1向上 2向左 3向右
      openWatch: false, // 开启数据实时监控刷新dom
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      waitTime: 3 * 1000 // 单步运动停止的时间(默认值1000ms)
    },
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
    statusOptions,
    multiOptions,
    checkFlagOptions,
    areaitemOptions,
    exportItems: [],
    labelitems: {},
    items: [],
    villages_count: 0,
    temp: {
      // villagecomb_id {population: xx}
      a: {
        villagecomb_id: 1,
        population: 1223
      },
      b: {
        villagecomb_id: 2,
        population: 371
      },
      c: {
        villagecomb_id: 3,
        population: 66
      },
      d: {
        villagecomb_id: 4,
        population: 36
      },
      e: {
        villagecomb_id: 5,
        population: 19
      }
    },
    houses_count: 0,
    labels_count: 0,
    customers_count: 0,
    customers_count_static: 492,
    housesList: [],
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
    listQuery: {
      page: 1,
      limit: 10000,
      randomint: 1200
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
    this.getLabelitems();
    this.getHousesCount();
    this.getLabelsCount();
    // this.getCustomersCount();
    this.getHousesList();
    var a = parseInt(this.temp.a.population);
    var b = parseInt(this.temp.b.population);
    var c = parseInt(this.temp.c.population);
    var d = parseInt(this.temp.d.population);
    var e = parseInt(this.temp.e.population);
    this.customers_count = a + b + c + d + e;
  },
  watch: {},
  methods: {
    getHousesCount() {
      fetchHousesCount().then(response => {
        this.houses_count = response.data.houses_count;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    getLabelsCount() {
      fetchLabelsCount().then(response => {
        this.labels_count = response.data.labels_count;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    // getCustomersCount() {
    //   fetchCustomersCount().then(response => {
    //     this.customers_count = response.data.customers_count;
    //     // Just to simulate the time of the request
    //     setTimeout(() => {
    //       this.listLoading = false;
    //     }, 1.5 * 1000);
    //   });
    // },

    getLabelitems() {
      fetchLabels().then(response => {
        this.labelitems = response.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    sliceLabels() {
      console.log("sliceLabels: ", this.sliceLabels);
      // var data = { population: this.temp.population };
      updateLabels(this.temp).then(response => {
        this.labelitems = response.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    resetLabelsClicked() {
      console.log("resetLabels: ", this.resetLabels);
      resetLabels(resetLabels).then(response => {
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    onChange() {
      var a = parseInt(this.temp.a.population);
      var b = parseInt(this.temp.b.population);
      var c = parseInt(this.temp.c.population);
      var d = parseInt(this.temp.d.population);
      var e = parseInt(this.temp.e.population);
      this.customers_count = a + b + c + d + e;
    },

    onCountdownChange() {
      if (this.countdown < 30) {
        this.text = "倒计时设置时长必须大于30s";
        this.snackbar = true;
        this.countdown = 30;
      }
    },

    onReset() {
      console.log("onConfirm");
      this.$confirm(
        "此操作将重置所有数据，之前抽取的数据将会丢失，确认？"
      ).then(res => {
        if (res) {
          this.resetLabelsClicked().then(res => {
            this.text = "数据重置完成";
            this.snackbar = true;
          });
        }
      });
      setTimeout(() => {
        this.getLabelitems();
        this.getHousesCount();
        this.getLabelsCount();
      }, 3 * 1000);
    },

    goStatistics() {
      this.$router.push({
        name: "汇总数据"
      });
    },

    goHouseList() {
      this.$router.push({
        name: "抽签房源"
      });
    },

    onConfirm() {
      console.log("onConfirm");
      this.$confirm("现在抽取第", this.batch_code, "批房源，确认？").then(
        res => {
          if (res) {
            this.sliceLabels();
          }
        }
      );
      // this.$router.push({
      //   name: "倒计时",
      //   params: { population: this.temp.population }
      // });
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

    getHousesList() {
      this.listLoading = true;
      fetchHouses(this.listQuery).then(response => {
        this.housesList = response.data.items;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.5 * 1000);
      });
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

table,
thead,
th {
  color: rgb(11, 105, 247) !important;
}

table,
thead,
tr {
  color: grey;
  font-weight: 400;
}

.controlpanel {
  color: blueviolet !important;
  font-weight: 800;
  font-size: 24px;
}

.v-input input {
  max-height: 32px;
  color: rgb(30, 145, 245) !important;
}

/* .head-seamless {
  width: 1500px;
  margin: auto auto;
  color: #5c5c5e;
  font-size: 12px;
  font-weight: 600;
} */

.seamless {
  max-height: 640px;
  width: 1500px;
  margin: 0;
  overflow: hidden;
  font-size: 24px;
  font-weight: 800;
}

.v-card {
  margin: 0;
}
</style>
