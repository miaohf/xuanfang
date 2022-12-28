<template>
  <v-container id="dashboard" fluid tag="section">
    <div class="px-10">
      <v-row>
        <div id="customersPinChart">
          <apexchart
            type="pie"
            :options="customersPinChart.chartOptions"
            :series="customersPinChart.series"
          ></apexchart>
        </div>
        <div id="customerStockChart">
          <apexchart
            type="area"
            height="200"
            width="1170"
            ref="customerStockChart.chart"
            :options="customerStockChart.chartOptions"
            :series="customerStockChart.series"
          ></apexchart>
        </div>
      </v-row>
      <v-row>
        <div id="customerCheckInChart">
          <apexchart
            type="bar"
            width="240"
            :options="customerCheckInChart.chartOptions"
            :series="customerCheckInChart.series"
          ></apexchart>
        </div>
        <div id="labelCheckInChart">
          <apexchart
            type="bar"
            width="240"
            :options="labelCheckInChart.chartOptions"
            :series="labelCheckInChart.series"
          ></apexchart>
        </div>

        <div id="housesBarStackChart">
          <apexchart
            type="bar"
            width="280"
            :options="housesBarStackChart.chartOptions"
            :series="housesBarStackChart.series"
          ></apexchart>
        </div>

        <div id="housesStatusStackChart">
          <apexchart
            type="bar"
            width="770"
            :options="housesStatusStackChart.chartOptions"
            :series="housesStatusStackChart.series"
          ></apexchart>
        </div>
      </v-row>
      <v-row>
        <div id="housesBarChart">
          <apexchart
            type="bar"
            width="1530"
            :options="housesBarChart.chartOptions"
            :series="housesBarChart.series"
          ></apexchart>
        </div>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { fetchDashboardData } from "@/api/dashboard";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Dashboard",
  components: {
    apexchart: VueApexCharts
  },

  data() {
    return {
      loaded: false,
      timer: '',

      // customersPinChart
      customersPinChart: {
        series: [44, 55, 13, 43, 22],
        chartOptions: {
          theme: {
            mode: "dark"
          },
          chart: {
            width: 360,
            type: "pie"
          },
          labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        }
      },

      // customerStockChart
      customerStockChart: {
        series: [
          {
            data: [[1638261613000, 30.95]]
          }
        ],
        chartOptions: {
          theme: {
            mode: "dark"
          },
          chart: {
            id: "area-datetime",
            type: "area",
            height: 200,
            zoom: {
              autoScaleYaxis: true
            }
          },
          annotations: {
            yaxis: [
              {
                y: 30,
                borderColor: "#999",
                label: {
                  show: true,
                  text: "九色鹿",
                  style: {
                    color: "#fff",
                    background: "#00E396"
                  }
                }
              }
            ],
            xaxis: [
              {
                x: 1638373140000,
                // new Date("3 Dec 2021 12:00:00").getTime(),
                borderColor: "#999",
                yAxisIndex: 0,
                label: {
                  show: true,
                  text: "Rally",
                  style: {
                    color: "#fff",
                    background: "#775DD0"
                  }
                }
              }
            ]
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
            style: "hollow"
          },
          xaxis: {
            type: "datetime",
            min: 1638373080000,
            // new Date("1 Dec 2021 16:00:00").getTime(),
            tickAmount: 1
          },
          tooltip: {
            x: {
              format: "dd MMM yyyy HH:mm"
            }
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 100]
            }
          }
        },

        selection: "one_day"
      },

      // housesBarChart
      housesBarChart: {
        series: [{ data: [] }],
        chartOptions: {
          theme: {
            mode: "dark"
          },
          chart: {
            height: 240,
            type: "bar",
            events: {
              click: function(chart, w, e) {
                // console.log(chart, w, e)
              }
            }
          },
          colors: [
            "#f70",
            "#f71",
            "#f72",
            "#f73",
            "#f74",
            "#f75",
            "#f76",
            "#f77",
            "#f78",
            "#f79",
            "#f7a",
            "#f7b",
            "#5f0",
            "#5f1",
            "#5f2",
            "#5f3",
            "#5f4",
            "#5f5",
            "#5f6",
            "#5f7",
            "#5f8",
            "#5f9",
            "#5fa",
            "#5fb",
            "#5fc",
            "#5fe",
            "#5ff",
            "#5ff",
            "#5ff",
            "#c0f",
            "#c1f",
            "#c2f",
            "#c3f",
            "#c4f",
            "#c5f",
            "#c6f",
            "#c7f",
            "#c8f",
            "#c9f",
            "#caf",
            "#cbf",
            "#ccf",
            "#cef",
            "#cff"
          ],
          plotOptions: {
            bar: {
              columnWidth: "85%",
              distributed: true
            }
          },
          dataLabels: {
            enabled: false,
            formatter: function(val) {
              return val;
            },
            offsetY: -20,
            style: {
              fontSize: "14px",
              colors: ["#304758"]
            }
          },
          legend: {
            show: false
          },
          xaxis: {
            categories: [],
            labels: {
              style: {
                colors: this.colors,
                fontSize: "12px"
              }
            }
          }
        }
      },

      // housesBarStackChart
      housesBarStackChart: {
        series: [
          {
            name: "已选",
            data: [0, 0, 0]
          },
          {
            name: "空闲",
            data: [0, 0, 0]
          }
        ],
        chartOptions: {
          theme: {
            mode: "dark"
          },
          chart: {
            type: "bar",
            height: 280,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10
            }
          },
          xaxis: {
            // type: 'datetime',
            categories: []
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        }
      },

      // housesStatusStackChart
      housesStatusStackChart: {
        series: [
          {
            name: "已选",
            data: [0, 0, 0]
          },
          {
            name: "空闲",
            data: [0, 0, 0]
          }
        ],
        chartOptions: {
          theme: {
            mode: "dark"
          },
          chart: {
            type: "bar",
            height: 280,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10
            }
          },
          xaxis: {
            // type: 'datetime',
            categories: []
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        }
      },

      // labelCheckInChart
      labelCheckInChart: {
        series: [
          {
            name: "已签入",
            data: [0, 0]
          },
          {
            name: "未签入",
            data: [0, 0]
          }
        ],
        chartOptions: {
          theme: {
            mode: "dark"
          },
          chart: {
            type: "bar",
            height: 280,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10
            }
          },
          xaxis: {
            // type: 'datetime',
            categories: []
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        }
      },

      // customerCheckInChart
      customerCheckInChart: {
        series: [
          {
            name: "已签退",
            data: [0, 0]
          },
          {
            name: "已签入",
            data: [0, 0]
          },
          {
            name: "未签入",
            data: [0, 0]
          }
        ],
        chartOptions: {
          theme: {
            mode: "dark"
          },
          chart: {
            type: "bar",
            height: 280,
            stacked: true
            // toolbar: {
            //   show: true
            // },
            // zoom: {
            //   enabled: true
            // }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10
            }
          },
          xaxis: {
            // type: 'datetime',
            categories: []
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        }
      },

      headers: [],
      items: [],
      basisinfo: {
        authors_count: "",
        books_count: "",
        logs_count: "",
        publishers_count: "",
        bookinstances_count: ""
      },
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      }
    };
  },

  computed: {},

  created() {
    window.addEventListener("resize", this.myEventHandler);
    this.getDashboard();
    this.timer = setInterval(() => {
      setTimeout(this.getDashboard(), 0);
    }, 1000 * 15);
  },

  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
    clearInterval(this.timer);
  },

  methods: {
    myEventHandler(e) {
      console.log("myEventHandler xxxx");
      this.getDashboard();
    },
    getDashboard() {
      fetchDashboardData().then(response => {
        this.customersPinChart.series =
          response.data.customers_pin_chart.series;

        this.customersPinChart.chartOptions = {
          ...this.customersPinChart.chartOptions,
          ...{ labels: response.data.customers_pin_chart.chartoptions_labels }
        };

        this.housesBarChart.series = [
          { name: "套数", data: response.data.houses_bar_chart.series_data }
        ];

        this.housesBarChart.chartOptions = {
          ...this.housesBarChart.chartOptions,
          ...{
            xaxis: {
              categories:
                response.data.houses_bar_chart.chartoptions_xaxis_categories
            }
          }
        };

        this.housesBarStackChart.series = [
          {
            name: "已选",
            data: response.data.houses_bar_stack_chart.series_data_02
          },
          {
            name: "空闲",
            data: response.data.houses_bar_stack_chart.series_data_01
          }
        ];

        this.housesBarStackChart.chartOptions = {
          ...this.housesBarStackChart.chartOptions,
          ...{
            xaxis: {
              categories:
                response.data.houses_bar_stack_chart
                  .chartoptions_xaxis_categories
            }
          }
        };

        this.housesStatusStackChart.series = [
          {
            name: "已选",
            data: response.data.house_status_chart.series_data_02
          },
          {
            name: "空闲",
            data: response.data.house_status_chart.series_data_01
          }
        ];

        this.housesStatusStackChart.chartOptions = {
          ...this.housesStatusStackChart.chartOptions,
          ...{
            xaxis: {
              categories:
                response.data.house_status_chart.chartoptions_xaxis_categories
            }
          }
        };

        this.labelCheckInChart.series = [
          {
            name: "已签入",
            data: response.data.labels_check_in_chart.series_data_02
          },
          {
            name: "未签入",
            data: response.data.labels_check_in_chart.series_data_01
          }
        ];

        this.labelCheckInChart.chartOptions = {
          ...this.labelCheckInChart.chartOptions,
          ...{
            xaxis: {
              categories:
                response.data.labels_check_in_chart
                  .chartoptions_xaxis_categories
            }
          }
        };
        this.customerCheckInChart.series = [
          {
            name: "已签退",
            data: response.data.customers_check_in_chart.series_data_03
          },
          {
            name: "已签入",
            data: response.data.customers_check_in_chart.series_data_02
          },
          {
            name: "未签入",
            data: response.data.customers_check_in_chart.series_data_01
          }
        ];

        this.customerCheckInChart.chartOptions = {
          ...this.customerCheckInChart.chartOptions,
          ...{
            xaxis: {
              categories:
                response.data.customers_check_in_chart
                  .chartoptions_xaxis_categories
            }
          }
        };

        // customerStockChart
        var customerStockChart_data = response.data.customers_stock_chart.data;
        var start_timestamp = 0;
        var end_timestamp =
          customerStockChart_data[customerStockChart_data.length - 1][0];
        if (customerStockChart_data.length >= 100) {
          start_timestamp =
            customerStockChart_data[customerStockChart_data.length - 99][0];
        } else {
          start_timestamp = customerStockChart_data[0][0];
        }
        this.customerStockChart.series = [
          {
            data: customerStockChart_data.slice(-100, -1)
            // data: customerStockChart_data
          }
        ];

        console.log("start:", start_timestamp);

        console.log(
          "end:",
          customerStockChart_data[customerStockChart_data.length - 1][0],
          // new Date('01 Dec 2021').getTime(),
          customerStockChart_data
        );

        this.customerStockChart.chartOptions = {
          ...this.customerStockChart.chartOptions,
          ...{
            annotations: {
              yaxis: [
                {
                  y: 30,
                  borderColor: "#999",
                  label: {
                    show: true,
                    text: "九色鹿",
                    style: {
                      color: "#fff",
                      background: "#00E396"
                    }
                  }
                }
              ],
              xaxis: [
                {
                  x: end_timestamp,
                  // 1638373140000,
                  // new Date('10 Dec 2021').getTime(),
                  // 1638355200000,
                  // customerStockChart_data[
                  //   customerStockChart_data.length - 1
                  // ][0],
                  borderColor: "#999",
                  yAxisIndex: 0,
                  label: {
                    show: true,
                    text: "Rally",
                    style: {
                      color: "#fff",
                      background: "#775DD0"
                    }
                  }
                }
              ]
            },
            xaxis: {
              type: "datetime",
              min: start_timestamp,
              // 1638373140000,
              // customerStockChart_data[customerStockChart_data.length - 100][0],
              tickAmount: 6
            }
          }
        };

        // console.log(response.data.customers_stock_chart.data.slice(-1, -1))
      });
      this.loaded = true;
    }
  }
};
</script>

<style>
/* #dashboard {
  background-color: rgb(228, 224, 224);
}
.apexcharts-legend-text {
  color: rgb(124, 121, 117) !important;
}
.apexcharts-text tspan  {
  color: rgb(124, 121, 117) !important;
} */
/* #customersPinChart {
  background-color: rgba(70, 70, 70, 0.9) !important;
} */

#customerStockChart {
  background-color: rgba(70, 70, 70, 0.9) !important;
  /* color: blue; */
  /* width: 1000px; */
}
</style>
