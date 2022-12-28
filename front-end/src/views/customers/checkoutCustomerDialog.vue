<template>
  <v-dialog v-model="dialogScan" max-width="900">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="orange" dark v-bind="attrs" v-on="on" class="mx-1 mr-2">
        签退<v-icon right>mdi-crop-free</v-icon>
      </v-btn>
    </template>

    <v-container class="pa-6 my-container">
      <v-col>
        <h1>户主签退</h1>
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
              label="扫码录入"
              hide-details
              single-line
              @input="handleScan"
              style="max-width: 300px;"
            />
          </v-col>
        </v-row>
        <div :v-if="this.temp.customer">
          <v-row :class="`customer-title-${temp.customer.check_flag}`">
            <h3>
              {{ this.temp.customer.name }}
              {{
                getNamefromOptions(checkInStatus, this.temp.customer.check_flag)
              }}
            </h3>
          </v-row>
          <v-row class="customer-detail">
            <p v-if="temp.customer.id">
              {{ this.temp.customer.id }},{{ this.temp.customer.lottery_sequence }}, {{ this.temp.customer.village }},
              {{ this.temp.customer.phone }}, {{ this.temp.customer.myarea }}㎡,
              {{ this.temp.customer.cardid }}
            </p>
          </v-row>
        </div>
        <div class="my-3" />
      </v-col>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="cancelCheckinCustomerDialog">取消</v-btn>
      </v-card-actions>
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
      </v-snackbar>
    </v-container>
  </v-dialog>
</template>

<script>
import { fetchCustomer, fetchCustomerByCode,  updateCustomer } from "@/api/customers";

const checkInStatus = [
  { key: 0, display_name: "✘" },
  { key: 1, display_name: "✔" },
  { key: 2, display_name: "Ο" }
];

export default {
  name: "CheckoutCustomerDialog",
  components: {},

  data: () => ({
    timeout: 3,
    snackbar: false,
    text: "",
    alert: false,
    alert_text: "",
    customersList: [],
    scan: {
      value: "",
      type: ""
    },
    house_code: "",
    objectItem: {},
    stringItem: "",
    dialogScan: false,
    default_book: "http://booksapi.coloredeer.com:8004/images/default_book.png",
    temp: {
      customer: {},
      houses: []
    },
    house: {
      id: "",
      garden: "",
      area: "",
      status: ""
    },
    checkInStatus
  }),
  mounted() {},
  methods: {
    handleScan() {
      console.log("handleScan");

      if (this.scan.value.length == 8) {
        this.scan.type = this.scan.value.substr(0, 1);

        if (this.scan.type == "8") {
          // const customer_code = Number(this.scan.value.substr(1, 6));
          const customer_code = Number(this.scan.value.substr(0, 7));
          console.log("customer_code: ", customer_code);
          this.getCustomerByCode(customer_code);
          setTimeout(() => {
            this.checkinCustomer(customer_code);
          }, 0.5 * 1000);
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
        }, 1.0 * 1000);
      });
      this.scan = {
        type: "",
        value: ""
      };
    },

    // getCustomer(customer_code) {
    //   console.log("getCustomer");
    //   fetchCustomer(customer_code).then(response => {
    //     this.temp.customer = response.data;
    //     // Just to simulate the time of the request
    //     setTimeout(() => {
    //       this.listLoading = false;
    //     }, 1.5 * 1000);
    //   });
    //   this.scan = {
    //     type: "",
    //     value: ""
    //   };
    // },

    checkinCustomer(customer_code) {
      console.log("checkinCustomer");
      var data = { check_flag: 2 };
      updateCustomer(this.temp.customer.id, data).then(response => {
        // this.temp.customer = response.data;
        // Just to simulate the time of the request
        this.temp.customer = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
        this.$parent.getList();
      });
      this.scan = {
        type: "",
        value: ""
      };
    },

    cancelCheckinCustomerDialog() {
      this.dialogScan = false;
      this.scan = {
        type: "",
        value: ""
      };
      this.temp = {
        customer: {},
        houses: []
      };
      console.log("cancelCheckinCustomerDialog");
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
    }
  }
};
</script>

<style scoped lang="scss">
$colors: (0 #949696, 1 #4ba946, 2 #e49723);

$color: nth($colors, random(length($colors)));

@each $i in $colors {
  .customer-title-#{nth($i,1)} {
    color: nth($i, 2) !important;
    font-size: 42px;
    margin-left: 40px;
  }
}

.customer-detail {
  color: rgb(207, 131, 32);
  font-size: 18px;
  margin-left: 40px;
  font-weight: 500;
  // font-weight-light grey--text mx-10
}

.my-container {
  background-color: rgba(79, 79, 82, 0.9);
}


</style>
