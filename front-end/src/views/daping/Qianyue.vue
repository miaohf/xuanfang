<template>
  <div class="page_bg">
    <v-row justify="center" class="header">
      <v-col cols="3" md="3">
        <v-row class="d-flex justify-end">
          <v-img class="logo" :src="require(`@/assets/${src}`)"></v-img>
          <span class="footprint"> </span>
        </v-row>
        <!-- <v-row class="d-flex justify-end">
          <span class="footprint">
            九色鹿网络
          </span>
        </v-row> -->
        <!-- <v-row class="d-flex justify-end">
          <v-img
            class="logo"
            src="http://www.tuozhanad.com/skin/img/logo.png"
          ></v-img>
          <span class="footprint">
            嘉兴九色鹿软件科技有限公司技术支持
          </span>
        </v-row> -->
      </v-col>
      <v-col cols="7" md="7">
        <v-row class="title" justify="center">
          <span class="title">
            {{ project_name }}
          </span>
          <!-- <span
            :style="{
              color: blueColor,
              'font-size': '28px',
              'font-weight': 600,
              padding: 0
            }"
          >
            房源数据
          </span> -->
        </v-row>
      </v-col>

      <v-col cols="2" md="2">
        <!-- v-if="audio.lottery_sequence != 0" -->
        <v-row class="lottery_sequence_font">
          第
          <span class="lottery_sequence">
            {{ audio.lottery_sequence }}
          </span>
          号
        </v-row>
      </v-col>
    </v-row>

    <div class="marquee">
      <marquee :data="marqueeList"></marquee>
    </div>

    <v-row justify="center">
      <v-col v-for="(value, k, i) in newDatas" :key="i" class="my-col">
        <v-card class="my-card">
        <v-simple-table class="statistics">
          <template v-slot:default>
            <thead>
              <tr>
                <td class="table-head">
                  小区名称
                </td>
                <td class="table-head">
                  面积
                </td>
                <td class="table-head text-center my-td">
                  可选/总数

                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, j) in value" :key="j">
                <td
                  :class="
                    `fontsize-td-${length_bigger_than_five(row.garden_name)}`
                  "
                >
                  <span
                    :style="{
                      color:
                        row.total - row.occupied == 0 ? grayColor : whiteColor
                    }"
                  >
                    {{ row.id }}. {{ row.garden_name }}</span
                  >
                </td>
                <td>
                  <span
                    :style="{
                      color:
                        row.total - row.occupied == 0 ? grayColor : whiteColor
                    }"
                  >
                    {{ row.area }}</span
                  >
                </td>
                <td class="text-center">
                  <span
                    v-if="row.total - row.occupied >= 10"
                    :style="{ color: greenColor }"
                  >
                    <span
                      :class="{
                        isChanged:
                          isFlashOn &&
                          oldDatas[k][j].occupied !== newDatas[k][j].occupied
                      }"
                      >{{row.total - row.occupied}}
                    </span>
                    <span :style="{ color: whiteColor }">/{{ row.total }}</span>
                  </span>
                  <span
                    v-else
                    :style="{
                      color:
                        row.total - row.occupied == 0 ? grayColor : redColor
                    }"
                  >
                    <span
                      :class="{
                        isChanged:
                          isFlashOn &&
                          oldDatas[k][j].occupied !== newDatas[k][j].occupied
                      }"
                      >{{row.total - row.occupied}}
                    </span>
                    <span
                      :style="{
                        color:
                          row.total - row.occupied == 0 ? grayColor : whiteColor
                      }"
                      >/{{ row.total }}</span
                    >
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
    <v-divider />

    <!-- <v-switch v-model="autoPlay" label="自动播报"></v-switch> -->

    <vuetify-audio
      :file="audio_url"
      color="success"
      :ended="audioFinish"
      :autoPlay="autoPlay"
    ></vuetify-audio>
    <v-checkbox v-model="autoPlay" label="自动播报" class="ma-0 pa-0">
    </v-checkbox>
  </div>
</template>

<script>
const baseUrl = "https://taozhuang.tuozhanad.com";
import marquee from "./components/marquee/marquee";
import { fetchStatistics } from "@/api/statistics";
import { fetchAudio, updateAudio } from "@/api/audios";

export default {
  name: "BullitinQianyue",

  components: {
    // vueSeamlessScroll,
    // MarqueeText
    marquee,
    VuetifyAudio: () => import("vuetify-audio")
  },

  data: () => ({
    // isChanged: 0,
    isFlashOn: 1,
    src: "coloredeer.jpg",
    audio: { lottery_sequence: 0 },
    autoPlay: true,
    audio_url: "https://taozhuang.tuozhanad.com/audios/coloredeer4.mp3",
    textList: [],
    marqueeList: [],
    project_name: "",
    oldDatas: {},
    newDatas: {
      List1: [],
      // List2: [],
      // List3: []
    },

    whiteColor: "#b3bcb9",
    blueColor: "#32a2f4",
    greenColor: "#53d88a",
    orangeColor: "#e4a908",
    redColor: "#e15656",
    grayColor: "#727b7e",
    lightblueColor: "#0882f5",

    timer: 0,
    timer2: 0,
    i: 0,
    message: "Hello, world ~!",
    timeout: 3000
  }),

  computed: {},

  created() {
    this.getStatistics();
    this.timer = setInterval(() => {
      setTimeout(this.getStatistics(), 0);
      setTimeout((this.isFlashOn = 0), 0);
    }, 1000 * 5);
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    getStatistics() {
      this.listLoading = true;
      fetchStatistics().then(response => {
        this.isFlashOn = 1;
        this.oldDatas = { ...this.newDatas };
        this.project_name = response.data.project_name;

        this.newDatas.List1 = response.data.details.filter(i => i.id <= 16);
        // this.newDatas.List2 = response.data.details.filter(
        //   i => i.id > 16 && i.id <= 32
        // );
        // this.newDatas.List3 = response.data.details.filter(
        //   i => i.id > 32 && i.id <= 57
        // );

        setTimeout(() => {
          this.listLoading = false;
        }, 3 * 1000);
      });
    },

    getAudio() {
      fetchAudio().then(response => {
        if (response.data.id) {
          clearInterval(this.timer);
          console.log("New audio detective");
          this.audio = response.data;

          setTimeout(() => {
            if (this.marqueeList.includes(this.audio.text)) {
              console.log("the same audio.text");
            } else {
              this.marqueeList.shift();
              this.marqueeList.push(this.audio);
            }
            this.audio_url = baseUrl + this.audio.uri;
          }, 0.1 * 1000);
        }
      });
    },

    audioFinish() {
      var data = { status: 1 };
      updateAudio(this.audio.id, data).then(response => {
        console.log("update audio finished");
      });
      if (this.autoPlay) {
        this.timer = setInterval(() => {
          setTimeout(this.getAudio(), 0);
        }, 1 * 1000);
      }
    },

    length_bigger_than_five(name) {
      if (name.length > 5) {
        return 1;
      } else {
        return 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
body {
  background-color: #41413f;
}
.page_bg {
  padding: 0;
  margin: 0 0;
  background-color: #41413f;
}
.marquee {
  font-size: 60px;
  font-weight: 600;
  background-color: #41413f;
  width: 100%;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 48px;
  color: rgb(245, 200, 142);
  box-sizing: border-box;
  border: 2px solid #454b57;
  // border-radius: 5px;
  // background: url(../img/sound.png) no-repeat 42px center / 35px 35px;
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

.statistics {
  height: 820px;
  background-color: rgb(139, 74, 56);
}

.header {
  background-color: rgb(139, 74, 56);
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
  color: #90978e !important;
  font-weight: 600 !important;
  // padding: 0  !important;
  // margin:  0 !important;
}

$fontsize: (0 28px, 1 12px);

@each $i in $fontsize {
  .fontsize-td-#{nth($i,1) } {
    font-size: nth($i, 2) !important;
  }
}

td {
  height: 40px !important;
  font-size: 30px !important;
  // color: #dac592 !important;
  color: rgb(162, 167, 173) !important;
  font-weight: 800;
  padding: 0 8px 0 40px !important;
  margin: auto;
}

tr:hover {
  background-color: #0282b4 !important;
  // padding: 0 0 0 6px  !important;
}

.my-col {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 0;
  padding-bottom: 0;
}

.my-card {
  padding: 30px 100px 30px 100px;
  margin: auto;
  background-color: rgb(139, 74, 56);
}

.title {
  color: #f79336;
  font-size: 44px;
  font-weight: 800;
  padding: 0;
  text-shadow: 2px 0px #353536;
}

.logo {
  max-width: 130px;
  padding: 0 0 0 0;
  margin: 10px 0 0 18px;
}

.footprint {
  color: #f7f3f3;
  font-size: 22px;
  font-weight: 400;
  margin: 0 10px 0 24px;
}

.lottery_sequence_font {
  color: #ece7e3;
  font-size: 30px;
  font-weight: 400;
  padding: 16px 0 0 130px;
}

.lottery_sequence {
  color: #f75c36;
  font-size: 36px;
  font-weight: 800;
  padding: 0 8px 0 8px;
}

.isChanged {
  color: #f6fa06 !important;
  font-size: x-large;
  animation: blink 1s 3;
  animation: blink 3s linear infinite;

}

.table-head {
  font-size: 16px !important;
  color: #b3ac99 !important;
}

.my-td {
  padding: 0 0 0 32px !important;
}


@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
