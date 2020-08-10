import Vue from 'vue';
const isServer = Vue.prototype.$isServer;
const MIN_DISTANCE = 10;
function getDirection (x, y) {
    if (x > y && x > MIN_DISTANCE) {
        return 'horizontal';
    }

    if (y > x && y > MIN_DISTANCE) {
        return 'vertical';
    }

    return '';
};
const platformEvents = () => {
    const proxy = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup'
    };
    if ('ontouchstart' in window) {
        return (...rest) => {
            on(...rest);
        };
    }
    return (el, event, handler, passive) => {
        if (!proxy[event]) return;
        on(el, proxy[event], handler, passive);
    };
};
const baseEvent = platformEvents();
function on (
    target,
    event,
    handler,
    passive = false
) {
    if (!isServer) {
        target.addEventListener(
            event,
            handler,
            { capture: false, passive }
        );
    }
}
export default {
    data () {
        return {
            startX: 0,
            startY: 0,
            deltaX: 0,
            deltaY: 0,
            offsetX: 0,
            offsetY: 0,
            direction: ''
        };
    },
    methods: {
        touchStart (event) {
            this.resetTouchStatus();
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
        },
        touchMove (event) {
            const touch = event.touches[0];
            this.deltaX = touch.clientX - this.startX;
            this.deltaY = touch.clientY - this.startY;
            this.offsetX = Math.abs(this.deltaX);
            this.offsetY = Math.abs(this.deltaY);
            this.direction =
              this.direction || getDirection(this.offsetX, this.offsetY);
        },
        resetTouchStatus () {
            this.direction = '';
            this.deltaX = 0;
            this.deltaY = 0;
            this.offsetX = 0;
            this.offsetY = 0;
        },
        bindTouchEvent (el) {
            const { onTouchStart, onTouchMove, onTouchEnd } = this;
            baseEvent(el, 'touchstart', onTouchStart);
            baseEvent(el, 'touchmove', onTouchMove);
            if (onTouchEnd) {
                baseEvent(el, 'touchend', onTouchEnd);
                baseEvent(el, 'touchcancel', onTouchEnd);
            }
        }
    }
};
