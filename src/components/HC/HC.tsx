import { DataModel, DiscoveryEvent, GTSLib, Logger, Utils } from '@senx/discovery-widgets';
import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { v4 } from 'uuid';
import HighCharts, { Options } from 'highcharts/highstock';
import HighchartsBoost from 'highcharts/modules/boost';
import { HCParams } from '../../types/types';

HighchartsBoost(HighCharts);

@Component({
  tag: 'discovery-highcharts',
  styleUrl: 'HC.css',
  shadow: true,
})
export class HC {
  @Prop() result: DataModel | string; // mandatory, will handle the result of a Warp 10 script execution
  @Prop() options: HCParams; // mandatory, will handle dashboard and tile option
  @State() @Prop() width: number; // optionnal
  @State() @Prop({ mutable: true }) height: number; // optionnal, mutable because, in this tutorial, we compute it
  @Prop() debug: boolean = false; // optionnal, handy if you want to use the Discovery Logger
  @Prop({ mutable: true }) params: object;

  @Event() draw: EventEmitter<void>; // mandatory

  @Element() el: HTMLElement;

  @State() innerOptions: HCParams; // will handle merged options
  @State() innerResult: DataModel; // will handle the parsed execution result

  private LOG: Logger; // The Discovery Logger
  private chartElement: HTMLDivElement; // The chart area
  private innerStyles: any = {}; // Will handle custom CSS styles for your tile
  private myChart: HighCharts.StockChart; // The Highcharts instance
  private uuid = v4(); // Unique id for this chart

  /************************************************************
   *********************** Watchers ****************************
   ************************************************************/

  /*
   * Called when the result is updated
   */
  @Watch('result') // mandatory
  updateRes(newValue: DataModel | string, oldValue: DataModel | string) {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      this.innerResult = GTSLib.getData(this.result);
      setTimeout(() => this.drawChart()); // <- we will see this function later
    }
  }

  /*
   * Called when the options are updated
   */
  @Watch('options') // mandatory
  optionsUpdate(newValue: string, oldValue: string) {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      if (!!this.options && typeof this.options === 'string') {
        this.innerOptions = JSON.parse(this.options);
      } else {
        this.innerOptions = { ...(this.options as HCParams) };
      }
      setTimeout(() => this.drawChart());
    }
  }

  /************************************************************
   *********************** Methods ****************************
   ************************************************************/

  /*
   * Mandatory
   * Called by Discovery when the component must be resized
   */
  @Method()
  async resize() {
    if (!!this.myChart) {
      this.myChart.reflow();
    }
  }

  /*
   * Optionnal
   * Called by Discovery when the component has to export its content to PNG or SVG
   */
  @Method()
  async export(type: 'png' | 'svg' = 'png') {
    console.log('Exporting chart to ' + type);
  }

  /************************************************************
   ******************* Events Handlers ************************
   ************************************************************/

  /* Handy if you want to handle Discovery events coming from other tiles */
  @Listen('discoveryEvent', { target: 'window' })
  discoveryEventHandler(event: CustomEvent<DiscoveryEvent>) {
    const res = Utils.parseEventData(event.detail, this.innerOptions.eventHandler, this.uuid);
    if (res.data) {
      this.innerResult = res.data;
      setTimeout(() => this.drawChart());
    }
    if (res.style) {
      this.innerStyles = { ...this.innerStyles, ...(res.style as { [k: string]: string }) };
    }
  }

  /************************************************************
   ********************* L0gic Part ***************************
   ************************************************************/

  drawChart() {
    // Merge options
    let options = Utils.mergeDeep<HCParams>(this.innerOptions || ({} as HCParams), this.innerResult.globalParams) as HCParams;
    this.innerOptions = { ...options };

    if(typeof this.innerOptions.HCParams === 'string') {
      this.innerOptions.HCParams = JSON.parse(this.innerOptions.HCParams);
    }

    // Flatten the data structure and add an id to GTS
    const gtsList = GTSLib.flattenGtsIdArray(this.innerResult.data as any[], 0).res;

    // Set the series data
    if (this.innerOptions.HCParams) {
      this.innerOptions.HCParams.series = gtsList.map((gts, index) => {
        return {
          ...this.innerOptions.HCParams?.series[index],
          data: gts.v,
          //if the name is not set, we set it to the default value this means also that the series does not have settings
          name:
            this.innerOptions.HCParams?.series[index]?.name === `Series ${index}` || !this.innerOptions.HCParams?.series[index]?.name
              ? `NO NAMMED GTS ${index}`
              : this.innerOptions.HCParams.series[index].name,
        };
      });

      // Make the chart
      this.myChart = HighCharts.stockChart(this.chartElement, this.innerOptions.HCParams as HighCharts.Options);
    } else {
      this.myChart = HighCharts.stockChart(this.chartElement, {});
    }
  }

  /************************************************************
   ********************* Life Cycle ***************************
   ************************************************************/

  /*
   * Mandatory
   * Part of the lifecycle
   */
  componentWillLoad() {
    //Chart.register(...registerables); // ChartJS specific loading
    this.LOG = new Logger(HC, this.debug); // init the Discovery Logger
    // parse options
    if (typeof this.options === 'string') {
      this.innerOptions = JSON.parse(this.options);
    } else {
      this.innerOptions = this.options;
    }
    // parse result
    this.innerResult = GTSLib.getData(this.result);

    // Get tile dimensions of the container
    const dims = Utils.getContentBounds(this.el.parentElement);
    this.width = dims.w;
    this.height = dims.h;
  }

  /*
   * Mandatory
   * Part of the lifecycle
   */
  componentDidLoad() {
    setTimeout(() => this.drawChart());
  }

  /*
   * Mandatory
   * Render the content of the component
   */
  render() {
    return <div class="chart-container">{this.innerResult ? <div id="chart" ref={el => (this.chartElement = el as HTMLDivElement)}></div> : ''}</div>;
  }
}
