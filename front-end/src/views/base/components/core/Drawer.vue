<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    permanent
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    mini-variant-width="80"
    width="215"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-uppercase font-weight-regular display-2">
          <span class="logo-mini">{{ $t("ct") }}</span>
          <span class="logo-normal">{{ $t("tim") }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
        </base-item-group>
        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState } from "vuex";
import { fetchUsers } from "@/api/users";

import "vue-search-select/dist/VueSearchSelect.css";
// import { ModelSelect } from 'vue-search-select'

export default {
  name: "DashboardCoreDrawer",
  // components: {
  //     ModelSelect
  //   },

  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    users: [],
    cdbn: "",
    bookinstance: {},
    adminitems: [
      {
        icon: "mdi-chart-bar",
        title: "统计图示",
        to: "/"
      },
      {
        icon: "mdi-home",
        title: "房源信息",
        to: "/houses"
      },
      {
        icon: "mdi-account-box",
        title: "户主资料",
        to: "/customers"
      },

      {
        icon: "mdi-label-outline",
        title: "号签列表",
        to: "/labels"
      },


      {
        group: "/contracts",
        icon: "mdi-human-male-female",
        title: "签约管理",
        children: [
          {
            title: "扫码签约",
            to: "scan"
          },
          {
            title: "触屏选房",
            to: "touch"
          }
        ]
      },

      {
        icon: "mdi-screen-rotation",
        title: "房源分配",
        to: "/slicelabels"
      },

      {
        // icon: "mdi-leaf",
        icon: "mdi-auto-fix",
        title: "预选方案",
        to: "/choices"
      },

      // {
      //   icon: "mdi-radio",
      //   // icon: "mdi-voice",
      //   title: "语音播报",
      //   to: "/podcast"
      // },

      {
        group: "/podcast",
        icon: "mdi-radio",
        title: "语音控制",
        children: [
          {
            title: "控制叫号",
            to: "controlvoice"
          },
          {
            title: "自动叫号",
            to: "podcast"
          }
        ]
      },

      {
        group: "/daping",
        icon: "mdi-desktop-mac",
        title: "投屏控制",
        children: [
          {
            title: "抽签投屏",
            to: "qianyue"
          },
          {
            title: "选房投屏",
            to: "huimin"
          }
        ]
      },
      {
        group: "/settings",
        icon: "mdi-settings",
        title: "系统设置",
        children: [
          {
            title: "楼层级差",
            to: "feefloats"
          },
          {
            title: "用户账号",
            to: "users"
          }
        ]
      }
    ],

    recorderitems: [
      {
        icon: "mdi-account-box",
        title: "户主资料",
        to: "/customers"
      },

      {
        icon: "mdi-auto-fix",
        title: "预选方案",
        to: "/choices"
      }
    ],

    normalitems: [
      {
        icon: "mdi-account-box",
        title: "户主资料",
        to: "/customers"
      }
    ]
  }),

  mounted() {
    // if (this.loginForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
    // this.$refs.scanField.focus()
  },

  computed: {
    ...mapState(["barColor", "barImage"]),
    // login_name() {
    //   return this.$store.state.name
    // },
    drawer: {
      get() {
        // console.log("this.$store.state.drawer:", this.$store.state.drawer);
        return this.$store.state.drawer;
      },
      set(val) {
        console.log(val);
        this.$store.commit("SET_DRAWER", val);
      }
    },

    // isAdminRole() {
    //   if (this.$store.getters.roles.includes("administrator")) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },

    computedItems() {
      if (this.isAdminRole()) {
        console.log("isAdminRole");
        return this.adminitems.map(this.mapItem);
      } else if (this.isRecorderRole()) {
        return this.recorderitems.map(this.mapItem);
      } else {
        return this.normalitems.map(this.mapItem);
      }
    },

    profile() {
      return {
        avatar: true,
        group: "",
        title: this.$store.getters.name,
        children: [
          // {
          //   href: "",
          //   title: this.$t("my-profile")
          // }
          // {
          //   to: "",
          //   title: this.$t("edit-profile")
          // },
          // {
          //   to: "",
          //   title: this.$t("settings")
          // }
        ]
      };
    }
  },

  watch: {
    "$vuetify.breakpoint.smAndDown"(val) {
      this.$emit("update:expandOnHover", !val);
    }
  },

  methods: {
    isAdminRole() {
      if (this.$store.getters.roles.includes("administrator")) {
        return true;
      } else {
        return false;
      }
    },

    isRecorderRole() {
      if (this.$store.getters.roles.includes("recorder")) {
        return true;
      } else {
        return false;
      }
    },

    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title)
      };
    },
    getUsers() {
      fetchUsers().then(response => {
        this.users = response.data.items;
      });
    }
  }
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

    .v-list-group--sub-group
      display: block !important

  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
