<template>
  <v-container fluid tag="section">
    <v-card class="my-0">
      <v-btn class="mt-6 mb-0" tile text large @click="goBack">
        <v-icon left v-text="icons['left']" /> 返回
      </v-btn>
      <v-card class="mx-auto" max-width="1500">
        <v-img
          src="http://xuanfang.tuozhanad.com/img/addition/mychoice.jpg"
          :aspect-ratio="16 / 3"
        >
        </v-img>
        <v-card-text>
          <v-chip class="mr-2" color="blue" text-color="white">
            <h2>{{ details.garden_name }} {{ details.area1 }}m² 户型</h2>
          </v-chip>

          <v-chip class="mr-2" color="grey" text-color="white">
            <h3>{{ details.deliver_type }}</h3>
          </v-chip>
          <v-chip class="mr-2" color="grey" text-color="white">
            <h3>面积：{{ details.area1 }} 平米</h3>
          </v-chip>
          <v-chip class="mr-2" color="grey" text-color="white">
            <h3>共计 {{ details.houses_count }} 套, 选择人数
            {{ details.customers_count }}，共选取
            {{ details.choices_count }} 套
            </h3></v-chip
          >
        </v-card-text>
      </v-card>
      <v-card-text>
        <v-simple-table fixed-header class="mx-3">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="grey--text" style="font-size:12px">
                  id
                </th>
                <th class="text-left">
                  户主号码
                </th>
                <th class="text-left">
                  户主姓名
                </th>
                <th class="text-left">
                  提交时间
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in choices" :key="row.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <v-chip color="info" text-color="white">
                    <h3>{{ row.customer_code }}</h3>
                  </v-chip>
                </td>
                <td>
                  <v-chip color="green" text-color="white">
                    <h3>{{ row.customer_short }}</h3>
                  </v-chip>
                </td>
                <td
                  class="display-1 mb-0 pb-2 pt-0 font-weight-light grey--text"
                  style="font-size:12px"
                >
                  {{
                    $moment(row.create_at)
                      .utc()
                      .format("YYYY年MM月DD日 HH:mm:ss")
                  }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { fetchHouseitem } from "@/api/houseitems";

export default {
  name: "Houseitem Details",

  components: {},

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
    // typeFilter(type) {
    //   return houseTypeKeyValue[type]
    // }
  },
  data() {
    return {
      icons: {
        left: "mdi-chevron-left",
        right: "mdi-chevron-right"
      },
      details: null,
      rules: {}
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
    this.getHouseitem(this.$route.params.id);
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getHouseitem(id) {
      this.listLoading = true;
      fetchHouseitem(id).then(response => {
        this.details = response.data;
        // list.sort((a, b) => (a.color > b.color) ? 1 : (a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 )
        this.choices = response.data.choices.sort((a, b) =>
          a.customer_id > b.customer_id ? 1 : -1
        );
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
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

    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>
<style scoped>
.red-color {
  background-color: rgb(209, 201, 200) !important;
  color: white !important;
}

.green-color {
  background-color: rgb(69, 123, 194) !important;
  color: white !important;
}
</style>
