(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1786edff"],{"21bf":function(t,e,i){},"79db":function(t,e,i){"use strict";var a=i("21bf"),n=i.n(a);n.a},"92f2":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-container",{staticClass:"px-8 py-0",attrs:{fluid:""},scopedSlots:t._u([{key:"after-heading",fn:function(){},proxy:!0}])},[i("v-row",{staticClass:"d-flex justify-space-between mx-1 mb-0"},[i("div",[i("v-row",[i("v-switch",{staticClass:"mx-3",staticStyle:{"max-width":"100px"},attrs:{label:"倒序"},model:{value:t.listQuery.orderby_id_desc,callback:function(e){t.$set(t.listQuery,"orderby_id_desc",e)},expression:"listQuery.orderby_id_desc"}}),i("v-select",{staticClass:"mx-3",staticStyle:{"max-width":"80px"},attrs:{items:t.villagesOptions,"item-text":"display_name","item-value":"key","menu-props":"auto","hide-details":"",label:"所在村","single-line":""},model:{value:t.listQuery.village_id,callback:function(e){t.$set(t.listQuery,"village_id",e)},expression:"listQuery.village_id"}}),i("v-select",{staticClass:"mx-3",staticStyle:{"max-width":"80px"},attrs:{items:t.batchCodeOptions,"item-text":"display_name","item-value":"key","menu-props":"auto","hide-details":"",label:"场次","single-line":""},model:{value:t.listQuery.batch_code,callback:function(e){t.$set(t.listQuery,"batch_code",e)},expression:"listQuery.batch_code"}}),i("v-text-field",{staticClass:"mx-3",staticStyle:{"max-width":"120px"},attrs:{label:"姓名","hide-details":"","single-line":""},model:{value:t.listQuery.keyword,callback:function(e){t.$set(t.listQuery,"keyword",e)},expression:"listQuery.keyword"}})],1)],1),i("div",[i("v-row",{staticClass:"mt-2"},[i("v-btn",{staticClass:"mx-3",attrs:{color:"primary"},on:{click:t.getQuery}},[t._v(" 查询 "),i("v-icon",{attrs:{right:""}},[t._v("mdi-magnify")])],1),i("v-btn",{staticClass:"mx-3",attrs:{color:"primary"},on:{click:t.resetQuery}},[t._v(" 重置 "),i("v-icon",{attrs:{right:""}},[t._v("mdi-lock-reset")])],1),i("export-excel",{attrs:{fields:t.exportFields,worksheet:"签约数据",name:"九色鹿抽签签约数据.xls",fetch:t.getListforExport}},[i("v-btn",{staticClass:"mx-3",attrs:{color:"primary"}},[t._v(" 导出 "),i("v-icon",{attrs:{right:""}},[t._v("mdi-arrow-down-bold-circle-outline")])],1)],1),t.isAdminRole?i("div",[i("AddContractDialog")],1):t._e(),t.isAdminRole?i("div",[i("AddScanContractDialogSingle")],1):t._e(),t.isAdminRole?i("div",[i("AddScanContractDialogBatch")],1):t._e()],1)],1)]),i("v-simple-table",{staticClass:"pa-3",attrs:{"fixed-header":""},scopedSlots:t._u([{key:"default",fn:function(){return[i("thead",[i("tr",[i("th",[t._v("ID")]),i("th",[t._v("户主编号")]),i("th",[t._v("签约单编号")]),i("th",[t._v("所在村")]),i("th",{staticClass:"text-right"},[t._v("姓名")]),i("th",[t._v("场次")]),i("th",[t._v("详细资料")]),i("th",[t._v("创建时间")]),i("th")])]),i("tbody",t._l(t.items,(function(e){return i("tr",{key:e.id},[i("td",{staticClass:"font-weight-light grey--text text-left",staticStyle:{"font-size":"11px"}},[t._v(" "+t._s(e.id)+" ")]),i("td",{staticClass:"text-left"},[t._v(" "+t._s(e.customer_code)+" ")]),i("td",{staticClass:"text-left"},[t._v(" "+t._s(e.sequence)+" ")]),i("td",{staticClass:"text-left"},[t._v(" "+t._s(e.village)+" ")]),i("td",{staticClass:"text-right"},[i("v-btn",{attrs:{color:"warning",icon:""},on:{click:function(i){return t.handlePrintByCustomer(e.customer_id)}}},[i("v-icon",{attrs:{small:"",icon:"",right:""}},[t._v("mdi-printer")])],1),t._v(" "+t._s(e.customer)+" ")],1),i("td",{staticClass:"text-left"},[t._v(" "+t._s(e.batch_code)+" ")]),i("td",[i("v-simple-table",{staticClass:"background-transparent",attrs:{dense:""},scopedSlots:t._u([{key:"default",fn:function(){return[i("tbody",t._l(e.houses,(function(e,a){return i("tr",{key:a},[i("td",{staticClass:"text-left",attrs:{width:"180"}},[t._v(t._s(e.garden))]),i("td",{staticClass:"text-right",attrs:{width:"90"}},[t._v(" "+t._s(e.building)+"幢 ")]),i("td",{staticClass:"text-right",attrs:{width:"90"}},[t._v(t._s(e.unit)+"单元")]),i("td",{staticClass:"text-right",attrs:{width:"90"}},[t._v(t._s(e.number)+"室")]),i("td",{staticClass:"text-right",attrs:{width:"90"}},[t._v(" "+t._s(e.house_type)+" ")]),i("td",{staticClass:"text-right",attrs:{width:"90"}},[t._v(t._s(e.area)+"㎡")])])})),0)]},proxy:!0}],null,!0)})],1),i("td",{staticClass:"text-left"},[t._v(" "+t._s(t.$moment(e.create_at).utc().format("MM-DD HH:mm:ss"))+" ")]),i("td",[i("v-btn",{attrs:{color:t.printer.single.color,icon:"",fab:"","x-small":""},on:{click:function(i){return t.handlePrint(e)}}},[i("v-icon",{domProps:{textContent:t._s(t.printer.single.icon)}})],1),e.audio_uri?i("v-btn",{attrs:{icon:"",fab:"",href:"https://taozhuang.tuozhanad.com"+e.audio_uri,target:"https://taozhuang.tuozhanad.com"+e.audio_uri,"x-small":"",color:"green"}},[i("v-icon",[t._v("mdi-library-music")])],1):t._e(),t.isAdminRole?i("v-btn",{attrs:{color:"warning",icon:"",fab:"","x-small":""},on:{click:function(i){return t.removeContract(e)}}},[i("v-icon",[t._v("mdi-delete")])],1):t._e()],1)])})),0)]},proxy:!0}])}),i("v-pagination",{staticClass:"my-3",attrs:{circle:t.circle,disabled:t.disabled,length:t.total_pages,"next-icon":t.nextIcon,"prev-icon":t.prevIcon,"total-visible":t.totalVisible,value:t.listQuery.page},on:{input:t.paginationChangeHandler},model:{value:t.listQuery.page,callback:function(e){t.$set(t.listQuery,"page",e)},expression:"listQuery.page"}}),i("v-snackbar",{attrs:{timeout:t.timeout},model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.text)+" ")])],1)},n=[],s=(i("caad"),i("d3b7"),i("2532"),i("f8fe")),r=[{key:"01",display_name:"01"},{key:"02",display_name:"02"},{key:"03",display_name:"03"}],o=[{key:1,display_name:"缪家村"},{key:2,display_name:"曹家村"},{key:3,display_name:"东云村"},{key:4,display_name:"江家村"},{key:5,display_name:"大云村"}],c={name:"Contracts",components:{AddContractDialog:function(){return Promise.all([i.e("chunk-2d20f6a7"),i.e("chunk-23431a8c")]).then(i.bind(null,"26b6"))},AddScanContractDialogSingle:function(){return i.e("chunk-2032fc3c").then(i.bind(null,"8ba9"))},AddScanContractDialogBatch:function(){return i.e("chunk-a684652e").then(i.bind(null,"3cd7"))}},data:function(){return{snackbar:!1,text:"",timeout:3e3,panel:[0,1],printer:{single:{color:"blue",icon:"mdi-printer"},batch:{color:"secondary",icon:"mdi-printer"},pay:{color:"green",icon:"mdi-cash-usd"}},exportItems:[],items:[],listQuery:{page:1,limit:12,keyword:void 0,activity:void 0,batch_code:void 0,sort:"+id",orderby_id_desc:void 0},search:"",awaitingSearch:!1,circle:!0,disabled:!1,length:10,nextIcon:"mdi-chevron-right",prevIcon:"mdi-chevron-left",totalVisible:10,total_pages:0,exportFields:{"确认书序号":"sequence","户主姓名":"customer","联系方式":"phone","所在村":"village","身份证号":{field:"cardid",callback:function(t){return"'".concat(t)}},"受托人":"sub_name","抽签序号":"customer_lottery_sequence","小区":{field:"houses",callback:function(t){var e=t[0];if(e)return e.garden}},"楼幢":{field:"houses",callback:function(t){var e=t[0];if(e)return"'".concat(e.building)}},"单元":{field:"houses",callback:function(t){var e=t[0];if(e)return e.unit}},"门牌号码A":{field:"houses",callback:function(t){var e=t[0];if(e)return e.number}},"面积A":{field:"houses",callback:function(t){var e=t[0];if(e)return e.area}},"自行车库面积A":{field:"houses",callback:function(t){var e=t[0];if(e)return e.sub_area}},"门牌号码B":{field:"houses",callback:function(t){var e=t[1];if(e)return e.number}},"面积B":{field:"houses",callback:function(t){var e=t[1];if(e)return e.area}},"自行车库面积B":{field:"houses",callback:function(t){var e=t[1];if(e)return e.sub_area}},"抽签场次":"batch_code"},greenColor:"rgb(81, 185, 116)",warningColor:"rgb(241, 211, 171)",batchCodeOptions:r,villagesOptions:o}},computed:{isAdminRole:function(){return!!this.$store.getters.roles.includes("administrator")}},created:function(){this.getList(),console.log(Date.now())},methods:{getQuery:function(){this.listQuery.page=1,this.getList()},getList:function(){var t=this;this.listLoading=!0,this.listQuery.limit=10,console.log(this),Object(s["e"])(this.listQuery).then((function(e){t.items=e.data.items,t.total_pages=e.data._meta.total_pages,console.log(t.items),setTimeout((function(){t.listLoading=!1}),1500)}))},getListforExport:function(){var t=this;return this.listLoading=!0,this.listQuery.limit=1e4,Object(s["e"])(this.listQuery).then((function(e){t.exportItems=e.data.items,setTimeout((function(){t.listLoading=!1}),1500)})),this.exportItems},resetQuery:function(){this.listQuery.keyword=void 0,this.listQuery.batch_code=void 0,this.listQuery.limit=10},handlePrint:function(t){this.$router.push({name:"打印签单",params:{id:t.id}})},handlePrintClearing:function(t){var e=this;t.isprinted?this.$router.push({name:"打印结算单",params:{id:t.id}}):this.$confirm("当前合同结算数据未生成无法打印，现在生成结算数据?").then((function(i){var a={id:t.id};i&&Object(s["f"])(t.id,a).then((function(t){t.data.error?(e.alert_text=t.data.error,e.alert=!0):(e.getList(),e.text="合同结算数据已经生成！请重新点击结算打印",e.snackbar=!0)}))}))},handlePrintByCustomer:function(t){this.$router.push({name:"客户签单",params:{id:t}})},removeContract:function(t){var e=this;this.$confirm("确认删除签约记录?").then((function(i){i&&Object(s["c"])(t.id).then((function(t){e.getList(),e.text="签约记录删除成功！",e.snackbar=!0}))}))},paginationChangeHandler:function(t){this.listQuery.page=t,this.getList()},reset:function(){this.$refs.form.reset()},resetValidation:function(){this.$refs.form.resetValidation()}}},l=c,d=(i("79db"),i("2877")),u=i("6544"),h=i.n(u),f=i("8336"),m=i("a523"),v=i("132d"),b=i("891e"),p=i("0fd9"),_=i("b974"),g=i("1f4f"),y=i("2db4"),x=i("b73d"),k=i("8654"),C=Object(d["a"])(l,a,n,!1,null,"759d3778",null);e["default"]=C.exports;h()(C,{VBtn:f["a"],VContainer:m["a"],VIcon:v["a"],VPagination:b["a"],VRow:p["a"],VSelect:_["a"],VSimpleTable:g["a"],VSnackbar:y["a"],VSwitch:x["a"],VTextField:k["a"]})},f8fe:function(t,e,i){"use strict";i.d(e,"e",(function(){return n})),i.d(e,"d",(function(){return s})),i.d(e,"a",(function(){return r})),i.d(e,"f",(function(){return o})),i.d(e,"c",(function(){return c})),i.d(e,"b",(function(){return l}));var a=i("b775");function n(t){return Object(a["a"])({url:"/contracts",method:"get",params:t})}function s(t){return Object(a["a"])({url:"/contracts/".concat(t),method:"get"})}function r(t){return Object(a["a"])({url:"/contracts",method:"post",data:t})}function o(t,e){return Object(a["a"])({url:"/contracts/".concat(t),method:"put",data:e})}function c(t){return Object(a["a"])({url:"/contracts/".concat(t),method:"delete"})}function l(t){return Object(a["a"])({url:"/contracts/scan",method:"post",data:t})}}}]);
//# sourceMappingURL=chunk-1786edff.c8dbe155.js.map