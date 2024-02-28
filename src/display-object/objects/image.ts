import {
  DisplayObjectConfig,
  ICSSStyleDeclaration,
  Image,
  ImageStyleProps,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { IL7GDisplayObject } from '../interface';
import { getNumber } from '../utils';

export class GImage
  extends Image
  implements IL7GDisplayObject<ImageStyleProps, [number, number]>
{
  originStyle: ImageStyleProps & ICSSStyleDeclaration<ImageStyleProps>;
  coordinates: [number, number];

  constructor(config: DisplayObjectConfig<ImageStyleProps>) {
    super(config);
    this.coordinates = [getNumber(this.style.x), getNumber(this.style.y)];
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof ImageStyleProps) => {
        if (key === 'x' || key === 'y') {
          return this.coordinates[key === 'x' ? 0 : 1];
        }
        return target[key];
      },
      set: (target, key: keyof ImageStyleProps, value: any) => {
        if (key === 'x' || key === 'y') {
          const index = key === 'x' ? 0 : 1;
          const newValue = getNumber(value);
          this.coordinates[index] = newValue;
          this.emit('COORDINATES_MODIFIED', {});
        } else {
          // @ts-ignore
          target[key] = value;
        }
        return true;
      },
    });
  }

  syncPosition(mapService: IMapService) {
    const { x, y } = mapService.lngLatToContainer(this.coordinates);
    this.originStyle.x = x;
    this.originStyle.y = y;
  }
}
