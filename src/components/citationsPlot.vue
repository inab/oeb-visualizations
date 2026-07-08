<template>
    <div :id="divId"></div>
</template>
<script>

import Plotly from 'plotly.js-dist';
import { randstr } from '../utils';

export default {
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
        },
        line: {
            type: Object,
            required: false,
            default: () => ({ dash: 'solid', width: 1.8 })
        }

    },
    mounted(){

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
                },  
            },
            hoverlabel: { color: this.darkMode ? 'white' : 'black' },
            hovermode: this.stack ? 'x unified' : 'closest',
            hoverdistance: 70,
            plot_bgcolor: this.darkMode ? "rgb(38, 50, 56)" : "white",
            paper_bgcolor: this.darkMode ? "rgb(38, 50, 56)" : "white",
        }
        

        Plotly.newPlot(this.divId, traces , layout);
    },
    methods: {
        buildTraces(){
            const traces = [];
            // build traces for object in dataTraces
            for(let i = 0; i < this.dataTraces.length; i++){
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
                        ...this.line,
                        color: this.colors[i]
                    },
                    stackgroup: this.stack ? 'one' : null
                }
                traces.push(trace);
            }
            return traces;
        },
        hoverTemplate(){
            if(this.stack){
                return "%{y} citations <extra></extra>";
            }else{
                return "%{y} citations in %{x} <extra></extra>";
            }
        }
    }
}
</script>
