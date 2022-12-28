<template>
  <v-container fluid tag="section">
    <v-row justify="center">
      <v-col cols="7"> </v-col>
      <v-col cols="4">
        <v-btn @click="goBack" class="primary">
          <i class="mdi mdi-arrow-left-bold"></i>返回
        </v-btn>
        <v-btn v-print="printObj" class="primary">
          <i class="mdi mdi-printer"></i>打印
        </v-btn>
      </v-col>
    </v-row>
    <div class="A4" id="printMe">
      <!-- <div class="backgroundimg"> -->
      <div :style="cssBackgroundImg" class="backgroundimg">
        <p>
          <br />
          <br />
        </p>
        <div class="customer">
          <br />
          <br />
          <p style="margin-left:350pt;line-height:200%">
            <span style="font-size:9.0pt;font-family:宋体;">
              打印时间：
            </span>
            <span style="font-size:9.0pt">
              {{ $moment(dt_now).format("YYYY-MM-DD HH:mm:ss") }}
            </span>
          </p>
          <br />

          <p align="center" style="text-align:center">
            <span style="font-size:14.0pt;font-family:黑体">{{
              details.project_name
            }}</span>
          </p>
          <br />
          <p align="center" style="text-align:center">
            <b style="mso-bidi-font-weight: normal"
              ><span style="font-size:18.0pt;font-family:黑体"
                >抽签顺序号凭证</span
              ></b
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（副联）
          </p>
          <!-- <p style="text-align:center">
            <span style="font-size:15.0pt;font-family:SimSun">副 联</span>
          </p> -->

          <br />
          <br />
          <v-row style="margin-left:80pt;">
            <v-col>
              <h1 class="lottery_sequence">
                第 {{ details.lottery_sequence }} 号
              </h1>
              <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
                >姓名:</span
              >
              <b
                ><u
                  ><span
                    style="font-size:13.0pt;line-height:200%;font-family:黑体"
                    >{{ details.name }}</span
                  ></u
                >
              </b>

              <span style="font-size:13.0pt; line-height:200%;font-family:黑体">
                入场号:</span
              >
              <b
                ><u
                  ><span
                    style="font-size:13.0pt;line-height:200%;font-family:黑体"
                    >{{ details.admission_sequence }}</span
                  ></u
                >
              </b>
            </v-col>
            <v-col>
              <barcode
                :value="details.customer_code"
                format="EAN8"
                flat="true"
                width="2"
                height="75"
                :displayValue="displayValue"
                fontSize="12"
              >
                条形码生成失败
              </barcode>
            </v-col>
          </v-row>
          <br />
          <p style="margin-left:90pt;line-height:200%">
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >抽签日期:</span
            >
            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span style="mso-spacerun:yes">&nbsp;</span>
                <span style="mso-spacerun:yes">&nbsp;</span></span
              ></u
            >
            <b style="mso-bidi-font-weight: normal"
              ><u
                ><span
                  style="font-size:13.0pt;line-height:200%;font-family:黑体"
                >
                  {{ $moment(dt_now).format("YYYY年MM月DD日") }}</span
                ></u
              ></b
            >
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >，抽签地点:</span
            >
            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span style="mso-spacerun:yes">&nbsp;</span>
                <span style="mso-spacerun:yes">&nbsp;</span></span
              ></u
            >
            <b style="mso-bidi-font-weight: normal"
              ><u
                ><span
                  style="font-size:13.0pt;line-height:200%;font-family:黑体"
                  >{{ details.project_location }}</span
                ></u
              ></b
            >
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >。</span
            >
            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span><span style="mso-spacerun:yes"></span></span></span
            ></u>
          </p>
          <p style="margin-left:90pt;line-height:200%">
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >抽签方案:</span
            >
            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span style="mso-spacerun:yes">&nbsp;</span>
                <span style="mso-spacerun:yes">&nbsp;</span></span
              ></u
            >
            <span v-for="p in details.plans" :key="p.id">
              <span style="font-size:13.0pt; line-height:200%;font-family:黑体">
                {{ p.areaitem_name }}</span
              >
              <b style="mso-bidi-font-weight: normal"
                ><u
                  ><span
                    style="font-size:13.0pt;line-height:200%;font-family:黑体"
                  >
                    {{ p.quantity }}
                  </span></u
                ></b
              >

              <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
                >套
              </span>
            </span>
          </p>
          <p style="margin-left:90pt;line-height:200%">
            <br />
            <span style="font-size:13.0pt;font-family:楷体"
              >抽签人（委托人）确认签字：</span
            >
            <input
              type="text"
              name="name"
              style="border:none;border-bottom:1px solid #000;"
            />
          </p>
          <p>
            <br />
          </p>
          <p style="margin-left:400pt;line-height:200%">
            <span style="font-family:楷体">{{
              $moment(dt_now).format("YYYY年MM月DD日")
            }}</span>
            <br />
            <br />
          </p>

          <p>
            <span style="margin-left:15pt;"
              >X———————————————————————————————————————————X</span
            >
            <br />
          </p>

          <p style="margin-left:350pt;line-height:200%">
            <span style="font-size:9.0pt;font-family:宋体;">
              打印时间：
            </span>
            <span style="font-size:9.0pt">
              {{ $moment(dt_now).format("YYYY-MM-DD HH:mm:ss") }}
            </span>
          </p>
          <br />
          <br />
          <p align="center" style="text-align:center">
            <span style="font-size:14.0pt;font-family:黑体">{{
              details.project_name
            }}</span>
          </p>
          <br />
          <p align="center" style="text-align:center">
            <b style="mso-bidi-font-weight: normal"
              ><span style="font-size:18.0pt;font-family:黑体"
                >抽签顺序号凭证</span
              ></b
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（正联）
          </p>

          <br />
          <br />
          <v-row style="margin-left:80pt;">
            <v-col>
              <h1 class="lottery_sequence">
                第 {{ details.lottery_sequence }} 号
              </h1>
              <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
                >姓名:</span
              >
              <b
                ><u
                  ><span
                    style="font-size:13.0pt;line-height:200%;font-family:黑体"
                    >{{ details.name }}</span
                  ></u
                ></b
              >
              <span style="font-size:13.0pt; line-height:200%;font-family:黑体">
                入场号:</span
              >
              <b
                ><u
                  ><span
                    style="font-size:13.0pt;line-height:200%;font-family:黑体"
                    >{{ details.admission_sequence }}</span
                  ></u
                >
              </b>
            </v-col>
            <v-col>
              <barcode
                :value="details.customer_code"
                format="EAN8"
                flat="false"
                width="2"
                height="75"
                :displayValue="displayValue"
                fontSize="12"
              >
                条形码生成失败
              </barcode>
            </v-col>
          </v-row>
          <br />
          <p style="margin-left:90pt;line-height:200%">
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >抽签日期:</span
            >
            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span style="mso-spacerun:yes">&nbsp;</span>
                <span style="mso-spacerun:yes">&nbsp;</span></span
              ></u
            >
            <b style="mso-bidi-font-weight: normal"
              ><u
                ><span
                  style="font-size:13.0pt;line-height:200%;font-family:黑体"
                >
                  {{ $moment(dt_now).format("YYYY年MM月DD日") }}</span
                ></u
              ></b
            >
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >，抽签地点:</span
            >
            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span style="mso-spacerun:yes">&nbsp;</span>
                <span style="mso-spacerun:yes">&nbsp;</span></span
              ></u
            >
            <b style="mso-bidi-font-weight: normal"
              ><u
                ><span
                  style="font-size:13.0pt;line-height:200%;font-family:黑体"
                  >{{ details.project_location }}</span
                ></u
              ></b
            >
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >。</span
            >

            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span><span style="mso-spacerun:yes"></span></span></span
            ></u>
          </p>

          <p style="margin-left:90pt;line-height:200%">
            <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
              >抽签方案:</span
            >
            <u
              ><span style="font-size:13.0pt;line-height:200%"
                ><span style="mso-spacerun:yes">&nbsp;</span>
                <span style="mso-spacerun:yes">&nbsp;</span></span
              ></u
            >
            <span v-for="p in details.plans" :key="p.id">
              <span style="font-size:13.0pt; line-height:200%;font-family:黑体">
                {{ p.areaitem_name }}</span
              >
              <b style="mso-bidi-font-weight: normal"
                ><u
                  ><span
                    style="font-size:13.0pt;line-height:200%;font-family:黑体"
                  >
                    {{ p.quantity }}
                  </span></u
                ></b
              >

              <span style="font-size:13.0pt; line-height:200%;font-family:黑体"
                >套
              </span>
            </span>
          </p>
          <br />
          <p style="margin-left:400pt;line-height:200%">
            <span style="font-family:楷体">{{
              $moment(dt_now).format("YYYY年MM月DD日")
            }}</span>
          </p>
          <p>
            <br />
            <br />
          </p>
        </div>
      </div>
    </div>
  </v-container>
</template>
customers
<script>
import { fetchCustomer } from "@/api/customers";
// import VueQr from "vue-qr";
import VueBarcode from "vue-barcode";

export default {
  name: "Book print",
  components: {
    barcode: VueBarcode
  },

  filters: {},
  data() {
    return {
      details: null,
      displayValue: false,
      lineColor: "#0aa",
      dt_now: "",
      printObj: {
        id: "printMe",
        popTitle: "good print",
        extraCss: "https://www.baidu.com",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      cssBackgroundImg: {
        backgroundImage: `url(${require("@/assets/background.jpg")})`
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
    this.getCustomer(this.$route.params.id);
    this.dt_now = Date.now();
  },

  methods: {
    goBack() {
      console.log("goback clicked");
      this.$router.go(-1);
    },
    getCustomer(id) {
      this.listLoading = true;
      fetchCustomer(id).then(response => {
        this.details = response.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.lottery_sequence {
  font-size: 45px;
  margin-right: 40px;
}

/* .center {
  margin: auto;
  width: 75%;
  padding: 10px;
} */
.customer {
  margin: auto auto;
  border: 3px solid rgb(41, 43, 41);
  /* width: 794px; */
  width: 700px;
  /* width: 700px; */
  /* height: 1122px; */
}

.A4 {
  background: white;
  /* width: 21cm;
  height: 29.7cm; */
  width: 794px;
  height: 1122px;
  display: block;
  margin: auto auto;
  color: black;
  padding: 0 0;
  margin-bottom: 0cm;
  /* box-shadow: 0 0 1cm 1cm rgba(0, 0, 0, 0.5); */
  overflow-y: auto;
  box-sizing: border-box;
}

.backgroundimg {
  /* background-image: url("http://xuanfang.tuozhanad.com/img/addition/background.jpg"); */
  background-size: cover;
  background-position: center center;
}

.input {
  font-weight: 800;
  font-size: 13pt;
}

@page {
  size: A4;
  margin: 1px 1px;
}

@media print {
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

  .backgroundimg {
    /* background-image: url("http://xuanfang.tuozhanad.com/img/addition/background.jpg"); */
    background-size: contain;
    background-position: center center;
    width: 794px;
    height: 1122px;
    padding: 0 0;
    margin: 0 0;
  }

  .customer {
    margin: 0 auto;
    padding: 0 0;
    /* width: 794px; */
    /* width: 700px; */
    /* width: 700px; */
    /* height: 1122px; */
  }

  .noprint {
    display: none;
  }

  .enable-print {
    display: block;
  }
}
</style>
