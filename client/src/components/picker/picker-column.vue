<script lang="jsx">
import { deepClone, preventDefault, range } from './utils';
import { TouchMixin } from '@/mixins/touch';
function getElementTranslateY (element) {
    const style = window.getComputedStyle(element);
    const transform = style.transform || style.webkitTransform;
    const translateY = transform.slice(7, transform.length - 1).split(', ')[5];
    return Number(translateY);
}
const DEFAULT_DURATION = 200;

// 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

export default {
    mixins: [TouchMixin],
    props: {
        visibleItemCount: [Number, String],
        itemHeight: [Number, String],
        defaultIndex: Number,
        swipeDuration: {
            type: [Number, String],
            default: 1000
        },
        initialOptions: {
            type: Array,
            default: () => []
        }
    },
    created () {
        if (this.$parent.children) {
            this.$parent.children.push(this);
        }
        this.setIndex(this.currentIndex);
    },
    destroyed () {
        const { children } = this.$parent;
        if (children.length) {
            children.splice(children.indexOf(this), 1);
        }
    },
    data () {
        return {
            offset: 0,
            duration: 0,
            options: deepClone(this.initialOptions),
            currentIndex: this.defaultIndex,
            transitionEndTrigger: null,
            moving: false,
            touchStartTime: null
        };
    },
    computed: {
        count () {
            return this.options.length;
        },
        baseOffset () {
            return (this.itemHeight * (this.visibleItemCount - 1)) / 2;
        }
    },
    mounted () {
        this.bindTouchEvent(this.$el);
    },
    methods: {
        getValue () {
            return this.options[this.currentIndex];
        },
        setValue (value) {
            const { options } = this;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value) {
                    return this.setIndex(i);
                }
            }
        },
        setOptions (options) {
            if (JSON.stringify(options) !== JSON.stringify(this.options)) {
                this.options = deepClone(options);
                this.setIndex(this.defaultIndex);
            }
        },
        onTouchStart (event) {
            this.touchStart(event);

            if (this.moving) {
                const translateY = getElementTranslateY(this.$refs.wrapper);
                this.offset = Math.min(0, translateY - this.baseOffset);
                this.startOffset = this.offset;
            } else {
                // 静止状态下获取开始位置
                this.startOffset = this.offset;
            }

            this.duration = 0;
            this.transitionEndTrigger = null;
            this.touchStartTime = Date.now();
            this.momentumOffset = this.startOffset;
        },
        onTouchMove (event) {
            this.touchMove(event);

            if (this.direction === 'vertical') {
                this.moving = true;
                preventDefault(event, true);
            }
            this.offset = range(
                this.startOffset + this.deltaY,
                -(this.count * this.itemHeight),
                this.itemHeight
            );

            const now = Date.now();
            if (now - this.touchStartTime > MOMENTUM_LIMIT_TIME) {
                this.touchStartTime = now;
                this.momentumOffset = this.offset;
            }
        },
        onTouchEnd () {
            const distance = this.offset - this.momentumOffset;
            const duration = Date.now() - this.touchStartTime;
            const allowMomentum =
                duration < MOMENTUM_LIMIT_TIME &&
                Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

            if (allowMomentum) {
                this.momentum(distance, duration);
                return;
            }

            const index = this.getIndexByOffset(this.offset);
            this.duration = DEFAULT_DURATION;
            this.setIndex(index, true);

            // compatible with desktop scenario
            // use setTimeout to skip the click event triggered after touchstart
            setTimeout(() => {
                this.moving = false;
            }, 0);
        },
        genOptions () {
            const optionStyle = {
                height: `${this.itemHeight}px`
            };
            return this.options.map((option, index) => {
                const text = option.label;

                const data = {
                    style: optionStyle,
                    class: ['picker-column-item'],
                    on: {
                        click: () => {
                            this.onClickItem(index);
                        }
                    }
                };

                return <li {...data}><div>{text}</div></li>;
            });
        },
        momentum (distance, duration) {
            const speed = Math.abs(distance / duration);

            distance = this.offset + (speed / 0.002) * (distance < 0 ? -1 : 1);

            const index = this.getIndexByOffset(distance);

            this.duration = +this.swipeDuration;
            this.setIndex(index, true);
        },
        getIndexByOffset (offset) {
            return range(Math.round(-offset / this.itemHeight), 0, this.count - 1);
        },
        setIndex (index, emitChange) {
            index = this.adjustIndex(index) || 0;

            const offset = -index * this.itemHeight;

            const trigger = () => {
                if (index !== this.currentIndex) {
                    this.currentIndex = index;

                    if (emitChange) {
                        this.$emit('change', index);
                    }
                }
            };

            // trigger the change event after transitionend when moving
            if (this.moving && offset !== this.offset) {
                this.transitionEndTrigger = trigger;
            } else {
                trigger();
            }

            this.offset = offset;
        },
        adjustIndex (index) {
            index = range(index, 0, this.count);
            return index;
        },
        onClickItem (index) {
            if (this.moving) {
                return;
            }

            this.duration = DEFAULT_DURATION;
            this.setIndex(index, true);
        },
        stopMomentum () {
            this.moving = false;
            this.duration = 0;

            if (this.transitionEndTrigger) {
                this.transitionEndTrigger();
                this.transitionEndTrigger = null;
            }
        },
        onTransitionEnd () {
            this.stopMomentum();
        }
    },
    render (h) {
        const { offset, baseOffset, duration, itemHeight } = this;
        const wrapperStyle = {
            transform: `translate3d(0, ${offset + baseOffset}px, 0)`,
            transitionDuration: `${duration}ms`,
            transitionProperty: duration ? 'all' : 'none',
            lineHeight: `${itemHeight}px`
        };
        return (
            <div class="picker-column">
                <ul ref="wrapper"
                    style={wrapperStyle}
                    onTransitionend={this.onTransitionEnd}>
                    {this.genOptions()}
                </ul>
            </div>
        );
    }
};
</script>
<style lang="less" scoped>
ul{
    margin: 0;
    padding: 0;
    list-style: none;
}
.picker{
    &-column{
        overflow: hidden;
        flex: 1;
    }
    &-column-item{
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000;
    }
}
</style>
