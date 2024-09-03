# Discovery - Highcharts
## Produce by [Kwh50](https://kwh50.io)

## Overview

This plugin allows seamless integration between **Discovery**, a powerfull tool distribute by [SenX](https://senx.io), and **Highcharts**, a popular JavaScript charting library. With this plugin, users can visualize data with Discovery dashboard directly in Highcharts, enabling rich and interactive data visualization capabilities.

⚠️ **Warning:** If you want to use this plugin for commercial use, you need to buy a license [here](https://shop.highcharts.com/)


## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Examples](#examples)
- [License](#license)

## Installation

To install the plugin, run this command in your project:

   ```bash
   npm install @_kwh50/discovery-highcharts highcharts
   ```
## Getting Started

To use this plugin you have to import it in your page

- In HTML
```html
    <script src="https://unpkg.com/@_kwh50/discovery-highcharts@1.0.2/dist/discovery-highcharts/discovery-highcharts.esm.js" />
```

- In Typescript
```ts
import "@_kwh50/discovery-highcharts";
```

## Usage

To implement an Highcharts chart inside a discovery dashboard you to specify the type of the tile :
```mc2
'type' 'HC'
```

and then you can pass your Highcharts chart definition in the options field :

- HTML
```html
<discovery-dashboard url="https://warpcloud.senx.io/api/v0/exec" dashboard-title="Discovery - Highcharts" debug id="dash">
    Discovery definition here
</discovery-dashboard>
<script>
    // Set HCOptions which correspond to Highcharts options
    document.getElementById('dash').setAttribute('options', JSON.stringify({
        HCOptions: //Your Highcharts chart definition here
    }));
    </script>
```

- React
```tsx
<discovery-dashboard url="https://warpcloud.senx.io/api/v0/exec" dashboard-title="Discovery - Highcharts">
    {`{
        'title' 'Discovery - Highcharts'
        'description' 'Discovery dashboard using Highcharts'
        'tiles' [
            {
                'title' 'Highcharts graph'
                'x' 0 'y' 0 'w' 12 'h' 3
                'type' 'HC'
                'options' {
                    'HCParams' `${Your Highcharts chart definition here}`
                }
                'macro' <%
                    1 4 <% DROP 
                    NEWGTS 'g' STORE
                    1 10 <% 
                        'ts' STORE $g $ts RAND + STU * NOW + NaN NaN NaN RAND ADDVALUE DROP
                    %> FOR
                $g %> FOR STACKTOLIST 'data' STORE
                { 
                    'data' $data 
                }
                %>
            }
        ]
    }`}
</discovery-dashboard>
```

## Examples

Here you can see an exemple in pure HTML and in React :

- HTML

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
    <title>Stencil Component Starter</title>

    <!-- Import Discovery -->
    <script nomodule src="https://unpkg.com/@senx/discovery-widgets/dist/discovery/discovery.js"></script>
    <script type="module" src="https://unpkg.com/@senx/discovery-widgets/dist/discovery/discovery.esm.js"></script>

    <script type="module" src="/build/kwh50-discovery-highcharts.esm.js"></script>
    <script nomodule src="/build/kwh50-discovery-highcharts.js"></script>
  </head>
  <body>
    <discovery-dashboard url="https://warpcloud.senx.io/api/v0/exec" dashboard-title="Discovery - Highcharts" debug id="dash">
      {
          'title' 'Discovery - Highcharts'
          'description' 'Discovery dashboard using Highcharts'
          'tiles' [
              {
                  'title' 'Highcharts graph'
                  'x' 0 'y' 0 'w' 12 'h' 3
                  'type' 'HC'
                  'macro' <%
                      1 4 <% DROP 
                      NEWGTS 'g' STORE
                      1 10 <% 
                      'ts' STORE $g $ts RAND + STU * NOW + NaN NaN NaN RAND ADDVALUE DROP 
                      %> FOR
                      $g %> FOR STACKTOLIST 'data' STORE
                      { 
                          'data' $data 
                      }
                  %>
              }
          ]
      }
      </discovery-dashboard>
      <script>
        // Set HCOptions which correspond to Highcharts options
        document.getElementById('dash').setAttribute('options', JSON.stringify({
          HCOptions: {
            chart: {
              type: 'area',
              animation: false,
            },
            legend: {
              enabled: true,
            },
            rangeSelector: {
              enabled: false
            },
            xAxis: {
              type: 'datetime',
              title: {
                text: 'Time',
              },
            },
            yAxis: {
              title: {
                text: 'Value',
              },
            },
            series: [
              {
              type: 'line',
              name: 'My custom serie',
            },
            {
              type: 'line',
              name: 'My other custom serie',
            },
            {
              type: 'line',
              name: 'An other one',
            },
            {
              type: 'line',
              name: 'And again...',
            }
          ],
          },
        })
      );
      </script>
  </body>
</html>
```

- React

```tsx
import React from 'react';
import "@senx/discovery-widgets/dist/discovery/discovery.esm.js";
import "@_kwh50/discovery-highcharts";
import "highcharts/highstock";

//declare the html tag discovery-dashboard
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "discovery-dashboard": any;
        }
    }
}

function App() {

    return (
        <div className="App">
            <discovery-dashboard
                url="https://warpcloud.senx.io/api/v0/exec"
                dashboard-title="Discovery - Highcharts"
            >
                {`{
                    'title' 'Discovery - Highcharts'
                    'description' 'Discovery dashboard using Highcharts'
                    'tiles' [
                        {
                            'title' 'Highcharts graph'
                            'x' 0 'y' 0 'w' 12 'h' 3
                            'type' 'HC'
                            'options' {
                                'HCParams' '${JSON.stringify({
                                    chart: {
                                        type: "area",
                                        animation: false,
                                    },
                                    legend: {
                                        enabled: true,
                                    },
                                    rangeSelector: {
                                        enabled: false,
                                    },
                                    xAxis: {
                                        type: "datetime",
                                        title: {
                                            text: "Time",
                                        },
                                    },
                                    yAxis: {
                                        title: {
                                            text: "Value",
                                        },
                                    },
                                    series: [
                                        {
                                            type: "line",
                                            name: "My custom serie",
                                        },
                                        {
                                            type: "line",
                                            name: "My other custom serie",
                                        },
                                        {
                                            type: "line",
                                            name: "An other one",
                                        },
                                        {
                                            type: "line",
                                            name: "And again...",
                                        },
                                    ],
                                } as Highcharts.Options)}'
                            }
                            'macro' <%
                                1 4 <% DROP 
                                NEWGTS 'g' STORE
                                1 10 <% 
                                'ts' STORE $g $ts RAND + STU * NOW + NaN NaN NaN RAND ADDVALUE DROP 
                                %> FOR
                                $g %> FOR STACKTOLIST 'data' STORE
                                { 
                                    'data' $data 
                                }
                            %>
                        }
                    ]
                }`}
            </discovery-dashboard>
        </div>
    );
}

export default App;

```

## License

License powered by [LGPL](https://www.gnu.org/licenses/lgpl-3.0.fr.html)