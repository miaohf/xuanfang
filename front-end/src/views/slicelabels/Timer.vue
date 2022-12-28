<template>
  <v-container fluid class="ma-0 px-6 py-3">
    <template v-slot:after-heading> </template>
    <v-card class="ma-auto pa-auto" style="width:1900px;height:800px">
      <div class="countCircle">
        <span>{{ countdown }}</span>
      </div>
    </v-card>
  </v-container>
</template>

<script>
// import { defineComponent } from "@vue/composition-api";

export default {
  data: () => ({
    countdown: "6",
    timer: null,
    temp: {
      population: 0
    }
  }),
  created() {
    this.timerStart();
    this.temp.population = this.$route.params.population;
  },
  methods: {
    //倒计时
    timerStart() {
      this.loading(); //启动定时器
      this.timer = setInterval(() => {
        //创建定时器
        if (this.countdown === 0) {
          this.$router.push({
            name: "抽签房源",
            params: { population: this.temp.population }
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
.countCircle {
  font-size: 360px;
  padding: 180px 200px 200px 660px;
  color:rgb(204, 99, 38)
}</style
>>
