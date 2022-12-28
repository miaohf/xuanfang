<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="green" dark v-bind="attrs" v-on="on" class="mx-3" fab>
        <v-icon large>mdi-lightbulb-outline</v-icon>
      </v-btn>
    </template>

    <v-row class="d-flex justify-end">
      <v-btn color="warning darken-1" icon @click="dialog = false">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-row>
    <div class="px-16 pt-8 pb-16">
      <v-row class="d-flex justify-center">
        <span
          v-if="count < 5"
          style="font-size:36px;color:orange;font-weight:800"
          class="mb-3"
          >准备抽取房源</span
        >
        <span
          v-if="count >= 5"
          style="font-size:36px;color:white;font-weight:800"
          class="mb-3"
          >正在抽取房源</span
        >
      </v-row>
      <v-row class="d-flex justify-center">
        <span
          v-if="count < 10"
          style="font-size:15px;color:white;font-weight:800"
          class="mb-10"
          >请点击任意一盏灯</span
        >
      </v-row>
      <v-row v-if="count < 10" class="d-flex justify-space-between">
        <v-btn
          v-if="count < 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_a"
          :disabled="disabled[1]"
        >
          <v-icon x-large>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn
          v-if="count < 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_b"
          :disabled="disabled[2]"
        >
          <v-icon x-large>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn
          v-if="count < 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_c"
          :disabled="disabled[3]"
        >
          <v-icon x-large>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn
          v-if="count < 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_d"
          :disabled="disabled[4]"
        >
          <v-icon x-large>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn
          v-if="count < 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_e"
          :disabled="disabled[5]"
        >
          <v-icon x-large>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn
          v-if="count >= 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_a"
          :disabled="disabled[1]"
        >
          <v-icon x-large>mdi-lightbulb</v-icon>
        </v-btn>
        <v-btn
          v-if="count >= 5"
          icon
          color="red large-btn"
          @click="onConfirm_b"
          :disabled="disabled[2]"
        >
          <v-icon x-large>mdi-lightbulb</v-icon>
        </v-btn>
        <v-btn
          v-if="count >= 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_c"
          :disabled="disabled[3]"
        >
          <v-icon x-large>mdi-lightbulb</v-icon>
        </v-btn>
        <v-btn
          v-if="count >= 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_d"
          :disabled="disabled[4]"
        >
          <v-icon x-large>mdi-lightbulb</v-icon>
        </v-btn>
        <v-btn
          v-if="count >= 5"
          icon
          x-large
          color="red large-btn"
          @click="onConfirm_e"
          :disabled="disabled[5]"
        >
          <v-icon>mdi-lightbulb</v-icon>
        </v-btn>
      </v-row>

      <div
        v-if="count == 10"
        class="d-flex justify-center countCircle ma-auto pa-auto"
      >
        <span>{{ countdown }}</span>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "StartChouQian",
  components: {},

  data: () => ({
    countdown: "",
    timer: null,
    disabled: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false
    },
    customersList: [],
    labelslist: [],
    objectItem: {},
    stringItem: "",
    dialog: false,
    count: 0
  }),
  mounted() {
    this.countdown = this.$parent.countdown;
  },
  methods: {
    addCount() {
      this.count = this.count + 1;
      if (this.count == 5) {
        this.disabled[1] = false;
        this.disabled[2] = false;
        this.disabled[3] = false;
        this.disabled[4] = false;
        this.disabled[5] = false;
        this.$parent.sliceLabels();
        this.$parent.myOption.step = 30;
      } else if (this.count == 10) {
        this.timerStart();
      }
    },

    onConfirm_a() {
      this.disabled[1] = true;
      this.addCount();
    },

    onConfirm_b() {
      this.disabled[2] = true;
      this.addCount();
    },

    onConfirm_c() {
      this.disabled[3] = true;
      this.addCount();
    },

    onConfirm_d() {
      this.disabled[4] = true;
      this.addCount();
    },

    onConfirm_e() {
      this.disabled[5] = true;
      this.addCount();
    },

    cancelAddDialog() {
      this.dialog = false;
      this.temp = {};
    },

    timerStart() {
      this.loading(); //启动定时器
      this.timer = setInterval(() => {
        //创建定时器
        if (this.countdown === 0) {
          // this.$router.push({
          //   name: "抽签房源"
          // });
          this.$router.push({
            name: "抽签房源"
          });
          this.clearTimer(); //关闭定时器
          // this.skipStep();
        } else {
          this.loading();
        }
      }, 1000);
    },

    loading() {
      //启动定时器
      this.countdown--; //定时器减1
    },
    clearTimer() {
      //清除定时器
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.v-btn--active .v-btn__content {
  color: red !important;
}

.large-btn {
  width: 50px !important;
}

.countCircle {
  font-size: 240px;
  // padding: 180px 200px 200px 660px;
  color: rgb(204, 99, 38);
}
</style>
