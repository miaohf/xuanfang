<template>
  <v-dialog v-model="dialog" max-width="1400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="green"
        dark
        v-bind="attrs"
        v-on="on"
        class="mx-2"
      >
        新增<v-icon right>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <!-- <v-card-title class="headline">编辑</v-card-title> -->
      <v-col>
        <v-card class="pa-6" height="400px">
          <h1>新增签约</h1>
          <v-divider class="mx-4 my-1"></v-divider>
          <v-row>
            <v-col cols="12" sm="5" md="5">
              <model-list-select
                :list="customersList"
                placeholder="选择户主"
                v-model="temp.customer_id"
                option-value="id"
                option-text="name"
              >
              </model-list-select>
            </v-col>

            <v-col cols="12" sm="7" md="7">
              <model-list-select
                :list="labelslist"
                placeholder="选择号签"
                v-model="temp.label_id"
                option-value="id"
                option-text="detail"
              >
              </model-list-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="12">
              <p
                class="mb-0 pb-2 pt-0 font-weight-light grey--text"
                style="font-size:18px"
              >
                 九色鹿抽签管理系统，由 九色鹿网络 提供技术支持。
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
import { createContract } from "@/api/contracts";
import { fetchCustomersList } from "@/api/customers";
import { fetchLabelsList } from "@/api/labels";
import { ModelListSelect } from "vue-search-select";

export default {
  name: "AddContractDialog",
  components: {
    ModelListSelect
  },

  data: () => ({
    customersList: [],
    labelslist: [],
    objectItem: {},
    stringItem: "",
    dialog: false,
    temp: {
      customer_id: "",
      label_id: "",
    }
  }),
  mounted() {
    this.getCustomers()
    this.getLabels()
  },
  methods: {
    getCustomers() {
      fetchCustomersList().then(response => {
        this.customersList = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      console.log("customersList:", this.customersList);
    },

    getLabels() {
      fetchLabelsList().then(response => {
        this.labelslist = response.data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      console.log("labelslist:", this.labelslist);
    },

    confirmAddDialog() {
      const tempData = this.temp;
      createContract(tempData).then(() => {
        this.dialog = false
        this.temp = {}
        this.getCustomers()
        this.getLabels()

        this.$parent.getList()

      });
    },

    cancelAddDialog() {
      this.dialog = false;
      this.temp = {};
    }
  }
};
</script>
