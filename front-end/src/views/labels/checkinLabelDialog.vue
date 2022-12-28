<template>
  <v-dialog v-model="dialogScan" max-width="900">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="green" dark v-bind="attrs" v-on="on" class="mx-2">
        校验<v-icon right>mdi-crop-free</v-icon>
      </v-btn>
    </template>

    <v-container class="pa-6 my-container" min-height="400px">
      <h1>号签校验</h1>
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
      <v-simple-table dense class="mx-8 mt-6">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                编号
              </th>
              <th class="text-left">
                校对
              </th>
              <th class="text-left">
                详细信息
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ temp.label.id }}</td>
              <td>
                <span :class="`label-checkflag-${temp.label.check_flag}`">
                  {{
                    getNamefromOptions(checkFlagOptions, temp.label.check_flag)
                  }}
                </span>
              </td>

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
                      <td :class="`label-checkflag-${item.check_flag}`">
                        {{
                          getNamefromOptions(checkFlagOptions, item.check_flag)
                        }}
                      </td>
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
        <v-btn color="primary" @click="cancelCheckinLabelDialog">取消</v-btn>
      </v-card-actions>
    </v-container>
  </v-dialog>
</template>

<script>
const checkFlagOptions = [
  { key: 0, display_name: "✘" },
  { key: 1, display_name: "✔" }
];

import { fetchLabel, updateLabel } from "@/api/labels";
export default {
  name: "checkinLabelDialog",
  components: {},

  data: () => ({
    alert: false,
    alert_text: "",
    customersList: [],
    scan: {
      value: "",
      type: ""
    },
    label_code: "",
    objectItem: {},
    stringItem: "",
    dialogScan: false,
    checkFlagOptions,
    temp: {
      customer: {},
      label: {
        houses: []
      }
    }
  }),
  mounted() {
    console.log(this.$parent);
  },
  methods: {
    handleScan() {
      console.log("handleScan");
      if (this.scan.value.length == 8) {
        this.scan.type = this.scan.value.substr(0, 1);
        if (this.scan.type == "9") {
          const label_id = Number(this.scan.value.substr(1, 6));
          console.log("label_id: ", label_id);
          this.getLabel(label_id);
          setTimeout(() => {
            this.checkinLabel(label_id);
          }, 1 * 1000);
        }
      }
    },

    getLabel(label_id) {
      console.log("checkinLabel");
      fetchLabel(label_id).then(response => {
        this.temp.label = response.data;
      });
    },

    checkinLabel(label_id) {
      console.log("checkinLabel");
      var data = { check_flag: 1 };
      updateLabel(label_id, data).then(response => {
        this.label_code = "";
        this.temp.label = response.data;
        // Just to simulate the time of the request
        console.log(this.temp.label);
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

    cancelCheckinLabelDialog() {
      this.dialogScan = false;
      this.scan = {
        type: "",
        value: ""
      };
      this.temp.label = [];
    }
  }
};
</script>

<style scoped lang="scss">
$colors: (0 #949696, 1 #4ba946);

$color: nth($colors, random(length($colors)));

@each $i in $colors {
  .label-checkflag-#{nth($i,1)} {
    color: nth($i, 2) !important;
    // font-size: 50px;
    // margin-left: 40px;
  }
}

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
