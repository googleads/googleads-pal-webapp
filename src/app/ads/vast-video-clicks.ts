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




