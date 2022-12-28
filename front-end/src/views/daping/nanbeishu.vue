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
            {{ data.project_name }}
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
      <v-col class="my-col">
        <v-simple-table class="statistics">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  小区名称
                </th>
                <th >
                  面积
                </th>
                <th>
                  可选/总数
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in List1" :key="row.id">
                <td
                  :class="
                    `fontsize-td-${length_bigger_than_five(row.garden_name)}`
                  "
                >
                  {{ row.id }}.
                  {{ row.garden_name }}
                </td>
                <td>
                  {{ row.area }}
                </td>
                <td class="text-center">
                  <span
                    v-if="row.total - row.occupied >= 10"
                    :style="{ color: greenColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                  <span
                    v-else
                    :style="{ color: row.free > 0 ? orangeColor : redColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col class="my-col">
        <v-simple-table class="statistics">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  小区名称
                </th>
                <th >
                  面积
                </th>
                <th>
                  可选/总数
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in List2" :key="row.id">
                <td
                  :class="
                    `fontsize-td-${length_bigger_than_five(row.garden_name)}`
                  "
                >
                  {{ row.id }}.
                  {{ row.garden_name }}
                </td>
                <td>
                  {{ row.area }}
                </td>
                <td class="text-center">
                  <span
                    v-if="row.total - row.occupied >= 10"
                    :style="{ color: greenColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                  <span
                    v-else
                    :style="{ color: row.free > 0 ? orangeColor : redColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col class="my-col">
        <v-simple-table class="statistics">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  小区名称
                </th>
                <th >
                  面积
                </th>
                <th>
                  可选/总数
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in List3" :key="row.id">
                <td
                  :class="
                    `fontsize-td-${length_bigger_than_five(row.garden_name)}`
                  "
                >
                  {{ row.id }}.
                  {{ row.garden_name }}
                </td>
                <td>
                  {{ row.area }}
                </td>
                <td class="text-center">
                  <span
                    v-if="row.total - row.occupied >= 10"
                    :style="{ color: greenColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                  <span
                    v-else
                    :style="{ color: row.free > 0 ? orangeColor : redColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col class="my-col">
        <v-simple-table class="statistics">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  小区名称
                </th>
                <th >
                  面积
                </th>
                <th>
                  可选/总数
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in List4" :key="row.id">
                <td
                  :class="
                    `fontsize-td-${length_bigger_than_five(row.garden_name)}`
                  "
                >
                  {{ row.id }}.
                  {{ row.garden_name }}
                </td>
                <td>
                  {{ row.area }}
                </td>
                <td class="text-center">
                  <span
                    v-if="row.total - row.occupied >= 10"
                    :style="{ color: greenColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                  <span
                    v-else
                    :style="{ color: row.free > 0 ? orangeColor : redColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <!-- <v-col class="my-col">
        <v-simple-table class="statistics">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  小区名称
                </th>
                <th >
                  面积
                </th>
                <th>
                  可选/总数
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in List5" :key="row.id">
                <td
                  :class="
                    `fontsize-td-${length_bigger_than_five(row.garden_name)}`
                  "
                >
                  {{ row.id }}.
                  {{ row.garden_name }}
                </td>
                <td>
                  {{ row.area }}
                </td>
                <td class="text-center">
                  <span
                    v-if="row.total - row.occupied >= 10"
                    :style="{ color: greenColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                  <span
                    v-else
                    :style="{ color: row.free > 0 ? orangeColor : redColor }"
                    >{{ row.total - row.occupied
                    }}<span :style="{ color: whiteColor }"
                      >/{{ row.total }}</span
                    >
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col> -->
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
const baseUrl = "https://nanbeishu.tuozhanad.com";
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
    src: "coloredeer.jpg",
    audio: { lottery_sequence: 0 },
    autoPlay: true,
    audio_url: "https://nanbeishu.tuozhanad.com/audios/coloredeer4.mp3",
    data: "",
    textList: [],
    marqueeList: [],

    List1: [],
    List2: [],
    List3: [],
    List4: [],
    List5: [],
    List6: [],
    // List7: [],
    // List8: [],

    whiteColor: "#e0e0d1",
    blueColor: "#32a2f4",
    greenColor: "#53d88a",
    orangeColor: "#e4a908",
    redColor: "#e15656",
    grayColor: "#626b6e",
    lightblueColor: "#0882f5",

    timer: 0,
    i: 0,
    message: "Hello, world ~!",
    timeout: 3000
  }),

  computed: {},

  created() {
    this.getStatistics();
    this.timer = setInterval(() => {
      setTimeout(this.getStatistics(), 0);
      // setTimeout(this.getText(), 0);
      // this.getAudio();
    }, 1000 * 3);
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    getStatistics() {
      this.listLoading = true;
      fetchStatistics().then(response => {
        this.data = response.data;
        // console.log(this.data);
        // jingmai = 19
        // nanbeishu = 14
        this.List1 = this.data.details.filter(i => i.id <= 14);
        this.List2 = this.data.details.filter(i => i.id > 14 && i.id <= 28);
        this.List3 = this.data.details.filter(i => i.id > 28 && i.id <= 42);
        this.List4 = this.data.details.filter(i => i.id > 42 && i.id <= 56);
        this.List5 = this.data.details.filter(i => i.id > 56 && i.id <= 70);
        this.List6 = this.data.details.filter(i => i.id > 110 && i.id <= 132);
        // this.List7 = this.data.details.filter(i => i.id > 114 && i.id <= 133);
        // this.List8 = this.data.details.filter(i => i.id > 108);

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
            // console.log(this.audio_url, this.audio.text);
            if (this.marqueeList.includes(this.audio.text)) {
              console.log("the same audio.text");
            } else {
              this.marqueeList.shift();
              this.marqueeList.push(this.audio);
              // console.log(this.marqueeList);
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
  // display: block;
  height: 820px;
  // line-height: 40px;
  // display: flex;
  // justify-content: space-between;
  // font-size: 30px;
  // font-weight: 600;
  // color: #e40808;
  // background-color: #353e42;
  background-color: rgb(40, 80, 100);
  // background-color: #363423;
  // margin: 0 0;
  // padding: 0 0;
  // border-style: double;
  // border: white;
  // border-color: white;
  // border-spacing: 100px 5px !important;
}

.header {
  background-color: rgb(40, 80, 100);
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

$fontsize: (0 19px, 1 12px);

@each $i in $fontsize {
  .fontsize-td-#{nth($i,1) } {
    font-size: nth($i, 2) !important;
  }
}

td {
  height: 40px !important;
  font-size: 20px !important;
  // color: #dac592 !important;
  color: rgb(199, 202, 200) !important;
  font-weight: 600;
  padding: 0 8px 0 10px !important;
  // margin: 0 !important;
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
// .v-messages {
//   height: 0 !important;
//   min-height: 0 !important;
// }

.title {
  color: #ff3b0a;
  font-size: 44px;
  font-weight: 800;
  padding: 0;
  text-shadow: 2px 0px #fa947a;
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
</style>
