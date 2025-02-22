<template>
  <div id="settings-wrapper">
    <v-card
      id="settings"
      class="py-2 px-4"
      color="rgba(0, 0, 0, .3)"
      dark
      flat
      link
      min-width="100"
      style="position: fixed; top: 115px; right: -35px; border-radius: 8px;"
    >
      <v-icon large>
        mdi-settings
      </v-icon>
    </v-card>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="#settings"
      bottom
      content-class="v-settings"
      left
      nudge-left="8"
      offset-x
      origin="top right"
      transition="scale-transition"
    >
      <v-card
        class="text-center mb-0"
        width="300"
      >
        <v-card-text>
          <strong class="mb-3 d-inline-block">侧边栏选中项颜色</strong>

          <v-item-group v-model="color">
            <v-item
              v-for="color in colors"
              :key="color"
              :value="color"
            >
              <template v-slot="{ active, toggle }">
                <v-avatar
                  :class="active && 'v-settings__item--active'"
                  :color="color"
                  class="v-settings__item"
                  size="25"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>

          <v-divider class="my-4 secondary" />

          <strong class="mb-3 d-inline-block">侧边栏蒙板</strong>

          <v-item-group v-model="scrim">
            <v-item
              v-for="scrim in scrims"
              :key="scrim"
              :value="scrim"
              class="mx-1"
            >
              <template v-slot="{ active, toggle }">
                <v-avatar
                  :class="active && 'v-settings__item--active'"
                  :color="scrim"
                  class="v-settings__item"
                  size="24"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>

          <v-divider class="my-4 secondary" />

          <v-row
            align="center"
            no-gutters
          >
            <v-col cols="auto">
              暗黑模式
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch
                v-model="$vuetify.theme.dark"
                class="ma-0 pa-0"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />

          <v-row
            align="center"
            no-gutters
          >
            <v-col cols="auto">
              侧边栏最小化
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch
                v-model="internalValue"
                class="ma-0 pa-0"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />

          <v-row
            align="center"
            no-gutters
          >
            <v-col cols="auto">
              Sidebar Image
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch
                v-model="showImg"
                class="ma-0 pa-0"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />

          <strong class="mb-3 d-inline-block">图像</strong>

          <v-item-group
            v-model="image"
            class="d-flex justify-space-between mb-3"
          >
            <v-item
              v-for="image in images"
              :key="image"
              :value="image"
              class="mx-1"
            >
              <template v-slot="{ active, toggle }">
                <v-sheet
                  :class="active && 'v-settings__item--active'"
                  class="d-inline-block v-settings__item"
                  @click="toggle"
                >
                  <v-img
                    :src="image"
                    height="100"
                    width="50"
                  />
                </v-sheet>
              </template>
            </v-item>
          </v-item-group>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  // Mixins
  import Proxyable from 'vuetify/lib/mixins/proxyable'
  import { mapMutations, mapState } from 'vuex'

  export default {
    name: 'DashboardCoreSettings',

    mixins: [Proxyable],

    data: () => ({
      color: '#E91E63',
      colors: [
        '#9C27b0',
        '#00CAE3',
        '#4CAF50',
        '#ff9800',
        '#E91E63',
        '#FF5252',
      ],
      image: 'http://mp.tuozhanad.com/img/slider.jpg',
      images: [
        'http://mp.tuozhanad.com/img/slider.jpg',
        'http://www.coloredeer.com/uploads/xitang1.jpg',
        'http://www.coloredeer.com/uploads/xitang2.jpg',
        'http://www.coloredeer.com/uploads/xitang3.jpg',
      ],
      menu: false,
      saveImage: '',
      scrim: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
      scrims: [
        'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
        'rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)'
      ],
      showImg: true,
    }),

    computed: {
      ...mapState(['barImage']),
    },

    watch: {
      color (val) {
        this.$vuetify.theme.themes[this.isDark ? 'dark' : 'light'].primary = val
      },
      showImg (val) {
        if (!val) {
          this.saveImage = this.barImage
          this.setBarImage('')
        } else if (this.saveImage) {
          this.setBarImage(this.saveImage)
          this.saveImage = ''
        } else {
          this.setBarImage(val)
        }
      },
      image (val) {
        this.setBarImage(val)
      },
      scrim (val) {
        this.$store.commit('SET_SCRIM', val)
      },
    },

    methods: {
      ...mapMutations({
        setBarImage: 'SET_BAR_IMAGE',
      }),
    },
  }
</script>

<style lang="sass">
  .v-settings
    .v-item-group > *
      cursor: pointer

    &__item
      border-width: 3px
      border-style: solid
      border-color: transparent !important

      &--active
        border-color: #00cae3 !important
</style>
