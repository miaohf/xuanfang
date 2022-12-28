<template>
  <div>
    <v-row justify="center" class="header">
      <v-col cols="3" md="3">
        <v-row class="d-flex justify-end">
          <v-img class="logo" :src="require(`@/assets/${src}`)"></v-img>
          <span class="footprint"> </span>
        </v-row>
      </v-col>
      <v-col cols="7" md="7">
        <v-row class="title" justify="center">
          <span class="title">
            {{ data.project_name }}
          </span>
        </v-row>
      </v-col>

      <v-col cols="2" md="2">
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
      <v-row v-for="(garden, i) in gardens" :key="i" class="garden">
        <v-col
          v-for="(building, j) in garden.buildings"
          :key="j"
          class="building"
        >
          <div v-for="(unit, k) in building.units" :key="k">
            <v-simple-table class="statistics">
              <template v-slot:default>
                <!-- <thead>
                  <tr>
                    <th>
                      小区名称
                    </th>
                    <th>
                      面积
                    </th>
                    <th>
                      可选/总数
                    </th>
                  </tr>
                </thead> -->

                <tbody>
                  <tr v-for="(floor, l) in unit.floors.reverse()" :key="l">
                    <th>{{ floor.name }}F</th>
                    <td
                      v-for="(house, m) in floor.houses"
                      :key="m"
                      :class="`my-td-style-${house.status}`"
                    >
                      {{ house.number }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
      </v-row>
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
const baseUrl = "https://xuanfang.tuozhanad.com";
import marquee from "./components/marquee/marquee";
import { fetchGardens } from "@/api/gardens";
import { fetchAudio, updateAudio } from "@/api/audios";
// import Barrage from "vue-barrage";

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
    autoPlay: false,
    audio_url: "https://xuanfang.tuozhanad.com/audios/coloredeer4.mp3",
    data: "",
    gardens: [],
    textList: [],
    marqueeList: [],

    listQuery: {
      page: 1,
      limit: 1,
      sort: "+id"
    },

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
    this.getGardens();
    // this.getStatistics();
    // this.timer = setInterval(() => {
    //   setTimeout(this.getStatistics(), 0);
    //   // setTimeout(this.getText(), 0);
    //   // this.getAudio();
    // }, 1000 * 3);
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    getGardens() {
      fetchGardens(this.listQuery).then(response => {
        this.gardens = response.data.items;
        console.log(this.gardens);
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
  height: 1000px;
  // line-height: 40px;
  // display: flex;
  // justify-content: space-between;
  // font-size: 30px;
  // font-weight: 600;
  // color: #e40808;
  // background-color: #353e42;
  background-color: rgb(47, 54, 58);
  // background-color: #363423;
  // margin: 0 0;
  // padding: 0 0;
  // border-style: double;
  // border: white;
  // border-color: white;
  // border-spacing: 100px 5px !important;
}

.header {
  background-color: rgb(63, 84, 95);
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
  color: #abeb70 !important;
  font-weight: 600 !important;
  padding: 0 4px 0 4px !important;
  // margin:  0 !important;
}

$fontsize: (0 19px, 1 12px);

@each $i in $fontsize {
  .fontsize-td-#{nth($i,1) } {
    font-size: nth($i, 2) !important;
  }
}

// td {
//   height: 40px !important;
//   font-size: 16px !important;
//   // color: #dac592 !important;
//   color: rgb(199, 202, 200) !important;
//   font-weight: 600;
//   text-align: right;
//   padding: 0 4px 0 4px !important;
//   margin: 1 !important;
// }

$colors: (1 #294f6e, 2 #4e3152, 3 #2e3761, 4 #916139, 9 #363431);

@each $i in $colors {
  .my-td-style-#{nth($i, 1)} {
    background-color: nth($i, 2) !important;
    height: 40px !important;
    font-size: 16px !important;
    // color: #dac592 !important;
    color: rgb(199, 202, 200) !important;
    font-weight: 600;
    text-align: right;
    padding: 0 4px 0 4px !important;
    margin: 1 !important;
  }
}

tr:hover {
  background-color: rgb(40, 80, 100) !important;
}

td:hover {
  background-color: #182c12 !important;
  color: #f88a0c !important;
  // font-size: 28px !important;
}

.title {
  color: #ff3b0a;
  font-size: 44px;
  font-weight: 800;
  padding: 0;
  text-shadow: 2px 0px #fa947a;
}

.logo {
  max-width: 160px;
  padding: 0 0 0 0;
  margin: 5px 0 5px 40px;
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
.garden {
  background-color: #484949;
  padding: 0 25px 0 25px !important;
}

.building {
  color: #eeda24;
  margin: 2px !important;
  padding: 0 0 0 0 !important;
}

.unit {
  background-color: #ac9f57;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}

.floor {
  background-color: #6b653f;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}

.house {
  background-color: #4c6066;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}

.number {
  color: #e6ec90;
  margin: auto;
  padding: auto;
  width: 100;
}
</style>
