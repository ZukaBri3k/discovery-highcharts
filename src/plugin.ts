import { PluginDef, PluginManager } from '@senx/discovery-widgets';
import * as pack from '../package.json';

export default () => {
    PluginManager.getInstance().register(
      new PluginDef({
        type: 'HC',
        name: pack.name,
        tag: 'discovery-highcharts',
        author: pack.author,
        description: pack.description,
        version: pack.version,
      }),
    );
};
