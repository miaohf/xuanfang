<template>
  <v-dialog v-model="dialog" max-width="1200">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="green" dark v-bind="attrs" v-on="on" class="mx-1">
        新增 <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-container class="px-3 my-container">
      <!-- <v-card-title class="headline">编辑</v-card-title> -->

      <div class="px-7 pb-5" height="800px">
        <v-card-title class="my-10"><h1>新增户主</h1></v-card-title>

        <!-- ['10001','潘金云','330421196904152048','40','缪家村','西窑洞浜１３号'], -->
        <!-- <v-divider class="mx-4 my-10"></v-divider> -->
        <v-row>
          <v-text-field
            v-model="temp.name"
            color="yellow darken-3"
            label="姓名"
            required
            class="mx-6"
            style="width:120px"
          ></v-text-field>

          <v-text-field
            v-model="temp.customer_code"
            color="yellow darken-3"
            label="户主编号"
            hint="户主编号必须为唯一"
            required
            class="mx-6"
            style="width:80px"
          ></v-text-field>
          <v-text-field
            v-model="temp.cardid"
            color="yellow darken-3"
            label="身份证号"
            hint="请输入18位身份证字符串"
            required
            class="mx-6"
            style="width:210px"
          ></v-text-field>
          <v-text-field
            v-model="temp.phone"
            color="yellow darken-3"
            label="联系方式"
            hint="手机号码或固定号码，最长11位"
            required
            class="mx-6"
            style="width:120px"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="temp.village"
            color="yellow darken-3"
            label="所在村"
            required
            class="mx-6"
            style="width:80px"
          ></v-text-field>
          <v-text-field
            v-model="temp.address"
            color="yellow darken-3"
            label="详细住址"
            required
            class="mx-6"
            style="width:180px"
          ></v-text-field>
          <v-text-field
            v-model="temp.population"
            color="yellow darken-3"
            label="场次"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>
        </v-row>
        <v-row> </v-row>
        <v-row>
          <v-text-field
            v-model="temp.sub_name"
            color="yellow darken-3"
            label="受托人姓名"
            required
            class="mx-6"
          ></v-text-field>
          <v-text-field
            v-model="temp.sub_cardid"
            color="yellow darken-3"
            label="受托人身份证号"
            required
            class="mx-6"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="temp.population"
            color="yellow darken-3"
            label="总人数"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>
          <v-text-field
            v-model="temp.population_aa"
            color="yellow darken-3"
            label="农业户口人数"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>

          <v-text-field
            v-model="temp.population_na"
            color="yellow darken-3"
            label="非农户口人数"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>

          <v-text-field
            v-model="temp.population_ao"
            color="yellow darken-3"
            label="农业独子"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>

          <v-text-field
            v-model="temp.population_no"
            color="yellow darken-3"
            label="非农独子"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="temp.myarea"
            color="yellow darken-3"
            label="可选面积"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>

          <v-text-field
            v-model="temp.zhandi_area"
            color="yellow darken-3"
            label="核定原合法户型占地面积"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>

          <v-text-field
            v-model="temp.jianzhu_area"
            color="yellow darken-3"
            label="核定原合法户型建筑面积"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>

          <v-text-field
            v-model="temp.population_area"
            color="yellow darken-3"
            label="安置标准内面积"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>

          <v-text-field
            v-model="temp.property_area"
            color="yellow darken-3"
            label="产权置换面积"
            required
            class="mx-6"
            style="width:60px"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <span class="mt-6 mx-3 orange--text" style="font-size:14px">
            本系统由 九色鹿网络 提供技术支持。
          </span>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="cancelAddDialog">取消</v-btn>
          <v-btn color="primary" @click="confirmAddDialog">确认</v-btn>
        </v-card-actions>
      </div>
    </v-container>
  </v-dialog>
</template>

<script>
import { createCustomer } from "@/api/customers";
// import { ModelListSelect } from "vue-search-select";
export default {
  name: "AddHouseDialog",
  components: {},

  data: () => ({
    gardenslist: [],
    boxeslist: [],
    objectItem: {},
    stringItem: "",
    dialog: false,
    temp: {
      name: "",
      customer_code: "",
      phone: "",
      cardid: "",
      myarea: "",
      village: "",
      address: ""
    }
  }),
  mounted() {},
  methods: {
    confirmAddDialog() {
      const tempData = this.temp;
      console.log(tempData);
      createCustomer(tempData).then(() => {
        this.dialog = false;
        this.temp = {};
        this.$parent.$parent.$parent.getList();
      });
    },

    cancelAddDialog() {
      this.dialog = false;
      this.temp = {};
    }
  }
};
</script>

<style scoped lang="scss">
.my-container {
  background-color: rgba(90, 90, 90, 0.9);
}
</style>
