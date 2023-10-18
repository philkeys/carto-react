import { Methods, executeTask } from '@keys2design/carto-react-workers';
import { wrapModelCall } from './utils';

// Make sure this is sync with the same constant in cloud-native/maps-api
export const HARD_LIMIT = 100;

export function getTable(props) {
  return wrapModelCall(props, fromLocal);
}

function fromLocal(props) {
  // Injecting sortByColumnType externally from metadata gives better results. It allows to avoid deriving type from row value itself (with potential null values)
  const { source, sortBy, sortDirection, sortByColumnType } = props;

  return executeTask(source.id, Methods.FEATURES_RAW, {
    filters: source.filters,
    filtersLogicalOperator: source.filtersLogicalOperator,
    sortBy,
    sortByDirection: sortDirection,
    sortByColumnType
  });
}

export function paginateTable({ rows, totalCount }, page, rowsPerPage) {
  const sliced = rows.slice(
    Math.min(rowsPerPage * Math.max(0, page), totalCount),
    Math.min(rowsPerPage * Math.max(1, page + 1), totalCount)
  );
  const pages = Math.ceil(totalCount / rowsPerPage);
  return { rows: sliced, pages };
}
