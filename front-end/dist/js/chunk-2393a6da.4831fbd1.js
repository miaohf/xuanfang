(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2393a6da"],{"1efd":function(t,e,s){},"812e":function(t,e,s){"use strict";var a=s("1efd"),i=s.n(a);i.a},d50d:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{attrs:{fluid:"",tag:"section"}},[s("v-divider",{staticClass:"mt-3"}),s("v-simple-table",{staticClass:"statistics",scopedSlots:t._u([{key:"default",fn:function(){return[s("thead",[s("tr",[s("th",{staticClass:"text-left grey--text"},[t._v("序号")]),s("th",{staticClass:"text-right grey--text"},[t._v("小区 | 地块")]),s("th",{staticClass:"text-right grey--text"},[t._v("面积1")]),s("th",{staticClass:"text-left grey--text"},[t._v("门牌号码")]),s("th",{staticClass:"text-left grey--text"},[t._v("户型")]),s("th",{staticClass:"text-left grey--text"},[t._v("状态")]),s("th")])]),s("tbody",t._l(t.items,(function(e,a){return s("tr",{key:e.id},[s("td",{staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(a+1)+"."+t._s(e.id)+" ")]),s("td",{staticClass:"text-right",staticStyle:{"font-size":"15px"}},[t._v(" "+t._s(e.garden)+" ")]),s("td",{staticClass:"text-right",staticStyle:{"font-size":"15px"}},[t._v(" "+t._s(e.area1)+" ")]),s("td",{staticStyle:{"font-size":"15px"}},[t._v(" "+t._s(e.house)+" ")]),s("td",{staticStyle:{"font-size":"15px"}},[t._v(" "+t._s(e.house_type)+" ")]),s("td",{style:{color:1==e.status?t.greenColor:t.redColor,"font-size":"14px"}},[t._v(" "+t._s(t.getNamefromOptions(t.statusOptions,e.status))+" ")])])})),0)]},proxy:!0}])})],1)},i=[],n=(s("4160"),s("159b"),s("f2cf")),o=[{key:1,display_name:"空闲"},{key:2,display_name:"已选"},{key:3,display_name:"剔除"}],r=[{key:1,display_name:"小户型"},{key:2,display_name:"中户型"},{key:3,display_name:"大户型"}],c={name:"Houses",components:{},data:function(){return{snackbar:!1,text:"",timeout:3e3,action:{color:"info",icon:"mdi-message-text"},items:[],listQuery:{page:1,limit:1e3,garden_id:1,sort:"+id"},circle:!0,disabled:!1,length:10,greenColor:"#1fd647",redColor:"#ff4d4d",total_pages:0,statusOptions:o,houseTypeOptions:r}},computed:{},created:function(){this.getList()},watch:{},methods:{getList:function(){var t=this;this.listLoading=!0;var e={page:1,limit:360,sort:"+id",garden_id:this.$route.params.garden_id};Object(n["c"])(e).then((function(e){t.items=e.data.items,t.total_pages=e.data._meta.total_pages,setTimeout((function(){t.listLoading=!1}),3e3)}))},getNamefromOptions:function(t,e){var s="";return t.forEach((function(t){t.key===e&&(s=t.display_name)})),s},reset:function(){this.$refs.form.reset()},resetValidation:function(){this.$refs.form.resetValidation()}}},u=c,d=(s("812e"),s("2877")),l=s("6544"),f=s.n(l),p=s("a523"),m=s("ce7e"),_=s("1f4f"),h=Object(d["a"])(u,a,i,!1,null,"f28463ac",null);e["default"]=h.exports;f()(h,{VContainer:p["a"],VDivider:m["a"],VSimpleTable:_["a"]})},f2cf:function(t,e,s){"use strict";s.d(e,"c",(function(){return i})),s.d(e,"a",(function(){return n})),s.d(e,"b",(function(){return o})),s.d(e,"d",(function(){return r}));var a=s("b775");function i(t){return Object(a["a"])({url:"/houses",method:"get",params:t})}function n(t){return Object(a["a"])({url:"/houses",method:"post",data:t})}function o(t){return Object(a["a"])({url:"/houses/".concat(t),method:"delete"})}function r(){return Object(a["a"])({url:"/houses/count",method:"get"})}}}]);
//# sourceMappingURL=chunk-2393a6da.4831fbd1.js.map