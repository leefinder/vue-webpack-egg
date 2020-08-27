import { isServer } from '..';

export let supportsPassive = false;

if (!isServer) {
    try {
        const opts = {};
        Object.defineProperty(opts, 'passive', {
            // eslint-disable-next-line getter-return
            get () {
                /* istanbul ignore next */
                supportsPassive = true;
            }
        });
        window.addEventListener('test-passive', null, opts);
        // eslint-disable-next-line no-empty
    } catch (e) { }
}

export function on (
    target,
    event,
    handler,
    passive = false
) {
    if (!isServer) {
        target.addEventListener(
            event,
            handler,
            supportsPassive ? { capture: false, passive } : false
        );
    }
}

export function off (target, event, handler) {
    if (!isServer) {
        target.removeEventListener(event, handler);
    }
}

export function stopPropagation (event) {
    event.stopPropagation();
}

export function preventDefault (event, isStopPropagation) {
    /* istanbul ignore else */
    if (typeof event.cancelable !== 'boolean' || event.cancelable) {
        event.preventDefault();
    }

    if (isStopPropagation) {
        stopPropagation(event);
    }
}
