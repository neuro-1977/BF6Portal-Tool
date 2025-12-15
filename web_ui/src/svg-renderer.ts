import { SVG, Rect, Text, Polygon } from '@svgdotjs/svg.js';

export function createBlockSVG(blockData: any): string {
  const width = 200;
  const height = 50 + (blockData.args.length * 25);

  const draw = SVG().size(width, height);
  draw.rect(width, height).radius(10).fill(blockData.color || '#ccc');

  draw.text(blockData.label).move(10, 10).font({ family: 'sans-serif', size: 16 }).fill('#fff');

  blockData.args.forEach((arg: string, index: number) => {
    const argLabel = blockData.param_labels[arg] || arg;
    draw.text(argLabel).move(20, 40 + (index * 25)).font({ family: 'sans-serif', size: 12 }).fill('#fff');
  });

  return draw.svg();
}

export function createHomeBlockSVG(): string {
  const width = 200;
  const height = 200;
  const snapSize = 20;

  const draw = SVG().size(width, height);

  // Main block
  draw.rect(width, height).radius(10).fill('#333').stroke({ width: 1, color: '#fff' });

  // Snap slots
  // Top
  draw.polygon(`0,${snapSize} ${snapSize},${snapSize} ${snapSize/2},0`).fill('#fff').move(width/2 - snapSize/2, 0);
  // Bottom
  draw.polygon(`0,0 ${snapSize},0 ${snapSize/2},${snapSize}`).fill('#fff').move(width/2 - snapSize/2, height - snapSize);
  // Left
  draw.polygon(`${snapSize},0 ${snapSize},${snapSize} 0,${snapSize/2}`).fill('#fff').move(0, height/2 - snapSize/2);
  // Right
  draw.polygon(`0,0 0,${snapSize} ${snapSize},${snapSize/2}`).fill('#fff').move(width - snapSize, height/2 - snapSize/2);

  draw.text('Home').move(width/2 - 30, height/2 - 10).font({ family: 'sans-serif', size: 24, weight: 'bold' }).fill('#fff');

  return draw.svg();
}