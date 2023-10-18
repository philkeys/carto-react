import { Methods, executeTask } from '@keys2design/carto-react-workers';
import { wrapModelCall } from './utils';

// Make sure this is sync with the same constant in cloud-native/maps-api
export const HARD_LIMIT = 500;

export function getScatter(props) {
  return wrapModelCall(props, fromLocal);
}

function fromLocal(props) {
  const { source, xAxisColumn, xAxisJoinOperation, yAxisColumn, yAxisJoinOperation } =
    props;

  return executeTask(source.id, Methods.FEATURES_SCATTERPLOT, {
    filters: source.filters,
    filtersLogicalOperator: source.filtersLogicalOperator,
    xAxisColumn,
    xAxisJoinOperation,
    yAxisColumn,
    yAxisJoinOperation
  });
}
