import { _executeModel } from '@keys2design/carto-react-api';
import { Methods, executeTask } from '@keys2design/carto-react-workers';
import { normalizeObjectKeys, wrapModelCall } from './utils';

export function getRange(props) {
  return wrapModelCall(props, fromLocal, fromRemote);
}

// From local
function fromLocal(props) {
  const { source, column } = props;

  return executeTask(source.id, Methods.FEATURES_RANGE, {
    filters: source.filters,
    filtersLogicalOperator: source.filtersLogicalOperator,
    column
  });
}

// From remote
function fromRemote(props) {
  const { source, abortController, ...params } = props;
  const { column } = params;

  return _executeModel({
    model: 'range',
    source,
    params: { column },
    opts: { abortController }
  }).then((res) => normalizeObjectKeys(res.rows[0]));
}
