import { Methods, executeTask } from '@keys2design/carto-react-workers';
import { wrapModelCall } from './utils';
import { AggregationTypes, geojsonFeatures } from '@keys2design/carto-react-core';

export function getFormula(props) {
  return wrapModelCall(props, fromLocal);
}

// From local
function fromLocal(props) {
  const { source, operation, column, joinOperation, viewport, spatialFilter } = props;

  const currentFeatures = geojsonFeatures({
    geojson: source.data,
    viewport,
    geometry: spatialFilter,
    uniqueIdProperty: 'listing_id'
  });

  if (operation === AggregationTypes.CUSTOM) {
    throw new Error('Custom aggregation not supported for local widget calculation');
  }
  return executeTask(source.id, Methods.FEATURES_FORMULA, {
    filters: source.filters,
    filtersLogicalOperator: source.filtersLogicalOperator,
    operation,
    joinOperation,
    column,
    currentFeatures
  });
}
