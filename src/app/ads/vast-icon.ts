import {assertNumber, assertString} from './common';

import {VASTStaticResource} from './vast-static-resource';

export interface VASTIcon {
  program?: string;

  width: number;

  height: number;

  xPosition: number|string;

  yPosition: number|string;

  duration?: number;

  offset?: number;

  apiFramework?: string;

  pxratio?: number;

  viewTracking?: URL[];

  clicks?: VASTIconClicks;

  staticResource?: VASTStaticResource;
}

export interface VASTIconClicks {
  clickThrough?: URL;

  clickTrackings?: VASTIconClickTracking[];
}

export interface VASTIconClickTracking {
  id?: string;

  uri: URL;
}

export function createVASTIcon(rootElement: Element): VASTIcon {
  console.debug('Parse Icon');

  let program;
  let width;
  let height;
  let xPosition: number|string = 0;
  let yPosition: number|string = 0;
  let staticResource;
  let clicks;

  for (let i = 0; i < rootElement.attributes.length; i++) {
    if (rootElement.attributes[i].name === 'program') {
      program = assertString(rootElement.attributes[i].value);
    } else if (rootElement.attributes[i].name === 'width') {
      width = Number(rootElement.attributes[i].value);
    } else if (rootElement.attributes[i].name === 'height') {
      height = Number(rootElement.attributes[i].value);
    } else if (rootElement.attributes[i].name === 'xPosition') {
      xPosition = rootElement.attributes[i].value;
    } else if (rootElement.attributes[i].name === 'yPosition') {
      yPosition = rootElement.attributes[i].value;
    }
  }

  for (let i = 0; i < rootElement.children.length; i++) {
    const child = rootElement.children[i];

    if (child.nodeType === 1 && child.nodeName === 'StaticResource') {
      staticResource = new VASTStaticResource(child);
    } else if (child.nodeType === 1 && child.nodeName === 'IconClicks') {
      clicks = createVASTIconClicks(child);
    }
  }

  assertNumber(width);
  assertNumber(height)

  return {
    program,
    width,
    height,
    xPosition,
    yPosition,
    staticResource,
    clicks
  };
}

export function createVASTIconClicks(rootElement: Element): VASTIconClicks {
  let clickThrough;

  const clickTrackings: VASTIconClickTracking[] = [];

  for (let i = 0; i < rootElement.children.length; i++) {
    const child = rootElement.children[i];

    if (child.nodeType === 1 && child.nodeName === 'IconClickThrough') {
      clickThrough = child.textContent;
    } else if (child.nodeType === 1 && child.nodeName === 'IconClickTracking') {
      let id;

      for (let j = 0; i < child.attributes.length; j++) {
        if (child.attributes[i].name === 'id') {
          let id = child.attributes[i].value;
          break;
        }
      }

      assertString(child.textContent)
      clickTrackings.push({id, uri: new URL(child.textContent)});
    }
  }

  assertString(clickThrough)
  return {clickThrough: new URL(clickThrough), clickTrackings};
}
