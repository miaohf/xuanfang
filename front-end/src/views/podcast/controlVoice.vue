<template>
  <v-container fluid class="px-8" style="min-height:720px">
    <template v-slot:after-heading> </template>
    <div class="marquee">
      <marquee :data="marqueeList"></marquee>
    </div>
    <v-row class="ma-0 d-flex justify-space-between ">
      <v-col  cols="9">
        <span v-for="customer in customers" :key="customer.id">
          <span v-if="customer.is_called">
            <v-badge
              overlap
              :class="`my-badge-${customer.is_called}`"
              :content="customer.is_called"
              offset-x="20"
              offset-y="20"
            >
              <v-btn
                :class="`my-btn-${customer.is_called} mx-2 my-2`"
                style="width:120px"
                :disabled="customer.lottery_sequence == '-'"
                @click="generateAudio(customer)"
                >{{ customer.lottery_sequence }}.{{ customer.name }}</v-btn
              ></v-badge
            >
          </span>

          <span v-else>
            <v-btn
              :class="`my-btn-${customer.is_called} mx-2 my-2`"
              style="width:120px"
              :disabled="customer.lottery_sequence == '-'"
              @click="generateAudio(customer)"
              >{{ customer.lottery_sequence }}.{{ customer.name }}</v-btn
            >
          </span>
        </span>
        <v-pagination
          v-model="listQuery.page"
          :circle="circle"
          :disabled="disabled"
          :length="total_pages"
          :next-icon="nextIcon"
          :prev-icon="prevIcon"
          :total-visible="totalVisible"
          :value="listQuery.page"
          @input="paginationChangeHandler"
          class="my-3 mx-0"
        ></v-pagination>
      </v-col>
      <v-col cols="3">
        <vuetify-audio
        :file="audio_url"
        color="warning"
        :autoPlay="autoPlay"
        :ended="freshCustomers"
        class="mt-3"
      ></vuetify-audio>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
const baseUrl = "https://taozhuang.tuozhanad.com";
import marquee from "./components/marquee/marquee";
import { fetchAudio } from "@/api/audios";
import { fetchCustomers, callNumberbyControl } from "@/api/customers";
// import { keDaXunFei } from "@/utils/tts-ws-node";

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
      text: ""
    },
    autoPlay: true,
    autoCall: true,
    audio_url: "https://taozhuang.tuozhanad.com/audios/coloredeer4.mp3",
    data: "",
    marqueeList: [{ text: "欢迎使用九色鹿抽签管理系统" }],
    timer: 0,
    i: 0,
    message: "Hello, world ~!",
    timeout: 3000,
    customers: [],
    customer: {},
    listQuery: {
      page: 1,
      limit: 80,
      // order_by_lottery_sequence: undefined,
      customer_code: undefined,
      customer_name: undefined,
      status: undefined,
      remain_area_greater_twenty: undefined,
      sort: "+id",
      orderby: 2,  //2 抽签顺序号
      paged: 1,
      check_flag: undefined,
      village_id: undefined
    },
    total_pages: 0,
    totalVisible: 10,
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    circle: true,
    disabled: false,
    badgeColor: "rgb(#7c2b02 .8)"
  }),

  computed: {},

  created() {
    this.getCustomers();
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    getCustomers() {
      const query = this.listQuery;
      fetchCustomers(query).then(response => {
        this.customers = response.data.items;
        this.total_pages = response.data._meta.total_pages;
        console.log(this.customers);
      });
    },

    getAudio() {
      fetchAudio().then(response => {
        if (response.data.id) {
          clearInterval(this.timer);
          this.audio = response.data;

          setTimeout(() => {
            this.audio_url = baseUrl + this.audio.uri;
            if (this.marqueeList.includes(this.audio.text)) {
              // console.log("the same audio.text");
            } else {
              this.marqueeList.shift();
              this.marqueeList.push(this.audio);
            }
          }, 5 * 1000);
        }
      });
    },

    freshCustomers() {
      if (this.customers.indexOf(this.customer) == this.customers.length - 1) {
        this.listQuery.page = this.listQuery.page + 1;
      }
      this.getCustomers();
    },

    pageUp() {
      this.listQuery.page = this.listQuery.page - 1;
      this.getCustomers();
    },

    pageDown() {
      this.listQuery.page = this.listQuery.page + 1;
      this.getCustomers();
    },

    paginationChangeHandler(pageNumber) {
      console.log("paginationChangeHandler, pageNumber: ", pageNumber);
      this.listQuery.page = pageNumber;
      this.getCustomers();
    },

    generateAudio(customer) {
      this.customer = customer;
      var text =
        "请选房顺序号，第" +
        customer.lottery_sequence +
        "号代表，上台选房。";
      // let kedaxunfei = new keDaXunFei(outputfile, text);
      // kedaxunfei.connect()  //浏览器websocket无法实现文件下载
      console.log("generateAudio");
      var data = {
        text: text,
        customer_id: customer.id
      };

      callNumberbyControl(data).then(response => {
        this.audio = response.data;
        setTimeout(() => {
          this.audio_url = baseUrl + this.audio.uri;
          if (this.marqueeList.includes(this.audio.text)) {
            console.log("the same audio.text");
          } else {
            this.marqueeList.shift();
            this.marqueeList.push(this.audio);
          }
        }, 3 * 1000);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.marquee {
  // font-size: 10px;
  font-weight: 400;
  background-color: #19191a;
  width: 100%;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  line-height: 50px;
  color: rgb(245, 200, 142);
  // box-sizing: border-box;
  // border: 1px solid #1b1a1a;
}

// .my-btn {
//   color: #f3b69e;
// }

// $colors: (0 #104232, 1 #ad7327, 2 #8f3e0f, 3 #912119, 4 #580903);
$colors: (
  0 #254137,
  1 #0b2a44,
  2 #0b2a44,
  3 #0b2a44,
  4 #0b2a44,
  5 #0b2a44,
  6 #0b2a44,
  7 #0b2a44,
  8 #0b2a44,
  9 #0b2a44,
  10 #0b2a44
);

$color: nth($colors, random(length($colors)));

@each $i in $colors {
  .my-btn-#{nth($i,1)} {
    color: #cacacc;
    background-color: nth($i, 2) !important;
  }

  .my-badge-#{nth($i,1)} {
    color: #49aa08;
  }
}

.dopage {
  background-color: #263741 !important;
}
</style>
