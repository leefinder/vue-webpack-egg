<script lang="jsx">
import PickerColumn from './picker-column.vue';
import { pickerProps } from './props';
export default {
    components: {
        PickerColumn
    },
    props: {
        ...pickerProps,
        visibleCount: {
            default: null
        }
    },
    data () {
        return {
            children: [],
            formattedColumns: []
        };
    },
    created () {
        const { dataType, visibleCount } = this;
        if (dataType === 'cascade') {
            const columns = this.formatCascade();
            this.formattedColumns = columns.slice(0, visibleCount !== null ? visibleCount : columns.length);
        }
        if (dataType === 'object') {
            this.formattedColumns = JSON.parse(JSON.stringify(this.columnList));
        }
    },
    computed: {
        dataType () {
            const { columnList } = this;
            const firstColumn = columnList[0] || {};

            if (firstColumn.children) {
                return 'cascade';
            }

            if (firstColumn.values) {
                return 'object';
            }

            return 'text';
        }
    },
    methods: {
        formatCascade (propColumns) {
            const { defaultIndex } = this;
            if (propColumns) {
                this.columnList = propColumns;
            }
            const formatted = [];
            let cursor = { label: '', value: '', children: this.columnList, defaultIndex };
            while (cursor && cursor.children) {
                const idx = cursor.defaultIndex !== undefined ? cursor.defaultIndex : defaultIndex;
                formatted.push({
                    values: cursor.children.map(({ label, value }) => ({ label, value })),
                    defaultIndex: idx
                });
                cursor = cursor.children[idx];
            }
            return formatted;
        },
        onCascadeChange (columnIndex) {
            let cursor = { children: this.columnList };
            const indexes = this.getIndexes();

            for (let i = 0; i <= columnIndex; i++) {
                cursor = cursor.children[indexes[i]];
            }
            while (cursor.children) {
                columnIndex++;

                this.setColumnValues(
                    columnIndex,
                    cursor.children.map(({ label, value }) => ({ label, value }))
                );

                cursor = cursor.children[cursor.defaultIndex || 0];
            }
        },
        onChange (columnIndex) {
            const { dataType } = this;
            if (dataType === 'cascade') {
                this.onCascadeChange(columnIndex);
            }
            this.$emit('change', this, this.getValues(), columnIndex);
        },
        emit (event) {
            const args = event !== 'cancel' ? [this.getValues(), this.getIndexes()] : [];
            this.$emit(event, ...args);
        },
        confirm () {
            this.children.forEach(child => child.stopMomentum());
            this.emit('confirm');
        },
        cancel () {
            this.emit('cancel');
        },
        getIndexes () {
            return this.children.map(child => child.currentIndex);
        },
        // 获取选中的值[index1, index2, index3, ...]
        getValues () {
            return this.children.map(child => child.getValue());
        },
        getColumn (index) {
            return this.children[index];
        },
        getColumnValue (index) {
            const column = this.getColumn(index);
            return column && column.getValue();
        },
        setColumnValue (index, value) {
            const column = this.getColumn(index);
            column && column.setValue(value);
        },
        getColumnIndex (columnIndex) {
            return (this.getColumn(columnIndex) || {}).currentIndex;
        },
        setColumnIndex (columnIndex, optionIndex) {
            const column = this.getColumn(columnIndex);
            column && column.setIndex(optionIndex);
        },
        getColumnValues (index) {
            return (this.getColumn(index) || {}).options;
        },
        setColumnValues (index, options) {
            const column = this.getColumn(index);
            if (column) {
                column.setOptions(options);
            }
        },
        setValues (values) {
            values.forEach((value, index) => {
                this.setColumnValue(index, value);
            });
        },
        genColumns () {
            return this.formattedColumns.map(({ values, defaultIndex }, columnIndex) => {
                const { itemHeight, defaultIndex: index, swipeDuration, visibleItemCount } = this;
                return <picker-column
                    itemHeight={itemHeight}
                    defaultIndex={defaultIndex || +index}
                    swipeDuration={swipeDuration}
                    visibleItemCount={visibleItemCount}
                    initialOptions={values}
                    onChange={() => {
                        this.onChange(columnIndex);
                    }}
                />;
            });
        }
    },
    render (h) {
        const { showToolbar, title, cancelButtonText, confirmButtonText, itemHeight, visibleItemCount } = this;
        const wrapHeight = +itemHeight * visibleItemCount;
        const frameStyle = {
            height: `${itemHeight}px`
        };

        const columnsStyle = {
            height: `${wrapHeight}px`
        };
        const maskStyle = {
            backgroundSize: `100% ${(wrapHeight - itemHeight) / 2}px`
        };
        return (
            <div class="picker">
                { showToolbar && <div class="picker-toolbar">
                    <div class="cancel" onClick={this.cancel}>{cancelButtonText}</div>
                    {title}
                    <div class="confirm" onClick={this.confirm}>{confirmButtonText}</div>
                </div>}
                <div class="picker-columns" style={columnsStyle}>
                    {this.genColumns()}
                    <div class="picker-mask" style={maskStyle} />
                    <div class="picker-frame" style={frameStyle}></div>
                </div>
            </div>
        );
    }
};
</script>

<style lang="less" scoped>
.picker{
    position: relative;
    overflow: hidden;
    width: 100%;
    z-index: 1000;
    background: #fff;
    &-toolbar {
        position: relative;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background: #f8f8f8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(33, 53, 67, 1);
        .cancel{
            height: 30px;
            line-height: 30px;
            padding: 0 15px;
            font-size: 16px;
        }
        .confirm{
            height: 30px;
            line-height: 30px;
            padding: 0 15px;
            font-size: 16px;
        }
    }
    &-columns{
        position: relative;
        display: flex;
    }
    &-frame {
        position: absolute;
        top: 50%;
        right: 16px;
        left: 16px;
        z-index: 3;
        transform: translateY(-50%);
        pointer-events: none;
        &::after{
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            top: -50%;
            right: -50%;
            bottom: -50%;
            left: -50%;
            border: 0 solid #ebedf0;
            border-width: 1px 0;
            transform: scale(0.5);
        }
    }
    &-mask{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(180deg, hsla(0, 0%, 100%, .9), hsla(0, 0%, 100%, .4)),
        linear-gradient(0deg, hsla(0, 0%, 100%, .9), hsla(0, 0%, 100%, .4));
        background-repeat: no-repeat;
        background-position: top, bottom;
        backface-visibility: hidden;
        pointer-events: none;
    }
}
</style>
