<template>
  <div class="bullitin">
    <v-row justify="center">
      <v-col cols="3" md="3"></v-col>
      <v-col cols="6" md="6">
        <v-row class="title" justify="center">
          <span
            :style="{
              color: blueColor,
              'font-size': '42px',
              'font-weight': 600,
              padding: 0
            }"
          >
            {{ data.project_name }}现场播报
          </span>
        </v-row>
      </v-col>
      <v-col cols="3" md="3">
        <v-row class="title2" justify="center">
          <span
            :style="{
              color: grayColor,
              'font-size': '28px',
              'font-weight': 600
            }"
          >
            共
          </span>
          <span
            :style="{
              color: whiteColor,
              'font-size': '32px',
              'font-weight': 600
            }"
          >
            {{ data.houses_total }}
          </span>
          <span
            :style="{
              color: grayColor,
              'font-size': '28px',
              'font-weight': 600
            }"
          >
            套，剩余
          </span>
          <span
            :style="{
              color: greenColor,
              'font-size': '32px',
              'font-weight': 600
            }"
          >
            {{ data.houses_free }}
          </span>
          <span
            :style="{
              color: grayColor,
              'font-size': '28px',
              'font-weight': 600
            }"
          >
            套
          </span>
        </v-row>
      </v-col>
    </v-row>

    <v-divider />

    <v-divider class="divider" />

    <div class="marquee">
      <marquee :data="marqueeList"></marquee>
    </div>

    <div class="head-seamless">
      <v-row>
        <span style="margin-left:0px">ID</span>
        <span style="margin-left:170px">户主姓名</span>
        <span style="margin-left:120px">小区地块</span>
        <span style="margin-left:180px">幢</span>
        <span style="margin-left:160px">单元</span>
        <span style="margin-left:100px">门牌号码</span>
        <span style="margin-left:130px">面积</span>
        <span style="margin-left:150px">签约时间</span>
      </v-row>
    </div>

    <vue-seamless-scroll
      :data="textList"
      :class-option="myOption"
      class="seamless"
    >
      <table class="seamless">
        <tr v-for="(item, index) in textList" :key="index">
          <td width=150>{{ item.id }}</td>
          <td class="text-right" width=150>{{ item.customer_name }}</td>
          <td class="text-right" width=240>{{ item.garden_name }}</td>
          <td class="text-right" width=150>{{ item.building_name }}幢</td>
          <td class="text-right" width=150>{{ item.unit_name }}单元</td>
          <td class="text-right" width=150>{{ item.number }}</td>
          <td class="text-right" width=150>{{ item.area }}㎡</td>
          <td
            class="text-right"
            width=150
            v-text="
              $moment(item.create_at)
                .utc()
                .format('MM-DD HH:mm')
            "
          ></td>
        </tr>
      </table>
    </vue-seamless-scroll>

    <v-divider />

    <v-row>
      <v-col cols="9"></v-col>
      <v-col cols="3">
        <v-row>
          <p
            class="mx-12"
            :style="{
              color: grayColor,
              'font-size': '24px',
              'font-weight': 500
            }"
          >
            .Copyright@2021
          </p>
          <!-- <v-img
            style="max-height: 30px; max-width: 120px;"
            class="logo"
            src="http://www.coloredeer.com/style/images/logo.png"
          ></v-img> -->
          <v-img
            style="max-height: 30px; max-width: 120px;"
            class="logo"
            src="http://www.tuozhanad.com/skin/img/logo.png"
          ></v-img>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import vueSeamlessScroll from "vue-seamless-scroll";
// import MarqueeText from "vue-marquee-text-component";
import marquee from "./components/marquee/marquee";
import { fetchStatistics } from "@/api/statistics";
import { fetchText, fetchTexts } from "@/api/texts";
import { MESSAGE_TYPE } from "vue-baberrage";
// import Barrage from "vue-barrage";

export default {
  name: "BullitinTexts",

  components: {
    vueSeamlessScroll,
    // MarqueeText,
    marquee
  },

  data: () => ({
    data: "",
    textList: [],
    marqueeList: [],
    message: "",
    whiteColor: "#efefef",
    blueColor: "#32a2f4",
    greenColor: "#53d88a",
    orangeColor: "#e4a908",
    redColor: "#f16666",
    grayColor: "#aaaaaa",
    QueryParam: {
      page: 1,
      limit: 1000
    },
    myOption: {
      step: 0.5, // 数值越大速度滚动越快
      limitMoveNum: 13, // 开始无缝滚动的数据量 this.dataList.length
      hoverStop: true, // 是否开启鼠标悬停stop
      direction: 1, // 0向下 1向上 2向左 3向右
      openWatch: false, // 开启数据实时监控刷新dom
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      waitTime: 3 * 1000 // 单步运动停止的时间(默认值1000ms)
    },

    timer: 0,
    i: 0,

    timeout: 3000
  }),

  computed: {},

  created() {
    this.getTexts();
    this.timer = setInterval(() => {
      setTimeout(this.getText(), 0);
      setTimeout(this.getStatistics(), 0);
    }, 1000 * 1);
  },

  // mounted() {
  //   setTimeout(() => {
  //     // listData length无变化，仅仅是属性变更，手动调用下组件内部的reset方法
  //     this.$refs.seamlessScroll.reset();
  //   }, 2000);
  // },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    getStatistics() {
      this.listLoading = true;
      fetchStatistics().then(response => {
        this.data = response.data;
        // console.log(this.data)
        this.leftList = this.data.details.filter(i => i.id <= 13);
        this.middleList = this.data.details.filter(
          i => i.id > 13 && i.id <= 26
        );
        this.rightList = this.data.details.filter(i => i.id > 26);
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 15 * 1000);
      });
    },

    getTexts() {
      fetchTexts(this.QueryParam).then(response => {
        this.textList = response.data.items.sort(function(a, b) {
          return a.id - b.id;
        });
        // console.log(this.textList);
        // this.marqueeList = this.textList.slice(-1)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    getText() {
      fetchText().then(response => {
        if (response.data.id) {
          // this.textList.shift();
          // console.log('response.data: ', response.data)
          this.textList.push(response.data);
          this.marqueeList.push(response.data);

          if (this.marqueeList.length >= 4) {
            this.marqueeList.shift();
          }
          console.log(
            "marqueeList: ",
            this.marqueeList,
            "this.marqueeList.length: ",
            this.marqueeList.length
          );
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
body {
  background-color: #303131;
}

.bullitin {
  padding: 0;
  margin: 0 0;
  background-color: #252525;
  height: 960px;
}

.marquee {
  color: #ece074;
  font-size: 35px;
  font-weight: 600;
  background-color: #5c5d5e;
  align-items: center;
  margin: 12px 36px;
}

.logo {
  padding: 0;
  margin: 0;
}

.title {
  padding-left: 80px;
  padding-top: 24px;
  // margin: 0 0;
  display: flex;
  text-align: left;
  // flex: auto;
}

.title2 {
  padding-top: 36px;
  // margin-top: 12px;
  display: flex;
  // text-align: center;
}

.head {
  width: 1300px;
  margin: 0 auto;
  margin-bottom: 10px;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li,
    a {
      display: block;
      height: 50px;
      line-height: 60px;
      // line-height: 2.0;
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      font-weight: 600;
      color: #a0bdf1;
    }
  }
}

.head-seamless {
  width: 1500px;
  margin: auto auto;
  color: #5c5c5e;
  font-size: 20px;
  font-weight: 600;
}

.card-seamless {
  height: 670px !important;
  margin: auto;
  padding: auto;
  width: 1600px;
  background-color: transparent;
}

.seamless {
  max-height: 670px;
  width: 1500px;
  margin: auto auto;
  overflow: hidden;
}

table {
  padding: 0;
  margin: 0 auto;
  tr {
    height: 50px;
    line-height: 50px;
    font-size: 48px;
    font-weight: 600;
    color: #bfc3ca;
    text-align: left;
  }
}

.marquee {
  width: 1600px;
  padding-left: 100p;
  padding-right: 30px;
  line-height: 50px;
  margin: 0 auto 28px;
  color: rgb(250, 250, 204);
  box-sizing: border-box;
  border: 1px solid #1b1a1a;
  border-radius: 24px;
  // background: url(../img/sound.png) no-repeat 42px center / 35px 35px;
}
</style>
