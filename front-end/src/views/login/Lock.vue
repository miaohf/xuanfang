<template>
  <v-container
    id="lock"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <v-slide-y-transition appear>
        <v-card
          class="mt-6 mt-md-0"
          light
          max-width="100%"
          width="250"
        >
          <v-card-text class="text-center">
            <v-avatar
              class="mt-n12 mb-6 elevation-12"
              color="grey"
              size="88"
            >
              <v-img src="http://xuanfang.tuozhanad.com/img/addition/logo.jpg" />
            </v-avatar>

            <div class="display-2 font-weight-light mb-3 text--darken-2 grey--text">
              秋天的树
            </div>

            <v-text-field
              class="mb-8"
              color="secondary"
              label="Enter Password"
            />

            <pages-btn>
              解锁
            </pages-btn>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PagesLock',

    components: {
      PagesBtn: () => import('./components/Btn'),
    },
  }
</script>
