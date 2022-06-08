import { useEffect, useCallback, useState } from 'react';
import { debounce, SpatialIndex } from '@carto/react-core';
import { Methods, executeTask } from '@carto/react-workers';
import { setIsDroppingFeatures } from '@carto/react-redux';
import { parse } from '@loaders.gl/core';
import { Layer } from '@deck.gl/core';
import { TILE_FORMATS } from '@deck.gl/carto';
import { throwError } from './utils';
import useFeaturesCommons from './useFeaturesCommons';
import { useDispatch } from 'react-redux';

export default function useTileFeatures({
  source,
  viewport,
  spatialFilter,
  uniqueIdProperty,
  debounceTimeout = 250
}) {
  const dispatch = useDispatch();
  const [
    debounceIdRef,
    isTilesetLoaded,
    setTilesetLoaded,
    clearDebounce,
    stopAnyCompute,
    setSourceFeaturesReady
  ] = useFeaturesCommons({ source });

  const [tileFormat, setTileFormat] = useState('');
  const [spatialIndex, setSpatialIndex] = useState();

  const sourceId = source?.id;

  const computeFeatures = useCallback(
    ({ viewport, spatialFilter, uniqueIdProperty }) => {
      if (!tileFormat) {
        return null;
      }

      setSourceFeaturesReady(false);

      executeTask(sourceId, Methods.TILE_FEATURES, {
        viewport,
        geometry: spatialFilter,
        uniqueIdProperty,
        tileFormat,
        spatialIndex
      })
        .then(() => {
          setSourceFeaturesReady(true);
        })
        .catch(throwError)
        .finally(clearDebounce);
    },
    [tileFormat, setSourceFeaturesReady, sourceId, spatialIndex, clearDebounce]
  );

  const loadTiles = useCallback(
    (tiles) => {
      const cleanedTiles = tiles.reduce((acc, { data, isVisible, bbox }) => {
        if (isVisible && data) {
          acc.push({
            data,
            bbox
          });
        }
        return acc;
      }, []);

      const isDroppingFeatures = tiles?.some((tile) => tile.content?.isDroppingFeatures);
      dispatch(setIsDroppingFeatures({ id: sourceId, isDroppingFeatures }));

      executeTask(sourceId, Methods.LOAD_TILES, { tiles: cleanedTiles })
        .then(() => setTilesetLoaded(true))
        .catch(throwError);
    },
    [sourceId, setTilesetLoaded, dispatch]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedComputeFeatures = useCallback(
    debounce(computeFeatures, debounceTimeout),
    [computeFeatures]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadTiles = useCallback(debounce(loadTiles, debounceTimeout), [
    loadTiles
  ]);

  useEffect(() => {
    if (sourceId && isTilesetLoaded) {
      clearDebounce();
      setSourceFeaturesReady(false);
      debounceIdRef.current = debouncedComputeFeatures({
        viewport,
        spatialFilter,
        uniqueIdProperty
      });
    }
  }, [
    viewport,
    spatialFilter,
    uniqueIdProperty,
    debouncedComputeFeatures,
    sourceId,
    isTilesetLoaded,
    setSourceFeaturesReady,
    clearDebounce,
    debounceIdRef
  ]);

  const onViewportLoad = useCallback(
    (tiles) => {
      stopAnyCompute();
      setSourceFeaturesReady(false);

      debounceIdRef.current = debouncedLoadTiles(tiles);
    },
    [stopAnyCompute, setSourceFeaturesReady, debouncedLoadTiles, debounceIdRef]
  );

  const fetch = useCallback(
    (...args) => {
      stopAnyCompute();

      if (spatialIndex) {
        return Layer.defaultProps.fetch.value(...args);
      }
      return customFetch(...args);
    },
    [stopAnyCompute, spatialIndex]
  );

  const onDataLoad = useCallback(({ tiles: [tile], scheme }) => {
    const tilesFormat = new URL(tile).searchParams.get('formatTiles');
    setTileFormat(tilesFormat || TILE_FORMATS.MVT);
    setSpatialIndex(Object.values(SpatialIndex).includes(scheme) ? scheme : undefined);
  }, []);

  return [onDataLoad, onViewportLoad, fetch];
}

// WORKAROUND: To read headers and know if the tile is dropping features.
// Remove when the new loader is ready => https://github.com/visgl/loaders.gl/pull/2128
const customFetch = async (url, { layer, loaders, loadOptions, signal }) => {
  loadOptions = loadOptions || layer.getLoadOptions();
  loaders = loaders || layer.props.loaders;

  const response = await fetch(url, { signal });
  const isDroppingFeatures =
    response.headers.get('Features-Dropped-From-Tile') === 'true';
  const result = await parse(response, loaders, loadOptions);
  return result ? { ...result, isDroppingFeatures } : null;
};
