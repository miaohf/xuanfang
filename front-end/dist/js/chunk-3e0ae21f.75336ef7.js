(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3e0ae21f"],{"1a46":function(e,t,s){"use strict";s.d(t,"a",(function(){return a})),s.d(t,"b",(function(){return i}));var n=s("b775");function a(e){return Object(n["a"])({url:"/boxeslist",method:"get",params:e})}function i(e){return Object(n["a"])({url:"/boxeslist2",method:"post",data:e})}},2772:function(e,t,s){"use strict";s.d(t,"a",(function(){return a}));var n=s("b775");function a(){return Object(n["a"])({url:"/areaitems",method:"get"})}},"2d5d":function(e,t,s){"use strict";s.d(t,"a",(function(){return a})),s.d(t,"b",(function(){return i}));var n=s("b775");function a(e){return Object(n["a"])({url:"/choices",method:"post",data:e})}function i(e){return Object(n["a"])({url:"/choices",method:"delete",data:e})}},"392d":function(e,t,s){},9671:function(e,t,s){"use strict";s.d(t,"h",(function(){return a})),s.d(t,"e",(function(){return i})),s.d(t,"f",(function(){return o})),s.d(t,"g",(function(){return r})),s.d(t,"c",(function(){return c})),s.d(t,"k",(function(){return l})),s.d(t,"d",(function(){return u})),s.d(t,"j",(function(){return d})),s.d(t,"i",(function(){return m})),s.d(t,"a",(function(){return h})),s.d(t,"b",(function(){return _}));var n=s("b775");function a(e){return Object(n["a"])({url:"/customers",method:"get",params:e})}function i(e){return Object(n["a"])({url:"/customers/".concat(e),method:"get"})}function o(e){return Object(n["a"])({url:"/customers/code/".concat(e),method:"get"})}function r(e,t){return Object(n["a"])({url:"/customers/".concat(e,"/choices"),method:"post",data:t})}function c(e){return Object(n["a"])({url:"/customers",method:"post",data:e})}function l(e,t){return Object(n["a"])({url:"/customers/".concat(e),method:"put",data:t})}function u(e){return Object(n["a"])({url:"/customers/".concat(e),method:"delete"})}function d(){return Object(n["a"])({url:"/customerslist",method:"get"})}function m(){return Object(n["a"])({url:"/customers/count",method:"get"})}function h(e){return Object(n["a"])({url:"/customers/callnumber",method:"post",data:e})}function _(e){return Object(n["a"])({url:"/customers/callnumberbycontrol",method:"post",data:e})}},a2fc:function(e,t,s){"use strict";s.r(t);var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-container",{attrs:{fluid:""}},[s("v-snackbar",{attrs:{timeout:e.timeout},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v(" "+e._s(e.text)+" ")]),s("v-row",{staticClass:"d-flex justify-start mx-1"},[s("v-col",{attrs:{cols:"12",sm:"1",md:"1"}},[s("v-btn",{staticClass:"primary mx-3",on:{click:e.goBack}},[s("v-icon",{attrs:{left:""}},[e._v("mdi-arrow-left-bold")]),e._v(" 返回 ")],1)],1),s("v-col",{attrs:{cols:"12",sm:"1",md:"2"}},[s("v-autocomplete",{staticStyle:{"max-width":"400px"},attrs:{items:e.customersList,chips:"",clearable:"","hide-details":"","hide-selected":"","item-text":"name","item-value":"id",label:"选择户主",solo:""},on:{change:e.getCustomer},scopedSlots:e._u([{key:"no-data",fn:function(){return[s("v-list-item",[s("v-list-item-title",[e._v(" 等待加载数据中 "),s("strong",[e._v("九色鹿网络")])])],1)]},proxy:!0},{key:"selection",fn:function(t){var n=t.attr,a=t.on,i=t.item,o=t.selected;return[s("v-chip",e._g(e._b({staticClass:"white--text",attrs:{"input-value":o,color:"blue-grey"}},"v-chip",n,!1),a),[s("span",{domProps:{textContent:e._s(i.name)}})])]}},{key:"item",fn:function(t){var n=t.item;return[s("v-list-item-content",[s("v-list-item-title",{domProps:{textContent:e._s(n.name)}}),s("v-list-item-subtitle",{domProps:{textContent:e._s(n.symbol)}})],1)]}}]),model:{value:e.temp.customer_id,callback:function(t){e.$set(e.temp,"customer_id",t)},expression:"temp.customer_id"}})],1),s("v-col",{attrs:{cols:"12",sm:"1",md:"2"}},[s("v-checkbox",{attrs:{label:"必须用完全部面积"},model:{value:e.mustExhaustMyArea,callback:function(t){e.mustExhaustMyArea=t},expression:"mustExhaustMyArea"}})],1),s("v-col",{attrs:{cols:"12",sm:"1",md:"7"}},[s("v-text-field",{staticClass:"ml-auto",staticStyle:{"max-width":"300px"},attrs:{autofocus:"","append-icon":"mdi-barcode",label:"扫码输入","hide-details":"","single-line":""},on:{input:e.handleScan},model:{value:e.scan.value,callback:function(t){e.$set(e.scan,"value",t)},expression:"scan.value"}})],1)],1),s("v-card",{staticClass:"ma-3 pa-6"},[e.customer.id?s("div",{staticClass:"ml-6"},[s("div",{staticClass:"print-magin",attrs:{id:"printMe"}},[s("h1",{staticClass:"ma-3 printstyle-h1"},[e._v(" "+e._s(e.customer.name)+" ")]),s("div",[s("span",{staticClass:"ma-3 printstyle"},[e._v(" 抽签顺序号： "),s("span",{staticClass:"ma-3 printstyle-h2"},[e._v(e._s(e.customer.lottery_sequence)+"，")])]),s("span",{staticClass:"ma-3 printstyle"},[s("span",{staticClass:"noprint"},[e._v("所在村：")]),e._v(" "+e._s(e.customer.village)+"，")]),s("span",{staticClass:"ma-3 printstyle noprint"},[e._v("电话："+e._s(e.customer.phone)+"，")]),s("span",{staticClass:"ma-3 printstyle"},[e._v("总面积： "),s("span",{staticClass:"ma-3 printstyle-h2"},[e._v(" "+e._s(e.customer.myarea)+" m²")]),e._v("， ")]),s("span",{staticClass:"ma-3 printstyle noprint"},[e._v(" 面积差："+e._s((e.customer.myarea_choice_remain-e.area_selected).toFixed(2))+" m² ")])]),s("br"),e._l(e.customer.choices_selected,(function(t,n){return s("div",{key:n,staticClass:"ma-3"},[s("span",{staticClass:"choice_font"},[e._v(" "+e._s(n+1)+"： "+e._s(t.box_name)+" ")]),s("span",{staticClass:"ml-2 mr-6 choice_font"},[e._v(" "+e._s(t.garden_name)+" "),e._l(t.labelareas,(function(t,n){return s("span",{key:n},[e._v(" "+e._s(t.area.toFixed(2))+"m² ")])}))],2)])})),s("v-row",{staticClass:"ma-3 d-flex justify-space-between "},[e._l(e.temp.labelitems,(function(t,n){return s("div",{key:n},[s("v-btn",{class:"choice_background-"+t.garden_id+" box-shadow-"+t.deliver_type+" noprint",on:{click:function(s){return e.removeLabelitem(t)}}},[e._v(" "+e._s(t.box_name)+" ")]),s("span",{staticClass:"ml-2 mr-6",staticStyle:{color:"grey","font-weight":"400"}},[e._v(" "+e._s(t.garden_name)+" "),e._l(t.labelareas,(function(t,n){return s("span",{key:n},[e._v(" "+e._s(t.area.toFixed(2))+"m² ")])}))],2)],1)})),s("v-spacer"),e.temp.labelitems.length>0&&(e.customer.myarea_choice_remain-e.area_selected<20||!e.mustExhaustMyArea)?s("v-btn",{staticClass:"info mr-3",on:{click:function(t){return e.addCustomerChoices()}}},[s("v-icon",{attrs:{left:"",small:""}},[e._v(" mdi-check")]),e._v("提交 ")],1):e._e(),0==e.customer.choices_selected.length?s("v-btn",{staticClass:"warning mr-3",on:{click:e.reset}},[s("v-icon",{attrs:{left:"",small:""}},[e._v("mdi-restart")]),e._v("重置 ")],1):e._e(),e.customer.choices_selected.length>0?s("v-btn",{directives:[{name:"print",rawName:"v-print",value:e.printObj,expression:"printObj"}],staticClass:"info mr-3 noprint"},[s("v-icon",{attrs:{left:"",small:""}},[e._v("mdi-printer")]),e._v("打印 ")],1):e._e(),e.customer.choices_selected.length>0?s("v-btn",{staticClass:"warning noprint",on:{click:e.deleteCustomerChoices}},[s("v-icon",{attrs:{left:"",small:""}},[e._v("mdi-delete")]),e._v("删除 ")],1):e._e()],2)],2),s("v-divider",{staticClass:"my-6"})],1):e._e(),0==e.customer.choices_selected.length?s("v-row",{staticClass:"my-6"},[s("v-label",[s("v-chip",{staticClass:"mx-8 mt-1",attrs:{label:"",color:e.color,"text-color":"white"}},[s("h3",[e._v(" 多选小区 ")])])],1),e._l(e.gardens[0],(function(t,n){return s("v-checkbox",{key:n,class:"background-"+e.get_garden_disabled(t)+"-"+t.id+" ml-3 mr-3 my-0",attrs:{multiple:"",value:t.id,label:t.name,"hide-details":"",disabled:e.get_garden_disabled(t)},on:{change:function(s){return e.onGardenChanged(t)}},model:{value:e.checkbox_gardens,callback:function(t){e.checkbox_gardens=t},expression:"checkbox_gardens"}})}))],2):e._e(),0==e.customer.choices_selected.length?s("v-row",[s("v-label",[s("v-chip",{staticClass:"mx-8 mt-1",attrs:{label:"",color:e.color,"text-color":"white"}},[s("h3",[e._v(" 互斥小区 ")])])],1),s("v-radio-group",{staticClass:"my-0",attrs:{row:""},model:{value:e.radio_garden,callback:function(t){e.radio_garden=t},expression:"radio_garden"}},e._l(e.gardens[1],(function(t,n){return s("v-radio",{key:n,class:"background-"+e.get_garden_disabled()+"-"+t.id+" ml-3 mr-3 my-0",attrs:{value:t.id,label:t.name,disabled:e.get_garden_disabled()},on:{change:function(t){return e.onGardenChanged()}}})})),1)],1):e._e(),0==e.customer.choices_selected.length?s("v-row",{staticClass:"d-flex justify-start mx-2 mb-6 "},e._l(e.boxes,(function(t,n){return s("div",{key:n},e._l(t,(function(t,n){return s("v-badge",{key:n,staticClass:"mx-3",attrs:{bordered:"",overlap:"",color:e.get_box_disabled(t)?e.greyColor:e.greenColor,content:t.free_choice_count-e.get_choice_count(t.id),"offset-x":"12","offset-y":"18"}},[s("v-btn",{class:"get_box_disabled(b) ? greyColor : box-"+e.get_box_disabled(t)+"-"+t.garden_id+" box-outlined-"+t.deliver_type+" my-1",attrs:{disabled:e.get_box_disabled(t),outlined:""},on:{click:function(s){return e.onBoxClick(t)}}},[e._v(" "+e._s(t.name+",")+" "),e._l(t.labelareas,(function(t,n){return s("span",{key:n},[s("span",0==n?[e._v(" "+e._s(t.area)+" ")]:[e._v(e._s("+"+t.area)+" ")])])})),e._v("㎡ ")],2)],1)})),1)})),0):e._e()],1)],1)},a=[],i=(s("99af"),s("4de4"),s("7db0"),s("4160"),s("caad"),s("b0c0"),s("a9e3"),s("2532"),s("159b"),s("9671")),o=s("1a46"),r=s("d5d5"),c=s("2d5d"),l=s("2772"),u={name:"AddChoice",components:{},filters:{statusFilter:function(e){var t={published:"success",draft:"info",deleted:"danger"};return t[e]}},data:function(){return{snackbar:!1,mustExhaustMyArea:!0,text:"",timeout:3e3,dt_now:"",action:{color:"grey",icon:"mdi-checkbox-marked"},color:"#555",icons:{left:"mdi-chevron-left",right:"mdi-chevron-right",info:"mdi-exclamation",success:"mdi-check",warning:"mdi-alert",error:"mdi-close"},greyColor:"#444",greenColor:"#338833",details:{},gardens:[],selected_gardens:[],checkbox_gardens:[],radio_garden:1e3,choice_count:{},params:{labels_quantity:1,boxes:[]},choices_selected:[],area_selected:0,scan:{value:"",type:""},maxNumberOfChoices:0,customer:{choices_selected:[]},customersList:[],boxes:{},temp:{customer_id:"",labelitems:[]},areaitems_max_area:{},printObj:{id:"printMe",popTitle:"good print",extraCss:"https://www.baidu.com",extraHead:'<meta http-equiv="Content-Language"content="zh-cn"/>'},printCertificateObj:{id:"printCertificate",popTitle:"方案列表",extraCss:"https://www.baidu.com",extraHead:'<meta http-equiv="Content-Language"content="zh-cn"/>'}}},computed:{isAdminRole:function(){return!!this.$store.getters.roles.includes("admin")}},created:function(){this.getCustomers(),this.getAreaitems(),this.getBoxesByPost(),this.getGardensList(),this.dt_now=Date.now()},methods:{goBack:function(){this.$router.go(-1)},getCustomers:function(){var e=this;Object(i["j"])().then((function(t){e.customersList=t.data.items,setTimeout((function(){e.listLoading=!1}),1500)})),console.log("customersList:",this.customersList)},get_garden_disabled:function(e){return!1},get_box_disabled:function(e){return!!(e.free_choice_count-this.get_choice_count(e.id)==0||this.customer.myarea_choice_remain-this.area_selected<20||!this.selected_gardens.includes(e.garden_id)||this.check_district_box(e))},check_district_box:function(e){var t=this,s=[1];if(s.includes(e.garden_id)){var n=this.params.boxes.find((function(s){return t.get_gardenid_from_boxid(s.id)==e.garden_id}));if(n){if(n!=e.id)return!0;console.log("check_disabled_box")}}return!1},get_gardenid_from_boxid:function(e){var t=this.boxes_allinone.find((function(t){return t.id===e})).garden_id;return t},reset:function(){this.temp.labelitems=[],this.area_selected=0,this.choice_count={},this.params.boxes=[],this.radio_garden=-1,this.checkbox_gardens=[],this.selected_gardens=[]},getAreaitems:function(){var e=this;this.listLoading=!0,Object(l["a"])().then((function(t){e.areaitems_max_area=t.data,setTimeout((function(){e.listLoading=!1}),5e3)}))},reCheck:function(){var e=this;for(var t in this.temp.labelitems=this.temp.labelitems.filter((function(t){return e.selected_gardens.includes(t.garden_id)})),this.choice_count)this.selected_gardens.includes(this.get_gardenid_from_boxid(parseInt(t)))||delete this.choice_count[t];this.getAreaSelected()},onGardenChanged:function(){var e=this;this.getBoxesByPost(),setTimeout((function(){e.selected_gardens=[],e.selected_gardens.push(e.radio_garden),e.selected_gardens=e.selected_gardens.concat(e.checkbox_gardens)}),100),setTimeout((function(){console.log("this.selected_gardens: ",e.selected_gardens),e.params.boxes=e.params.boxes.filter((function(t){return e.selected_gardens.includes(e.get_gardenid_from_boxid(t.id))})),e.reCheck(),console.log("this.params.boxes: ",e.params.boxes)}),200),setTimeout((function(){e.reCheck()}),300)},getBoxesByPost:function(){var e=this;this.listLoading=!0,this.getAreaitems();var t={gardens:this.selected_gardens};Object(o["b"])(t).then((function(t){e.boxes=t.data.items,e.boxes_allinone=t.data.allinonelist,setTimeout((function(){e.listLoading=!1}),3e3)}))},getGardensList:function(){var e=this;this.listLoading=!0,Object(r["b"])().then((function(t){e.gardens=t.data.items,setTimeout((function(){e.listLoading=!1}),5e3)}))},get_choice_count:function(e){return e in this.choice_count?this.choice_count[e]:0},getAreaSelected:function(){var e=0;for(var t in this.temp.labelitems)console.log("labelitem area: ",this.temp.labelitems[t].area),e+=this.temp.labelitems[t].area;this.area_selected=e},onBoxClick:function(e){this.params.boxes.push(e),this.temp.labelitems=this.temp.labelitems.concat(e.labelitems),console.log("this.temp.labelitems: ",this.temp.labelitems),this.getAreaSelected(),this.choice_count[e.id]=this.get_choice_count(e.id)+1,this.temp.labelitems=this.temp.labelitems.sort((function(e,t){return t.area-e.area}))},removeLabelitem:function(e){var t=this;this.temp.labelitems=this.temp.labelitems.filter((function(t){return t!==e})),this.params.boxes=this.params.boxes.filter((function(t){return t.id!==e.box_id})),delete this.choice_count[e.box_id],setTimeout((function(){t.reCheck()}),20)},addCustomerChoices:function(){var e=this;this.$confirm("确定提交预选方案?").then((function(t){t&&Object(c["a"])(e.temp).then((function(t){e.text=e.customer.name+" 的预选方案录入！",e.snackbar=!0,setTimeout((function(){e.getAreaitems(),e.getBoxesByPost(),e.reset(),e.getCustomer(e.temp.customer_id)}),1e3)}))}))},deleteCustomerChoices:function(e){var t=this;this.$confirm("确定需要删除方案?").then((function(e){e&&Object(c["b"])(t.temp).then((function(e){t.text=t.customer.name+" 预选方案已删除",t.snackbar=!0,e&&t.getBoxesByPost(),setTimeout((function(){t.reset(),t.getCustomer(t.customer.id)}),1e3)}))}))},handleScan:function(){if(console.log("handleScan"),this.scan.value.length>8&&(console.log("this.scan.value.length > 8"),console.log(this.scan.value),this.scan.value="",console.log(this.scan.value),this.reset()),8==this.scan.value.length&&(this.scan.type=this.scan.value.substr(0,1),"8"==this.scan.type)){var e=Number(this.scan.value.substr(0,7));console.log("customer_code: ",e),this.reset(),this.getCustomerByCode(e)}},getCustomerByCode:function(e){var t=this;console.log("getCustomer"),Object(i["f"])(e).then((function(e){t.customer=e.data,t.temp.customer_id=t.customer.id,t.reset(),t.maxNumberOfChoices=Math.ceil((e.data.myarea+20)/80)+1,setTimeout((function(){t.listLoading=!1}),1500)})),this.scan={type:"",value:""}},getCustomer:function(){var e=this;this.listLoading=!0,Object(i["e"])(this.temp.customer_id).then((function(t){e.customer=t.data,e.reset(),e.maxNumberOfChoices=Math.ceil((t.data.myarea+20)/80)+1,setTimeout((function(){e.listLoading=!1}),5e3)}))},getNamefromOptions:function(e,t){var s="";return e.forEach((function(e){e.key===t&&(s=e.display_name)})),s},getSortClass:function(e){var t=this.listQuery.sort;return t==="+".concat(e)?"ascending":"descending"}}},d=u,m=(s("d229"),s("2877")),h=s("6544"),_=s.n(h),b=s("c6a6"),f=s("4ca6"),g=s("8336"),v=s("b0af"),p=s("ac7c"),x=s("cc20"),C=s("62ad"),y=s("a523"),k=s("ce7e"),j=s("132d"),w=s("24c9"),O=s("da13"),L=s("5d23"),V=s("67b6"),B=s("43a6"),T=s("0fd9"),A=s("2db4"),S=s("2fa4"),M=s("8654"),P=Object(m["a"])(d,n,a,!1,null,null,null);t["default"]=P.exports;_()(P,{VAutocomplete:b["a"],VBadge:f["a"],VBtn:g["a"],VCard:v["a"],VCheckbox:p["a"],VChip:x["a"],VCol:C["a"],VContainer:y["a"],VDivider:k["a"],VIcon:j["a"],VLabel:w["a"],VListItem:O["a"],VListItemContent:L["g"],VListItemSubtitle:L["j"],VListItemTitle:L["k"],VRadio:V["a"],VRadioGroup:B["a"],VRow:T["a"],VSnackbar:A["a"],VSpacer:S["a"],VTextField:M["a"]})},d229:function(e,t,s){"use strict";var n=s("392d"),a=s.n(n);a.a},d5d5:function(e,t,s){"use strict";s.d(t,"b",(function(){return a})),s.d(t,"a",(function(){return i}));var n=s("b775");function a(e){return Object(n["a"])({url:"/gardenslist",method:"get",params:e})}function i(e){return Object(n["a"])({url:"/gardens",method:"get",params:e})}}}]);
//# sourceMappingURL=chunk-3e0ae21f.75336ef7.js.map