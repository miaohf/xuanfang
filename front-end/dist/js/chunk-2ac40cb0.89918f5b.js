(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2ac40cb0"],{"01c4":function(t,e,s){},"8ff2d":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{attrs:{fluid:"",tag:"section"}},[s("v-card",{staticClass:"my-0"},[s("v-btn",{staticClass:"mt-6 mb-0",attrs:{tile:"",text:"",large:""},on:{click:t.goBack}},[s("v-icon",{attrs:{left:""},domProps:{textContent:t._s(t.icons["left"])}}),t._v(" 返回 ")],1),s("v-card",{staticClass:"mx-auto",attrs:{"max-width":"1500"}},[s("v-img",{attrs:{src:"http://xuanfang.tuozhanad.com/img/addition/mychoice.jpg","aspect-ratio":16/3}}),s("v-card-text",[s("v-chip",{staticClass:"mr-2",attrs:{color:"blue","text-color":"white"}},[s("h2",[t._v(t._s(t.details.garden_name)+" "+t._s(t.details.area1)+"m² 户型")])]),s("v-chip",{staticClass:"mr-2",attrs:{color:"grey","text-color":"white"}},[s("h3",[t._v(t._s(t.details.deliver_type))])]),s("v-chip",{staticClass:"mr-2",attrs:{color:"grey","text-color":"white"}},[s("h3",[t._v("面积："+t._s(t.details.area1)+" 平米")])]),s("v-chip",{staticClass:"mr-2",attrs:{color:"grey","text-color":"white"}},[s("h3",[t._v("共计 "+t._s(t.details.houses_count)+" 套, 选择人数 "+t._s(t.details.customers_count)+"，共选取 "+t._s(t.details.choices_count)+" 套 ")])])],1)],1),s("v-card-text",[s("v-simple-table",{staticClass:"mx-3",attrs:{"fixed-header":""},scopedSlots:t._u([{key:"default",fn:function(){return[s("thead",[s("tr",[s("th",{staticClass:"grey--text",staticStyle:{"font-size":"12px"}},[t._v(" id ")]),s("th",{staticClass:"text-left"},[t._v(" 户主号码 ")]),s("th",{staticClass:"text-left"},[t._v(" 户主姓名 ")]),s("th",{staticClass:"text-left"},[t._v(" 提交时间 ")])])]),s("tbody",t._l(t.choices,(function(e,a){return s("tr",{key:e.id},[s("td",[t._v(t._s(a+1))]),s("td",[s("v-chip",{attrs:{color:"info","text-color":"white"}},[s("h3",[t._v(t._s(e.customer_code))])])],1),s("td",[s("v-chip",{attrs:{color:"green","text-color":"white"}},[s("h3",[t._v(t._s(e.customer_short))])])],1),s("td",{staticClass:"display-1 mb-0 pb-2 pt-0 font-weight-light grey--text",staticStyle:{"font-size":"12px"}},[t._v(" "+t._s(t.$moment(e.create_at).utc().format("YYYY年MM月DD日 HH:mm:ss"))+" ")])])})),0)]},proxy:!0}])})],1)],1)],1)},i=[],c=(s("4160"),s("caad"),s("2532"),s("159b"),s("b775"));function o(t){return Object(c["a"])({url:"/houseitems/".concat(t),method:"get"})}var r={name:"Houseitem Details",components:{},filters:{statusFilter:function(t){var e={published:"success",draft:"info",deleted:"danger"};return e[t]}},data:function(){return{icons:{left:"mdi-chevron-left",right:"mdi-chevron-right"},details:null,rules:{}}},computed:{isAdminRole:function(){return!!this.$store.getters.roles.includes("admin")}},created:function(){this.getHouseitem(this.$route.params.id)},methods:{goBack:function(){this.$router.go(-1)},getHouseitem:function(t){var e=this;this.listLoading=!0,o(t).then((function(t){e.details=t.data,e.choices=t.data.choices.sort((function(t,e){return t.customer_id>e.customer_id?1:-1})),setTimeout((function(){e.listLoading=!1}),1500)}))},getNamefromOptions:function(t,e){var s="";return t.forEach((function(t){t.key===e&&(s=t.display_name)})),s},getSortClass:function(t){var e=this.listQuery.sort;return e==="+".concat(t)?"ascending":"descending"}}},n=r,l=(s("a086"),s("2877")),d=s("6544"),u=s.n(d),h=s("8336"),m=s("b0af"),f=s("99d9"),_=s("cc20"),v=s("a523"),p=s("132d"),g=s("adda"),x=s("1f4f"),C=Object(l["a"])(n,a,i,!1,null,"5a85b76e",null);e["default"]=C.exports;u()(C,{VBtn:h["a"],VCard:m["a"],VCardText:f["d"],VChip:_["a"],VContainer:v["a"],VIcon:p["a"],VImg:g["a"],VSimpleTable:x["a"]})},a086:function(t,e,s){"use strict";var a=s("01c4"),i=s.n(a);i.a}}]);
//# sourceMappingURL=chunk-2ac40cb0.89918f5b.js.map