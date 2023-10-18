import React, { useState } from 'react';
import { checkIfSourceIsDroppingFeature } from '@keys2design/carto-react-redux';
import { NoDataAlert } from '@keys2design/carto-react-ui';
import { useSelector } from 'react-redux';
import { defaultDroppingFeaturesAlertProps } from './defaultDroppingFeaturesAlertProps';

export default function WidgetWithAlert({
  dataSource,
  droppingFeaturesAlertProps = defaultDroppingFeaturesAlertProps,
  showDroppingFeaturesAlert = true,
  noDataAlertProps = {},
  warning,
  global = false,
  stableHeight, // if specified, "no-data" state will attempt to keep the same height as when rendered with data
  children
}) {
  const isDroppingFeatures = useSelector((state) =>
    checkIfSourceIsDroppingFeature(state, dataSource)
  );

  const [childrenRef, setChildenRef] = useState();
  const [savedHeight, setSavedHeight] = useState();
  const noData =
    (!global && isDroppingFeatures && showDroppingFeaturesAlert) || warning || !children;

  if (stableHeight) {
    if (noData && childrenRef && savedHeight === undefined) {
      setSavedHeight(childrenRef?.clientHeight);
    } else if (!noData && savedHeight !== undefined) {
      setSavedHeight(undefined);
    }
  }

  return noData ? (
    <NoDataAlert
      {...(isDroppingFeatures
        ? droppingFeaturesAlertProps
        : warning
        ? { ...noDataAlertProps, body: warning }
        : noDataAlertProps)}
      style={{ height: savedHeight }}
    />
  ) : (
    <div ref={setChildenRef}>{children}</div>
  );
}
