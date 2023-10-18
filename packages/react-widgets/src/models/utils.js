import { MAP_TYPES, API_VERSIONS } from '@deck.gl/carto/typed';
import {
  AggregationTypes,
  getSpatialIndexFromGeoColumn,
  _filtersToSQL
} from '@keys2design/carto-react-core';

export function isRemoteCalculationSupported(props) {
  const { source } = props;

  return (
    source &&
    source.type !== MAP_TYPES.TILESET &&
    source.credentials.apiVersion !== API_VERSIONS.V2 &&
    !(source.geoColumn && getSpatialIndexFromGeoColumn(source.geoColumn)) &&
    source.provider !== 'databricks'
  );
}

export function wrapModelCall(props, fromLocal) {
  return fromLocal(props);
}

export function formatTableNameWithFilters(props) {
  const { source } = props;
  const { data, filters, filtersLogicalOperator } = source;

  const whereClause = _filtersToSQL(filters, filtersLogicalOperator);

  const formattedSourceData =
    source.type === MAP_TYPES.QUERY ? `(${data.replace(';', '')}) foo` : data;

  return `${formattedSourceData} ${whereClause}`.trim();
}

// Due to each data warehouse has its own behavior with columns,
// we need to normalize them and transform every key to lowercase
export function normalizeObjectKeys(el) {
  if (Array.isArray(el)) {
    return el.map(normalizeObjectKeys);
  }

  return Object.entries(el).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] =
      typeof value === 'object' && value ? normalizeObjectKeys(value) : value;
    return acc;
  }, {});
}

// Operation columns & Join operation
const sumColumns = (operationColumns) =>
  operationColumns.map((column) => `COALESCE(${column}, 0)`).join(' + ');

const SELECT_CLAUSE_BY_JOIN_OPERATION = {
  [AggregationTypes.AVG]: (operationColumns) =>
    `(${sumColumns(operationColumns)}) / ${operationColumns.length}`,
  [AggregationTypes.SUM]: (operationColumns) => sumColumns(operationColumns),
  [AggregationTypes.COUNT]: (operationColumns) => operationColumns[0],
  [AggregationTypes.MIN]: (operationColumns) => `LEAST(${operationColumns.join()})`,
  [AggregationTypes.MAX]: (operationColumns) => `GREATEST(${operationColumns.join()})`
};

export function formatOperationColumn(operationColumn, joinOperation) {
  if (!Array.isArray(operationColumn)) {
    return operationColumn || '*';
  }

  if (operationColumn.length <= 1) {
    return operationColumn[0];
  }

  const selectClauseFormatter = SELECT_CLAUSE_BY_JOIN_OPERATION[joinOperation];

  if (!selectClauseFormatter) {
    throw new Error(`${joinOperation} isn't valid.`);
  }

  return selectClauseFormatter(operationColumn);
}
