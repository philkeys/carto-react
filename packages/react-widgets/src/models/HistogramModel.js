import { Methods, executeTask } from '@keys2design/carto-react-workers';
import { wrapModelCall } from './utils';
import { geojsonFeatures } from '@keys2design/carto-react-core';

export function getHistogram(props) {
  return wrapModelCall(props, fromLocal);
}

// From local
function fromLocal(props) {
  const { source, column, operation, ticks, viewport, spatialFilter } = props;

  const currentFeatures = geojsonFeatures({
    geojson: source.data,
    viewport,
    geometry: spatialFilter,
    uniqueIdProperty: 'listing_id'
  });

  return executeTask(source.id, Methods.FEATURES_HISTOGRAM, {
    filters: source.filters,
    filtersLogicalOperator: source.filtersLogicalOperator,
    operation,
    column,
    ticks,
    currentFeatures
  });
}
