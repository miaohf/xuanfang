<template>
  <v-dialog v-model="dialogScan" max-width="900">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" class="my-btn" large>
        提交<v-icon right large>mdi-check</v-icon>
      </v-btn>
    </template>
    <v-container class="my-container ">
      <h1 class="head">选房结果</h1>
      <!-- <v-divider class="mx-4 my-1"></v-divider> -->
      <v-card class="customer">
        <v-row :v-if="selectionData.customer">
          <span class="customer_name">{{ selectionData.customer.name }}</span>
          <span class="customer_info"
            >第 {{ selectionData.customer.lottery_sequence }} 号</span
          >
          <span class="customer_info">
            {{ selectionData.customer.village }}
          </span>
        </v-row>
      </v-card>
      <v-card class="labels">
        <v-simple-table dense class="mx-15 mt-6">
          <template v-slot:default>
            <thead>
              <tr>
                <!-- <th class="text-left"></th> -->
                <th class="text-left">
                  编号
                </th>
                <th class="text-left">
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in selectionData.labels" :key="i">
                <td class="text-right">{{ i + 1 }}</td>
                <v-simple-table dense>
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="(item, i) in row.houses" :key="i">
                        <td>{{ item.garden_name }}</td>
                        <td>{{ row.building_name }}幢</td>
                        <!-- <td>{{ item.unit }}单元</td> -->
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
      </v-card>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancelAddScanDialog" class="my-btn" large>取消</v-btn>
        <v-btn @click="confirmAddScanDialog" class="my-btn" large>确认</v-btn>
      </v-card-actions>
    </v-container>
  </v-dialog>
</template>

<script>
import { createContracts } from "@/api/contracts";
import { fetchCustomerByCode } from "@/api/customers";
import { fetchLabel } from "@/api/labels";
// import { ModelListSelect } from "vue-search-select";
// import { get_bookinfo_byISBN } from "@api/isbn"
export default {
  name: "AddScanContractDialogBatch",
  components: {
    // ModelListSelect
  },

  props: {
    selectionData: {
      type: Object,
      required: true
    }
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
    dialogScan: false
  }),
  mounted() {
    // this.getCustomers();
    // this.getHouses()
    console.log(this.$parent)
  },
  methods: {

    confirmAddScanDialog() {
      const tempData = this.selectionData;
      const id = this.$route.params.id;
      createContracts(tempData).then(() => {
        this.dialogScan = false;
        this.scan = {
          type: "",
          value: ""
        };
        this.temp = {
          customer: {},
          labels: []
        };
        this.label_code = "";
        this.$parent.getGardens();
        this.$parent.resetData();
        // window.location.reload();
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
        labels: []
      };
      console.log("cancelAddScanDialog");
    }
  }
};
</script>

<style scoped lang="scss">
td {
  font-size: 16px !important;
  color: rgb(224, 195, 140);
}

.my-container {
  background-color: #072435;
}

tbody,
th,
tr,
td {
  background-color: #072435 !important;
  font-size: 30px !important;
  font-weight: 400;
}

th {
  color: #a19a85;
  font-size: 16px !important;
  font-weight: 800 !important;
}

.head {
  height: 40px;
  margin: 30px 30px 30px 30px;
}

.customer {
  height: 120px;

  padding: 30px 30px 30px 30px !important;
  margin: 0 30px 0 30px !important;
  background-color: #072435 !important;
  border-width: 0px;
}

.customer_name {
  color: #ffcb3d;
  font-size: 32px;
  font-weight: 800;
  margin: 10px 0 10px 30px;
}

.customer_info {
  color: #b4661e;
  font-size: 26px;
  font-weight: 800;
  margin: 15px 0 10px 30px;
}

.labels {
  height: 350px;

  padding: 30px 30px 30px 30px !important;
  margin: 0 30px 0 30px !important;
  background-color: #072435 !important;
  border-width: 0px;
}

.my-btn {
  color: #dfd4b5 !important;
  background-color: #11535e !important;
  font-size: 24px;
  font-weight: 400;
  margin: 0 10px 0 10px;
}
</style>
