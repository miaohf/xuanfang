<template>
  <v-container fluid tag="section">
    <v-divider class="mt-3" />

    <v-simple-table class="statistics">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left grey--text">序号</th>
            <th class="text-right grey--text">小区 | 地块</th>
            <th class="text-right grey--text">面积1</th>
            <th class="text-left grey--text">门牌号码</th>
            <th class="text-left grey--text">户型</th>
            <th class="text-left grey--text">状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in items" :key="row.id">
            <td style="font-size:11px">
              {{ index + 1}}.{{ row.id }}
            </td>
            <td class="text-right" style="font-size:15px">
              {{ row.garden }}
            </td>
            <td class="text-right" style="font-size:15px">
              {{ row.area1 }}
            </td>
            <td style="font-size:15px">
              {{ row.house }}
            </td>
            <td style="font-size:15px">
              {{ row.house_type }}
            </td>
            <td
              :style="{
                color: row.status == 1 ? greenColor : redColor,
                'font-size': '14px'
              }"
            >
              {{ getNamefromOptions(statusOptions, row.status) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import { fetchHouses } from "@/api/houses";

const statusOptions = [
  { key: 1, display_name: "空闲" },
  { key: 2, display_name: "已选" },
  { key: 3, display_name: "剔除" }
];

const houseTypeOptions = [
  { key: 1, display_name: "小户型" },
  { key: 2, display_name: "中户型" },
  { key: 3, display_name: "大户型" }
];

export default {
  name: "Houses",

  components: {},

  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,

    action: {
      color: "info",
      icon: "mdi-message-text"
    },
    items: [],
    listQuery: {
      page: 1,
      limit: 1000,
      garden_id: 1,
      sort: "+id"
    },
    circle: true,
    disabled: false,
    length: 10,
    greenColor: "#1fd647",
    redColor: "#ff4d4d",
    total_pages: 0,
    statusOptions,
    houseTypeOptions
  }),

  computed: {},
  // beforeCreate() {
  //   this.listQuery.garden_id = this.$route.params.garden_id
  //   console.log('this.listQuery.garden_id:', this.listQuery.garden_id)
  // },

  created() {
    this.getList();
    // console.log('this.$route.params.garden_id:', this.$route.params.garden_id)
  },
  watch: {},
  methods: {
    getList() {
      this.listLoading = true;
      var queryParam = {
        page: 1,
        limit: 360,
        sort: "+id",
        garden_id: this.$route.params.garden_id
      };
      fetchHouses(queryParam).then(response => {
        this.items = response.data.items;
        this.total_pages = response.data._meta.total_pages;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 3 * 1000);
      });
    },

    getNamefromOptions(options, key) {
      // return options[key]
      let showname = "";
      options.forEach(item => {
        if (item.key === key) {
          // console.log(key, item.key, item.display_name)
          showname = item.display_name;
        }
      });
      return showname;
    },

    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style lang="scss" scoped>

.houselist {
  background-color: #252525;

}


.title {
  padding: 15px 0;
  margin: 0 0;
  display: flex;
  text-align: center;
}

.statistics {
  font-size: 60px;
  font-weight: 600;
  // color: #e40808;
  background-color: #383838;
  margin: 0 0;
  padding: 0 0;
  // border-style: double;
  // border: white;
  // border-color: white;
}
td,
th {
  font-size: 60px;
  color: #e0e0d1;
}
</style>
