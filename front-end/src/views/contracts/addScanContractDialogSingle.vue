<template>
  <v-dialog v-model="dialogScan" max-width="900">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="green" dark v-bind="attrs" v-on="on" class="mx-2">
        新增<v-icon right>mdi-crop-free</v-icon>
      </v-btn>
    </template>
    <v-container class="my-container pa-6 ">
      <h1>单个新增签约</h1>
      <v-divider class="mx-4 my-1"></v-divider>
      <v-alert
        v-model="alert"
        border="left"
        close-text="Close Alert"
        color="#2A3B4D"
        dark
        dismissible
      >
        {{ alert_text }}
      </v-alert>
      <v-row>
        <v-col cols="8" sm="8" md="8">
          <v-text-field
            autofocus
            v-model="scan.value"
            prepend-icon="mdi-barcode"
            class="ml-auto"
            label="扫码输入"
            hide-details
            single-line
            @input="handleScan"
            style="max-width: 300px;"
          />
        </v-col>
      </v-row>
      <div :v-if="this.temp.customer">
        <v-row class="display-3 font-weight-light orange--text mx-10">
          <h3>{{ this.temp.customer.name }}</h3>
        </v-row>
        <v-row class="font-weight-light grey--text title mx-10">
          <p>
            <!-- {{ this.temp.customer.id }} -->
            {{ this.temp.customer.village }}
            {{ this.temp.customer.phone }} {{ this.temp.customer.myarea }}
            {{ this.temp.customer_code }}
          </p>
        </v-row>
      </div>
      <v-simple-table dense class="mx-15 mt-6">
        <template v-slot:default>
          <thead>
            <tr>

              <th class="text-left">
                详细信息
              </th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="(item, i) in temp.label.houses" :key="i">
                      <td>{{ item.garden }}</td>
                      <td>{{ item.building }}幢</td>
                      <td>{{ item.unit }}单元</td>
                      <td>{{ item.number }}室</td>
                      <td>{{ item.house_type }}</td>
                      <td>{{ item.area }}㎡</td>
                      <td>
                        <span v-if="item.sub_area == 0"> - </span>
                        <span v-else> {{ item.sub_area }} ㎡</span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div class="my-3" />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="cancelAddScanDialog">取消</v-btn>
        <v-btn color="primary" @click="confirmAddScanDialog">确认</v-btn>
      </v-card-actions>
    </v-container>
  </v-dialog>
</template>

<script>
import { createContract } from "@/api/contracts";
import { fetchCustomerByCode } from "@/api/customers";
import { fetchLabel } from "@/api/labels";
// import { ModelListSelect } from "vue-search-select";
// import { get_bookinfo_byISBN } from "@api/isbn"
export default {
  name: "AddScanContractDialogSingle",
  components: {
    // ModelListSelect
  },

  data: () => ({
    alert: false,
    alert_text: "",
    customersList: [],
    // housesList: [],
    scan: {
      value: "",
      type: ""
    },
    label_code: "",
    objectItem: {},
    stringItem: "",
    dialogScan: false,
    temp: {
      customer: {},
      label: {}
    }
  }),
  mounted() {
    // this.getCustomers();
    // this.getHouses()
  },
  methods: {
    handleScan() {
      console.log("handleScan");
      if (this.scan.value.length == 8) {
        this.scan.type = this.scan.value.substr(0, 1);
        if (this.scan.type == "9") {
          const label_code = Number(this.scan.value.substr(1, 6));
          console.log("label_code: ", label_code);
          this.getLabelByCode(label_code);
        } else if (this.scan.type == "8") {
          // const customer_code = Number(this.scan.value.substr(1, 6));
          const customer_code = Number(this.scan.value.substr(0, 7));
          console.log("customer_code: ", customer_code);
          this.getCustomerByCode(customer_code);
        }
      }
    },

    getCustomerByCode(customer_code) {
      console.log("getCustomer");
      fetchCustomerByCode(customer_code).then(response => {
        this.temp.customer = response.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      this.scan = {
        type: "",
        value: ""
      };
    },

    getLabelByCode(label_code) {
      fetchLabel(label_code).then(response => {
        this.temp.label = response.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      this.scan = {
        type: "",
        value: ""
      };
    },

    confirmAddScanDialog() {
      const tempData = {
        customer_id: this.temp.customer.id,
        label_id: this.temp.label.id
      };
      const id = this.$route.params.id;
      createContract(tempData).then(() => {
        this.dialogScan = false;
        this.scan = {
          type: "",
          value: ""
        };
        this.temp = {
          customer: {},
          label: {}
        };
        this.label_code = "";
        this.$parent.getList();
      });
    },

    cancelAddScanDialog() {
      this.dialogScan = false;
      this.scan = {
        type: "",
        value: ""
      };
      this.temp = {
        customer: {},
        label: {}
      };
      this.label_code = "";
      console.log("cancelAddScanDialog");
    }
  }
};
</script>

<style scoped lang="scss">
td {
  font-size: 16px !important;
  color: orange;
}

.my-container {
  background-color: rgba(79, 79, 82, 0.9);
}

tbody,
th,
tr,
td {
  background-color: rgba(79, 79, 82, 0.9) !important;
}
</style>
