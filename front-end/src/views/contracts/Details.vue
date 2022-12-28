<template>
  <v-container id="" fluid tag="section">
    <v-card class="my-0">
      <v-btn class="mt-6 mb-0" tile text large @click="goBack">
        <v-icon left v-text="icons['left']" /> 返回
      </v-btn>
      <v-card-text>
        <v-card-title class="justify-center font-weight-light">
          <span v-if="details.audios.length > 0">
            <i class="mdi mdi-headphones"></i>
          </span>
          {{ details.title }}
        </v-card-title>
        <v-card-text
          class="body-1 text-center my-3 font-weight-light grey--text"
        >
          <span v-for="(author, id) in details.authors" :key="id">
            {{ author.name }}
          </span>
          <span v-if="details.authors.length > 0">著</span>
        </v-card-text>
        <v-row>
          <v-col cols="12" sm="3" class="mt-10">
            <v-flex xs12 md12>
              <v-img
                :src="details.pic ? details.pic : default_book"
                class="mx-6 my-0"
              >
                <span v-if="isAdminRole"
                  ><UploadPictureDialog></UploadPictureDialog
                ></span>
              </v-img>
            </v-flex>
            <v-flex xs12 md2> </v-flex>
          </v-col>
          <v-col cols="12" sm="9" class="pt-0">
            <base-material-tabs centered>
              <v-tab v-for="(tab, i) in tabs" :key="i">
                {{ tab }}
              </v-tab>

              <v-tab-item>
                <v-card-text
                  class="body-1 text-left mb-3 font-weight-light grey--text"
                >
                  简介：{{ details.summary }}
                </v-card-text>

                <v-card-text
                  class="mb-0 pb-2 pt-0 font-weight-light grey--text"
                  style="font-size:12px"
                >
                  图书ID：{{ details.id }}
                  <v-spacer />
                  库存数量：{{ details.available_numbers }}
                  <v-spacer />
                  <span>
                    包装档次：{{
                      getNamefromOptions(bindingOptions, details.binding)
                    }}</span
                  >
                  <v-spacer />
                  <span>
                    是否上架：{{
                      getNamefromOptions(onlineOptions, details.is_online)
                    }}</span
                  >
                  <!-- <v-spacer />
                  馆藏位置：{{ details.library }} -->
                  <v-spacer />
                  出版日期：{{ details.pubdate }}
                  <v-spacer />
                  出版社：
                  <span v-for="(publisher, id) in details.publishers" :key="id">
                    {{ publisher.name }}
                  </span>
                  <span v-if="details.pubplace">
                    ({{ details.pubplace }})
                  </span>
                  <v-spacer />
                  ISBN：{{ details.isbn }}
                  <v-spacer />
                  <!-- <v-flex v-if="isAdminRole" xs12 md2>
                    <EditBookDialog></EditBookDialog>
                  </v-flex> -->
                  <p
                    class="mb-0 pb-2 pt-0 font-weight-light grey--text"
                    style="font-size:9px"
                  >
                    {{ details.pic }}
                  </p>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-divider class="mt-5"></v-divider>
                <v-card
                  flat
                  v-for="bookinstance in details.bookinstances"
                  :key="bookinstance.id"
                >
                  <v-layout
                    row
                    wrap
                    :class="`pa-3 bookinstance ${bookinstance.status}`"
                  >
                    <v-flex xs12 md1>
                      <div class="caption grey--text">
                        ID
                      </div>
                      <div class="caption">{{ bookinstance.id }}</div>
                      <!-- <div>cdbn {{ bookinstance.cdbn }}</div> -->
                    </v-flex>
                    <v-flex xs12 md2>
                      <div class="caption grey--text">图书编号(CDBN)</div>
                      <div class="caption">{{ bookinstance.cdbn }}</div>
                    </v-flex>
                    <v-flex xs6 sm4 md1>
                      <div class="caption grey--text">状态</div>
                      <div class="caption">
                        {{
                          getNamefromOptions(
                            bookinstanceStatusOptions,
                            bookinstance.status
                          )
                        }}
                      </div>
                    </v-flex>
                    <v-flex xs6 sm4 md1>
                      <div class="caption grey--text">书架号</div>
                      <div class="caption">
                        <v-icon
                          >mdi-numeric-{{
                            bookinstance.contractshelf_id
                          }}-box</v-icon
                        >
                        <!-- {{ bookinstance.contractshelf }} -->
                      </div>
                    </v-flex>
                    <v-flex xs6 sm4 md1>
                      <div class="caption grey--text">区间</div>
                      <div class="caption">
                        {{ bookinstance.floor }}
                      </div>
                    </v-flex>
                    <v-flex xs6 sm4 md1>
                      <div class="caption grey--text">分册</div>
                      <div class="caption">{{ bookinstance.volume }}</div>
                    </v-flex>
                    <v-flex xs2 sm4 md1>
                      <div class="caption grey--text">借阅人</div>
                      <div class="caption right">
                        {{ bookinstance.user }}
                      </div>
                    </v-flex>
                    <v-flex xs6 sm4 md1>
                      <div class="caption grey--text">上架日期</div>
                      <div class="caption">
                        {{
                          $moment(bookinstance.created_at).format("YYYY/M/D")
                        }}
                      </div>
                    </v-flex>
                    <v-flex xs6 sm4 md1>
                      <div class="caption grey--text">更新于</div>
                      <div class="caption">
                        {{ $moment(bookinstance.last_updated).fromNow() }}
                      </div>
                    </v-flex>
                    <v-flex xs12 md2>
                      <div>
                        <span v-if="!bookinstance.user && isAdminRole">
                          <v-btn
                            color="red"
                            text
                            mini
                            @click="removeBookinstance(bookinstance.id)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </span>
                        <span v-else></span>
                      </div>
                    </v-flex>
                  </v-layout>

                  <v-divider></v-divider>
                </v-card>
                <v-spacer />

                <v-flex v-if="isAdminRole" xs12 md2>
                  <AddBookinstanceDialog></AddBookinstanceDialog>
                </v-flex>
              </v-tab-item>
            </base-material-tabs>
          </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}
        </v-snackbar>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addlogdialog" max-width="290">
      <v-card>
        <v-card-text>
          <base-subheading>
            办理借书
          </base-subheading>

          <v-select
            color="secondary"
            item-color="secondary"
            label="读者账号"
            :items="users"
            v-model="templog.user_id"
            item-value="id"
            item-text="name"
          >
            <template v-slot:item="{ attrs, item, on }">
              <v-list-item
                v-bind="attrs"
                active-class="secondary elevation-4 white--text"
                class="mx-3 mb-3 v-sheet"
                elevation="0"
                v-on="on"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="addlogdialog = false">
            取消
          </v-btn>

          <v-btn color="green darken-1" text @click="addLog()">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// import Popup from "./Popup";

import { fetchContract, updateContract, deleteContract } from "@/api/contracts";

import { upload } from "@/api/upload";

import { createLog } from "@/api/logs";
import { fetchUsers } from "@/api/users";

// import { upload, remove } from '../../api/upload'

const bindingOptions = [
  { key: 0, display_name: "简装" },
  { key: 1, display_name: "精装" }
];

const bookinstanceStatusOptions = [
  { key: 0, display_name: "借出" },
  { key: 1, display_name: "在库" }
];

const onlineOptions = [
  { key: 0, display_name: "否" },
  { key: 1, display_name: "是" }
];
const houseStatusOptions = [
  { key: 0, display_name: "待租" },
  { key: 1, display_name: "已租" },
  { key: 2, display_name: "下线" }
];

// const contractshelfIdOptions = [
//   { key: 1, display_name: 'mdi-numeric-1-box' },
//   { key: 2, display_name: 'mdi-numeric-2-box' },
//   { key: 3, display_name: 'mdi-numeric-3-box' },
//   { key: 4, display_name: 'mdi-numeric-4-box' },
//   { key: 5, display_name: 'mdi-numeric-5-box' },
//   { key: 6, display_name: 'mdi-numeric-6-box' },
//   { key: 7, display_name: 'mdi-numeric-7-box' },
//   { key: 8, display_name: 'mdi-numeric-8-box' },
//   { key: 9, display_name: 'mdi-numeric-9-box' }
// ];

export default {
  name: "Book Details",

  components: {
    // EditBookDialog: () => import("./editBookDialog"),
    // UploadPictureDialog: () => import("./uploadPictureDialog"),
    // VuetifyAudio: () => import('vuetify-audio'),
    // AddLogDialog: () => import("./addLogDialog")
  },

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
      addlogdialog: false,
      bookinstance_id: "",
      default_book:
        "http://contractsapi.coloredeer.com:8004/images/default_book.png",
      bindingOptions,
      onlineOptions,
      bookinstanceStatusOptions,
      tab: 0,
      tabs: ["图书信息", "上架详情", "音频档案"],
      icons: {
        left: "mdi-chevron-left",
        right: "mdi-chevron-right",
        info: "mdi-exclamation",
        success: "mdi-check",
        warning: "mdi-alert",
        error: "mdi-close"
      },
      details: null,
      temp: {},
      editFormVisible: false,
      removeQuery: {
        type: undefined,
        period: undefined,
        id: undefined
      },
      rules: {},
      users: [],
      templog: {
        bookinstance_id: "",
        user_id: ""
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
    this.getBook(this.$route.params.id);
    this.getUsers();
  },

  methods: {
    goBack() {
      console.log("goback clicked");
      this.$router.go(-1);
    },
    getBook(id) {
      this.listLoading = true;
      fetchContract(id).then(response => {
        this.details = response.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    getUsers() {
      fetchUsers().then(response => {
        this.users = response.data.items;
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      });
      // console.log(this.users);
    },
    createLogDialogVisible(id) {
      this.addlogdialog = true;
      this.templog.bookinstance_id = id;
    },
    addLog() {
      console.log(this.templog);
      createLog(this.templog).then(() => {
        this.addlogdialog = false;
      });
    },
    handleUpdate(id) {
      this.temp = Object.assign({}); // copy obj
      this.editFormVisible = true;
      fetchContract(id).then(response => {
        this.temp = response.data;
      });
      this.$nextTick(() => {
        this.$refs["editForm"].clearValidate();
      });
    },
    handleAddBorrow() {
      this.resetTemp();
      this.handleAddBorrowFormVisible = true;
      this.$nextTick(() => {
        this.$refs["editForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateContract(tempData).then(() => {
            this.editFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
      this.getBook(this.$route.params.id);
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
    removeBookinstance(id) {},
    removeAudio(id) {},
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 40%;
  margin-bottom: 1rem;
  color: #212529;
  padding-left: 20px;
}

.table th,
.table td {
  padding: 0.5rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}

.details {
  padding: 25px;
  margin-top: 0px;
}

/* span {
line-height:1.5;
} */

.el-divider {
  margin-bottom: 0px;
}

.text-example {
  background-color: rgba(94, 91, 91, 0.813);
  /* border: 1px solid rgba(86, 61, 124,.15) */
}

/* .v-overflow-btn .v-input__slot::before {
  border-color: grey !important;
} */
</style>
