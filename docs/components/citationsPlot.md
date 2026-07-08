
## Data

Data is provided to the component as an array of objects through the `dataTraces` prop. Each object corresponds to a publication and will be represented as a trace in the resulting plot. They have the following keys: `data`, `id`, `label`, `title`, `year` and `url`.
- `data`:  array of objects. Each object has the following keys: `count` and `year`. `count` is the number of citations of the publication in the year `year`. Exmple
```
[
  {
    "count": 1,
    "year": 2019
  },
  {
    "count": 1,
    "year": 2020
  },
  {
    "count": 1,
    "year": 2021
  }
]

```

- `id`: string. Identifier of the publication.
- `label`: string. Label of the publication.
- `title`: string. Title of the publication.
- `year`: number. Year of the publication.
- `url`: string. URL of the publication.

## Props

| Name | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
|dataTraces | Array | Array of objects  with keys `data`, `id`, `label`, `title`, `year` and `url`. <br> More details in "Data" section | | true |
| stack | Boolean | If true, the traces will be stacked. | false | false |
| colors | Array | Array of colors for the traces. HEX format |  | false |
| height | Number | Height of the plot in pixels. | 400 | false |
| showlegend | Boolean | If true, the legend will be shown. | true | false |
| title | String | Title of the plot. | | false |
| xaxisTitle | String | Title of the x axis. | Year | false |
| yaxisTitle | String | Title of the y axis. | Number of citations | false |
| dark | Boolean | If true, the plot will be displayed in dark mode. | false | false |
| line | Object | Plotly line style dictionary applied to every trace, e.g. `{ dash: 'solid', width: 4 }`. `color` is ignored here (use `colors`). | `{ dash: 'solid', width: 1.8 }` | false |

## Usage

Import the `citationsPlot` in your Vue component and add it to the `components` section. Then use the component in the template.

```html
<template>
    <div>
        <citationsPlot :dataTraces="data" />
    </div>
</template>
<script>
import citationsPlotPage from '../components/citationsPlotPage.vue'

export default {
  name: 'IndexPage',
  components: {
    citationsPlotPage
  },
  data(){
    return {
      data: [
        {
          "data": [
            {
              "count": 1,
              "year": 2019
            },
            {
              "count": 1,
              "year": 2020
            },
            {
              "count": 1,
              "year": 2021
            }
          ],
          "id": "paper1",
          "label": "OEB paper",
          "title": "OpenEBench: a web platform for transparent and reproducible biomedical benchmarking",
          "year": 2020,
          "url": ""
        },
        {
          "data": [
            {
              "count": 1,
              "year": 2019
            },
            {
              "count": 1,
              "year": 2020
            },
            {
              "count": 1,
              "year": 2021
            }
          ],
          "id": "paper2",
          "label": "OEB paper 2",
          "title": "OpenEBench 2: an update of the web platform for transparent and reproducible biomedical benchmarking",
          "year": 2020,
          "url": ""
        }
      ]
    }
  }
}
</script>
```
