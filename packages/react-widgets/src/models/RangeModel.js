import { Methods, executeTask } from '@keys2design/carto-react-workers';
import { wrapModelCall } from './utils';
import { geojsonFeatures } from '@keys2design/carto-react-core/index';

export function getRange(props) {
  return wrapModelCall(props, fromLocal);
}

// From local
function fromLocal(props) {
  const { source, column, viewport, spatialFilter } = props;

  const currentFeatures = geojsonFeatures({
    geojson: source.data,
    viewport,
    geometry: spatialFilter,
    uniqueIdProperty: 'listing_id'
  });

  return executeTask(source.id, Methods.FEATURES_RANGE, {
    filters: source.filters,
    filtersLogicalOperator: source.filtersLogicalOperator,
    column,
    currentFeatures
  });
}
