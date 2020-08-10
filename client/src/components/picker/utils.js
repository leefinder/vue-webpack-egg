const { hasOwnProperty } = Object.prototype;

export function deepClone (obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }

    if (typeof obj === 'object') {
        return deepAssign({}, obj);
    }

    return obj;
}
export function range (num, min, max) {
    return Math.min(Math.max(num, min), max);
}
function isDef (val) {
    return val !== undefined && val !== null;
}
export function isObject (val) {
    return val !== null && typeof val === 'object';
}
function assignKey (to, from, key) {
    const val = from[key];

    if (!isDef(val)) {
        return;
    }

    if (!hasOwnProperty.call(to, key) || !isObject(val)) {
        to[key] = val;
    } else {
        // eslint-disable-next-line no-use-before-define
        to[key] = deepAssign(Object(to[key]), from[key]);
    }
}

function deepAssign (to, from) {
    Object.keys(from).forEach(key => {
        assignKey(to, from, key);
    });
    return to;
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
