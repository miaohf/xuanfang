(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5aec353a"],{"0f96":function(t,e,o){},1100:function(t,e,o){t.exports=o.p+"img/background.936c6830.jpg"},1771:function(t,e,o){var a={"./background - 副本.jpg":"5fa0","./background.jpg":"1100","./background111.jpg":"b9c1","./background2.jpg":"35a5","./background22 (2).jpg":"dc70","./background22.jpg":"9bba","./coloredeer-logo.jpg":"6749","./coloredeer.jpg":"979c","./coloredeer.png":"5b1e","./coloredeer2..jpg":"9a9e","./coloredeer_white - 副本.png":"2742","./house.jpg":"7e71","./lock.jpg":"ec2d","./login.jpg":"d0cf","./logo.jpg":"b640","./mychoice.jpg":"878d","./pricing.jpg":"429c","./register.jpg":"89ea","./slider.png":"fd2b","./slider1.jpg":"4dce","./slider2.jpg":"9a02","./stracraft.jpg":"69be","./tuozhan_logo.png":"fa30","./unnamed.jpg":"1d40","./vuetify.svg":"6dff"};function n(t){var e=r(t);return o(e)}function r(t){if(!o.o(a,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return a[t]}n.keys=function(){return Object.keys(a)},n.resolve=r,t.exports=n,n.id="1771"},"1d40":function(t,e,o){t.exports=o.p+"img/unnamed.a75e43fb.jpg"},2742:function(t,e,o){t.exports=o.p+"img/coloredeer_white - 副本.99388a40.png"},"35a5":function(t,e,o){t.exports=o.p+"img/background2.0535ad41.jpg"},"429c":function(t,e,o){t.exports=o.p+"img/pricing.f76b550f.jpg"},"4dce":function(t,e,o){t.exports=o.p+"img/slider1.0f583e54.jpg"},"4e37":function(t,e,o){"use strict";o.d(e,"a",(function(){return n})),o.d(e,"b",(function(){return r}));var a=o("b775");function n(){return Object(a["a"])({url:"/audios",method:"get"})}function r(t,e){return Object(a["a"])({url:"/audios/".concat(t),method:"put",data:e})}},"5b1e":function(t,e,o){t.exports=o.p+"img/coloredeer.d812261c.png"},"5fa0":function(t,e,o){t.exports=o.p+"img/background - 副本.f2224db4.jpg"},6749:function(t,e,o){t.exports=o.p+"img/coloredeer-logo.69f4cf9b.jpg"},"69be":function(t,e,o){t.exports=o.p+"img/stracraft.5a9d6794.jpg"},"6dff":function(t,e,o){t.exports=o.p+"img/vuetify.31b0d032.svg"},7577:function(t,e,o){"use strict";var a=o("0f96"),n=o.n(a);n.a},"7e71":function(t,e,o){t.exports=o.p+"img/house.d56626f5.jpg"},"86e2":function(t,e,o){"use strict";var a=o("dec1"),n=o.n(a);n.a},"878d":function(t,e,o){t.exports=o.p+"img/mychoice.89bf54bf.jpg"},"89ea":function(t,e,o){t.exports=o.p+"img/register.85b37874.jpg"},"979c":function(t,e,o){t.exports=o.p+"img/coloredeer.f02f5a98.jpg"},"9a02":function(t,e,o){t.exports=o.p+"img/slider2.4ee8bb71.jpg"},"9a9e":function(t,e,o){t.exports=o.p+"img/coloredeer2..ee0fbcdf.jpg"},"9bba":function(t,e,o){t.exports=o.p+"img/background22.f2224db4.jpg"},"9c3c":function(t,e,o){"use strict";o.r(e);var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"page_bg"},[a("v-row",{staticClass:"header",attrs:{justify:"center"}},[a("v-col",{attrs:{cols:"3",md:"3"}},[a("v-row",{staticClass:"d-flex justify-end"},[a("v-img",{staticClass:"logo",attrs:{src:o("1771")("./"+t.src)}}),a("span",{staticClass:"footprint"})],1)],1),a("v-col",{attrs:{cols:"7",md:"7"}},[a("v-row",{staticClass:"title",attrs:{justify:"center"}},[a("span",{staticClass:"title"},[t._v(" "+t._s(t.project_name)+" ")])])],1),a("v-col",{attrs:{cols:"2",md:"2"}},[a("v-row",{staticClass:"lottery_sequence_font"},[t._v(" 第 "),a("span",{staticClass:"lottery_sequence"},[t._v(" "+t._s(t.audio.lottery_sequence)+" ")]),t._v(" 号 ")])],1)],1),a("div",{staticClass:"marquee"},[a("marquee",{attrs:{data:t.marqueeList}})],1),a("v-row",{attrs:{justify:"center"}},t._l(t.newDatas,(function(e,o,n){return a("v-col",{key:n,staticClass:"my-col"},[a("v-card",{staticClass:"my-card"},[a("v-simple-table",{staticClass:"statistics",scopedSlots:t._u([{key:"default",fn:function(){return[a("thead",[a("tr",[a("td",{staticClass:"table-head"},[t._v(" 小区名称 ")]),a("td",{staticClass:"table-head"},[t._v(" 面积 ")]),a("td",{staticClass:"table-head text-center my-td"},[t._v(" 可选/总数 ")])])]),a("tbody",t._l(e,(function(e,n){return a("tr",{key:n},[a("td",{class:"fontsize-td-"+t.length_bigger_than_five(e.garden_name)},[a("span",{style:{color:e.total-e.occupied==0?t.grayColor:t.whiteColor}},[t._v(" "+t._s(e.id)+". "+t._s(e.garden_name))])]),a("td",[a("span",{style:{color:e.total-e.occupied==0?t.grayColor:t.whiteColor}},[t._v(" "+t._s(e.area))])]),a("td",{staticClass:"text-center"},[e.total-e.occupied>=10?a("span",{style:{color:t.greenColor}},[a("span",{class:{isChanged:t.isFlashOn&&t.oldDatas[o][n].occupied!==t.newDatas[o][n].occupied}},[t._v(t._s(e.total-e.occupied)+" ")]),a("span",{style:{color:t.whiteColor}},[t._v("/"+t._s(e.total))])]):a("span",{style:{color:e.total-e.occupied==0?t.grayColor:t.redColor}},[a("span",{class:{isChanged:t.isFlashOn&&t.oldDatas[o][n].occupied!==t.newDatas[o][n].occupied}},[t._v(t._s(e.total-e.occupied)+" ")]),a("span",{style:{color:e.total-e.occupied==0?t.grayColor:t.whiteColor}},[t._v("/"+t._s(e.total))])])])])})),0)]},proxy:!0}],null,!0)})],1)],1)})),1),a("v-divider"),a("vuetify-audio",{attrs:{file:t.audio_url,color:"success",ended:t.audioFinish,autoPlay:t.autoPlay}}),a("v-checkbox",{staticClass:"ma-0 pa-0",attrs:{label:"自动播报"},model:{value:t.autoPlay,callback:function(e){t.autoPlay=e},expression:"autoPlay"}})],1)},n=[],r=(o("a4d3"),o("4de4"),o("4160"),o("caad"),o("e439"),o("dbb4"),o("b64b"),o("d3b7"),o("2532"),o("159b"),o("ade3")),i=o("d9a8"),s=o("b775");function c(){return Object(s["a"])({url:"/statistics",method:"get"})}var u=o("4e37");function d(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,a)}return o}function l(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?d(Object(o),!0).forEach((function(e){Object(r["a"])(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):d(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var g="https://taozhuang.tuozhanad.com",p={name:"BullitinQianyue",components:{marquee:i["a"],VuetifyAudio:function(){return o.e("chunk-2d0c9adc").then(o.bind(null,"59bd"))}},data:function(){return{isFlashOn:1,src:"coloredeer.jpg",audio:{lottery_sequence:0},autoPlay:!0,audio_url:"https://taozhuang.tuozhanad.com/audios/coloredeer4.mp3",textList:[],marqueeList:[],project_name:"",oldDatas:{},newDatas:{List1:[]},whiteColor:"#b3bcb9",blueColor:"#32a2f4",greenColor:"#53d88a",orangeColor:"#e4a908",redColor:"#e15656",grayColor:"#727b7e",lightblueColor:"#0882f5",timer:0,timer2:0,i:0,message:"Hello, world ~!",timeout:3e3}},computed:{},created:function(){var t=this;this.getStatistics(),this.timer=setInterval((function(){setTimeout(t.getStatistics(),0),setTimeout(t.isFlashOn=0,0)}),5e3)},destroyed:function(){clearInterval(this.timer)},methods:{getStatistics:function(){var t=this;this.listLoading=!0,c().then((function(e){t.isFlashOn=1,t.oldDatas=l({},t.newDatas),t.project_name=e.data.project_name,t.newDatas.List1=e.data.details.filter((function(t){return t.id<=16})),setTimeout((function(){t.listLoading=!1}),3e3)}))},getAudio:function(){var t=this;Object(u["a"])().then((function(e){e.data.id&&(clearInterval(t.timer),console.log("New audio detective"),t.audio=e.data,setTimeout((function(){t.marqueeList.includes(t.audio.text)?console.log("the same audio.text"):(t.marqueeList.shift(),t.marqueeList.push(t.audio)),t.audio_url=g+t.audio.uri}),100))}))},audioFinish:function(){var t=this,e={status:1};Object(u["b"])(this.audio.id,e).then((function(t){console.log("update audio finished")})),this.autoPlay&&(this.timer=setInterval((function(){setTimeout(t.getAudio(),0)}),1e3))},length_bigger_than_five:function(t){return t.length>5?1:0}}},f=p,m=(o("86e2"),o("2877")),b=o("6544"),j=o.n(b),y=o("b0af"),v=o("ac7c"),h=o("62ad"),A=o("ce7e"),C=o("adda"),O=o("0fd9"),w=o("1f4f"),x=Object(m["a"])(f,a,n,!1,null,"d46ed070",null);e["default"]=x.exports;j()(x,{VCard:y["a"],VCheckbox:v["a"],VCol:h["a"],VDivider:A["a"],VImg:C["a"],VRow:O["a"],VSimpleTable:w["a"]})},b9c1:function(t,e,o){t.exports=o.p+"img/background111.936c6830.jpg"},d0cf:function(t,e,o){t.exports=o.p+"img/login.d6d3bb09.jpg"},d9a8:function(t,e,o){"use strict";var a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("section",{staticClass:"marquee-wrap"},[o("div",{ref:"marquee",staticClass:"marquee",style:{animationDuration:t.duration}},t._l(t.data,(function(e,a){return o("span",{key:a,staticClass:"text-item"},[o("i",{staticClass:"mdi mdi-bell-ring-outline ring"}),t._v(" "+t._s(e.text)+" "+t._s(t.$moment(e.create_at).utc().format("YYYY-MM-DD HH:mm"))+" ")])})),0)])},n=[],r=(o("a9e3"),{name:"marquee",props:{data:{type:Array,default:function(){return[]}},speed:{type:Number,default:120}},data:function(){return{duration:"30s"}},mounted:function(){}}),i=r,s=(o("7577"),o("2877")),c=Object(s["a"])(i,a,n,!1,null,"5cdc2e08",null);e["a"]=c.exports},dc70:function(t,e,o){t.exports=o.p+"img/background22 (2).0535ad41.jpg"},dec1:function(t,e,o){},ec2d:function(t,e,o){t.exports=o.p+"img/lock.9ae20e99.jpg"},fa30:function(t,e){t.exports="data:image/png;base64,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"},fd2b:function(t,e,o){t.exports=o.p+"img/slider.8555344c.png"}}]);
//# sourceMappingURL=chunk-5aec353a.77e050ce.js.map