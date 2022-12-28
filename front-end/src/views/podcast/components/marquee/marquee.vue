<template>
  <section class="marquee-wrap">
    <div class="marquee" ref="marquee" :style="{ animationDuration: duration }">
      <span class="text-item" v-for="(item, index) of data" :key="index">
        <i class="mdi mdi-bell-ring-outline ring"></i>
        {{ item.text }}
        {{
          $moment(item.create_at)
            .utc()
            .format("YYYY-MM-DD HH:mm")
        }}
      </span>

      <!-- <span
        class="text-item"
        v-for="(item, index) of data"
        :key="`copy-${index}`"
        >{{ item }}</span
      > -->
    </div>
  </section>
</template>

<script>
export default {
  name: "marquee",
  props: {
    /* 跑马灯数据 */
    data: {
      type: Array,
      default: () => []
    },
    /* 跑马灯速度，数值越大速度越快 */
    speed: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      duration: 0
    };
  },
  mounted() {
    /* 跑马灯速度，使用跑马灯内容宽度 除以 速度 得到完整跑完一半内容的时间 */
    this.duration = '30s'
      // ~~this.$refs.marquee.getBoundingClientRect().width / this.speed + "s";
    console.log(' marquee this.duration: ', this.duration)
  },

};
</script>

<style lang="less" scoped>
// 自行使用 px2rem，这部分不讲述

.marquee-wrap {
  position: relative;
  overflow: hidden;
  &:after {
    content: "0";
    opacity: 0;
  }
}

.marquee {
  position: absolute;
  font-size: 0;
  color: rgb(248, 124, 74);
  white-space: nowrap;
  animation-name: marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.text-item {
  margin-left: 600px;
  margin-right: 24px;
  
  font-size: 24px;
  /* 解决Font Boosting */
  -webkit-text-size-adjust: none;
  // max-height: 999px; //如果上面的依然未解决问题就加上这句吧
}

.ring {
  color: rgb(248, 124, 74);
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
