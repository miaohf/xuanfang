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
      <h1 class="head-1">
        嘉善县九色鹿价格结算表
      </h1>
      <v-row>
        <v-col>
          <span style="padding-left:25px"
            >结算单位（盖章）：嘉善宏达拆迁有限责任公司</span
          >
        </v-col>
        <v-col>
          <span style="padding-left:415px">
            编号：{{
              $moment(details.create_at)
                .utc()
                .format("YYYY")
            }}-{{ details.sequence }}
          </span>
        </v-col>
      </v-row>
      <table border="1" bordercolor="#000000">
        <tr>
          <td rowspan="3" class="head-4">安置户</td>
          <td class="head-4">姓 名</td>
          <td colspan="3" class="input-text">{{ details.customer }}</td>
          <td class="head-4">在册农业人口</td>
          <td class="input-text">2</td>
          <td rowspan="3" class="head-4">可安置面积</td>
          <td class="head-4">标准安置面积</td>
          <td class="input-text">
            {{ details.customer_population_area.toFixed(2) }}
          </td>
          <td colspan="3" class="head-4">可置换面积</td>
          <td colspan="2" class="input-text">
            {{ details.myarea_remain.toFixed(2) }}
          </td>
        </tr>
        <tr>
          <td class="head-4">联系电话</td>
          <td colspan="3" class="input-text">{{ details.phone }}</td>
          <td class="head-4">当前房源面积</td>
          <td class="input-text">{{ details.area.toFixed(2) }}</td>
          <td class="head-4">产权置换面积</td>
          <td class="input-text">
            {{ details.customer_property_area.toFixed(2) }}
          </td>
          <td colspan="3" class="head-4">实际置换面积</td>
          <td colspan="2" class="input-text">{{ details.area.toFixed(2) }}</td>
        </tr>
        <tr>
          <td class="head-4">旧房地址</td>
          <td colspan="3" class="input-text">{{ details.address }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td colspan="3" class="head-4">剩余可置换面积</td>
          <!-- <td colspan="2">{{Math.round(details.available_area - details.area)}}</td> -->
          <td colspan="2" class="input-text">
            {{ parseFloat(details.myarea_remain - details.area).toFixed(2) }}
          </td>
        </tr>
        <tr>
          <td colspan="1" class="head-4">安置房源地址</td>
          <td colspan="4" class="input-text">
            {{ details.garden }}{{ details.house }}
          </td>
          <td class="head-4">车位编号</td>
          <td class="input-text"></td>
          <td class="head-4">楼层</td>
          <td class="input-text">{{ details.floor }}</td>
          <td class="head-4">总楼层</td>
          <td colspan="2" class="input-text">{{ details.floors }}</td>
          <td colspan="2" class="head-4">层次级差</td>
          <td class="input-text">{{ details.feefloat }}</td>
        </tr>
        <tr>
          <td colspan="7" class="head-2">安置房价格结算明细</td>
          <td colspan="8" class="head-2">各项收（代）费明细</td>
        </tr>
        <tr>
          <td colspan="4" class="head-4">安置标准分类</td>
          <td class="head-4">面积(㎡)</td>
          <td class="head-4">单价(元/㎡)</td>
          <td class="head-4">金额(元)</td>
          <td colspan="3" class="head-4">项目</td>
          <td class="head-4">数量</td>
          <td colspan="2" class="head-4">金额(元)</td>
          <td colspan="2" class="head-4">说明</td>
        </tr>
        <tr>
          <td colspan="4">标准价({{ details.population_price }}元/㎡)</td>
          <td class="input-text">{{ details.population_area.toFixed(2) }}</td>
          <td>{{ details.population_price_discount.toFixed(2) }}</td>
          <td class="input-text">{{ details.population_fee.toFixed(2) }}</td>
          <td colspan="3">污水处理入网费(200元/套)</td>
          <td></td>
          <td colspan="2" class="input-text">0.00</td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="4">产权置换价(960元/㎡)</td>
          <td class="input-text">{{ details.property_area.toFixed(2) }}</td>
          <td>{{ details.property_price_discount.toFixed(2) }}</td>
          <td class="input-text">{{ details.property_fee.toFixed(2) }}</td>
          <td colspan="3">房屋装修保证金(1000元/套)</td>
          <td></td>
          <td colspan="2" class="input-text">0.00</td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="4">套内不可分割20㎡部分(3510元/㎡)</td>
          <td class="input-text">{{ details.extend_area.toFixed(2) }}</td>
          <td>{{ details.extend_price_discount.toFixed(2) }}</td>
          <td class="input-text">{{ details.extend_fee.toFixed(2) }}</td>
          <td colspan="3">物业管理费(0.5元/㎡.月)</td>
          <td></td>
          <td colspan="2" class="input-text">0.00</td>
          <td colspan="2">初定三年</td>
        </tr>
        <tr>
          <td colspan="4">市场优惠价(20平米)(6110元/㎡)</td>
          <td class="input-text">
            {{ details.market_discount_area.toFixed(2) }}
          </td>
          <td>{{ details.market_discount_price_discount.toFixed(2) }}</td>
          <td class="input-text">
            {{ details.market_discount_fee.toFixed(2) }}
          </td>
          <td colspan="3">垃圾清运费(套)</td>
          <td>*</td>
          <td colspan="2" class="input-text">0.00</td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="4">暂定市场价格(6110元/㎡)</td>
          <td class="input-text">{{ details.market_area.toFixed(2) }}</td>
          <td>{{ details.market_price_discount.toFixed(2) }}</td>
          <td class="input-text">{{ details.market_fee.toFixed(2) }}</td>
          <td colspan="3">管道煤气开户费</td>
          <td></td>
          <td colspan="2" class="input-text">0.00</td>
          <td colspan="2">免</td>
        </tr>

        <tr>
          <td colspan="4">车位、车库(1000元/㎡)</td>
          <td class="input-text">{{ details.sub_area.toFixed(2) }}</td>
          <td>{{ details.sub_price.toFixed(2) }}</td>
          <td class="input-text">{{ details.sub_fee.toFixed(2) }}</td>
          <td colspan="3"></td>
          <td></td>
          <td colspan="2"></td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="6" class="head-4">房款结算小计</td>
          <td class="input-text-red">{{ details.total_fee.toFixed(2) }}</td>
          <td colspan="3" class="head-4">各项(代)收费小计</td>
          <td>*</td>
          <td colspan="2" class="input-text-red">0.00</td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="4" class="head-4">应收款项总计（人民币小写）</td>
          <td class="input-text-red">{{ details.total_fee.toFixed(2) }}</td>
          <td colspan="3" class="head-4">各项应收款（人民币大写）</td>
          <td colspan="7" class="money">{{ details.total_fee_chinese }}</td>
        </tr>
      </table>

      <v-row>
        <v-col>
          <span style="padding-left:25px">结算经办人：</span>
        </v-col>
        <v-col>
          <span>审核人：</span>
        </v-col>
        <v-col>
          <span style="padding-left:190px">
            结算日期：
            {{
              $moment(details.create_at)
                .utc()
                .format("YYYY-MM-DD")
            }}
          </span>
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col>
          <span style="padding-left:30px">注：以上内容面积单位为平方米(㎡)</span>
        </v-col>
      </v-row> -->
    </div>
  </v-container>
</template>

<script>
import { fetchBill } from "@/api/bills";

export default {
  name: "Bill Print",
  components: {},

  filters: {},
  data() {
    return {
      details: null,
      // population_price: 580,
      // property_price: 960,
      // extend20_price: 3510,
      // market_discount_price: 6110,
      // market_price: 6110,
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
    this.getBill(this.$route.params.id);
    this.dt_now = Date.now();
  },

  methods: {
    goBack() {
      console.log("goback clicked");
      this.$router.go(-1);
    },
    getBill(id) {
      this.listLoading = true;
      fetchBill(id).then(response => {
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

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.A4 {
  background: white;
  /* width: 21cm;
  height: 29.7cm; */
  width: 1122px;
  height: 794px;
  display: block;
  margin: auto;
  padding: auto;
  margin-bottom: 0cm;
  box-shadow: 0 0 0.1cm 0.1cm rgb(181, 216, 248);
  overflow-y: auto;
  box-sizing: border-box;
}

.head-1 {
  margin-top: 30pt;
  padding: 10pt;
  font-weight: 800;
  font-size: 21pt;
  text-align: center;
}

.head-2 {
  padding: 2pt;
  font-weight: 600;
  font-size: 12pt;
  text-align: center;
  background-color: rgb(231, 229, 226);
}

.head-3 {
  font-weight: 400;
  font-size: 12pt;
  text-align: center;
}

.head-4 {
  font-weight: 400;
  font-size: 11pt;
  text-align: center;
  background-color: rgb(231, 229, 226);
}

.input-text {
  font-weight: 500;
  font-size: 10pt;
  color: rgb(64, 10, 214);
}

.input-text-red {
  font-weight: 700;
  font-size: 10pt;
  color: rgb(233, 31, 31);
}

.money {
  text-align: left;
  font-weight: 500;
  color:  rgb(64, 10, 214);
}

td {
  padding-top: 9px;
  padding-bottom: 6px;
  padding-left: 8px;
  padding-right: 8px;
}

table {
  margin: auto;
  text-align: right;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  justify-content: space-around;
}

@page {
  /* size: A4; */
  size: landscape;
  margin: 1px 1px;
}

/* @media print{@page {size: landscape}} */

@media print {
  .A4 {
    background: white;
    /* width: 21cm;
  height: 29.7cm; */
    width: 1122px;
    height: 794px;
    display: block;
    margin: auto;
    padding: auto;
    margin-bottom: 0cm;
    box-shadow: 0 0 0.5cm 0.5cm rgba(90, 88, 88, 0.1);
    overflow-y: auto;
    box-sizing: border-box;
  }

  .head-1 {
    margin-top: 30pt;
    padding: 10pt;
    font-weight: 800;
    font-size: 21pt;
    text-align: center;
  }

  .head-2 {
    padding: 2pt;
    font-weight: 600;
    font-size: 12pt;
    text-align: center;
    background-color: rgb(231, 229, 226);
  }

  .head-3 {
    font-weight: 400;
    font-size: 12pt;
    text-align: center;
  }

  .head-4 {
    font-weight: 400;
    font-size: 11pt;
    text-align: center;
    background-color: rgb(231, 229, 226);
  }

  .input-text {
    font-weight: 500;
    font-size: 10pt;
    color: rgb(64, 10, 214);
  }

  .input-text-red {
    font-weight: 700;
    font-size: 10pt;
    color: rgb(233, 31, 31);
  }

  .money {
    text-align: left;
    font-weight: 500;
    color:  rgb(64, 10, 214);
  }

  td {
    padding-top: 9px;
    padding-bottom: 6px;
    padding-left: 8px;
    padding-right: 8px;
  }

  table {
    margin: auto;
    text-align: right;
  }

  .flex-container {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    justify-content: space-around;
  }
}
</style>
