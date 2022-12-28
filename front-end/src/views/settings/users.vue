<template>
  <v-container fluid class="px-8 py-0">
    <template v-slot:after-heading> </template>
    <v-row class="d-flex justify-space-between mx-1 mb-5">
      <v-col cols="6" md="10">
        <v-text-field
          v-model="listQuery.name"
          append-icon="mdi-magnify"
          class="ml-auto"
          label="Search: 登录名，姓名，微信昵称"
          hide-details
          single-line
          style="max-width: 360px;"
        />
      </v-col>
      <!-- <v-col cols="6" md="2">
          <AddBookDialog />
        </v-col> -->
    </v-row>

    <v-divider class="mt-3" />

    <v-simple-table fixed-header class="pa-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th>ID</th>
            <th>账号</th>
            <th>用户名称</th>
            <th>角色</th>
            <th class="text-right">活跃指数</th>
            <!-- <th>微信昵称</th> -->
            <th>手机号码</th>
            <th>状态</th>
            <th>最后一次访问</th>
            <th>创建时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td
              class="mb-0 pb-2 pt-0 font-weight-light grey--text"
              style="font-size:12p4"
            >
              {{ row.id }}
            </td>
            <td style="font-size:13px">
              {{ row.username ? row.username : "-" }}
            </td>
            <td style="font-size:13px">{{ row.name ? row.name : "-" }}</td>
            <td style="font-size:13px">
              {{ row.role_name ? row.role_name : "-" }}
            </td>
            <td style="font-size:13px" class="text-right">{{ row.login_counts }}</td>
            <!-- <td style="font-size:13px">{{ row.nickname ? row.nickname : '-'}}</td> -->
            <td class="mb-0 pb-2 pt-0 font-weight-light" style="font-size:12p4">
              {{ row.phone ? row.phone : "-" }}
            </td>
            <td class="mb-0 pb-2 pt-0 font-weight-light" style="font-size:12p4">
              {{ getNamefromOptions(userStatusOptions, row.status) }}
            </td>
            <!-- <td>{{ row.total }}</td> -->
            <td class="mb-0 pb-2 pt-0 font-weight-light" style="font-size:14px">
              {{
                $moment(row.last_seen)
                  .utc()
                  .fromNow()
              }}
            </td>
            <td class="mb-0 pb-2 pt-0 font-weight-light" style="font-size:14px">
              {{
                $moment(row.member_since)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss")
              }}
            </td>
            <!-- <td class="text-right">
                <v-btn
                  :color="action.color"
                  class="px-1 ml-1"
                  icon
                  fab
                  small
                  @click="handleToDetails(row)"
                >
                  <v-icon v-text="action.icon" />
                </v-btn>
                <v-btn
                  v-if="isAdminRole"
                  color="warning"
                  class="ml-1"
                  text
                  x-small
                  @click="removeAuthor(row)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </td> -->
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div class="text-center">
      <v-row justify="center" align="center">
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
        ></v-pagination>
        <!-- <span>共{{total_pages}}页</span> -->
      </v-row>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { fetchUsers, deleteUser } from "@/api/users";

const userStatusOptions = [
  { key: 0, display_name: "待审核" },
  { key: 1, display_name: "正常" },
  { key: 2, display_name: "未通过" },
  { key: 3, display_name: "驳回" }
];

export default {
  name: "Users",

  components: {},

  data: () => ({
    snackbar: false,
    text: "",
    timeout: 3000,

    action: {
      color: "info",
      icon: "mdi-blur"
    },
    items: [],
    listQuery: {
      page: 1,
      limit: 100,
      name: undefined,
      status: undefined,
      sort: "+id"
    },
    // search: undefined,
    userStatusOptions,
    circle: true,
    disabled: false,
    length: 10,
    nextIcon: "mdi-chevron-right",
    prevIcon: "mdi-chevron-left",
    totalVisible: 10,
    total_pages: ""
  }),
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
    this.getList();
    // console.log()
  },
  watch: {
    search: function(val) {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.getList();
          this.awaitingSearch = false;
        }, 6000); // 1 sec delay
      }
      this.awaitingSearch = true;
    }
  },
  methods: {
    getQuery() {
      setTimeout(() => this.getList(), 500);
    },
    getList() {
      this.listLoading = true;
      fetchUsers(this.listQuery).then(response => {
        this.items = response.data.items;
        this.total_pages = response.data._meta.total_pages;
        console.log(this.items);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleToDetails(row) {
      // console.log(row.id)
      this.$router.push({
        name: "读者详情",
        params: { id: row.id }
      });
    },
    removeAuthor(row) {
      this.$confirm("确认删除读者账号?").then(res => {
        if (res) {
          deleteUser(row.id).then(response => {
            this.getList();
            // Just to simulate the time of the request
            this.text = "作者删除成功！";
            this.snackbar = true;
          });
        }
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
    paginationChangeHandler(pageNumber) {
      this.listQuery.page = pageNumber;
      this.getList();
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

table,
thead,
tr {
  color: grey;
  font-weight: 400;
}

.background-transparent {
  background-color: transparent !important;
}

tr:hover {
  background-color: #0282b4 !important;
  color: rgb(224, 221, 221);
}
</style>