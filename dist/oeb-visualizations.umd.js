!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("plotly.js-dist")):"function"==typeof define&&define.amd?define(["exports","plotly.js-dist"],t):(e=e||self,t(e.oeb_visualizations={},e.Plotly))}(this,function(e,t){"use strict";function i(e,t,i,a,r,s,n,o,c,l){"boolean"!=typeof n&&(c=o,o=n,n=!1);var d="function"==typeof i?i.options:i;e&&e.render&&(d.render=e.render,d.staticRenderFns=e.staticRenderFns,d._compiled=!0,r&&(d.functional=!0)),a&&(d._scopeId=a);var u;if(s?(u=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,c(e)),e&&e._registeredComponents&&e._registeredComponents.add(s)},d._ssrRegister=u):t&&(u=n?function(){t.call(this,l(this.$root.$options.shadowRoot))}:function(e){t.call(this,o(e))}),u)if(d.functional){var p=d.render;d.render=function(e,t){return u.call(t),p(e,t)}}else{var h=d.beforeCreate;d.beforeCreate=h?[].concat(h,u):[u]}return i}t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var a=i({render:function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{attrs:{id:"plotAccessibility"}})},staticRenderFns:[]},void 0,{name:"accessibilityPlot",props:{dtick:{type:Number,required:!1,default:864e5},xaxisTitle:{type:String,required:!1,default:"Date"},yaxisTitle:{type:String,required:!1,default:"Access time (ms)"},colorOnline:{type:String,required:!1,default:"111, 176, 129"},colorOffline:{type:String,required:!1,default:"255, 153, 145"},colorNA:{type:String,required:!1,default:"rgba(204,204,204,.8)"},height:{type:Number,required:!1,default:400},dataItems:{type:Array,required:!0,validator:function(e){for(var t=0;t<e.length;t++)e[t].hasOwnProperty("access_time")?e[t].hasOwnProperty("date")?e[t].hasOwnProperty("code")||console.error("[oeb-visualizations warn] code key is missing in dataItems prop item (at position "+t+")"):console.error("[oeb-visualizations warn] date key is missing in dataItems prop item (at position "+t+")"):console.error("[oeb-visualizations warn] access_time key is missing in dataItems prop item (at position "+t+")"),null!==e[t].access_time&&"number"!=typeof e[t].access_time&&console.error("[oeb-visualizations warn] access_time must be null or a number in dataItems prop item (at position "+t+")"),null!==e[t].code&&"number"!=typeof e[t].code&&console.error("[oeb-visualizations warn] code must be null or a number in dataItems prop item (at position "+t+")"),("string"!=typeof e[t].date||isNaN(Date.parse(e[t].date)))&&console.error("[oeb-visualizations warn] date must be a string containing a date in dataItems prop item (at position "+t+")"),null===e[t].date&&console.error("[oeb-visualizations warn] date cannot be null in dataItems prop item (at position "+t+")");return!0}}},mounted:function(){var e=this.buildOnlineTraces(this.dataItems);e=e.concat(this.buildOfflineNATraces(this.dataItems));var i={bargap:0,barmode:"stack",showlegend:!0,autosize:!0,height:this.height,margin:{l:50,r:50,b:70,t:70,pad:4},xaxis:{type:"date",title:this.xaxisTitle,font:{size:8},tickfont:{size:8},tickmode:"linear",tick0:this.dataItems[0].date,dtick:this.dtick,tickangle:45,tickformat:"%d %b"},yaxis:{title:this.yaxisTitle,titlefont:{size:10},tickfont:{size:8}},template:"plotly_white",legend:{orientation:"h",yanchor:"bottom",y:1.02,xanchor:"right",x:1,font:{size:8}}};t.newPlot("plotAccessibility",e,i)},methods:{generateColor:function(e,t){for(var i=[],a=0;a<30;a++)switch(e[a]){case"up":i.push("rgba("+this.colorOnline+",0)");break;case"down":i.push("rgba("+this.colorOffline+","+t+")");break;case"NA":i.push("rgba("+this.colorNA+","+t+")")}return i},extractSubarraysBetweenNullValues:function(e){for(var t={access_time:[],date:[],average_access_time:0},i=[],a=[],r=0,s=0,n=0;n<e.length;n++)null!==e[n].access_time?(i.push(e[n].access_time),a.push(e[n].date),r+=e[n].access_time,s+=1):i.length>0&&(t.access_time.push(i),t.date.push(a),i=[],a=[]);return t.access_time.push(i),t.date.push(a),t.average_access_time=r/s,t},buildAccessTimeTraces:function(e){for(var t=[],i=0;i<e.access_time.length;i++){var a=e.access_time[i],r={x:e.date[i],y:a,name:"Online",legendgroup:"up",showlegend:0===i,mode:"markers+lines",type:"scatter",fill:"tozeroy",fillcolor:"rgba("+this.colorOnline+",.2)",connectgaps:!1,line:{color:"rgba("+this.colorOnline+",.8)",width:1.5},marker:{size:5}};t.push(r)}return t},buildAvgAccessTimeTrace:function(e){var t=new Date(this.dataItems[0].date);t.setDate(t.getDate()-1);var i=new Date(this.dataItems[this.dataItems.length-1].date);return i.setDate(i.getDate()+1),{x:[t,i],y:[e,e],name:"Average access time",showlegend:!0,mode:"lines",type:"scatter",line:{color:"rgba("+this.colorOnline+",.6)",width:1.5,dash:"4px"},marker:{size:5}}},buildOnlineTraces:function(e){var t=this.extractSubarraysBetweenNullValues(e),i=this.buildAccessTimeTraces(t);return i.push(this.buildAvgAccessTimeTrace(t.average_access_time)),i},extractOfflineNADates:function(e){for(var t=[404,500,502,503,504],i=[],a=[],r=0;r<e.length;r++)null===e[r].access_time&&null===e[r].code?i.push(e[r].date):null===e[r].access_time&&t.includes(e[r].code)&&a.push(e[r].date);return{NA:i,down:a}},prepareBarSeries:function(e,t){var i="rgba("+t+",.8)",a="rgba("+t+",.2)",r=Array(e.length).fill(2).concat(Array(e.length).fill(120)),s=Array(e.length).fill(i).concat(Array(e.length).fill(a));return e=e.concat(e),{dates:e,access_times:r,colors:s}},buildBarTrace:function(e,t){return{x:e.dates,y:e.access_times,marker:{color:e.colors},name:t,type:"bar"}},buildOfflineNATraces:function(e){var t=[],i=this.extractOfflineNADates(e),a=this.prepareBarSeries(i.down,this.colorOffline),r=this.buildBarTrace(a,"Offline");t.push(r);var s=this.prepareBarSeries(i.NA,this.colorNA),n=this.buildBarTrace(s,"No information captured");return t.push(n),t}}},void 0,!1,void 0,void 0,void 0);e.accessibilityPlot=a,Object.defineProperty(e,"__esModule",{value:!0})});
