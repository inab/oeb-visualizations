function normalizeComponent(e,t,i,r,a,s,n,o,l,c){"boolean"!=typeof n&&(l=o,o=n,n=!1);var d="function"==typeof i?i.options:i;e&&e.render&&(d.render=e.render,d.staticRenderFns=e.staticRenderFns,d._compiled=!0,a&&(d.functional=!0)),r&&(d._scopeId=r);var u;if(s?(u=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,l(e)),e&&e._registeredComponents&&e._registeredComponents.add(s)},d._ssrRegister=u):t&&(u=n?function(){t.call(this,c(this.$root.$options.shadowRoot))}:function(e){t.call(this,o(e))}),u)if(d.functional){var _=d.render;d.render=function(e,t){return u.call(t),_(e,t)}}else{var m=d.beforeCreate;d.beforeCreate=m?[].concat(m,u):[u]}return i}import Plotly from"plotly.js-dist";var script={name:"accessibilityPlot",props:{dtick:{type:Number,required:!1,default:864e5},xaxisTitle:{type:String,required:!1,default:"Date"},yaxisTitle:{type:String,required:!1,default:"Access time (ms)"},colorOnline:{type:String,required:!1,default:"111, 176, 129"},colorOffline:{type:String,required:!1,default:"255, 153, 145"},colorNA:{type:String,required:!1,default:"204,204,204"},height:{type:Number,required:!1,default:400},dataItems:{type:Array,required:!0,validator:function(e){for(var t=0;t<e.length;t++)e[t].hasOwnProperty("access_time")?e[t].hasOwnProperty("date")?e[t].hasOwnProperty("code")||console.error("[oeb-visualizations warn] code key is missing in dataItems prop item (at position "+t+")"):console.error("[oeb-visualizations warn] date key is missing in dataItems prop item (at position "+t+")"):console.error("[oeb-visualizations warn] access_time key is missing in dataItems prop item (at position "+t+")"),null!==e[t].access_time&&"number"!=typeof e[t].access_time&&console.error("[oeb-visualizations warn] access_time must be null or a number in dataItems prop item (at position "+t+")"),null!==e[t].code&&"number"!=typeof e[t].code&&console.error("[oeb-visualizations warn] code must be null or a number in dataItems prop item (at position "+t+")"),("string"!=typeof e[t].date||isNaN(Date.parse(e[t].date)))&&console.error("[oeb-visualizations warn] date must be a string containing a date in dataItems prop item (at position "+t+")"),null===e[t].date&&console.error("[oeb-visualizations warn] date cannot be null in dataItems prop item (at position "+t+")");return!0}}},mounted:function(){var e=this.buildOnlineTraces(this.dataItems);e=e.concat(this.buildOfflineNATraces(this.dataItems));var t={bargap:0,barmode:"stack",showlegend:!0,autosize:!0,height:this.height,margin:{l:50,r:50,b:70,t:70,pad:4},xaxis:{type:"date",title:this.xaxisTitle,font:{size:8},tickfont:{size:8},tickmode:"linear",tick0:this.dataItems[0].date,dtick:this.dtick,tickangle:45,tickformat:"%d %b"},yaxis:{title:this.yaxisTitle,titlefont:{size:10},tickfont:{size:8}},template:"plotly_white",legend:{orientation:"h",yanchor:"bottom",y:1.02,xanchor:"right",x:1,font:{size:8}},hoverlabel:{bgcolor:"#FFF"},hovermode:"closest",hoverdistance:70};Plotly.newPlot("plotAccessibility",e,t)},methods:{generateColor:function(e,t){for(var i=[],r=0;r<30;r++)switch(e[r]){case"up":i.push("rgba("+this.colorOnline+",0)");break;case"down":i.push("rgba("+this.colorOffline+","+t+")");break;case"NA":i.push("rgba("+this.colorNA+","+t+")")}return i},extractSubarraysBetweenNullValues:function(e){for(var t={access_time:[],date:[],average_access_time:0},i=[],r=[],a=0,s=0,n=0;n<e.length;n++)null!==e[n].access_time?(i.push(e[n].access_time),r.push(e[n].date),a+=e[n].access_time,s+=1):i.length>0&&(t.access_time.push(i),t.date.push(r),i=[],r=[]);return t.access_time.push(i),t.date.push(r),t.average_access_time=a/s,t},buildAccessTimeTraces:function(e){for(var t=[],i=0;i<e.access_time.length;i++){var r=e.access_time[i],a={x:e.date[i],y:r,name:"Online",legendgroup:"up",showlegend:0===i,mode:"markers+lines",type:"scatter",fill:"tozeroy",fillcolor:"rgba("+this.colorOnline+",.2)",connectgaps:!1,line:{color:"rgba("+this.colorOnline+",.8)",width:1.5},marker:{size:5},hovertemplate:"<b>Online</b><br>%{x|%d %b %Y}<br>%{y} ms <extra></extra>",hoveron:"points+fills"};t.push(a)}return t},buildAvgAccessTimeTrace:function(e){var t=new Date(this.dataItems[0].date);t.setDate(t.getDate()-1);var i=new Date(this.dataItems[this.dataItems.length-1].date);return i.setDate(i.getDate()+1),{x:[t,i],y:[e,e],name:"Average access time",showlegend:!0,mode:"lines",type:"scatter",line:{color:"rgba("+this.colorOnline+",.6)",width:1.5,dash:"4px"},marker:{size:5}}},buildOnlineTraces:function(e){var t=this.extractSubarraysBetweenNullValues(e),i=this.buildAccessTimeTraces(t);return i.push(this.buildAvgAccessTimeTrace(t.average_access_time)),i},extractOfflineNADates:function(e){for(var t=[404,500,502,503,504],i=[],r=[],a=0;a<e.length;a++)null===e[a].access_time&&null===e[a].code?i.push(e[a].date):null===e[a].access_time&&t.includes(e[a].code)&&r.push(e[a].date);return{NA:i,down:r}},barTrace:function(e,t,i,r,a){return{x:e.dates,y:e.access_times,marker:{color:e.colors},name:t,type:"bar",legendgroup:"down",showlegend:i,hoverinfo:r,hovertemplate:a}},buildBarTraces:function(e,t,i){var r="rgba("+t+",.8)",a="rgba("+t+",.2)",s={dates:e,access_times:Array(e.length).fill(2),colors:Array(e.length).fill(r)},n={dates:e,access_times:Array(e.length).fill(120),colors:Array(e.length).fill(a)},o="<b>"+i+"</b><br>%{x|%d %b %Y}<br>%{y} ms <extra></extra>";return[this.barTrace(s,i,!1,"skip",""),this.barTrace(n,i,!0,"all",o)]},buildOfflineNATraces:function(e){var t=[],i=this.extractOfflineNADates(e);return t=t.concat(this.buildBarTraces(i.down,this.colorOffline,"Offline")),t=t.concat(this.buildBarTraces(i.NA,this.colorNA,"No information available"))}}},normalizeComponent_1=normalizeComponent,__vue_script__=script,__vue_render__=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{attrs:{id:"plotAccessibility"}})},__vue_staticRenderFns__=[],__vue_inject_styles__=void 0,__vue_scope_id__=void 0,__vue_module_identifier__=void 0,__vue_is_functional_template__=!1,accessibilityPlot=normalizeComponent_1({render:__vue_render__,staticRenderFns:__vue_staticRenderFns__},__vue_inject_styles__,__vue_script__,__vue_scope_id__,__vue_is_functional_template__,__vue_module_identifier__,void 0,void 0);export{accessibilityPlot};
