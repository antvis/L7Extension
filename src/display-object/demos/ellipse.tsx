import { CanvasEvent } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { GaodeMap, Scene } from '@antv/l7';
import { GEllipse, GLayer } from '@antv/l7-g-plugin';
import React, { useEffect } from 'react';
import Stats from 'stats.js';

const mapId = 'map' + Math.random();

export default function Demo1() {
  useEffect(() => {
    const scene = new Scene({
      id: mapId,
      map: new GaodeMap({
        style: 'normal',
        center: [120.5, 30.5],
        zoom: 8,
      }),
    });
    scene.on('loaded', () => {
      const gLayer = new GLayer({
        renderer: new CanvasRenderer(),
      });
      scene.addLayer(gLayer);

      gLayer.on('add', () => {
        for (let i = 0; i < 30; i++) {
          const ellipse = new GEllipse({
            style: {
              cx: Math.random() + 120,
              cy: Math.random() + 30,
              rx: 10,
              ry: 6,
              fill: '#1890FF',
              stroke: '#ffffff',
              lineWidth: 2,
            },
          });
          gLayer.gCanvas?.appendChild(ellipse);
        }

        const stats = new Stats();
        stats.showPanel(0);
        const $stats = stats.dom;
        $stats.style.position = 'absolute';
        $stats.style.left = '0px';
        $stats.style.top = '0px';
        const $wrapper = scene.getMapContainer() as HTMLElement;
        $wrapper.appendChild($stats);
        gLayer.gCanvas?.addEventListener(CanvasEvent.AFTER_RENDER, () => {
          if (stats) {
            stats.update();
          }
        });
      });
    });
  }, []);

  return <div id={mapId} style={{ position: 'relative', height: 400 }}></div>;
}
