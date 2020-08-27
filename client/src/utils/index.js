import Vue from 'vue';
export const inBrowser = typeof window !== 'undefined';
export const isServer = Vue.prototype.$isServer;
export function isObject (val) {
    return val !== null && typeof val === 'object';
}
export function isFunction (val) {
    return typeof val === 'function';
}
export function isPromise (val) {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
export function isDef (val) {
    return val !== undefined && val !== null;
}

function trimExtraChar (value, char, regExp) {
    const index = value.indexOf(char);

    if (index === -1) {
        return value;
    }

    if (char === '-' && index !== 0) {
        return value.slice(0, index);
    }

    return value.slice(0, index + 1) + value.slice(index).replace(regExp, '');
}

export function formatNumber (value, allowDot) {
    if (allowDot) {
        value = trimExtraChar(value, '.', /\./g);
    } else {
        value = value.split('.')[0];
    }

    value = trimExtraChar(value, '-', /-/g);

    const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;

    return value.replace(regExp, '');
}
