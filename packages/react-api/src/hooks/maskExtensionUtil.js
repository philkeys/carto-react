import { MASK_ID } from '@keys2design/carto-react-core/';
import { MaskExtension } from '@deck.gl/extensions/typed';

const maskExtension = new MaskExtension();

export function getMaskExtensionProps(maskPolygon) {
  return {
    maskId: Boolean(maskPolygon && maskPolygon.length) && MASK_ID,
    extensions: [maskExtension]
  };
}
