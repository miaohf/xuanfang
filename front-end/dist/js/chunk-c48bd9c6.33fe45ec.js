(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c48bd9c6"],{"15ac":function(t,e,a){},"1fce":function(t,e,a){"use strict";var u=a("676f"),n=a.n(u);n.a},"49d6":function(t,e,a){"use strict";a.r(e);var u=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{staticClass:"px-8 py-0",staticStyle:{height:"720px"},attrs:{fluid:""},scopedSlots:t._u([{key:"after-heading",fn:function(){},proxy:!0}])},[a("div",{staticClass:"marquee"},[a("marquee",{attrs:{data:t.marqueeList}})],1),a("v-row",[a("v-col",[a("vuetify-audio",{attrs:{file:t.audio_url,color:"success",ended:t.audioFinish,downloadable:"",autoPlay:t.autoPlay}}),a("v-row",{staticClass:"d-flex justify-space-between mx-1 mb-0"},[a("v-row",[a("v-switch",{staticClass:"mx-10",attrs:{label:"自动播报",color:"secondary","hide-details":""},model:{value:t.autoPlay,callback:function(e){t.autoPlay=e},expression:"autoPlay"}}),a("v-switch",{staticClass:"mx-10",attrs:{label:"自动叫号",color:"secondary","hide-details":""},model:{value:t.autoCall,callback:function(e){t.autoCall=e},expression:"autoCall"}})],1),a("v-row",[a("v-text-field",{staticClass:"mx-6",staticStyle:{"max-width":"100px"},attrs:{label:"设置台上人数",clearable:""},model:{value:t.offset,callback:function(e){t.offset=e},expression:"offset"}}),a("v-text-field",{staticClass:"mx-6",staticStyle:{"max-width":"100px"},attrs:{label:"设置起始号码",clearable:""},model:{value:t.start_number,callback:function(e){t.start_number=e},expression:"start_number"}})],1)],1)],1)],1)],1)},n=[],o=(a("caad"),a("d3b7"),a("2532"),a("909f")),i=a("4e37"),r=a("9671"),s="http://xuanfang.tuozhanad.com",c={name:"PodCast",components:{marquee:o["a"],VuetifyAudio:function(){return a.e("chunk-2d0c9adc").then(a.bind(null,"59bd"))}},data:function(){return{start_number:1,offset:5,audio:{audiotype:0,lottery_sequence:1,text:"抽签马上开始，请1-5号上前准备。"},autoPlay:!0,autoCall:!0,audio_url:"https://xuanfang.tuozhanad.com/audios/coloredeer4.mp3",data:"",marqueeList:[],timer:0,i:0,message:"Hello, world ~!",timeout:3e3}},computed:{},created:function(){},destroyed:function(){clearInterval(this.timer)},methods:{getAudio:function(){var t=this;Object(i["a"])().then((function(e){e.data.id&&(clearInterval(t.timer),t.audio=e.data,setTimeout((function(){t.audio_url=s+t.audio.uri,t.marqueeList.includes(t.audio.text)||(t.marqueeList.shift(),t.marqueeList.push(t.audio))}),5e3))}))},audioFinish:function(){var t=this,e={status:1};if(this.audio.id&&Object(i["b"])(this.audio.id,e).then((function(t){console.log("update audio finished")})),console.log("this.autoCall && this.audio.audiotype: ",this.autoCall,this.audio.audiotype),this.autoCall&&0==this.audio.audiotype){console.log("检查自动叫号");var a={lottery_sequence:this.audio.lottery_sequence,offset:this.offset,start_number:this.start_number};Object(r["a"])(a).then((function(e){t.audio=e.data,setTimeout((function(){t.audio_url=s+t.audio.uri,t.marqueeList.includes(t.audio.text)?console.log("the same audio.text"):(t.marqueeList.shift(),t.marqueeList.push(t.audio))}),3e3)}))}else console.log("检查自动播报"),this.timer=setInterval((function(){setTimeout(t.getAudio(),0)}),1e3);this.start_number=0}}},l=c,d=(a("5db4"),a("2877")),f=a("6544"),m=a.n(f),h=a("62ad"),b=a("a523"),p=a("0fd9"),v=a("b73d"),y=a("8654"),x=Object(d["a"])(l,u,n,!1,null,"5033ad27",null);e["default"]=x.exports;m()(x,{VCol:h["a"],VContainer:b["a"],VRow:p["a"],VSwitch:v["a"],VTextField:y["a"]})},"4e37":function(t,e,a){"use strict";a.d(e,"a",(function(){return n})),a.d(e,"b",(function(){return o}));var u=a("b775");function n(){return Object(u["a"])({url:"/audios",method:"get"})}function o(t,e){return Object(u["a"])({url:"/audios/".concat(t),method:"put",data:e})}},"5db4":function(t,e,a){"use strict";var u=a("15ac"),n=a.n(u);n.a},"676f":function(t,e,a){},"909f":function(t,e,a){"use strict";var u=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{staticClass:"marquee-wrap"},[a("div",{ref:"marquee",staticClass:"marquee",style:{animationDuration:t.duration}},t._l(t.data,(function(e,u){return a("span",{key:u,staticClass:"text-item"},[a("i",{staticClass:"mdi mdi-bell-ring-outline ring"}),t._v(" "+t._s(e.text)+" "+t._s(t.$moment(e.create_at).utc().format("YYYY-MM-DD HH:mm"))+" ")])})),0)])},n=[],o=(a("a9e3"),{name:"marquee",props:{data:{type:Array,default:function(){return[]}},speed:{type:Number,default:10}},data:function(){return{duration:0}},mounted:function(){this.duration="30s",console.log(" marquee this.duration: ",this.duration)}}),i=o,r=(a("1fce"),a("2877")),s=Object(r["a"])(i,u,n,!1,null,"770c1868",null);e["a"]=s.exports},9671:function(t,e,a){"use strict";a.d(e,"h",(function(){return n})),a.d(e,"e",(function(){return o})),a.d(e,"f",(function(){return i})),a.d(e,"g",(function(){return r})),a.d(e,"c",(function(){return s})),a.d(e,"k",(function(){return c})),a.d(e,"d",(function(){return l})),a.d(e,"j",(function(){return d})),a.d(e,"i",(function(){return f})),a.d(e,"a",(function(){return m})),a.d(e,"b",(function(){return h}));var u=a("b775");function n(t){return Object(u["a"])({url:"/customers",method:"get",params:t})}function o(t){return Object(u["a"])({url:"/customers/".concat(t),method:"get"})}function i(t){return Object(u["a"])({url:"/customers/code/".concat(t),method:"get"})}function r(t,e){return Object(u["a"])({url:"/customers/".concat(t,"/choices"),method:"post",data:e})}function s(t){return Object(u["a"])({url:"/customers",method:"post",data:t})}function c(t,e){return Object(u["a"])({url:"/customers/".concat(t),method:"put",data:e})}function l(t){return Object(u["a"])({url:"/customers/".concat(t),method:"delete"})}function d(){return Object(u["a"])({url:"/customerslist",method:"get"})}function f(){return Object(u["a"])({url:"/customers/count",method:"get"})}function m(t){return Object(u["a"])({url:"/customers/callnumber",method:"post",data:t})}function h(t){return Object(u["a"])({url:"/customers/callnumberbycontrol",method:"post",data:t})}}}]);
//# sourceMappingURL=chunk-c48bd9c6.33fe45ec.js.map