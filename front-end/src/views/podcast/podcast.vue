<template>
  <v-container fluid class="px-8 py-0" style="height:720px">
    <template v-slot:after-heading> </template>
    <div class="marquee">
      <marquee :data="marqueeList"></marquee>
    </div>
    <v-row>
      <v-col>
        <vuetify-audio
          :file="audio_url"
          color="success"
          :ended="audioFinish"
          downloadable
          :autoPlay="autoPlay"
        ></vuetify-audio>
        <v-row class="d-flex justify-space-between mx-1 mb-0">
          <v-row>
            <v-switch
              v-model="autoPlay"
              label="自动播报"
              class="mx-10"
              color="secondary"
              hide-details
            />
            <v-switch
              v-model="autoCall"
              label="自动叫号"
              class="mx-10"
              color="secondary"
              hide-details
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model="offset"
              label="设置台上人数"
              clearable
              class="mx-6"
              style="max-width: 100px;"
            ></v-text-field>

            <v-text-field
              v-model="start_number"
              label="设置起始号码"
              clearable
              class="mx-6"
              style="max-width: 100px;"
            ></v-text-field>
          </v-row>
        </v-row>
      </v-col>
      <!-- <v-col>
        <v-card>
          <span>
            xxxxxx
          </span>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
const baseUrl = "http://xuanfang.tuozhanad.com";
import marquee from "./components/marquee/marquee";
import { fetchAudio, updateAudio } from "@/api/audios";
import { callNumber } from "@/api/customers";

export default {
  name: "PodCast",

  components: {
    marquee,
    VuetifyAudio: () => import("vuetify-audio")
  },

  data: () => ({
    start_number: 1,
    offset: 5,
    audio: {
      audiotype: 0, // 0, 播报，1, 叫号
      lottery_sequence: 1,
      text: "抽签马上开始，请1-5号上前准备。"
    },
    autoPlay: true,
    autoCall: true,
    audio_url: "https://xuanfang.tuozhanad.com/audios/coloredeer4.mp3",
    data: "",
    marqueeList: [],
    timer: 0,
    i: 0,
    message: "Hello, world ~!",
    timeout: 3000
  }),

  computed: {},

  created() {},

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    getAudio() {
      fetchAudio().then(response => {
        // console.log("fetchAudio");
        if (response.data.id) {
          clearInterval(this.timer);
          // console.log("New audio detective");
          this.audio = response.data;

          setTimeout(() => {
            this.audio_url = baseUrl + this.audio.uri;
            // console.log(this.audio_url, this.audio.text);
            if (this.marqueeList.includes(this.audio.text)) {
              // console.log("the same audio.text");
            } else {
              this.marqueeList.shift();
              this.marqueeList.push(this.audio);
              // console.log(this.marqueeList);
            }
          }, 5 * 1000);
        }
      });
    },

    audioFinish() {
      var data = { status: 1 };
      if (this.audio.id) {
        updateAudio(this.audio.id, data).then(response => {
          console.log("update audio finished");
        });
      }

      console.log(
        "this.autoCall && this.audio.audiotype: ",
        this.autoCall,
        this.audio.audiotype
      );
      if (this.autoCall && this.audio.audiotype == 0) {
        console.log("检查自动叫号");
        var calldata = {
          lottery_sequence: this.audio.lottery_sequence,
          offset: this.offset,
          start_number: this.start_number
        };

        callNumber(calldata).then(response => {
          this.audio = response.data;
          setTimeout(() => {
            this.audio_url = baseUrl + this.audio.uri;
            if (this.marqueeList.includes(this.audio.text)) {
            console.log("the same audio.text");
          } else {
            this.marqueeList.shift();
            this.marqueeList.push(this.audio);
            // console.log(this.marqueeList);
          }
          }, 3 * 1000);          
        });
      } else {
        console.log("检查自动播报");
        this.timer = setInterval(() => {
          setTimeout(this.getAudio(), 0);
        }, 1000 * 1);
      }
      this.start_number = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.marquee {
  font-size: 60px;
  font-weight: 600;
  background-color: #19191a;
  width: 100%;
  align-items: center;

  padding-left: 10px;
  padding-right: 10px;
  line-height: 48px;
  color: rgb(245, 200, 142);
  box-sizing: border-box;
  border: 1px solid #1b1a1a;
}
</style>
