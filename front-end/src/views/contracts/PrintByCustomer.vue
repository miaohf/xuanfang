<template>
  <v-container fluid tag="section" data-app="true">
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
    <div id="printMe">
      <div v-for="row in items" :key="row.id">
        <div class="A4">
          <div :style="cssBackgroundImg" class="backgroundimg">
            <div class="contract">
              <br />
              <br />
              <p style="margin-left:380pt;line-height:200%">
                <span style="font-size:9.0pt;font-family:宋体;">
                  打印时间：
                </span>
                <span style="font-size:9.0pt">
                  {{ $moment(dt_now).format("YYYY-MM-DD HH:mm:ss") }}
                </span>
              </p>
              <br />
              <br />
              <br />
              <p align="center" style="text-align:center">
                <span style="font-size:14.0pt;font-family:黑体">{{
                  row.project_name
                }}</span>
              </p>
              <br />
              <p align="center" style="text-align:center">
                <b style="mso-bidi-font-weight: normal"
                  ><span style="font-size:18.0pt;font-family:黑体"
                    >抽签房屋确认书</span
                  ></b
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（副联）
              </p>
              <br />
              <p style="text-align:center">
                <span style="font-size:15.0pt;font-family:SimSun"></span>
              </p>

              <p style="margin-left:425pt;line-height:300%">
                <span>
                  流水号:
                  {{
                    $moment(row.create_at)
                      .utc()
                      .format("YYYY")
                  }}-{{ row.sequence }}</span
                >
              </p>
              <p style="text-indent:27.0pt;line-height:200%">
                <span
                  style="font-size:13.0pt;line-height:200%;font-family:宋体;mso-ascii-font-family: Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font: minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
                >
                  被安置户
                </span>
                <span class="text-decoration-underline input">
                  <b>{{ row.customer }}</b>
                </span>

                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;</span
                ><span
                  style="font-size:13.0pt;line-height:200%;font-family:宋体;mso-ascii-font-family: Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font: minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
                >
                  ，按照《{{
                    row.rule_name
                  }}》之规定，经被安置户自行或其被委托人抽签确认，抽取的公寓房房号为：</span
                >
                <span v-for="(item, i) in row.houses" :key="i">
                  <span class="text-decoration-underline input">
                    {{ item.garden }}{{ item.building }}幢{{ item.unit }}单元{{
                      item.number
                    }}
                  </span>
                  <span
                    style="font-size:13.0pt;line-height:200%;font-family:宋体;"
                    >，面积为：</span
                  >
                  <span class="text-decoration-underline input">
                    {{ item.area }}
                  </span>
                  <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;</span>
                  <span
                    style="font-size:13.0pt;line-height:200%;font-family:宋体;"
                    >平方米。
                  </span>
                </span>
              </p>

              <br />
              <br />
              <p>
                <span style="font-size:13.0pt;font-family:楷体"
                  >抽签人（被委托人）确认签字：</span
                >
                <input
                  type="text"
                  name="name"
                  style="border:none;border-bottom:1px solid #000;"
                />
              </p>
              <br />
              <br />
              <p style="margin-left:430pt;line-height:200%">
                <span style="font-family:楷体">{{
                  $moment(dt_now).format("YYYY年MM月DD日")
                }}</span>
              </p>
              <br />
              <p>
                <span>X————————————————————————————————————————————X</span>
              </p>
              <br />
              <br />
              <br />
              <p align="center" style="text-align:center">
                <span style="font-size:14.0pt;font-family:黑体">{{
                  row.project_name
                }}</span>
              </p>
              <br />
              <p align="center" style="text-align:center">
                <b style="mso-bidi-font-weight: normal"
                  ><span style="font-size:18.0pt;font-family:黑体"
                    >抽签房屋确认书</span
                  ></b
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（正联）
              </p>
              <br />
              <p style="text-align:center">
                <span style="font-size:15.0pt;font-family:SimSun"></span>
              </p>

              <p style="margin-left:425pt;line-height:300%">
                <span>
                  流水号:
                  {{
                    $moment(row.create_at)
                      .utc()
                      .format("YYYY")
                  }}-{{ row.sequence }}</span
                >
              </p>
              <p style="text-indent:27.0pt;line-height:200%">
                <span
                  style="font-size:13.0pt;line-height:200%;font-family:宋体;mso-ascii-font-family: Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font: minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
                >
                  被安置户
                </span>
                <span class="text-decoration-underline input">
                  <b>{{ row.customer }}</b>
                </span>

                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;</span
                ><span
                  style="font-size:13.0pt;line-height:200%;font-family:宋体;mso-ascii-font-family: Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font: minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
                >
                  ，按照《{{
                    row.rule_name
                  }}》之规定，经被安置户自行或其被委托人抽签确认，抽取的公寓房房号为：</span
                >
                <span v-for="(item, i) in row.houses" :key="i">
                  <span class="text-decoration-underline input">
                    {{ item.garden }}{{ item.building }}幢{{ item.unit }}单元{{
                      item.number
                    }}
                  </span>
                  <span
                    style="font-size:13.0pt;line-height:200%;font-family:宋体;"
                    >，面积为：</span
                  >
                  <span class="text-decoration-underline input">
                    {{ item.area }}
                  </span>
                  <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;</span>
                  <span
                    style="font-size:13.0pt;line-height:200%;font-family:宋体;"
                    >平方米。
                  </span>
                </span>
              </p>

              <br />
              <br />
              <p>
                <span style="font-size:13.0pt;font-family:楷体"
                  >抽签人（被委托人）确认签字：</span
                >
                <input
                  type="text"
                  name="name"
                  style="border:none;border-bottom:1px solid #000;"
                />
              </p>
              <br />
              <br />
              <p style="margin-left:430pt;line-height:200%">
                <span style="font-family:楷体">{{
                  $moment(dt_now).format("YYYY年MM月DD日")
                }}</span>
              </p>
              <p>
                <span>&nbsp;</span>
              </p>
              <br />
              <br />

              <p>
                <span
                  style="font-size:9.0pt;font-family:宋体;mso-ascii-font-family: Calibri;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font: minor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
                  ><b>注意事项：</b></span
                >
              </p>
              <p>
                <span style="font-size:9.0pt">1</span>
                <span
                  style="font-size:9.0pt;font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font: minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast; mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
                  >、本凭证是办理交房手续的重要依据，请妥善保管，切勿遗失。</span
                >
              </p>
              <!-- <p>
            <span style="font-size:9.0pt">2</span>
            <span
              style="font-size:9.0pt;font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font: minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast; mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
              >、安置房小区建造完成竣工验收后（具体时间地点另行通知）起一个月内凭本凭证与集聚办、征迁办（委托方）签订《{{
                row.project_name
              }}协议书》及付款（包括自行车库款（1000元/平米））、交房等相关手续。</span
            >
          </p> -->
              <p>
                <span style="font-size:9.0pt">2</span>
                <span
                  style="font-size:9.0pt;font-family:宋体;mso-ascii-font-family:Calibri;mso-ascii-theme-font: minor-latin;mso-fareast-font-family:宋体;mso-fareast-theme-font:minor-fareast; mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin"
                  >、本次安置房房源与交房实际户型、面积有误差时以不动产权证书为准。</span
                >
              </p>
              <p>
                <span>———————————————————————————————————————————————</span>
              </p>
              <v-row justify="center">
                <v-col cols="8">
                  <span style="font-size:9.0pt;font-family:宋体"
                    >打印时间：{{
                      $moment(dt_now).format("YYYY-MM-DD HH:mm:ss")
                    }}</span
                  >
                </v-col>
                <v-col cols="4" style="text-align:right">
                  <span style="font-size:9.0pt;font-family:宋体;">{{
                    row.organizer
                  }}</span>
                </v-col>
              </v-row>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { fetchContracts } from "@/api/contracts";

export default {
  name: "ContractPrint",
  components: {},

  filters: {},
  data() {
    return {
      row: null,
      listQuery: {
        page: 1,
        limit: 100,
        customer_id: undefined,
        sort: "+id"
      },
      items: "",
      dt_now: "",
      printObj: {
        id: "printMe",
        popTitle: "good print"
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
    this.getContracts(this.$route.params.id);
    this.dt_now = Date.now();
  },

  methods: {
    goBack() {
      console.log("goback clicked");
      this.$router.go(-1);
    },
    getContracts(customer_id) {
      this.listLoading = true;
      this.listQuery.customer_id = customer_id;
      fetchContracts(this.listQuery).then(response => {
        this.items = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    }
  }
};
</script>

<style scope="this api replaced by slot-scope in 2.5.0+">
.contract {
  margin: auto auto;
  /* width: 794px; */
  width: 700px;
  /* width: 700px; */
  /* height: 1122px; */
}

.A4 {
  background: white;
  /* width: 21cm;
  height: 29.7cm; */
  color: black;
  width: 794px;
  height: 1122px;
  display: block;
  margin: auto auto;
  padding: 0 0;
  margin-bottom: 0cm;
  /* box-shadow: 0 0 1cm 1cm rgba(0, 0, 0, 0.5); */
  overflow-y: auto;
  box-sizing: border-box;
}

.backgroundimg {
  background-image: url("http://xuanfang.tuozhanad.com/img/addition/background.jpg");
  background-size: cover;
  /* background-repeat: no-repeat; */
  background-position: center center; /* optionally, center the image */
  /* height: 1051px; */
  /* padding: auto auto;
  margin: auto auto; */
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
    background-image: url("http://xuanfang.tuozhanad.com/img/addition/background.jpg");
    background-size: contain;
    /* background-repeat: no-repeat; */
    background-position: center center; /* optionally, center the image */
    width: 794px;
    height: 1122px;
    padding: 0 0;
    margin: 0 0;
  }

  .contract {
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
