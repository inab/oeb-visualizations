import Plotly from 'plotly.js-dist';

function randstr(prefix) {
  return Math.random().toString(36).replace('0.', prefix || '');
}

//
var script$1 = {
  name: 'accessibilityPlot',
  data: () => ({
    divId: randstr('acc_plot_'),
    max_access_time: 0,
    config: {
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: ['lasso']
    }
  }),
  props: {
    xrange: {
      /*
      xrange is the range of the x axis in ms.
      */
      type: Array,
      required: false
    },
    dtick: {
      /*
      dtick is the interval between ticks on the x axis in ms.
      */
      type: Number,
      required: false,
      default: 86400000.0
    },
    xaxisTitle: {
      /*
      xaxisTitle is the title of the x axis.
      */
      type: String,
      required: false,
      default: 'Date'
    },
    yaxisTitle: {
      /*
      yaxisTitle is the title of the y axis.
      */
      type: String,
      required: false,
      default: 'Access time (ms)'
    },
    colorOnline: {
      /*
      colorOnline is the color of the online line.
      format: "<R>, <G>, <B>"
      */
      type: String,
      required: false,
      default: '111, 176, 129'
    },
    colorOffline: {
      /*
      colorOffline is the color of the offline bars.
      format: "<R>, <G>, <B>"
      */
      type: String,
      required: false,
      default: '255, 153, 145'
    },
    colorNA: {
      /*
      colorNA is the color of the NA bars.
      format: "<R>, <G>, <B>"
      */
      type: String,
      required: false,
      default: '204,204,204'
    },
    height: {
      /*
      height is the height of the plot in px.
      */
      type: Number,
      required: false,
      default: 350
    },
    width: {
      /*
      width is the width of the plot in px.
      */
      type: Number,
      required: false,
      default: 700
    },
    week: {
      /*
      whether the plot is used to show data of one week
      If true, days of the week are shown on the x axis
      */
      type: Boolean,
      required: false,
      default: false
    },
    sixMonths: {
      /*
      whether the plot is used to show data of six months
      If true, months are shown on the x axis
      */
      type: Boolean,
      required: false,
      default: false
    },
    dataItems: {
      /*
      dataItems is an array of objects with keys "access_time", "date" and "code".
          - access_time is the time it took to access the server in ms.
          - date is the date of the access.
          - code is the HTTP code returned by the server.
      Each object represents an access to the server.
      */
      type: Array,
      required: true,
      validator: function (value) {
        /*
        This function validates the dataItems prop. It throws a console error if the prop is not valid.
        TODO: apply vue-types to define the prop. 
        https://github.com/dwightjack/vue-types
        */
        for (let i = 0; i < value.length; i++) {
          // The value must be an array of objects with keys "access_time", "date" and "code"
          if (!value[i].hasOwnProperty('access_time')) {
            console.error(`[oeb-visualizations warn] access_time key is missing in dataItems prop item (at position ${i})`);
          } else if (!value[i].hasOwnProperty('date')) {
            console.error(`[oeb-visualizations warn] date key is missing in dataItems prop item (at position ${i})`);
          } else if (!value[i].hasOwnProperty('code')) {
            console.error(`[oeb-visualizations warn] code key is missing in dataItems prop item (at position ${i})`);
          }
          // Access time must be null or a number
          if (value[i].access_time !== null && typeof value[i].access_time !== 'number') {
            console.error(`[oeb-visualizations warn] access_time must be null or a number in dataItems prop item (at position ${i})`);
          }
          // Code must be null or a number
          if (value[i].code !== null && typeof value[i].code !== 'number') {
            console.error(`[oeb-visualizations warn] code must be null or a number in dataItems prop item (at position ${i})`);
          }
          // Date must be a string containing a parseable date, or a number (timestamp)
          const validDateString = typeof value[i].date === 'string' && !isNaN(Date.parse(value[i].date));
          const validDateNumber = typeof value[i].date === 'number';
          if (!validDateString && !validDateNumber) {
            console.error(`[oeb-visualizations warn] date must be a string containing a date or a number in dataItems prop item (at position ${i})`);
            console.error(`[oeb-visualizations warn] date type is ${typeof value[i].date} and the value is ${value[i].date}`);
          }

          // And date cannot be null
          if (value[i].date === null) {
            console.error(`[oeb-visualizations warn] date cannot be null in dataItems prop item (at position ${i})`);
          }
        }
        return true;
      }
    }
  },
  mounted() {
    // Compute the tallest online bar from real measurements only.
    // Math.max over an array containing null coerces null -> 0, so a site
    // that was down the whole window would yield 0 and render the
    // offline/NA bars with zero height (invisible). Ignore nulls/NaN and
    // apply a floor so down-only sites still draw full-height bars.
    const times = this.dataItems.map(item => item.access_time).filter(t => typeof t === 'number' && !isNaN(t));
    this.max_access_time = times.length ? Math.max(...times) : 100;
    var traces = this.buildOnlineTraces(this.dataItems); // generate line traces

    traces = traces.concat(this.buildOfflineNATraces(this.dataItems)); //  generate bar traces

    const layout = {
      bargap: 0.0,
      barmode: 'stack',
      showlegend: true,
      autosize: true,
      height: this.height,
      width: this.width,
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 20,
        pad: 4
      },
      xaxis: {
        type: 'date',
        ticklabelmode: this.xaxisMode(),
        title: this.xaxisTitle,
        font: {
          size: 10
        },
        tickfont: {
          size: 10
        },
        showgrid: this.sixMonths ? true : false,
        griddash: "dot",
        gridwidth: 1,
        gridcolor: "#d9d7d7",
        showspikes: true,
        spikedash: "4px",
        spikethickness: 1,
        tick0: this.xaxisTickZero(),
        dtick: this.xaxisTickD(),
        tickangle: this.xaxisTickAngle(),
        tickformat: this.xaxisTickFormat(),
        tickvals: this.sixMonths ? this.monthTickVales() : null,
        range: this.xaxisRange()
      },
      yaxis: {
        title: this.yaxisTitle,
        titlefont: {
          size: 10
        },
        tickfont: {
          size: 10
        }
      },
      template: 'plotly_white',
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: -0.5,
        xanchor: 'left',
        x: 0.05,
        font: {
          size: 8
        }
      },
      hoverlabel: {
        bgcolor: "#FFF"
      },
      hovermode: 'closest'
    };
    console.log(this.divId);
    Plotly.newPlot(this.divId, traces, layout, this.config);
  },
  methods: {
    generateColor(values, transparency) {
      /*
      Parameters:
          - values: array of values. Values must be in ["up", "down", "NA"]
          - transparency: float between 0 and 1
       Returns an array of colors in the form "rgba(255, 153, 145,0.8)"
      */
      let colors = [];
      for (let i = 0; i < 30; i++) {
        switch (values[i]) {
          case "up":
            colors.push(`rgba(${this.colorOnline},0)`);
            break;
          case "down":
            colors.push(`rgba(${this.colorOffline},${transparency})`);
            break;
          case "NA":
            colors.push(`rgba(${this.colorNA},${transparency})`);
        }
      }
      return colors;
    },
    extractSubarraysBetweenNullValues(data) {
      /*
      This function extracts subarrays of access_time between null values. 
      This is, consecutive access_time values that are not null and separated by null values.
      It also creates the subarrays of dates for those access_time values.
      It also computes the average access time of the whole data.
       Parameters:
          - data: array of objects with keys "access_time" and "date". access_time can be null
       Returns an object with keys:
          - access_time: array of arrays of access_time values
          - date: array of arrays of dates
          - average_access_time: average access time of the whole data
      */

      var subarrays = {
        access_time: [],
        date: [],
        average_access_time: 0
      };
      var subarrayTime = [];
      var subarrayDate = [];
      var sum = 0;
      var nonNullValues = 0;
      for (let i = 0; i < data.length; i++) {
        // Only genuine successful measurements belong on the online
        // line. An error code with a recorded access_time must not
        // sneak in (it would draw green and skew the average); treat it
        // as a break, just like a null access_time.
        if (data[i].access_time !== null && !this.isErrorCode(data[i].code)) {
          // keep adding to subarray
          subarrayTime.push(data[i].access_time);
          subarrayDate.push(data[i].date);
          sum += data[i].access_time;
          nonNullValues += 1;
        } else {
          // Push subarray to subarrays and reset subarray
          if (subarrayTime.length > 0) {
            subarrays.access_time.push(subarrayTime);
            subarrays.date.push(subarrayDate);
            subarrayTime = [];
            subarrayDate = [];
          }
        }
      }
      // push last subarray
      subarrays.access_time.push(subarrayTime);
      subarrays.date.push(subarrayDate);

      // compute average access time
      subarrays.average_access_time = sum / nonNullValues;
      return subarrays;
    },
    buildAccessTimeTraces(subarrays) {
      /*
      This function builds the line traces of access time between null values. 
      
      Arguments:
          - subarrays: object with keys "access_time" and "date". 
              - access_time is an array of arrays of access_time values. 
              - date is an array of arrays of dates.
      Returns an array of line traces
      */

      var traces = []; // stores resulting traces

      // iterate over subarrays and build line traces
      for (let i = 0; i < subarrays.access_time.length; i++) {
        const subarray = subarrays.access_time[i];
        const subarrayDate = subarrays.date[i];
        const showlegend = i === 0 ? true : false;
        const trace = {
          x: subarrayDate,
          y: subarray,
          name: 'Online',
          legendgroup: 'up',
          showlegend: showlegend,
          mode: 'markers+lines',
          type: 'scatter',
          fill: 'tozeroy',
          fillcolor: `rgba(${this.colorOnline},.2)`,
          connectgaps: false,
          line: {
            color: `rgba(${this.colorOnline},.8)`,
            width: 1.5
          },
          marker: {
            size: 5
          },
          hovertemplate: '<b>Online</b><br>%{x|%d %b %Y}<br>%{y} ms <extra></extra>',
          hoveron: 'points+fills'
        };
        traces.push(trace);
      }
      return traces;
    },
    buildAvgAccessTimeTrace(avgAccessTime) {
      /*
      This function builds the line trace of the average access time of the whole data. 
      The trace is an horizontal line at y=average access time.
       Arguments:
          - avgAccessTime: average access time of the whole data
       Returns a line trace
      */

      // set start and end dates so that the line spands the whole plot
      const firstDate = new Date(this.dataItems[0].date);
      if (this.week) {
        firstDate.setDate(firstDate.getDate() - 0.3); // one day before the first date in data
      } else {
        firstDate.setDate(firstDate.getDate() - 1); // one month before the first date in data
      }

      const lastDate = new Date(this.dataItems[this.dataItems.length - 1].date);
      if (this.week) {
        lastDate.setDate(lastDate.getDate() + 0.3);
      } else {
        lastDate.setDate(lastDate.getDate() + 1); // one month after the last date in data
      }

      const trace = {
        x: [firstDate, lastDate],
        y: [avgAccessTime, avgAccessTime],
        name: 'Average access time',
        showlegend: true,
        mode: 'lines',
        type: 'scatter',
        line: {
          color: `rgba(${this.colorOnline},.6)`,
          width: 1.5,
          dash: '4px'
        },
        marker: {
          size: 5
        },
        // avg access time with 2 decimals
        hovertemplate: '<b>Average access time</b><br>%{y:.2f} ms <extra></extra>'
      };
      return trace;
    },
    buildOnlineTraces(data) {
      /* 
      This function builds one trace per subarray of access_time between null values.
      It also builds the trace of the average access time of the whole data.
      [i] Why not just one trace for access_time? 
      [i] Because if we do that, the area under null values is filled too.
      Arguments:
          - data: array of objects with keys "access_time" and "date". access_time can be null
      Returns an array of traces
      */

      const subarrays = this.extractSubarraysBetweenNullValues(data);
      var traces = this.buildAccessTimeTraces(subarrays);
      traces.push(this.buildAvgAccessTimeTrace(subarrays.average_access_time));
      return traces;
    },
    isErrorCode(code) {
      /*
      Returns true if the HTTP code denotes the server being offline.
      Single source of truth shared by the online-line and offline-bar
      logic so redness is decided consistently by the response code.
      */
      const errorCodes = [400, 403, 404, 408, 500, 502, 503, 504];
      return errorCodes.includes(code);
    },
    extractOfflineNADates(data) {
      /*
      This function extracts dates with access_time null. 
      Depending on the code, the server is offline or NA on those dates.
       Arguments:
          - data: array of objects with keys "access_time", "date" and "code". access_time and code can be null
      
      Returns an object with keys:
          - NA: array of dates with code null (no information available)
          - down: array of dates with code in errorCodes (server offline)
       Classification is driven by the HTTP code, not by access_time
      null-ness: an error response that happened to record an access_time
      is still "offline", and a missing code is "no information available".
      */
      const resultNA = [];
      const resultOffline = [];
      for (let i = 0; i < data.length; i++) {
        // no code at all -> grey "No information available"
        if (data[i].code === null) {
          resultNA.push(data[i].date);
          // an error code -> red "Offline"
        } else if (this.isErrorCode(data[i].code)) {
          resultOffline.push(data[i].date);
        }
      }
      return {
        NA: resultNA,
        down: resultOffline
      };
    },
    barTrace(data, name, showlegend, hoverinfo, hovertemplate, group) {
      /*
      This function builds a bar trace.
      Arguments:
          - data: object with keys "dates" and "access_times"
              - dates: array of dates
              - access_times: array of access_times
              - colors: array of colors in rgba format (eg:"rgba(255, 153, 145,0.8)")
          - name: name of the trace
      */
      const trace = {
        x: data.dates,
        y: data.access_times,
        marker: {
          color: data.colors
        },
        name: name,
        type: "bar",
        legendgroup: group,
        showlegend: showlegend,
        hoverinfo: hoverinfo,
        hovertemplate: hovertemplate,
        width: 1000 * 3600 * 24 * 1 // 100% of the space between two dates
      };

      console.log(trace);
      return trace;
    },
    buildBarTraces(dates, color, label, group) {
      /*
      This function builds the series used to display the offline/NA bars.
      For each date, two columns are created: one very short and one tall. 
      These columns cover the whole plot height. 
      The tall column is colored with colorStrong and the short one with colorLight.
       Arguments:
          - dates: array of dates
          - color: color of the bars
       Returns array with offline and NA traces
       */

      const colorStrong = `rgba(${color},.8)`;
      const colorLight = `rgba(${color},.2)`;
      const dataShort = {
        dates: dates,
        access_times: Array(dates.length).fill(2),
        colors: Array(dates.length).fill(colorStrong)
      };
      const dataTall = {
        dates: dates,
        access_times: Array(dates.length).fill(this.max_access_time * 1.1),
        colors: Array(dates.length).fill(colorLight)
      };
      const hovertemplate = `<b>${label}</b><br>%{x|%d %b %Y}<br>%{y} ms <extra></extra>`;
      const traceShort = this.barTrace(dataShort, label, false, 'skip', '', group);
      const traceTall = this.barTrace(dataTall, label, true, 'all', hovertemplate, group);
      return [traceShort, traceTall];
    },
    buildOfflineNATraces(data) {
      /*
      This function builds the bar traces of offline and NA values.
       Arguments:
      - data: array of objects with keys "access_time", "date" and "code". access_time and code can be null
      
      Returns an array of bar traces
      */

      var traces = [];
      const arrays = this.extractOfflineNADates(data);

      // Down arrays
      if (arrays.down.length > 0) {
        traces = traces.concat(this.buildBarTraces(arrays.down, this.colorOffline, 'Offline', 'down'));
        console.log(arrays.down);
      }
      // NA arrays
      if (arrays.NA.length > 0) {
        traces = traces.concat(this.buildBarTraces(arrays.NA, this.colorNA, 'No information available', 'na'));
        console.log(arrays.NA);
      }
      return traces;
    },
    xaxisTickFormat() {
      /*
      This function returns the tickformat of the x axis.
      If the plot is used to show data of one week, it returns the day of the week and  the day.
      Otherwise, it returns the day and the month.
      */

      if (this.week) {
        return "%A<br>%d %b";
      }
      if (this.sixMonths) {
        return "%d %b";
      } else {
        return "%d %b";
      }
    },
    xaxisTickAngle() {
      /*
      This function returns the tickangle of the x axis.
      If the plot is used to show data of one week, it returns 0.
      Otherwise, it returns 45.
      */
      if (this.week) {
        return 0;
      }
      if (this.sixMonths) {
        return 45;
      } else {
        return 45;
      }
    },
    xaxisTickD() {
      if (this.sixMonths === true) {
        return "M1";
      } else {
        return this.dtick;
      }
    },
    xaxisTickZero() {
      if (this.sixMonths === true) {
        console.log('zero six months ago');
        const lastDate = new Date(this.dataItems[this.dataItems.length - 1].date);
        //return lastDate minus six months
        console.log(lastDate);
        console.log('six months ago: ' + new Date(lastDate.setMonth(lastDate.getMonth() - 6)));
        return new Date(lastDate.setMonth(lastDate.getMonth() - 6));
      } else {
        return this.dataItems[0];
      }
    },
    xaxisMode() {
      if (this.sixMonths === true) {
        return "period";
      } else {
        return "instant";
      }
    },
    xaxisRange() {
      if (!this.xrange) {
        return [this.dataItems[0], this.dataItems[this.dataItems.length - 1]];
      } else {
        return this.xrange;
      }
    },
    monthTickVales() {
      // First day of month of last date and previous five months
      const lastDate = new Date(this.dataItems[this.dataItems.length - 1].date);
      const lastMonth = lastDate.getMonth();
      const lastYear = lastDate.getFullYear();
      const tickValues = [];
      for (let i = 0; i < 6; i++) {
        tickValues.push(new Date(lastYear, lastMonth - i, 1));
      }
      return tickValues;
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('div', {
    attrs: {
      "id": _vm.divId
    }
  });
};
var __vue_staticRenderFns__$1 = [];

/* style */
const __vue_inject_styles__$1 = undefined;
/* scoped */
const __vue_scope_id__$1 = undefined;
/* module identifier */
const __vue_module_identifier__$1 = undefined;
/* functional template */
const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

var accessibilityPlot = normalizeComponent_1({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, undefined, undefined);

//
var script = {
  name: 'citationsPlot',
  data: () => ({
    divId: randstr('cit_plot_')
  }),
  props: {
    dataTraces: {
      /*
      dataTraces is and array of data to be plotted. Each element of the array is an object with the following structure:
      TODO: apply vue-types to define the prop
      https://github.com/dwightjack/vue-types
      {
          data: array, // required
          id: string, // required
          label: string, // optional
          title: string, // optional
          year: number, // optional
          url: string // optional
      }
      */
      type: Array,
      required: true
    },
    stack: {
      type: Boolean,
      required: false,
      default: false
    },
    colors: {
      type: Array,
      required: false,
      default: () => ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
    },
    height: {
      type: Number,
      required: false,
      default: 400
    },
    showlegend: {
      type: Boolean,
      required: false,
      default: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    xaxisTitle: {
      type: String,
      required: false,
      default: 'Year'
    },
    yaxisTitle: {
      type: String,
      required: false,
      default: 'Number of citations'
    },
    darkMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted() {
    const traces = this.buildTraces();
    const layout = {
      showlegend: this.showlegend,
      autosize: true,
      height: this.height,
      margin: {
        l: 50,
        r: 50,
        b: 70,
        t: 50,
        pad: 4
      },
      xaxis: {
        title: this.xaxisTitle,
        font: {
          size: 10
        },
        tickfont: {
          size: 10
        },
        tickmode: 'linear',
        color: this.darkMode ? 'white' : 'black'
      },
      yaxis: {
        title: this.yaxisTitle,
        titlefont: {
          size: 10
        },
        tickfont: {
          size: 10
        },
        font: {
          size: 10
        },
        color: this.darkMode ? 'white' : 'black'
      },
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1,
        font: {
          size: 8,
          color: this.darkMode ? 'white' : 'black'
        }
      },
      hoverlabel: {
        color: this.darkMode ? 'white' : 'black'
      },
      hovermode: this.stack ? 'x unified' : 'closest',
      hoverdistance: 70,
      plot_bgcolor: this.darkMode ? "rgb(38, 50, 56)" : "white",
      paper_bgcolor: this.darkMode ? "rgb(38, 50, 56)" : "white"
    };
    Plotly.newPlot(this.divId, traces, layout);
  },
  methods: {
    buildTraces() {
      const traces = [];
      // build traces for object in dataTraces
      for (let i = 0; i < this.dataTraces.length; i++) {
        const trace = {
          x: this.dataTraces[i].data.map(d => d.year),
          y: this.dataTraces[i].data.map(d => d.citations),
          mode: 'lines+markers',
          name: this.dataTraces[i].label,
          hovertemplate: this.hoverTemplate(),
          marker: {
            size: 5
          },
          line: {
            color: this.colors[i],
            width: 1.8
          },
          stackgroup: this.stack ? 'one' : null
        };
        traces.push(trace);
      }
      return traces;
    },
    hoverTemplate() {
      if (this.stack) {
        return "%{y} citations <extra></extra>";
      } else {
        return "%{y} citations in %{x} <extra></extra>";
      }
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('div', {
    attrs: {
      "id": _vm.divId
    }
  });
};
var __vue_staticRenderFns__ = [];

/* style */
const __vue_inject_styles__ = undefined;
/* scoped */
const __vue_scope_id__ = undefined;
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

var citationsPlot = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    accessibilityPlot: accessibilityPlot,
    citationsPlot: citationsPlot
});

// install function executed by Vue.use()
const install = function installVueOEBViz(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
};

// Create module definition for Vue.use()
const plugin = {
  install
};

/*
if (typeof Vue !== 'undefined') {
  for (const name in components) {
    Vue.component(name, components[name])
  }
}
*/

export { accessibilityPlot, citationsPlot, plugin as default };
