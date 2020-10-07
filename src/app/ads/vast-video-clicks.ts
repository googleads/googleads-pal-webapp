/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export interface VASTVideoClicks {
    clickThrough?: VASTClickThrough;

    clickTrackings: VASTClickTracking[];
}

export interface VASTClickThrough {
    id?: string;

    uri: string;
}

export interface VASTClickTracking {
    id?: string;

    uri: string;
}

export function createVASTVideoClicks(rootElement: Element): VASTVideoClicks {
    const clickThrough = parseClickThrough(rootElement);
    const clickTrackings = parseClickTrackings(rootElement);

    return { clickThrough, clickTrackings };
}

function parseClickThrough(rootElement: Element): VASTClickThrough | undefined {

    for (let i = 0; i < rootElement.children.length; i++) {
        const child = rootElement.children[i];

        if (child.nodeType === 1 && child.nodeName === 'ClickThrough') {
            if (child.textContent === null) {
                throw new Error('ClickThrough element must have URI.');
            }

            let clickThrough = { uri: child.textContent };

            for (let i = 0; i < child.attributes.length; i++) {
                if (child.attributes[i].name === 'id') {
                    console.log('Parse ClickThrough.id attribute');
                    return { uri: child.textContent, id: child.attributes[i].value };
                }
            }

            return { uri: child.textContent };
        }
    }

    return undefined;
}

function parseClickTrackings(rootElement: Element): VASTClickTracking[] {
    console.debug('Parse ClickTrackings');

    const clickTrackings: VASTClickTracking[] = [];

    for (let i = 0; i < rootElement.children.length; i++) {
        const child = rootElement.children[i];

        if (child.nodeType === 1 && child.nodeName === 'ClickTracking') {
            if (child.textContent === null) {
                throw new Error('ClickTracking element must have URI.');
            }

            let clickTracking: VASTClickTracking = { uri: child.textContent };

            for (let i = 0; i < child.attributes.length; i++) {
                if (child.attributes[i].name === 'id') {
                    console.log('Parse ClickTracking.id attribute');
                    clickTracking = {
                        uri: child.textContent,
                        id: child.attributes[i].value
                    };
                }
            }

            clickTrackings.push(clickTracking);
        }
    }

    return clickTrackings;
}




