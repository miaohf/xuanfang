<template>
  <v-dialog v-model="dialog" max-width="1024">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="green" dark v-bind="attrs" v-on="on" class="mx-2">
        新增<v-icon right>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-col>
        <v-card class="pa-6" height="400px">
          <h1>新增房源</h1>
          <v-divider class="mx-4 my-1"></v-divider>
          <v-row>
            <v-col cols="12" sm="7" md="7">
              <v-row>
                <v-col>
                  <model-list-select
                    :list="gardenslist"
                    placeholder="选择小区"
                    v-model="temp.garden_id"
                    option-value="id"
                    option-text="name"
                  >
                  </model-list-select>
                </v-col>
                <v-col>
                  <model-list-select
                    :list="boxeslist"
                    placeholder="选择号箱"
                    v-model="temp.box_id"
                    option-value="id"
                    option-text="name"
                  >
                  </model-list-select>
                </v-col>
              </v-row>
              <v-text-field
                v-model="temp.number"
                color="purple darken-2"
                label="门牌号码"
                required
              ></v-text-field>
              <v-text-field
                v-model="temp.area"
                color="purple darken-2"
                label="预测面积"
                required
              ></v-text-field>
              <v-text-field
                v-model="temp.sub_area"
                color="purple darken-2"
                label="储藏室面积"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="12">
              <p
                class="mb-0 pb-2 pt-0 font-weight-light orange--text"
                style="font-size:12px"
              >
                本系统由 九色鹿网络 提供技术支持。
              </p>
            </v-col>
          </v-row>
          <div class="my-3" />
        </v-card>
      </v-col>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="cancelAddDialog">取消</v-btn>
        <v-btn color="primary" @click="confirmAddDialog">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { createHouse } from "@/api/houses";
import { fetchGardensList } from "@/api/gardens";
import { fetchBoxesList } from "@/api/boxes";
import { ModelListSelect } from "vue-search-select";
export default {
  name: "AddHouseDialog",
  components: {
    ModelListSelect
  },

  data: () => ({
    gardenslist: [],
    boxeslist: [],
    objectItem: {},
    stringItem: "",
    dialog: false,
    temp: {
      garden_id: "",
      box_id: "",
      address: "",
      area: "",
      sub_area: ""
    }
  }),
  mounted() {
    this.getGardens();
    this.getBoxes();
  },
  methods: {
    getGardens() {
      fetchGardensList().then(response => {
        this.gardenslist = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      console.log("gardenslist:", this.gardenslist);
    },

    getBoxes() {
      fetchBoxesList().then(response => {
        this.boxeslist = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      console.log("boxeslist:", this.boxeslist);
    },

    confirmAddDialog() {
      const tempData = this.temp;
      console.log(tempData);
      createHouse(tempData).then(() => {
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
